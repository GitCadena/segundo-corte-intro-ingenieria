/**
 * Pruebas de seguridad contra una instancia real de Supabase.
 *
 *   npx supabase start
 *   node pruebas/rls.mjs
 *
 * Comprueba lo que la interfaz no puede comprobar sola:
 *  - Que el puntaje lo calcula el servidor y no el cliente.
 *  - Que un estudiante solo ve y modifica sus propios datos.
 *  - Que no puede asignarse el rol docente.
 *  - Que el docente solo consulta los grupos que tiene autorizados.
 *  - Que un envío repetido no se cuenta dos veces.
 *
 * Usa cuentas de prueba con datos ficticios y no toca datos reales.
 */

import { createClient } from '@supabase/supabase-js'
import { execSync } from 'node:child_process'

const URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321'
const ANON =
  process.env.SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
// Se ejecuta psql DENTRO del contenedor, donde Postgres escucha en su socket
// local: el 54322 del host no existe dentro del contenedor.
const CONTENEDOR = process.env.SUPABASE_DB_CONTAINER ?? 'supabase_db_segundo-corte-web'

let ok = 0
const fallos = []

async function prueba(nombre, fn) {
  try {
    const r = await fn()
    if (r === true || r === undefined) ok++
    else fallos.push(`${nombre}: ${r}`)
  } catch (e) {
    fallos.push(`${nombre}: excepción ${e.message}`)
  }
}

/** SQL administrativo, como lo haría la docente desde el SQL Editor. */
function sql(consulta) {
  return execSync(
    `docker exec -i ${CONTENEDOR} psql -U postgres -d postgres -t -A -c "${consulta.replaceAll('"', '\\"')}"`,
    { encoding: 'utf8' },
  ).trim()
}

function cliente() {
  return createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function registrar({ correo, nombres, apellidos, grupo }) {
  const c = cliente()
  const { data, error } = await c.auth.signUp({
    email: correo,
    password: 'claveDePrueba123',
    options: { data: { nombres, apellidos, grupo, codigo_estudiantil: '' } },
  })
  if (error) throw new Error(`registro de ${correo}: ${error.message}`)
  return { c, id: data.user.id }
}

const sello = Date.now()
const correoA = `ana.prueba.${sello}@ejemplo.test`
const correoB = `bruno.prueba.${sello}@ejemplo.test`
const correoD = `docente.prueba.${sello}@ejemplo.test`

console.log('Creando cuentas de prueba…')
const A = await registrar({ correo: correoA, nombres: 'Ana', apellidos: 'Prueba', grupo: 'Grupo 1' })
const B = await registrar({ correo: correoB, nombres: 'Bruno', apellidos: 'Prueba', grupo: 'Grupo 2' })
const D = await registrar({ correo: correoD, nombres: 'Dora', apellidos: 'Docente', grupo: 'Grupo 1' })

/* ---------------------- 1. El trigger crea el perfil --------------------- */

await prueba('el registro crea el perfil con nombre y grupo', async () => {
  const { data, error } = await A.c.from('perfiles').select('nombres, rol, grupo_id').eq('id', A.id).single()
  if (error) return error.message
  if (data.nombres !== 'Ana') return `nombres = ${data.nombres}`
  if (data.rol !== 'estudiante') return `rol = ${data.rol}`
  if (!data.grupo_id) return 'no resolvió el grupo'
  return true
})

await prueba('el rol nunca se toma de los metadatos del registro', async () => {
  const c = cliente()
  const correo = `colado.${sello}@ejemplo.test`
  const { error } = await c.auth.signUp({
    email: correo,
    password: 'claveDePrueba123',
    options: { data: { nombres: 'Colado', apellidos: 'X', grupo: 'Grupo 1', rol: 'docente' } },
  })
  if (error) return error.message
  const rol = sql(`select rol from public.perfiles where correo = '${correo}'`)
  return rol === 'estudiante' ? true : `quedó con rol ${rol}`
})

/* ------------------- 2. El puntaje lo calcula el servidor ---------------- */

await prueba('puntaje sin pistas ni fallos: 100 % del máximo', async () => {
  const { data, error } = await A.c.rpc('registrar_intento', {
    p_actividad_id: 'e1-a1-orden',
    p_correcto: true,
    p_pistas: 0,
    p_intentos_fallidos: 0,
    p_solucion_vista: false,
    p_datos: {},
    p_cliente_id: `t1-${sello}`,
  })
  if (error) return error.message
  if (data.mejor_puntaje !== 100) return `esperaba 100, obtuvo ${data.mejor_puntaje}`
  if (data.estado !== 'dominada') return `estado = ${data.estado}`
  return true
})

await prueba('puntaje con 2 pistas y 1 fallo: 100 × (1 − 0,4 − 0,1) = 50', async () => {
  const { data, error } = await A.c.rpc('registrar_intento', {
    p_actividad_id: 'e1-a2-roles',
    p_correcto: true,
    p_pistas: 2,
    p_intentos_fallidos: 1,
    p_solucion_vista: false,
    p_datos: {},
    p_cliente_id: `t2-${sello}`,
  })
  if (error) return error.message
  if (data.mejor_puntaje !== 50) return `esperaba 50, obtuvo ${data.mejor_puntaje}`
  if (data.estado !== 'completada') return `estado = ${data.estado}`
  return true
})

await prueba('ver la solución deja el puntaje en 0 pero completa la actividad', async () => {
  const { data, error } = await A.c.rpc('registrar_intento', {
    p_actividad_id: 'e1-a4-entrega',
    p_correcto: true,
    p_pistas: 0,
    p_intentos_fallidos: 0,
    p_solucion_vista: true,
    p_datos: {},
    p_cliente_id: `t3-${sello}`,
  })
  if (error) return error.message
  return data.mejor_puntaje === 0 && data.estado === 'completada'
    ? true
    : `puntaje ${data.mejor_puntaje}, estado ${data.estado}`
})

await prueba('el cliente no puede inventarse el puntaje: solo informa evidencia', async () => {
  // La función no acepta ningún parámetro de puntaje. Se comprueba que un
  // intento con las mismas condiciones siempre da el mismo valor del catálogo.
  const max = Number(sql(`select puntos_max from public.actividades where id = 'e1-a5-cambio'`))
  const { data, error } = await A.c.rpc('registrar_intento', {
    p_actividad_id: 'e1-a5-cambio',
    p_correcto: true,
    p_pistas: 0,
    p_intentos_fallidos: 0,
    p_solucion_vista: false,
    p_datos: { puntaje: 99999, trampa: true },
    p_cliente_id: `t4-${sello}`,
  })
  if (error) return error.message
  return data.mejor_puntaje === max ? true : `esperaba ${max}, obtuvo ${data.mejor_puntaje}`
})

await prueba('una actividad inexistente se rechaza con un mensaje claro', async () => {
  const { error } = await A.c.rpc('registrar_intento', {
    p_actividad_id: 'actividad-que-no-existe',
    p_correcto: true,
    p_pistas: 0,
    p_intentos_fallidos: 0,
    p_solucion_vista: false,
    p_datos: {},
    p_cliente_id: `t5-${sello}`,
  })
  return error && error.message.includes('no existe en el catálogo')
    ? true
    : `no se rechazó: ${error?.message ?? 'sin error'}`
})

/* ---------------------------- 3. Idempotencia ---------------------------- */

await prueba('el mismo cliente_id no se cuenta dos veces', async () => {
  const id = `idem-${sello}`
  const envio = {
    p_actividad_id: 'e1-a3-requisitos',
    p_correcto: true,
    p_pistas: 0,
    p_intentos_fallidos: 0,
    p_solucion_vista: false,
    p_datos: {},
    p_cliente_id: id,
  }
  await A.c.rpc('registrar_intento', envio)
  await A.c.rpc('registrar_intento', envio)
  await A.c.rpc('registrar_intento', envio)
  const n = Number(sql(`select count(*) from public.intentos where cliente_id = '${id}'`))
  const totales = Number(
    sql(`select intentos_totales from public.mejores where perfil_id = '${A.id}' and actividad_id = 'e1-a3-requisitos'`),
  )
  return n === 1 && totales === 1 ? true : `intentos=${n}, intentos_totales=${totales}`
})

await prueba('el mejor puntaje se conserva: reintentar peor no lo baja', async () => {
  await A.c.rpc('registrar_intento', {
    p_actividad_id: 'e1-a1-orden',
    p_correcto: true,
    p_pistas: 3,
    p_intentos_fallidos: 3,
    p_solucion_vista: false,
    p_datos: {},
    p_cliente_id: `peor-${sello}`,
  })
  const p = Number(
    sql(`select mejor_puntaje from public.mejores where perfil_id = '${A.id}' and actividad_id = 'e1-a1-orden'`),
  )
  const e = sql(`select estado from public.mejores where perfil_id = '${A.id}' and actividad_id = 'e1-a1-orden'`)
  return p === 100 && e === 'dominada' ? true : `puntaje ${p}, estado ${e}`
})

/* ------------------------ 4. Aislamiento entre cuentas ------------------- */

await B.c.rpc('registrar_intento', {
  p_actividad_id: 'e1-a1-orden',
  p_correcto: true,
  p_pistas: 0,
  p_intentos_fallidos: 0,
  p_solucion_vista: false,
  p_datos: {},
  p_cliente_id: `b1-${sello}`,
})

await prueba('un estudiante solo lee sus propios mejores resultados', async () => {
  const { data, error } = await A.c.from('mejores').select('perfil_id')
  if (error) return error.message
  const ajenos = data.filter((m) => m.perfil_id !== A.id)
  return ajenos.length === 0 ? true : `ve ${ajenos.length} filas ajenas`
})

await prueba('un estudiante solo lee sus propios intentos', async () => {
  const { data, error } = await A.c.from('intentos').select('perfil_id')
  if (error) return error.message
  return data.every((i) => i.perfil_id === A.id) ? true : 've intentos ajenos'
})

await prueba('un estudiante no puede leer el perfil de otro', async () => {
  const { data, error } = await A.c.from('perfiles').select('id').eq('id', B.id)
  if (error) return error.message
  return data.length === 0 ? true : 'pudo leer el perfil ajeno'
})

await prueba('un estudiante no puede modificar el resultado de otro', async () => {
  const antes = sql(
    `select mejor_puntaje from public.mejores where perfil_id = '${B.id}' and actividad_id = 'e1-a1-orden'`,
  )
  await A.c.from('mejores').update({ mejor_puntaje: 999 }).eq('perfil_id', B.id)
  const despues = sql(
    `select mejor_puntaje from public.mejores where perfil_id = '${B.id}' and actividad_id = 'e1-a1-orden'`,
  )
  return antes === despues ? true : `cambió de ${antes} a ${despues}`
})

await prueba('un estudiante no puede inflar su propio resultado por UPDATE directo', async () => {
  await A.c.from('mejores').update({ mejor_puntaje: 999 }).eq('perfil_id', A.id).eq('actividad_id', 'e1-a1-orden')
  const p = Number(
    sql(`select mejor_puntaje from public.mejores where perfil_id = '${A.id}' and actividad_id = 'e1-a1-orden'`),
  )
  return p === 100 ? true : `quedó en ${p}`
})

await prueba('un estudiante no puede insertar un intento a nombre de otro', async () => {
  const { error } = await A.c.from('intentos').insert({
    perfil_id: B.id,
    actividad_id: 'e1-a1-orden',
    correcto: true,
    puntaje: 999,
    cliente_id: `falso-${sello}`,
  })
  return error ? true : 'la inserción a nombre ajeno fue aceptada'
})

await prueba('un estudiante no puede ascenderse a docente', async () => {
  const { error } = await A.c.from('perfiles').update({ rol: 'docente' }).eq('id', A.id)
  const rol = sql(`select rol from public.perfiles where id = '${A.id}'`)
  return rol === 'estudiante' ? true : `quedó como ${rol} (error: ${error?.message ?? 'ninguno'})`
})

await prueba('un estudiante no puede autorizarse un grupo como docente', async () => {
  const { error } = await A.c.from('docente_grupos').insert({
    docente_id: A.id,
    grupo_id: sql(`select id from public.grupos where nombre = 'Grupo 1'`),
  })
  return error ? true : 'pudo insertarse en docente_grupos'
})

await prueba('los borradores son estrictamente privados', async () => {
  await A.c.from('borradores').upsert({ perfil_id: A.id, actividad_id: 'laboratorio', contenido: { codigo: 'x' } })
  const { data } = await B.c.from('borradores').select('perfil_id')
  return (data ?? []).every((b) => b.perfil_id === B.id) ? true : 'Bruno ve borradores de Ana'
})

/* --------------------------- 5. Permisos docente ------------------------- */

console.log('Asignando el rol docente por vía administrativa…')
sql(`update public.perfiles set rol = 'docente' where id = '${D.id}'`)
sql(
  `insert into public.docente_grupos (docente_id, grupo_id) select '${D.id}', id from public.grupos where nombre = 'Grupo 1' on conflict do nothing`,
)

const clienteDocente = cliente()
await clienteDocente.auth.signInWithPassword({ email: correoD, password: 'claveDePrueba123' })

await prueba('el docente ve a los estudiantes de su grupo autorizado', async () => {
  const { data, error } = await clienteDocente.from('v_progreso_estudiante').select('perfil_id, grupo').eq('perfil_id', A.id)
  if (error) return error.message
  return data.length > 0 ? true : 'no ve a la estudiante de su grupo'
})

await prueba('el docente NO ve estudiantes de grupos no autorizados', async () => {
  const { data, error } = await clienteDocente.from('v_progreso_estudiante').select('perfil_id').eq('perfil_id', B.id)
  if (error) return error.message
  return data.length === 0 ? true : 've a Bruno, que está en el Grupo 2'
})

await prueba('el docente lee los mejores resultados de su grupo', async () => {
  const { data, error } = await clienteDocente.from('mejores').select('perfil_id')
  if (error) return error.message
  const deB = data.filter((m) => m.perfil_id === B.id)
  const deA = data.filter((m) => m.perfil_id === A.id)
  return deA.length > 0 && deB.length === 0 ? true : `de Ana ${deA.length}, de Bruno ${deB.length}`
})

await prueba('el docente tampoco puede modificar resultados', async () => {
  await clienteDocente.from('mejores').update({ mejor_puntaje: 5 }).eq('perfil_id', A.id).eq('actividad_id', 'e1-a1-orden')
  const p = Number(
    sql(`select mejor_puntaje from public.mejores where perfil_id = '${A.id}' and actividad_id = 'e1-a1-orden'`),
  )
  return p === 100 ? true : `quedó en ${p}`
})

/* ------------------------ 6. Catálogo y anónimos ------------------------- */

await prueba('el catálogo de actividades se sembró completo', async () => {
  const n = Number(sql('select count(*) from public.actividades'))
  const e = Number(sql('select count(*) from public.estaciones'))
  const l = Number(sql('select count(*) from public.logros'))
  return n === 63 && e === 6 && l === 12 ? true : `actividades ${n}, estaciones ${e}, logros ${l}`
})

await prueba('un visitante sin sesión no ve datos de estudiantes', async () => {
  const anon = cliente()
  const { data: m } = await anon.from('mejores').select('perfil_id')
  const { data: p } = await anon.from('perfiles').select('id')
  return (m ?? []).length === 0 && (p ?? []).length === 0
    ? true
    : `mejores ${m?.length}, perfiles ${p?.length}`
})

await prueba('un visitante sin sesión sí ve la lista de grupos (la necesita el registro)', async () => {
  const anon = cliente()
  const { data, error } = await anon.from('grupos').select('nombre')
  if (error) return error.message
  return data.length > 0 ? true : 'no ve los grupos'
})

await prueba('un visitante sin sesión no puede registrar intentos', async () => {
  const anon = cliente()
  const { error } = await anon.rpc('registrar_intento', {
    p_actividad_id: 'e1-a1-orden',
    p_correcto: true,
    p_pistas: 0,
    p_intentos_fallidos: 0,
    p_solucion_vista: false,
    p_datos: {},
    p_cliente_id: `anon-${sello}`,
  })
  return error ? true : 'un anónimo pudo registrar un intento'
})

/* -------------------------------- limpieza ------------------------------- */

console.log('Borrando las cuentas de prueba…')
sql(`delete from auth.users where email like '%.${sello}@ejemplo.test'`)

/* -------------------------------- informe -------------------------------- */

console.log(`\n${ok} comprobaciones de seguridad pasaron.`)
if (fallos.length > 0) {
  console.log(`\n${fallos.length} FALLARON:\n`)
  for (const f of fallos) console.log(`  ✗ ${f}`)
  process.exit(1)
}
console.log('Sin fallos.\n')
