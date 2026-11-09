/**
 * Pruebas del tercer corte (validadores, exportación). Se ejecutan con:
 *   npm run pruebas:tercer-corte
 * No dependen del navegador ni de la base de datos.
 */
import { validarCriterio, atributosRepetidos, revisarFicha3 } from '../src/tercer-corte/lib/validadores.js'
import { csvFicha3, pdfFicha3, csvFicha4, pdfFicha4 } from '../src/tercer-corte/lib/exportar.js'
import { EJEMPLO_LA_ESQUINA } from '../src/tercer-corte/data/iso.js'
import { PSEUDO_EJEMPLO, PSEUDO_CON_FALLA, CASO_EJEMPLO } from '../src/tercer-corte/data/pseudocodigo.js'
import {
  MAX_PASOS, analizar, correr, valorDeEntrada, valorSimple, resultadosCoinciden, detectarCodigo, variablesSinAsignar,
} from '../src/tercer-corte/lib/interprete.js'
import { revisarFicha4, firmaEjecucion, firmaPrueba } from '../src/tercer-corte/lib/ficha4.js'

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

/* ============================ Ficha 4 · intérprete ============================ */

const PSEUDO = PSEUDO_EJEMPLO
const entradaEjemplo = () => ({ productos: valorDeEntrada(CASO_EJEMPLO, 'lista').valor })

prueba('intérprete · el ejemplo de La Esquina da 31.500 (10 panes a 500 y 2 tortas a 15.000)', () => {
  const r = correr(PSEUDO, entradaEjemplo())
  return r.ok && r.resultado === 31500 ? true : JSON.stringify([r.ok, r.resultado, r.error])
})

prueba('intérprete · el recorrido tiene un paso por línea ejecutada y guarda los valores', () => {
  const r = correr(PSEUDO, entradaEjemplo())
  const p8 = r.pasos[7]
  return r.pasos.length === 13 && p8.vars.total === '35000' && p8.vars.unidades === '10' ? true : `${r.pasos.length} pasos; paso 8: ${JSON.stringify(p8?.vars)}`
})

prueba('intérprete · con 9 unidades no hay descuento y entra por el SI NO', () => {
  const r = correr(PSEUDO, { productos: valorDeEntrada('cantidad=9, precio=1000', 'lista').valor })
  return r.ok && r.resultado === 9000 && r.pasos.some((p) => p.nota.includes('va al SI NO')) ? true : JSON.stringify([r.resultado, r.error])
})

prueba('intérprete · la versión con falla da 35.000 en vez de 31.500', () => {
  const r = correr(PSEUDO_CON_FALLA, entradaEjemplo())
  return r.ok && r.resultado === 35000 ? true : String(r.resultado)
})

prueba('intérprete · operadores ASCII y decimales con coma o punto', () => {
  const texto = ['PROCESO cuentas', 'ENTRADA: a (número)', 'x <- a * 2,5', 'y := x / 2 + 0.5', 'SI y >= 3 Y NO (a = 0) ENTONCES', '  z <- y % 2', 'SI NO', '  z <- 0', 'FIN SI', 'SALIDA: z'].join('\n')
  const r = correr(texto, { a: 2 })
  return r.ok && r.resultado === 1 ? true : JSON.stringify([r.resultado, r.error, r.errores])
})

prueba('intérprete · MIENTRAS suma de 1 a n', () => {
  const texto = ['PROCESO suma', 'ENTRADA: n (número)', 'i ← 1', 'suma ← 0', 'MIENTRAS i ≤ n', '  suma ← suma + i', '  i ← i + 1', 'FIN MIENTRAS', 'SALIDA: suma'].join('\n')
  const r = correr(texto, { n: 5 })
  return r.ok && r.resultado === 15 ? true : JSON.stringify([r.resultado, r.error])
})

prueba('intérprete · los miles con punto valen miles: 15.000 son quince mil y 0,1 es un décimo', () => {
  return valorSimple('15.000') === 15000 && valorSimple('$15.000') === 15000 && valorSimple('0,1') === 0.1 && valorSimple('2.5') === 2.5 && valorSimple('0.125') === 0.125
    ? true
    : [valorSimple('15.000'), valorSimple('0,1'), valorSimple('2.5'), valorSimple('0.125')].join(' | ')
})

prueba('intérprete · un ciclo infinito se corta en 1000 pasos con un aviso amable', () => {
  const texto = ['PROCESO ciclo', 'ENTRADA: n (número)', 'MIENTRAS n > 0', '  n ← n + 1', 'FIN MIENTRAS', 'SALIDA: n'].join('\n')
  const r = correr(texto, { n: 1 })
  return !r.ok && r.truncado && r.pasos.length === MAX_PASOS && /1000 pasos/.test(r.error.mensaje) && /ciclo/.test(r.error.pista) ? true : JSON.stringify([r.ok, r.truncado, r.pasos.length, r.error])
})

prueba('intérprete · dividir entre cero da un mensaje simple con la línea', () => {
  const r = correr(['PROCESO d', 'ENTRADA: a (número)', 'r ← 10 / a', 'SALIDA: r'].join('\n'), { a: 0 })
  return !r.ok && r.error.linea === 3 && /entre cero/.test(r.error.mensaje) && r.error.pista ? true : JSON.stringify(r.error)
})

prueba('intérprete · variable sin valor: dice cuál y en qué línea', () => {
  const r = correr(['PROCESO v', 'ENTRADA: a (número)', 'r ← a + b', 'SALIDA: r'].join('\n'), { a: 1 })
  return !r.ok && /«b»/.test(r.error.mensaje) && r.error.linea === 3 ? true : JSON.stringify(r.error)
})

prueba('intérprete · campo de registro que no existe lista los que sí hay', () => {
  const r = correr(['PROCESO c', 'ENTRADA: lista (lista)', 'PARA CADA x EN lista', '  t ← x.valor', 'FIN PARA', 'SALIDA: 1'].join('\n'), { lista: [{ precio: 5 }] })
  return !r.ok && /valor/.test(r.error.mensaje) && /precio/.test(r.error.pista) ? true : JSON.stringify(r.error)
})

prueba('intérprete · lista vacía: PARA CADA no entra y lo dice', () => {
  const r = correr(['PROCESO c', 'ENTRADA: lista (lista)', 't ← 0', 'PARA CADA x EN lista', '  t ← t + 1', 'FIN PARA', 'SALIDA: t'].join('\n'), { lista: [] })
  return r.ok && r.resultado === 0 && r.pasos.some((p) => /vacía/.test(p.nota)) ? true : JSON.stringify([r.resultado, r.error])
})

prueba('análisis · bloque sin cerrar: mensaje con la línea y cómo cerrarlo', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: a (número)', 'SI a > 1 ENTONCES', '  r ← 1', 'SALIDA: r'].join('\n'))
  return !a.ok && a.errores.some((e) => e.linea === 3 && /no está cerrado/.test(e.mensaje) && /FIN SI/.test(e.pista)) ? true : JSON.stringify(a.errores)
})

prueba('análisis · FIN que sobra y SI sin ENTONCES', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: a (número)', 'FIN SI', 'SI a > 1', 'SALIDA: a'].join('\n'))
  const m = a.errores.map((e) => e.mensaje).join(' | ')
  return !a.ok && /sobra/.test(m) && /ENTONCES/.test(m) ? true : m
})

prueba('análisis · cierres cruzados: FIN PARA donde iba FIN SI', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: l (lista)', 'SI 1 = 1 ENTONCES', '  PARA CADA i EN l', '  FIN SI', 'FIN PARA', 'SALIDA: 1'].join('\n'))
  return !a.ok && a.errores.length > 0 ? true : 'aceptó los cierres cruzados'
})

prueba('análisis · una línea que no es pseudocódigo da una pista, no un error técnico', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: a (número)', 'imprimir resultado por pantalla', 'SALIDA: a'].join('\n'))
  const e = a.errores[0]
  return !a.ok && e.linea === 3 && /No entiendo la línea 3/.test(e.mensaje) && /flecha/.test(e.pista) && !/undefined|TypeError|Unexpected/.test(e.mensaje + e.pista) ? true : JSON.stringify(e)
})

prueba('análisis · reconoce SI NO, repetir y salida (resumen de la estructura)', () => {
  const a = analizar(PSEUDO)
  const r = a.resumen
  return a.ok && r.tieneSi && r.tieneSiNo && r.tieneRepetir && r.tieneSalida && r.entradas[0].nombre === 'productos' && r.entradas[0].tipo === 'lista' ? true : JSON.stringify(r)
})

prueba('análisis · variables sin asignar: detecta la que nunca recibe valor y acepta la asignada en las dos ramas', () => {
  const mala = analizar(['PROCESO x', 'ENTRADA: a (número)', 'r ← a + b', 'SALIDA: r'].join('\n'))
  const buena = analizar(PSEUDO)
  const dosRamas = analizar(['PROCESO x', 'ENTRADA: a (número)', 'SI a > 1 ENTONCES', '  d ← 1', 'SI NO', '  d ← 2', 'FIN SI', 'SALIDA: d'].join('\n'))
  const unaRama = analizar(['PROCESO x', 'ENTRADA: a (número)', 'SI a > 1 ENTONCES', '  d ← 1', 'FIN SI', 'SALIDA: d'].join('\n'))
  return variablesSinAsignar(mala.programa)[0]?.nombre === 'b' && variablesSinAsignar(buena.programa).length === 0 && variablesSinAsignar(dosRamas.programa).length === 0 && variablesSinAsignar(unaRama.programa)[0]?.nombre === 'd'
    ? true
    : 'detección incorrecta'
})

prueba('código · avisa de print(, for … in, range(, llaves y punto y coma, pero no del pseudocódigo en español', () => {
  const casos = ['print(total)', 'for i in range(10):', 'if (x > 1) {', 'total = total + 1;', 'console.log(x)']
  const sinAviso = casos.filter((t) => detectarCodigo(t).length === 0)
  return sinAviso.length === 0 && detectarCodigo(PSEUDO).length === 0 ? true : `sin aviso: ${sinAviso.join(' | ')}; falso positivo: ${detectarCodigo(PSEUDO)}`
})

prueba('seguridad · el texto no se ejecuta: process, constructor, __proto__ y funciones no hacen nada', () => {
  const intentos = ['x ← process.exit()', 'x ← constructor', 'x ← a.__proto__', 'x ← a.constructor.constructor("return 1")()', 'x ← (function(){})()']
  for (const linea of intentos) {
    const r = correr(['PROCESO s', 'ENTRADA: a (número)', linea, 'SALIDA: x'].join('\n'), { a: 1 })
    if (r.ok) return `ejecutó «${linea}»`
    if (/TypeError|ReferenceError|is not|Cannot/.test(JSON.stringify(r))) return `error técnico con «${linea}»: ${JSON.stringify(r).slice(0, 120)}`
  }
  return true
})

prueba('caso de prueba · una lista se escribe con un registro por línea y los errores son claros', () => {
  const buena = valorDeEntrada('cantidad=10, precio=500\ncantidad=2, precio=15.000', 'lista')
  const mala = valorDeEntrada('cantidad 10\nprecio', 'lista')
  return buena.valor.length === 2 && buena.valor[1].precio === 15000 && mala.error && /campo=valor/.test(mala.error) ? true : JSON.stringify([buena, mala])
})

prueba('caso de prueba · resultados que coinciden: 31500, 31.500 y $31.500 sí; 31,5 no', () => {
  return resultadosCoinciden(31500, '31500') && resultadosCoinciden(31500, '31.500') && resultadosCoinciden(31500, '$31.500') && !resultadosCoinciden(31500, '31,5') && !resultadosCoinciden(31500, '')
    ? true
    : 'comparación incorrecta'
})

/* ======================== Ficha 4 · revisión y entrega ======================== */

const ficha4Completa = () => {
  const c = {
    proceso: 'Calcular el total de un pedido con descuento',
    entradas: 'productos: lista',
    salida: 'total a pagar: número',
    pseudo: PSEUDO_EJEMPLO,
    caso__productos: CASO_EJEMPLO,
    esperado: '31500',
    prueba_por_id: 'ana',
    prueba_por_nombre: 'Ana',
  }
  c.prueba_terminada = firmaEjecucion(c)
  c.par_id = 'luis'
  c.par_nombre = 'Luis'
  c.par_firma = firmaPrueba(c)
  return c
}

prueba('ficha 4 · completa con prueba hecha y compañero distinto: todo en verde y se puede entregar', () => {
  const r = revisarFicha4(ficha4Completa())
  return r.puedeEntregar && r.puntos.every((p) => p.ok) ? true : JSON.stringify(r.puntos.filter((p) => !p.ok).map((p) => p.id))
})

prueba('ficha 4 · vacía: no se entrega y no se rompe', () => {
  const r = revisarFicha4({})
  return !r.puedeEntregar && r.puntos.filter((p) => p.ok).length === 0 ? true : JSON.stringify(r.puntos.filter((p) => p.ok).map((p) => p.id))
})

prueba('ficha 4 · sin la confirmación del compañero no se puede entregar', () => {
  const c = ficha4Completa()
  delete c.par_id
  const r = revisarFicha4(c)
  return !r.puedeEntregar && !r.puntos.find((p) => p.id === 'par').ok ? true : 'permitió entregar sin compañero'
})

prueba('ficha 4 · el mismo integrante no puede confirmar su propia prueba', () => {
  const c = ficha4Completa()
  c.par_id = c.prueba_por_id
  c.par_firma = firmaPrueba(c)
  return revisarFicha4(c).puntos.find((p) => p.id === 'par').ok ? 'se confirmó a sí mismo' : true
})

prueba('ficha 4 · si cambian el pseudocódigo o el caso después de la confirmación, hay que confirmar y probar de nuevo', () => {
  const c = ficha4Completa()
  c.pseudo = c.pseudo.replace('0,1', '0,2')
  const r = revisarFicha4(c)
  const par = r.puntos.find((p) => p.id === 'par')
  const prueba = r.puntos.find((p) => p.id === 'prueba')
  return !par.ok && par.pista && !prueba.ok && !r.puedeEntregar ? true : JSON.stringify({ par: par.ok, prueba: prueba.ok })
})

prueba('ficha 4 · resultado distinto al esperado: avisa y no deja entregar', () => {
  const c = ficha4Completa()
  c.esperado = '35000'
  c.par_firma = firmaPrueba(c)
  const r = revisarFicha4(c)
  const p = r.puntos.find((x) => x.id === 'resultado')
  return !p.ok && /no coincide/.test(p.pista) && !r.puedeEntregar ? true : JSON.stringify(p)
})

prueba('ficha 4 · código de otro lenguaje se detecta en la revisión', () => {
  const c = ficha4Completa()
  c.pseudo = `${c.pseudo}\nprint(total)`
  const p = revisarFicha4(c).puntos.find((x) => x.id === 'espanol')
  return !p.ok && /print\(/.test(p.pista) ? true : JSON.stringify(p)
})

prueba('ficha 4 · sin SI NO o sin repetir lo pide con una pista', () => {
  const c = ficha4Completa()
  c.pseudo = ['PROCESO x', 'ENTRADA: productos (lista)', 't ← 0', 'SI t = 0 ENTONCES', '  t ← 1', 'FIN SI', 'SALIDA: t'].join('\n')
  const r = revisarFicha4(c)
  const si = r.puntos.find((p) => p.id === 'si')
  const rep = r.puntos.find((p) => p.id === 'repetir')
  return !si.ok && /SI NO/.test(si.pista) && !rep.ok ? true : JSON.stringify([si, rep])
})

prueba('ficha 4 · modo manual: tabla llena + resultado + quién la hizo, y el compañero confirma', () => {
  const c = ficha4Completa()
  c.modo_prueba = 'manual'
  c.prueba_manual = JSON.stringify([{ linea: '3', variables: 'total = 0', parcial: '' }])
  c.resultado_obtenido = '31500'
  c.par_firma = firmaPrueba(c)
  const r = revisarFicha4(c)
  return r.puedeEntregar ? true : JSON.stringify(r.puntos.filter((p) => !p.ok).map((p) => p.id))
})

prueba('ficha 4 · las entradas sin tipo se señalan', () => {
  const c = ficha4Completa()
  c.entradas = 'productos'
  const p = revisarFicha4(c).puntos.find((x) => x.id === 'entradas')
  return !p.ok && /tipo/.test(p.pista) ? true : JSON.stringify(p)
})

prueba('csv y pdf · la ficha 4 se exporta', () => {
  const datos = { equipo: 'La Esquina', miembros: [{ nombres: 'Ana', apellidos: 'Pérez' }], estado: 'entregada', entregada_en: '2026-11-10T23:00:00Z', contenido: ficha4Completa() }
  const csv = csvFicha4([datos])
  const bytes = pdfFicha4(datos)
  const txt = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return csv.startsWith('﻿') && csv.includes('calcularTotal') && txt.startsWith('%PDF-1.4') && txt.includes('Ficha 4') ? true : csv.slice(0, 200)
})

console.log(`\n${ok} comprobaciones pasaron.`)
if (fallos.length > 0) {
  console.log(`\n${fallos.length} FALLARON:\n`)
  for (const f of fallos) console.log(`  ✗ ${f}`)
  process.exit(1)
}
console.log('Sin fallos.\n')
