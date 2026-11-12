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
import { normalizarLineas, limpiarPseudocodigo } from '../src/tercer-corte/lib/normalizar.js'
import { esGrupoSencillo, armarPseudocodigo, faltantes, nombreDeProceso, EJEMPLO_ASISTENTE } from '../src/tercer-corte/lib/asistente.js'
import { construirTabla, revisarTabla, respuestasCorrectas, sugerirCaso, tipoDePaso } from '../src/tercer-corte/lib/pruebaGuiada.js'

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
  return !a.ok && /sobra/.test(m) && /no está cerrado/.test(m) ? true : m
})

prueba('análisis · cierres cruzados: FIN PARA donde iba FIN SI', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: l (lista)', 'SI 1 = 1 ENTONCES', '  PARA CADA i EN l', '  FIN SI', 'FIN PARA', 'SALIDA: 1'].join('\n'))
  return !a.ok && a.errores.length > 0 ? true : 'aceptó los cierres cruzados'
})

prueba('análisis · una línea que no es pseudocódigo da una pista, no un error técnico', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: a (número)', 'hacer cuentas raras', 'SALIDA: a'].join('\n'))
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

/* ============== Ficha 4 · lo que escriben los estudiantes (casos reales) ============== */

const PRECIOS = [
  'PROCESO descuentoPrecio',
  'ENTRADA: precio (número)',
  'total_a_pagar ← 0',
  'intentos ← 0',
  'MIENTRAS intentos < 3 HACER',
  '    SI precio > 0 ENTONCES',
  '        SI precio > 100 ENTONCES',
  '            total_a_pagar ← precio * 0.90',
  '        SI NO',
  '            total_a_pagar ← precio',
  '        FIN SI',
  '        SALIDA: total_a_pagar',
  '        intentos ← 3',
  '    SI NO',
  '        SALIDA: "Precio inválido, intente de nuevo"',
  '        intentos ← intentos + 1',
  '    FIN SI',
  'FIN MIENTRAS',
  'FIN PROCESO',
].join('\n')

prueba('estudiantes · «FIN PROCESO» al final se acepta (era el error «No entiendo la línea 21»)', () => {
  const a = analizar(PRECIOS)
  return a.ok ? true : JSON.stringify(a.errores)
})

prueba('estudiantes · el algoritmo del precio: 150 da 135, 5 da 5, y -1 repite 3 veces el aviso', () => {
  const r150 = correr(PRECIOS, { precio: 150 })
  const r5 = correr(PRECIOS, { precio: 5 })
  const rNeg = correr(PRECIOS, { precio: -1 })
  const avisos = rNeg.pasos.filter((p) => /Precio inválido/.test(p.texto)).length
  return r150.resultado === 135 && r5.resultado === 5 && rNeg.ok && avisos === 3 && rNeg.resultado === 'Precio inválido, intente de nuevo'
    ? true
    : JSON.stringify([r150.resultado, r5.resultado, rNeg.resultado, avisos, r150.error, rNeg.error])
})

prueba('estudiantes · LEER, ESCRIBIR, IMPRIMIR y MOSTRAR equivalen a ENTRADA y SALIDA', () => {
  const texto = ['ALGORITMO doble', 'DEFINIR n COMO ENTERO', 'LEER n', 'ESCRIBIR "El doble es: ", n * 2', 'FIN ALGORITMO'].join('\n')
  const r = correr(texto, { n: 4 })
  return r.ok && r.resultado === 'El doble es: 8' ? true : JSON.stringify([r.ok, r.resultado, r.error, r.errores])
})

prueba('estudiantes · varias salidas con coma: la coma decimal no separa (0,5)', () => {
  const r = correr(['PROCESO c', 'ENTRADA: a (número)', 'MOSTRAR "Mitad:", a * 0,5, " listo"', 'FIN PROCESO'].join('\n'), { a: 3 })
  return r.ok && r.resultado === 'Mitad:1,5 listo' ? true : JSON.stringify([r.resultado, r.error, r.errores])
})

prueba('estudiantes · ENTRADA sin dos puntos y una variable llamada «salida» se aceptan', () => {
  const r = correr(['PROCESO c', 'ENTRADA n (número)', 'salida ← n + 1', 'SALIDA: salida'].join('\n'), { n: 1 })
  return r.ok && r.resultado === 2 ? true : JSON.stringify([r.resultado, r.error, r.errores])
})

prueba('estudiantes · «PROCESO» solo, sin nombre, también se acepta', () => {
  const r = correr(['PROCESO', 'ENTRADA: n (número)', 'SALIDA: n', 'FIN PROCESO'].join('\n'), { n: 7 })
  return r.ok && r.resultado === 7 ? true : JSON.stringify([r.error, r.errores])
})

prueba('estudiantes · el error de línea no repite «línea N» dos veces en el texto mostrado', () => {
  const a = analizar(['PROCESO x', 'ENTRADA: a (número)', 'hacer cuentas raras', 'SALIDA: a'].join('\n'))
  const e = a.errores[0]
  return (e.mensaje.match(/línea 3/g) ?? []).length === 1 ? true : e.mensaje
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
  return !r.completa && r.puntos.filter((p) => p.ok).length === 0 ? true : JSON.stringify(r.puntos.filter((p) => p.ok).map((p) => p.id))
})

prueba('ficha 4 · sin la confirmación del compañero no se puede entregar', () => {
  const c = ficha4Completa()
  delete c.par_id
  const r = revisarFicha4(c)
  return !r.completa && !r.puntos.find((p) => p.id === 'par').ok ? true : 'permitió entregar sin compañero'
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
  return !par.ok && par.pista && !prueba.ok && !r.completa ? true : JSON.stringify({ par: par.ok, prueba: prueba.ok })
})

prueba('ficha 4 · resultado distinto al esperado: avisa y no deja entregar', () => {
  const c = ficha4Completa()
  c.esperado = '35000'
  c.par_firma = firmaPrueba(c)
  const r = revisarFicha4(c)
  const p = r.puntos.find((x) => x.id === 'resultado')
  return !p.ok && /no coincide/.test(p.pista) && !r.completa ? true : JSON.stringify(p)
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

/* ====================== Ficha 4 · pseudocódigo de otras fuentes (IA, PSeInt…) ====================== */

const DESDE_IA = [
  '```',
  '**Algoritmo:** Descuento por cantidad',
  '',
  'ENTRADA:',
  '- precio (número)',
  '- cantidad (entero)',
  '',
  '1. INICIO',
  '2. total = precio * cantidad;',
  '3. IF cantidad >= 10 AND precio > 0 THEN',
  '     total = total - total * 0.1',
  '   ELSE IF cantidad >= 5 THEN',
  '     total = total - total * 0.05',
  '   ELSE',
  '     total = total',
  '   END IF',
  '4. PRINT "Total: ", total',
  '5. FIN',
  '```',
].join('\n')

prueba('flexible · pseudocódigo pegado de una IA (viñetas, markdown, inglés, = y ;) se entiende y se ejecuta', () => {
  const r = correr(DESDE_IA, { precio: 1000, cantidad: 10 })
  const r2 = correr(DESDE_IA, { precio: 1000, cantidad: 6 })
  const r3 = correr(DESDE_IA, { precio: 1000, cantidad: 2 })
  return r.ok && r.resultado === 'Total: 9000' && r2.resultado === 'Total: 5700' && r3.resultado === 'Total: 2000'
    ? true
    : JSON.stringify([r.errores, r.error, r.resultado, r2.resultado, r3.resultado])
})

prueba('flexible · la normalización conserva el número de líneas (los mensajes siguen señalando la línea que ven)', () => {
  const n = normalizarLineas(DESDE_IA)
  return n.texto.split('\n').length === DESDE_IA.split('\n').length ? true : `${n.texto.split('\n').length} vs ${DESDE_IA.split('\n').length}`
})

prueba('flexible · avisa qué palabras estaban en inglés y «Limpiar y traducir» las pasa a español sin cambiar el resultado', () => {
  const n = normalizarLineas(DESDE_IA)
  const limpio = limpiarPseudocodigo(DESDE_IA)
  const otra = normalizarLineas(limpio)
  const r = correr(limpio, { precio: 1000, cantidad: 10 })
  return n.ingles.includes('IF') && n.ingles.includes('OUTPUT / PRINT') && otra.ingles.length === 0 && r.ok && r.resultado === 'Total: 9000' ? true : JSON.stringify([n.ingles, otra.ingles, r.errores, r.error])
})

prueba('flexible · «SINO SI» encadena varias condiciones en español', () => {
  const t = ['PROCESO nota', 'ENTRADA: n (número)', 'SI n >= 4,5 ENTONCES', '  r ← "Excelente"', 'SINO SI n >= 3 ENTONCES', '  r ← "Aprobado"', 'SI NO', '  r ← "Reprobado"', 'FIN SI', 'SALIDA: r'].join('\n')
  const casos = [[5, 'Excelente'], [3.2, 'Aprobado'], [1, 'Reprobado']]
  const malos = casos.filter(([n, esperado]) => correr(t, { n }).resultado !== esperado)
  const a = analizar(t)
  return malos.length === 0 && a.ok && a.resumen.tieneSiNo ? true : JSON.stringify([malos, a.errores])
})

prueba('flexible · PARA i ← 1 HASTA n (con y sin PASO) y listas por posición', () => {
  const t = ['PROCESO suma', 'ENTRADA: precios (lista), n (número)', 'suma ← 0', 'PARA i ← 1 HASTA n', '  suma ← suma + precios[i]', 'FIN PARA', 'SALIDA: suma'].join('\n')
  const r = correr(t, { precios: [10, 20, 30, 40], n: 4 })
  const t2 = ['PROCESO pares', 'ENTRADA: n (número)', 'c ← 0', 'PARA i ← 2 HASTA n CON PASO 2', '  c ← c + 1', 'FIN PARA', 'SALIDA: c'].join('\n')
  const t3 = ['PROCESO cuenta', 'ENTRADA: n (número)', 'c ← 0', 'PARA i ← n HASTA 1 PASO -1', '  c ← c + i', 'FIN PARA', 'SALIDA: c'].join('\n')
  return r.resultado === 100 && correr(t2, { n: 10 }).resultado === 5 && correr(t3, { n: 4 }).resultado === 10 ? true : JSON.stringify([r.resultado, r.error, r.errores])
})

prueba('flexible · REPETIR … HASTA QUE ejecuta el cuerpo al menos una vez', () => {
  const t = ['PROCESO intentos', 'ENTRADA: n (número)', 'REPETIR', '  n ← n + 1', 'HASTA QUE n >= 3', 'SALIDA: n'].join('\n')
  return correr(t, { n: 10 }).resultado === 11 && correr(t, { n: 0 }).resultado === 3 ? true : JSON.stringify(correr(t, { n: 0 }))
})

prueba('flexible · funciones LONGITUD, REDONDEAR, MAX, MIN y PROMEDIO; posición de lista con campo', () => {
  const t = ['PROCESO f', 'ENTRADA: lista (lista), items (lista)', 'a ← LONGITUD(lista)', 'b ← REDONDEAR(10 / 3, 1)', 'c ← MAX(3, 9, 4) - MIN(3, 9, 4)', 'd ← PROMEDIO(lista)', 'e ← items[2].precio', 'SALIDA: a, " ", b, " ", c, " ", d, " ", e'].join('\n')
  const r = correr(t, { lista: [2, 4, 6], items: [{ precio: 5 }, { precio: 7 }] })
  return r.ok && r.resultado === '3 3,3 6 4 7' ? true : JSON.stringify([r.resultado, r.error, r.errores])
})

prueba('flexible · una función desconocida y una posición inexistente dan mensajes claros', () => {
  const a = correr(['PROCESO f', 'ENTRADA: n (número)', 'x ← raiz2(n)', 'SALIDA: x'].join('\n'), { n: 4 })
  const b = correr(['PROCESO f', 'ENTRADA: l (lista)', 'x ← l[5]', 'SALIDA: x'].join('\n'), { l: [1, 2] })
  return a.errores?.[0]?.mensaje.includes('No conozco la función') && !b.ok && /no existe/.test(b.error.mensaje) && /empiezan en 1/.test(b.error.pista) ? true : JSON.stringify([a, b.error])
})

prueba('flexible · asignar a una posición de lista y mostrar la lista', () => {
  const t = ['PROCESO p', 'ENTRADA: l (lista)', 'l[2] ← 99', 'SALIDA: l[2]'].join('\n')
  const r = correr(t, { l: [1, 2, 3] })
  return r.ok && r.resultado === 99 && /\[1, 99, 3\]/.test(r.pasos[1].vars.l) ? true : JSON.stringify([r.resultado, r.pasos[1]?.vars])
})

prueba('flexible · estilo PSeInt: Algoritmo, Leer, Escribir, Sino, FinSi, FinMientras', () => {
  const t = ['Algoritmo contador', '  Definir n Como Entero', '  Leer n', '  i <- 0', '  Mientras i < n Hacer', '    i <- i + 1', '  FinMientras', '  Si i = n Entonces', '    Escribir "Llegó a ", i', '  Sino', '    Escribir "No llegó"', '  FinSi', 'FinAlgoritmo'].join('\n')
  const r = correr(t, { n: 3 })
  return r.ok && r.resultado === 'Llegó a 3' ? true : JSON.stringify([r.resultado, r.error, r.errores])
})

prueba('flexible · el encabezado «ENTRADA:» con la lista de datos debajo declara las entradas', () => {
  const a = analizar(normalizarLineas(DESDE_IA).texto)
  return a.ok && a.resumen.entradas.map((e) => e.nombre).join(',') === 'precio,cantidad' ? true : JSON.stringify([a.errores, a.resumen.entradas])
})

prueba('flexible · en la revisión de la ficha 4, el inglés pide traducir pero el algoritmo sí se ejecuta', () => {
  const c = ficha4Completa()
  c.pseudo = PSEUDO_EJEMPLO.replace('PARA CADA item EN productos', 'FOR EACH item IN productos').replace('FIN PARA', 'END FOR')
  c.prueba_terminada = firmaEjecucion(c)
  const r = revisarFicha4(c)
  const esp = r.puntos.find((p) => p.id === 'espanol')
  return r.ejecucion?.ok && r.ejecucion.resultado === 31500 && !esp.ok && /inglés/.test(esp.pista) ? true : JSON.stringify([r.analisis.errores, esp])
})


prueba('guiada · la tabla se arma con SU algoritmo: casillas solo donde una línea cambia una variable', () => {
  const c = ficha4Completa()
  const e = revisarFicha4(c).ejecucion
  const t = construirTabla(e.pasos)
  return e.ok && t.filas.length > 0 && t.pedidas > 0 && t.columnas.includes('total') ? true : JSON.stringify([t.columnas, t.pedidas])
})

prueba('guiada · la tabla correcta se aprueba y una casilla mal se detecta', () => {
  const c = ficha4Completa()
  const e = revisarFicha4(c).ejecucion
  const t = construirTabla(e.pasos)
  const buenas = respuestasCorrectas(t)
  const ok1 = revisarTabla(t, buenas).todas
  const claves = Object.keys(buenas).filter((k) => !k.endsWith('|?'))
  const r2 = revisarTabla(t, { ...buenas, [claves[0]]: '99999' })
  return ok1 && !r2.todas && r2.ok[claves[0]] === false ? true : JSON.stringify([ok1, r2.buenas, r2.total])
})

prueba('sencilla · solo el Grupo 3 ve la versión sencilla', () => {
  const si = ['Grupo 3', 'grupo 3', ' GRUPO  3 '].every(esGrupoSencillo)
  const no = ['Grupo 1', 'Grupo 2', 'Grupo 30', '', null, undefined].every((g) => !esGrupoSencillo(g))
  return si && no ? true : JSON.stringify([si, no])
})

prueba('sencilla · con las respuestas del ejemplo el asistente arma un pseudocódigo que se entiende y se ejecuta', () => {
  const texto = armarPseudocodigo('Calcular el total del pedido', EJEMPLO_ASISTENTE)
  const c = { proceso: 'Calcular el total del pedido', entradas: 'productos: lista', salida: 'total', pseudo: texto, caso__productos: 'cantidad=10, precio=5000\ncantidad=2, precio=15000' }
  const rev = revisarFicha4(c)
  const e = rev.ejecucion
  const pasan = ['bloques', 'si', 'repetir', 'variables', 'espanol'].every((id) => rev.puntos.find((p) => p.id === id).ok)
  return e?.ok && e.resultado === 72000 && pasan ? true : JSON.stringify([e?.resultado, e?.error, rev.analisis.errores, rev.puntos.filter((p) => !p.ok).map((p) => p.id)])
})

prueba('sencilla · el asistente avisa lo que falta y arma un nombre de proceso válido', () => {
  const falta = faltantes({ lista: 'x' }).length === 6
  const nombre = nombreDeProceso('Calcular el total del pedido') === 'calcularElTotalDelPedido' && nombreDeProceso('¡¡') === 'miProceso' && nombreDeProceso('3 pasos') === 'proceso3Pasos'
  return falta && nombre ? true : JSON.stringify([falta, nombre])
})

prueba('ficha 4 · se puede entregar con el pseudocódigo escrito aunque la revisión no esté completa, pero no vacía', () => {
  const r = revisarFicha4({ pseudo: 'PROCESO x\ntotal = 1\nSALIDA total' })
  return r.puedeEntregar && !r.completa && !revisarFicha4({}).puedeEntregar ? true : JSON.stringify([r.puedeEntregar, r.completa])
})

prueba('guiada · tipoDePaso reconoce entrada, decisión, vuelta y salida', () => {
  const r = [tipoDePaso('ENTRADA: x'), tipoDePaso('SI x > 3 ENTONCES'), tipoDePaso('PARA CADA i EN l'), tipoDePaso('SALIDA total'), tipoDePaso('total ← 0')]
  return r.join() === 'entrada,decide,vuelta,salida,asigna' ? true : r.join()
})

prueba('guiada · el caso sugerido usa los nombres del algoritmo y se puede ejecutar', () => {
  const c = ficha4Completa()
  const rev = revisarFicha4(c)
  const caso = sugerirCaso(rev.analisis.programa, c.pseudo)
  const e = revisarFicha4({ ...c, ...caso }).ejecucion
  return Object.keys(caso).length > 0 && e?.ok ? true : JSON.stringify([caso, e?.error])
})

console.log(`\n${ok} comprobaciones pasaron.`)
if (fallos.length > 0) {
  console.log(`\n${fallos.length} FALLARON:\n`)
  for (const f of fallos) console.log(`  ✗ ${f}`)
  process.exit(1)
}
console.log('Sin fallos.\n')
