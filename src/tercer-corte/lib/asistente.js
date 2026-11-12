/**
 * Versión sencilla de la Ficha 4 (Grupo 3, primíparos): ayudas que no cambian lo
 * que se entrega ni cómo se revisa. Lógica pura, se prueba en Node.
 */

/** El Grupo 3 ve la ficha 4 en su versión sencilla (el grupo viene del perfil: «Grupo 3»). */
export const esGrupoSencillo = (grupo) => /^grupo\s*3$/i.test(String(grupo ?? '').trim())

const sinTildes = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '')

/** «Calcular el total del pedido» → «calcularElTotalDelPedido» */
export function nombreDeProceso(texto) {
  const palabras = sinTildes(texto)
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  if (palabras.length === 0) return 'miProceso'
  const [a, ...resto] = palabras
  const nombre = a.toLowerCase() + resto.map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase()).join('')
  return /^[A-Za-z]/.test(nombre) ? nombre : `proceso${nombre}`
}

/** Una palabra sola, sin espacios ni tildes, para usarla como nombre de dato o variable. */
export function palabraSola(texto, defecto) {
  const p = sinTildes(texto).trim().split(/\s+/)[0]?.replace(/[^A-Za-z0-9_]/g, '') ?? ''
  return /^[A-Za-z_]/.test(p) ? p : defecto
}

export const EJEMPLO_ASISTENTE = {
  lista: 'productos',
  item: 'producto',
  acumulador: 'total',
  suma: 'producto.cantidad × producto.precio',
  condicion: 'total ≥ 50000',
  si: 'descuento ← total × 0,1',
  no: 'descuento ← 0',
  final: 'total ← total − descuento',
  salida: 'total',
}

/** Campos que deben estar llenos para poder armar el pseudocódigo. */
export const CAMPOS_OBLIGATORIOS = ['lista', 'acumulador', 'suma', 'condicion', 'si', 'no', 'salida']

/** Arma el pseudocódigo con las respuestas del equipo, con la misma forma del ejemplo de la ficha. */
export function armarPseudocodigo(proceso, r) {
  const lista = palabraSola(r.lista, 'datos')
  const item = palabraSola(r.item, 'elemento')
  const acum = palabraSola(r.acumulador, 'total')
  const linea = (t) => String(t ?? '').trim()
  const salida = [
    `PROCESO ${nombreDeProceso(proceso)}`,
    `ENTRADA: ${lista} (lista)`,
    `${acum} ← 0`,
    `PARA CADA ${item} EN ${lista}`,
    `  ${acum} ← ${acum} + ${linea(r.suma)}`,
    'FIN PARA',
    `SI ${linea(r.condicion)} ENTONCES`,
    `  ${linea(r.si)}`,
    'SI NO',
    `  ${linea(r.no)}`,
    'FIN SI',
  ]
  if (linea(r.final) !== '') salida.push(linea(r.final))
  salida.push(`SALIDA: ${palabraSola(r.salida, acum)}`)
  return salida.join('\n')
}

/** Qué falta por llenar (para decirlo con claridad). */
export const faltantes = (r) => CAMPOS_OBLIGATORIOS.filter((k) => String(r[k] ?? '').trim() === '')
