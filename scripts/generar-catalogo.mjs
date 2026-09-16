/**
 * Genera la migración que siembra el catálogo de estaciones y actividades en
 * Supabase a partir de los archivos de contenido.
 *
 *   npm run catalogo
 *
 * Es idempotente: usa upsert por id, así que se puede volver a ejecutar cada
 * vez que se agregue o ajuste una actividad. No borra filas que ya no existan
 * en el contenido, para no dejar huérfanos los intentos ya registrados; si una
 * actividad se retira de verdad, hay que borrarla a mano y decidir qué pasa con
 * su historial.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catalogoActividades, catalogoEstaciones } from '../src/data/catalogo.js'

const aqui = dirname(fileURLToPath(import.meta.url))
const destino = resolve(aqui, '../supabase/migrations/20260915130000_catalogo.sql')

const txt = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replaceAll("'", "''")}'`)
const arr = (lista) =>
  lista.length === 0 ? "'{}'::text[]" : `ARRAY[${lista.map(txt).join(', ')}]::text[]`

const lineas = []
lineas.push('-- ARCHIVO GENERADO por scripts/generar-catalogo.mjs. No editar a mano.')
lineas.push(`-- Generado a partir del contenido de src/data/. ${catalogoActividades.length} actividades.`)
lineas.push('')
lineas.push('begin;')
lineas.push('')
lineas.push('insert into public.estaciones (id, orden, titulo, sesion) values')
lineas.push(
  catalogoEstaciones
    .map((e) => `  (${txt(e.id)}, ${e.orden}, ${txt(e.titulo)}, ${txt(e.sesion)})`)
    .join(',\n') +
    '\non conflict (id) do update set orden = excluded.orden, titulo = excluded.titulo, sesion = excluded.sesion;',
)
lineas.push('')
lineas.push(
  'insert into public.actividades (id, estacion_id, titulo, tipo, nivel, puntos_max, cuenta_nota, conceptos, orden) values',
)
lineas.push(
  catalogoActividades
    .map(
      (a) =>
        `  (${txt(a.id)}, ${txt(a.estacionId)}, ${txt(a.titulo)}, ${txt(a.tipo)}, ${txt(a.nivel)}, ` +
        `${a.puntos}, ${a.cuentaNota}, ${arr(a.conceptos)}, ${a.orden})`,
    )
    .join(',\n') +
    `\non conflict (id) do update set
  estacion_id = excluded.estacion_id,
  titulo      = excluded.titulo,
  tipo        = excluded.tipo,
  nivel       = excluded.nivel,
  puntos_max  = excluded.puntos_max,
  cuenta_nota = excluded.cuenta_nota,
  conceptos   = excluded.conceptos,
  orden       = excluded.orden;`,
)
lineas.push('')

// Logros
const { default: logros } = await import('../src/data/logros.js')
lineas.push('insert into public.logros (id, titulo, descripcion, evidencia) values')
lineas.push(
  logros
    .map((l) => `  (${txt(l.id)}, ${txt(l.titulo)}, ${txt(l.descripcion)}, ${txt(l.evidencia)})`)
    .join(',\n') +
    '\non conflict (id) do update set titulo = excluded.titulo, descripcion = excluded.descripcion, evidencia = excluded.evidencia;',
)
lineas.push('')
lineas.push('commit;')
lineas.push('')

mkdirSync(dirname(destino), { recursive: true })
writeFileSync(destino, lineas.join('\n'), 'utf8')

console.log(`Catálogo generado: ${destino}`)
console.log(`  ${catalogoEstaciones.length} estaciones`)
console.log(`  ${catalogoActividades.length} actividades`)
console.log(`  ${logros.length} logros`)
