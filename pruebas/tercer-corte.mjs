/**
 * Pruebas del tercer corte (validadores, exportación). Se ejecutan con:
 *   npm run pruebas:tercer-corte
 * No dependen del navegador ni de la base de datos.
 */
import { validarCriterio, atributosRepetidos, revisarFicha3 } from '../src/tercer-corte/lib/validadores.js'
import { csvFicha3, pdfFicha3 } from '../src/tercer-corte/lib/exportar.js'
import { EJEMPLO_LA_ESQUINA } from '../src/tercer-corte/data/iso.js'

let ok = 0
const fallos = []
function prueba(nombre, fn) {
  try {
    const r = fn()
    if (r === true) ok += 1
    else fallos.push(`${nombre}: ${r}`)
  } catch (e) {
    fallos.push(`${nombre}: lanzó ${e.message}`)
  }
}

/* ------------------------------ criterio medible ------------------------------ */

prueba('criterio · acepta los tres ejemplos de La Esquina', () => {
  const malos = EJEMPLO_LA_ESQUINA.atributos.filter((a) => !validarCriterio(a.criterio).ok)
  return malos.length === 0 ? true : malos.map((a) => a.criterio).join(' | ')
})

for (const t of [
  'Registrar un pedido toma menos de 2 minutos',
  'El total coincide con el cálculo a mano en 10 de 10 pedidos',
  'Ante un dato faltante muestra un aviso y no se cierra',
  'Responde en menos de dos segundos',
  'Funciona en 3 navegadores distintos',
  'No permite entrar con una contraseña vacía',
]) {
  prueba(`criterio · acepta «${t}»`, () => (validarCriterio(t).ok ? true : validarCriterio(t).pista))
}

for (const [t, palabra] of [
  ['Que sea rápido', 'rápido'],
  ['Que sea fácil de usar', 'fácil'],
  ['Que se vea bonito y moderno', 'bonito'],
]) {
  prueba(`criterio · rechaza «${t}» y nombra la palabra vaga`, () => {
    const r = validarCriterio(t)
    return !r.ok && r.pista?.includes(palabra) && r.pista.includes('menos de 2 minutos') ? true : JSON.stringify(r)
  })
}

prueba('criterio · vacío no da pista (todavía no escribieron)', () => {
  const r = validarCriterio('   ')
  return !r.ok && r.pista === null ? true : JSON.stringify(r)
})

prueba('criterio · algo sin número ni verificación da una pista útil', () => {
  const r = validarCriterio('Que le guste a la gente')
  return !r.ok && r.pista?.includes('sí o no') ? true : JSON.stringify(r)
})

/* ---------------------------- atributos repetidos ---------------------------- */

prueba('repetidos · detecta el que se repite y ignora vacíos', () => {
  const r = atributosRepetidos(['usabilidad', 'seguridad', 'usabilidad', '', ''])
  return r.length === 1 && r[0] === 'usabilidad' ? true : JSON.stringify(r)
})

prueba('repetidos · tres distintos no dan alerta', () => (atributosRepetidos(['a', 'b', 'c']).length === 0 ? true : 'alerta falsa'))

/* ------------------------------- revisión ficha 3 ------------------------------ */

const completa = () => ({
  a1_atributo: 'usabilidad', a1_significa: 'Fácil de usar', a1_criterio: 'Menos de 2 minutos', a1_prueba: 'Cronometrar a 3 personas',
  a2_atributo: 'adecuacion', a2_significa: 'Total correcto', a2_criterio: 'Coincide en 10 de 10 pedidos', a2_prueba: 'Comparar con calculadora',
  a3_atributo: 'fiabilidad', a3_significa: 'No se daña', a3_criterio: 'Muestra un aviso y no se cierra', a3_prueba: 'Enviar vacío',
  mas_importante: 'a2', por_que: 'Si el total falla, se pierde dinero',
})

prueba('ficha 3 · vacía no se puede entregar', () => (revisarFicha3({}).puedeEntregar ? 'permitió entregar vacía' : true))

prueba('ficha 3 · completa se puede entregar y todo queda en verde', () => {
  const r = revisarFicha3(completa())
  return r.puedeEntregar && r.puntos.every((p) => p.ok) ? true : JSON.stringify(r.puntos.filter((p) => !p.ok))
})

prueba('ficha 3 · falta un campo de un atributo: no se entrega', () => {
  const c = completa()
  c.a2_prueba = '  '
  return revisarFicha3(c).puedeEntregar ? 'permitió entregar incompleta' : true
})

prueba('ficha 3 · falta decir cuál es el más importante: no se entrega', () => {
  const c = completa()
  delete c.por_que
  return revisarFicha3(c).puedeEntregar ? 'permitió entregar sin el más importante' : true
})

prueba('ficha 3 · atributo repetido: alerta y no se entrega', () => {
  const c = completa()
  c.a3_atributo = 'usabilidad'
  const r = revisarFicha3(c)
  return !r.puedeEntregar && r.repetidos.includes('usabilidad') && r.puntos.find((p) => p.id === 'distintos').pista ? true : JSON.stringify(r.repetidos)
})

prueba('ficha 3 · un criterio vago avisa pero NO impide entregar (validador suave)', () => {
  const c = completa()
  c.a1_criterio = 'Que sea rápido'
  const r = revisarFicha3(c)
  const p = r.puntos.find((x) => x.id === 'criterio-1')
  return r.puedeEntregar && !p.ok && p.pista ? true : JSON.stringify(p)
})

/* -------------------------------- exportación -------------------------------- */

prueba('csv · una fila por equipo con encabezado, comillas y BOM', () => {
  const csv = csvFicha3([
    { equipo: 'Pedidos "La Esquina", v2', miembros: [{ nombres: 'Ana', apellidos: 'Pérez' }], estado: 'entregada', entregada_en: '2026-11-09T23:00:00Z', contenido: completa() },
  ])
  const lineas = csv.replace('\ufeff', '').split('\r\n')
  return csv.startsWith('\ufeff') && lineas.length === 2 && lineas[0].startsWith('equipo,integrantes') && lineas[1].includes('"Pedidos ""La Esquina"", v2"') && lineas[1].includes('Pérez, Ana')
    ? true
    : lineas[1]
})

prueba('pdf · se genera un PDF válido con los textos de la ficha', () => {
  const bytes = pdfFicha3({ equipo: 'Pedidos La Esquina', miembros: [{ nombres: 'Ana', apellidos: 'Pérez' }], estado: 'en_progreso', contenido: completa() })
  const txt = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return txt.startsWith('%PDF-1.4') && txt.trimEnd().endsWith('%%EOF') && txt.includes('Ficha 3') ? true : 'PDF inválido'
})

console.log(`\n${ok} comprobaciones pasaron.`)
if (fallos.length > 0) {
  console.log(`\n${fallos.length} FALLARON:\n`)
  for (const f of fallos) console.log(`  ✗ ${f}`)
  process.exit(1)
}
console.log('Sin fallos.\n')
