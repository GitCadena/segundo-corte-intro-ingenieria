# Segundo corte · Introducción a la Ingeniería Informática

**En producción:** https://segundo-corte-intro-ingenieria.vercel.app
**Repositorio:** https://github.com/GitCadena/segundo-corte-intro-ingenieria
**Supabase:** proyecto `segundo-corte-intro-ingenieria` en la organización GitCadena's Org (dashboard.supabase.com)

Aplicación de enseñanza para las sesiones 7 a 11 del microcurrículo (Ingeniería
Informática, Institución Universitaria Colegio Mayor del Cauca, Popayán).

Teoría, un ejemplo desarrollado paso a paso, 57 actividades que se corrigen
solas, un laboratorio de pseudocódigo que ejecuta el código de verdad, cuentas
de estudiante con el progreso guardado en Supabase, y un panel docente.

## Cómo correrla

```bash
npm install
npm run dev        # http://localhost:5173
```

Requiere Node 18 o superior. Sin configurar Supabase arranca en **modo
demostración**: funciona completa, guarda el avance solo en ese navegador y lo
advierte con una banda visible.

El archivo `.env.local` incluido apunta a un **Supabase local** que se levanta
con Docker:

```bash
npm run supabase   # descarga y arranca la pila, aplica las dos migraciones
npm run seguridad  # comprueba RLS, puntaje y aislamiento de datos
npm run dev
```

Si Docker no está corriendo, borra `.env.local` para volver al modo
demostración. Para conectar el proyecto real de Supabase y publicar en Vercel,
seguir [`docs/CONFIGURACION.md`](docs/CONFIGURACION.md).

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve lo compilado |
| `npm run pruebas` | Verifica intérprete, soluciones y coherencia del contenido (267 comprobaciones) |
| `npm run catalogo` | Regenera la migración que siembra el catálogo en Supabase |
| `npm run supabase` | Levanta un Supabase local con Docker y aplica las migraciones |
| `npm run seguridad` | Prueba RLS y puntaje contra ese Supabase (26 comprobaciones) |

## Contenido

| Estación | Sesión | Tema | Actividades |
|---|---|---|---|
| 1 · Cómo se construye el software | 7 | Proceso, requisitos, roles, alcance | 11 |
| 2 · ¿Cuándo un software es bueno? | 8 | ISO/IEC 25010, adecuación funcional, usabilidad | 11 |
| 3 · Que no se rompa | 9 | Robustez, fronteras, compatibilidad, portabilidad | 11 |
| 4 · Informática y sociedad | 8 y 9 | Ley de Moore, brecha digital, datos personales | 10 |
| 5 · Pensar como programador | 10 | Algoritmos, patrones, estructurada y POO | 8 |
| 6 · Reto final de práctica | 11 | Caso integrador, con cronómetro opcional | 6 |

Cada estación tiene las mismas seis secciones: **qué aprenderás · comprende ·
mira un ejemplo · practica jugando · ponlo a prueba · qué te llevas**, más un
taller de clase y el glosario contextual.

### Mecánicas de juego

Ordenar (por dependencias, admite varios órdenes válidos) · emparejar ·
clasificar · verdadero/falso con explicación · calcular con fórmulas a la vista ·
decidir sobre un caso y ver su consecuencia · elegir alcance con capacidad
limitada · romper un formulario con validación real · explorar límites · tabla de
casos de prueba · simulador de crecimiento exponencial · predecir y comprobar ·
decidir qué datos pedir · seguir variables · armar algoritmos · completar
pseudocódigo · escribir pseudocódigo · clases y objetos · talleres con lista de
chequeo.

Las de código **ejecutan el algoritmo del estudiante** contra casos de prueba que
incluyen los límites. No se comparan con una solución guardada: cualquier
solución que pase los casos es válida.

## Puntaje y estados

- Primer intento sin pistas: 100 % de los puntos.
- Cada pista resta 20 %; cada intento fallido, 10 %. El piso es el 40 %.
- Ver la solución completa: 0 puntos, pero la actividad queda como completada.
- Se conserva el **mejor** resultado. Repetir no acumula puntos.
- Tres estados distintos: **intentada** · **completada** · **dominio demostrado**
  (al primer intento y sin pistas). Abrir contenido o marcar una lista no produce
  ninguno.

El puntaje lo recalcula el servidor (`registrar_intento()` en PostgreSQL) a
partir del catálogo: el navegador informa evidencia, no cifras.

## Pseudocódigo soportado

`Algoritmo/FinAlgoritmo` (y `Proceso/FinProceso`), `Definir … Como`, `Dimension`
(arreglos de base 1), `Leer`, `Escribir`, asignación con `<-`, `=`, `:=` o `←`,
`Si/Entonces/Sino/FinSi`, `Mientras/Hacer/FinMientras`, `Repetir/Hasta Que`,
`Para … Hasta … Con Paso …/FinPara`, operadores `+ − * / ^ MOD`, comparaciones
`= <> < <= > >=`, lógicos `Y O NO`, y las funciones `raiz`, `abs`, `trunc`,
`redondear`, `sen`, `cos`, `ln`, `exp`, `longitud`, `mayusculas`, `minusculas`,
`subcadena`, `concatenar`, `ConvertirANumero`, `ConvertirATexto`.

La sintaxis exacta está documentada dentro de la aplicación, en el laboratorio.

**Seguridad:** el código del estudiante nunca se evalúa con `eval` ni con
`new Function`. Lo interpreta `src/lib/pseudo.js` (tokenizador, parser y
evaluador propios) con límites de 400 000 pasos y 400 líneas de salida, de modo
que un ciclo sin fin produce un mensaje de error en vez de congelar la pestaña.

## Estructura

```
src/
  data/
    estaciones/       contenido completo de las seis estaciones
    m1..m6-*.js       teoría original (la usan las estaciones como `comprende`)
    catalogo.js       catálogo plano con identificadores estables
    glosario.js       41 términos con definición y ejemplo
    logros.js         12 logros, cada uno con su evidencia
  lib/
    pseudo.js         intérprete de pseudocódigo con traza de variables
    puntaje.js        reglas de puntaje (la versión que manda está en SQL)
    almacen.js        persistencia, cola de pendientes y modo demostración
    supabase.js       cliente
  estado/             sesión y progreso (React Context)
  componentes/juegos/ un componente por mecánica
  vistas/             inicio, acceso, panel, estación, laboratorio, progreso, docente, glosario
supabase/migrations/  esquema con RLS + catálogo generado
pruebas/
  verificar.mjs       267 comprobaciones de contenido e intérprete
  rls.mjs             26 comprobaciones de seguridad contra Postgres real
scripts/              generadores del catálogo, la presentación y la guía
materiales/           presentación (35 diapositivas) y guía docente
docs/CONFIGURACION.md puesta en marcha de Supabase y Vercel
```

## Para agregar o cambiar una actividad

1. Editar el archivo de su estación en `src/data/estaciones/`.
2. Ejecutar `npm run pruebas`: verifica que la solución pase sus casos, que las
   opciones incorrectas efectivamente fallen, y que la ficha esté completa
   (objetivo, instrucciones, concepto previo, pistas y explicación).
3. Ejecutar `npm run catalogo` y aplicar la migración resultante en Supabase.

Los identificadores no se renombran ni se reutilizan: si una actividad cambia de
contenido pero mide lo mismo, conserva su `id`; si mide algo distinto, se crea
uno nuevo. De eso depende que los intentos ya registrados sigan teniendo sentido.

## Uso en clase

- **Modo proyección** (botón en la barra superior) agranda la tipografía y oculta
  la navegación, para videobeam.
- **Ritmo sugerido por sesión:** 10 min de apertura, 25 de teoría proyectada, 15
  de demostración en vivo, 45 de práctica en los equipos y 25 de puesta en común
  sobre lo que más falló.
- Los **talleres** no los califica la aplicación: son los entregables del corte.
  La aplicación guarda el borrador y muestra la rúbrica desde el principio.
- El **reto final** (estación 6) es el ensayo del parcial, con cronómetro
  opcional de 45 minutos. No genera nota académica.

La planeación completa, los errores frecuentes, la rúbrica, doce preguntas de
parcial con justificación y una alternativa sin conexión están en
`materiales/Guia_Docente_Segundo_Corte.docx`.

## Accesibilidad

Fondos claros y contraste alto; foco visible en todo lo interactivo; navegación
completa por teclado; ningún estado se comunica solo con color (siempre hay texto
o icono); ninguna actividad exige arrastrar elementos —ordenar funciona con
botones y con un selector de posición—; objetivos táctiles de 44 px; y se respeta
`prefers-reduced-motion`.
