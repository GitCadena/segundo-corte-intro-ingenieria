/**
 * Lógica de la Ficha 4 · Pseudocódigo del proceso principal. Pura: sin React ni
 * red, para probarla en Node (pruebas/tercer-corte.mjs).
 */
import {
  analizar,
  ejecutarPrograma,
  detectarCodigo,
  variablesSinAsignar,
  valorDeEntrada,
  resultadosCoinciden,
  camposUsados,
} from './interprete.js'

const lleno = (v) => String(v ?? '').trim() !== ''

const TIPOS_CONOCIDOS = /(n[uú]mero|numero|entero|decimal|texto|cadena|palabra|lista|registro|verdadero|falso|booleano|fecha|dinero|cantidad|precio)/i

/** Cada línea de «entradas» debe decir qué es y de qué tipo: «precio: número». */
export function revisarEntradasEscritas(texto) {
  const lineas = String(texto ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lineas.length === 0) return { ok: false, sinTipo: [] }
  const sinTipo = lineas.filter((l) => !/\S+\s*(?::|\(|-|–)\s*\S+/.test(l) || !TIPOS_CONOCIDOS.test(l))
  return { ok: sinTipo.length === 0, sinTipo }
}

function hash(base) {
  let h = 5381
  for (let i = 0; i < base.length; i += 1) h = ((h << 5) + h + base.charCodeAt(i)) | 0
  return String(h >>> 0)
}

/** Firma del pseudocódigo y del caso: si cambian, hay que repetir la prueba de escritorio. */
export function firmaEjecucion(c = {}) {
  return hash(
    [c.pseudo, ...Object.keys(c).filter((k) => k.startsWith('caso__')).sort().map((k) => `${k}=${c[k]}`)]
      .map((x) => String(x ?? '').trim())
      .join('|'),
  )
}

/** Firma de toda la prueba: si cambia algo, la confirmación del compañero deja de valer. */
export function firmaPrueba(c = {}) {
  return hash([firmaEjecucion(c), c.esperado, c.resultado_obtenido, c.prueba_manual].map((x) => String(x ?? '').trim()).join('|'))
}

/** Convierte las entradas escritas en el caso de prueba en valores del programa. */
export function entradasDelCaso(programa, c = {}) {
  const valores = {}
  const errores = []
  for (const e of programa.entradas) {
    const { valor, error } = valorDeEntrada(c[`caso__${e.nombre}`], e.tipo)
    if (error) errores.push(`En «${e.nombre}»: ${error}`)
    else if (valor !== undefined) valores[e.nombre] = valor
  }
  return { valores, errores }
}

/** Analiza el pseudocódigo y, si se puede, lo ejecuta con el caso escrito. */
export function procesar(c = {}) {
  const analisis = analizar(c.pseudo)
  let ejecucion = null
  let erroresCaso = []
  if (analisis.ok && analisis.programa) {
    const { valores, errores } = entradasDelCaso(analisis.programa, c)
    erroresCaso = errores
    if (errores.length === 0) ejecucion = ejecutarPrograma(analisis.programa, valores)
  }
  return { analisis, ejecucion, erroresCaso }
}

/** Resultado obtenido de la prueba de escritorio: el del intérprete o el que escribió el equipo a mano. */
export function resultadoObtenido(c, ejecucion) {
  if (c.modo_prueba === 'manual') return lleno(c.resultado_obtenido) ? c.resultado_obtenido : null
  if (ejecucion?.ok && ejecucion.resultado !== undefined) return ejecucion.resultado
  return null
}

export function pruebaManualCompleta(c = {}) {
  let filas = []
  try {
    filas = JSON.parse(c.prueba_manual || '[]')
  } catch {
    filas = []
  }
  const llenas = filas.filter((f) => lleno(f.linea) || lleno(f.variables) || lleno(f.parcial))
  return llenas.length >= 1 && lleno(c.resultado_obtenido) && lleno(c.prueba_por_id)
}

/**
 * Revisión de la ficha 4: puntos «✓ / pendiente» y si se puede entregar.
 * @param {Record<string,string>} c contenido plano de la ficha
 * @param {{ usuarioId?: string }} ctx
 */
export function revisarFicha4(c = {}, ctx = {}) {
  const { analisis, ejecucion } = procesar(c)
  const entradas = revisarEntradasEscritas(c.entradas)
  const codigo = detectarCodigo(c.pseudo)
  const r = analisis.resumen
  const sinAsignar = analisis.programa ? variablesSinAsignar(analisis.programa) : []
  const escribioAlgo = lleno(c.pseudo)

  const manual = c.modo_prueba === 'manual'
  const obtenido = resultadoObtenido(c, ejecucion)
  const pruebaHecha = manual ? pruebaManualCompleta(c) : !!ejecucion?.ok && ejecucion.pasos.length > 0 && c.prueba_terminada === firmaEjecucion(c)
  const coincide = obtenido !== null && resultadosCoinciden(obtenido, c.esperado)
  const firma = firmaPrueba(c)
  const parValido = lleno(c.par_id) && c.par_firma === firma && c.par_id !== c.prueba_por_id

  const puntos = [
    { id: 'proceso', texto: 'Eligieron el proceso más importante de su sistema', ok: lleno(c.proceso) },
    {
      id: 'entradas',
      texto: 'Entradas con su tipo definidas',
      ok: entradas.ok,
      pista: lleno(c.entradas) && !entradas.ok ? `A estas líneas les falta el tipo: ${entradas.sinTipo.map((l) => `«${l}»`).join(', ')}. Escríbelas como «precio: número».` : null,
    },
    { id: 'salida', texto: 'Salida definida', ok: lleno(c.salida) },
    {
      id: 'bloques',
      texto: 'Todos los bloques están bien cerrados y el pseudocódigo se entiende',
      ok: escribioAlgo && analisis.ok,
      pista: escribioAlgo && !analisis.ok ? analisis.errores[0]?.mensaje + (analisis.errores[0]?.pista ? ` ${analisis.errores[0].pista}` : '') : null,
    },
    {
      id: 'si',
      texto: 'Hay al menos un SI … ENTONCES … SI NO',
      ok: !!r.tieneSi && !!r.tieneSiNo,
      pista: escribioAlgo && r.tieneSi && !r.tieneSiNo ? 'Tienes un SI, pero le falta el «SI NO» (lo que pasa cuando la condición es falsa).' : null,
    },
    { id: 'repetir', texto: 'Hay al menos un MIENTRAS o un PARA CADA (repetir)', ok: !!r.tieneRepetir },
    {
      id: 'variables',
      texto: 'No hay variables sin asignar',
      ok: escribioAlgo && analisis.ok && sinAsignar.length === 0,
      pista: sinAsignar.length > 0 ? `La variable «${sinAsignar[0].nombre}» se usa en la línea ${sinAsignar[0].linea} antes de darle un valor. Asígnala antes, por ejemplo «${sinAsignar[0].nombre} ← 0».` : null,
    },
    {
      id: 'espanol',
      texto: 'Está escrito en español, no en código de un lenguaje',
      ok: escribioAlgo && codigo.length === 0,
      pista: codigo.length > 0 ? `Encontré rastros de código (${codigo.join(', ')}). Escribe el proceso con palabras en español: SI, ENTONCES, MIENTRAS, ←.` : null,
    },
    {
      id: 'prueba',
      texto: 'Prueba de escritorio completa con un caso real',
      ok: pruebaHecha,
      pista: null,
    },
    {
      id: 'resultado',
      texto: 'El resultado obtenido coincide con el esperado',
      ok: pruebaHecha && coincide,
      pista: pruebaHecha && lleno(c.esperado) && obtenido !== null && !coincide ? 'El resultado no coincide con el esperado. Revisen la línea donde el valor se aparta de lo que esperaban y corrijan el pseudocódigo o el cálculo a mano.' : null,
    },
    {
      id: 'par',
      texto: 'Un compañero confirmó que siguió el pseudocódigo y obtuvo el mismo resultado',
      ok: parValido,
      pista: lleno(c.par_id) && c.par_firma !== firma ? 'Cambiaron algo después de la confirmación: tu compañero debe confirmar de nuevo.' : null,
    },
  ]
  return {
    puntos,
    puedeEntregar: puntos.every((p) => p.ok),
    analisis,
    ejecucion,
    sinAsignar,
    firma,
    obtenido,
    coincide,
    camposSugeridos: camposUsados(c.pseudo),
  }
}
