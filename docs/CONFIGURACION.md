# Configuración de Supabase, Vercel y del panel docente

Esta guía se sigue una sola vez. Al terminar, los estudiantes podrán registrarse
y su avance viajará entre dispositivos.

Mientras no se complete, **la aplicación funciona igual pero en modo
demostración**: guarda el avance solo en el navegador de cada equipo y lo
advierte con una banda visible en la parte superior. El panel docente no tiene
versión de demostración porque lee datos reales de estudiantes.

---

## 1. Crear el proyecto de Supabase

1. Entrar a <https://supabase.com> y crear un proyecto nuevo (el plan gratuito
   alcanza de sobra para un curso).
2. Elegir la región más cercana. Guardar la contraseña de la base de datos en un
   lugar seguro; no va en el repositorio.

## 2. Aplicar las migraciones

En **SQL Editor** del proyecto, ejecutar en este orden el contenido de:

1. `supabase/migrations/20260915120000_esquema_inicial.sql` — tablas, funciones,
   triggers y políticas RLS.
2. `supabase/migrations/20260915130000_catalogo.sql` — siembra las 6 estaciones,
   las 63 actividades y los 12 logros.

El segundo archivo se regenera con `npm run catalogo` cada vez que se agregue o
cambie una actividad. Es idempotente: se puede volver a ejecutar sin problema.

> **Por qué hay que sembrar el catálogo:** el puntaje NO lo envía el navegador.
> La función `registrar_intento()` lo recalcula a partir de `actividades.puntos_max`.
> Si una actividad no está en la tabla, la aplicación devuelve un error claro en
> vez de guardar un puntaje inventado.

## 3. Configurar la autenticación

En **Authentication → Providers**, dejar habilitado *Email*.

- **Para un curso presencial**, lo más práctico es desactivar *Confirm email*
  (Authentication → Sign In / Providers → Email → Confirm email). Así el
  estudiante entra de inmediato tras registrarse. Si se deja activo, la
  aplicación muestra el aviso correcto: «revisa tu correo para activar la cuenta».
- En **Authentication → URL Configuration**, poner en *Site URL* la dirección
  donde quede publicada la aplicación (por ejemplo `https://segundo-corte.vercel.app`)
  y agregar la misma en *Redirect URLs*, junto con `http://localhost:5173` para
  poder probar en local. Sin esto, el enlace de recuperación de contraseña no
  regresa a la aplicación.

## 4. Conectar la aplicación

Copiar `.env.example` como `.env.local` y completar con los valores de
**Project Settings → API**:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

La `anon key` es pública por diseño: la protección real la dan las políticas RLS.
La que **nunca** se publica ni se pone en el frontend es la `service_role`.

Reiniciar `npm run dev`. La banda de «modo demostración» debe desaparecer.

## 5. Crear los grupos del curso

La migración crea *Grupo 1*, *Grupo 2* y *Grupo 3*. Para usar los nombres reales:

```sql
update public.grupos set nombre = '1AM' where nombre = 'Grupo 1';
insert into public.grupos (nombre) values ('2BM') on conflict do nothing;
```

Los nombres son lo que aparece en el desplegable del formulario de registro.

## 6. Dar el rol docente

**Esto no se puede hacer desde la aplicación, a propósito.** Un trigger
(`proteger_rol`) rechaza cualquier cambio de rol que llegue con el rol `anon` o
`authenticated`, que son los únicos que usa el navegador. Solo lo aceptan la
clave `service_role` y el SQL Editor de la consola, así que un estudiante no
puede ascenderse aunque manipule las peticiones.

Después de que la docente se registre normalmente, ejecutar en el SQL Editor:

```sql
-- 1. Asignar el rol
update public.perfiles
   set rol = 'docente'
 where correo = 'appaz@unimayor.edu.co';

-- 2. Autorizar los grupos que puede consultar
insert into public.docente_grupos (docente_id, grupo_id)
select p.id, g.id
  from public.perfiles p, public.grupos g
 where p.correo = 'appaz@unimayor.edu.co'
on conflict do nothing;
```

El paso 2 es el que importa: sin una fila en `docente_grupos`, el panel docente
carga pero muestra cero estudiantes, porque las políticas RLS no autorizan la
lectura. Es el comportamiento correcto, no un error.

## 7. Comprobar el aislamiento de datos

### Automático (recomendado)

Con Docker instalado:

```bash
npm run supabase   # levanta Postgres, GoTrue y PostgREST en local
npm run seguridad  # 26 comprobaciones contra ese Postgres
```

`pruebas/rls.mjs` crea tres cuentas de prueba con datos ficticios, comprueba el
aislamiento y las borra al terminar. Verifica, entre otras cosas, que el puntaje
lo calcula el servidor, que un estudiante no puede ascenderse a docente, que no
puede modificar resultados propios ni ajenos por UPDATE directo, que el mismo
envío no se cuenta dos veces, y que el docente solo ve los grupos autorizados.

Contra el proyecto real se ejecuta igual, indicando sus datos:

```bash
SUPABASE_URL=https://xxxx.supabase.co SUPABASE_ANON_KEY=eyJ... SUPABASE_DB_CONTAINER=... npm run seguridad
```

(La parte administrativa usa `psql` dentro del contenedor local; contra el
proyecto real hay que ejecutar a mano las tres sentencias que el script marca
como administrativas.)

### Manual, desde la consola del navegador

Vale la pena hacerlo una vez, con dos cuentas de prueba:

| Qué se comprueba | Cómo | Resultado esperado |
|---|---|---|
| Un estudiante ve solo lo suyo | Iniciar sesión como A y abrir «Mi progreso» | Solo aparecen los intentos de A |
| No puede leer datos ajenos | Con la sesión de A, en la consola del navegador: `await supabase.from('mejores').select('*')` | Devuelve solo las filas de A |
| No puede modificar resultados ajenos | `await supabase.from('mejores').update({mejor_puntaje:999}).eq('perfil_id','<id de B>')` | 0 filas afectadas (no hay política de UPDATE) |
| No puede ascenderse a docente | `await supabase.from('perfiles').update({rol:'docente'}).eq('id','<id propio>')` | Error: «El rol solo lo puede cambiar la administración del curso» |
| El docente ve solo sus grupos | Iniciar sesión como docente y abrir el panel | Solo los grupos presentes en `docente_grupos` |

## 8. Publicar en Vercel

1. Subir el repositorio a GitHub (sin `node_modules` ni `.env.local`).
2. En vercel.com: *Add New → Project → Import Git Repository*.
3. Vercel detecta Vite: framework **Vite**, build `npm run build`, output `dist`.
4. En *Settings → Environment Variables*, agregar `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` con los mismos valores de `.env.local`.
   **Sin esto el despliegue arranca en modo demostración**, porque las variables
   de Vite se resuelven durante la compilación, no al abrir la página.
5. Desplegar, y volver al paso 3 para agregar la URL definitiva a las *Redirect URLs*
   de Supabase.

---

## Qué hacer si algo falla

| Síntoma | Causa más probable |
|---|---|
| Sale la banda de «modo demostración» en producción | Faltan las variables de entorno en Vercel, o se agregaron después de compilar: hay que volver a desplegar |
| «Tu cuenta existe pero no tiene perfil asociado» | No se ejecutó la migración del esquema, o el trigger `al_crear_usuario` no quedó creado |
| «La actividad X no existe en el catálogo» | Falta ejecutar `supabase/migrations/…_catalogo.sql`, o se agregó una actividad sin correr `npm run catalogo` |
| El panel docente muestra cero estudiantes | Falta la fila en `docente_grupos` (paso 6) |
| El enlace de recuperación de contraseña no vuelve a la app | Falta la URL en *Redirect URLs* (paso 3) |
| El estudiante ve «Pendiente de sincronización» | No hay conexión. La aplicación reintenta sola; al volver la red pasa a «Guardado». Es el comportamiento diseñado, no una falla |

## Nota honesta sobre el modelo de confianza

El puntaje se recalcula en el servidor, y por eso un cliente manipulado no puede
inventarse una cifra. Pero **la corrección de cada actividad ocurre en el
navegador**: es el único lugar donde puede ocurrir en una aplicación de este tipo,
porque las respuestas correctas viajan al cliente para poder dar retroalimentación
inmediata.

En la práctica esto significa que alguien con conocimientos suficientes podría
marcar una actividad como correcta sin resolverla. Por eso la propuesta de
evaluación de la guía docente le asigna a la aplicación un 15 % de seguimiento y
no más: el peso académico está en el parcial y en los talleres.
