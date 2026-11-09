/**
 * Validadores de la Ficha 3 · Calidad. Lógica pura, sin React ni red: se prueba
 * en Node (pruebas/tercer-corte.mjs).
 */
import { NUMERO_ATRIBUTOS, nombreAtributo } from '../data/iso.js'

const NUMEROS_EN_LETRAS =
  /\b(cero|un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|cuarenta|cincuenta|cien|ciento|mil|medio|media)\b/i

// Frases que describen algo que se puede comprobar con un sí o un no.
const VERBOS_DE_COMPROBACION =
  /\b(muestra|aparece|permite|rechaza|bloquea|avisa|impide|devuelve|coincide|existe|cumple|se cierra|se congela|se guarda|guarda|pide|redirige|abre|funciona en|no pierde|sin errores|siempre|nunca|ning[uú]n|ninguna|todos|todas)\b/i

// Palabras que suenan a calidad pero no se pueden medir por sí solas.
const PALABRAS_VAGAS =
  /\b(r[aá]pido|r[aá]pida|f[aá]cil|bonito|bonita|lindo|linda|bueno|buena|mejor|intuitivo|intuitiva|seguro|segura|agradable|c[oó]modo|c[oó]moda|moderno|moderna|eficiente|estable|robusto|robusta|claro|clara|sencillo|sencilla)\b/i

/**
 * ¿El criterio contiene un número o un sí/no verificable?
 * @returns {{ ok: boolean, pista: string | null }}
 */
export function validarCriterio(texto) {
  const t = String(texto ?? '').trim()
  if (t === '') return { ok: false, pista: null }
  const tieneNumero = /\d/.test(t) || NUMEROS_EN_LETRAS.test(t)
  if (tieneNumero) return { ok: true, pista: null }
  const vaga = t.match(PALABRAS_VAGAS)
  if (VERBOS_DE_COMPROBACION.test(t) && !vaga) return { ok: true, pista: null }
  if (vaga) {
    const p = vaga[0].toLowerCase()
    return {
      ok: false,
      pista: `«Que sea ${p}» no se puede probar. Cambia esa palabra por un número (por ejemplo «menos de 2 minutos» o «10 de 10 pedidos») o por algo que se conteste con sí o no.`,
    }
  }
  return {
    ok: false,
    pista: 'Escribe algo que otra persona pueda comprobar: un número (por ejemplo «menos de 2 minutos») o algo que se responda con sí o no (por ejemplo «muestra un aviso y no se cierra»).',
  }
}

/** Atributos elegidos que se repiten (por id). */
export function atributosRepetidos(ids) {
  const vistos = new Set()
  const repetidos = new Set()
  for (const id of ids) {
    if (!id) continue
    if (vistos.has(id)) repetidos.add(id)
    vistos.add(id)
  }
  return [...repetidos]
}

const lleno = (v) => String(v ?? '').trim() !== ''

/** Campos de cada atributo i (1 a 3). */
export const camposAtributo = (i) => ({
  atributo: `a${i}_atributo`,
  significa: `a${i}_significa`,
  criterio: `a${i}_criterio`,
  prueba: `a${i}_prueba`,
})

/**
 * Revisión de la ficha 3: lista de puntos «✓ / pendiente» y si se puede entregar.
 * @param {Record<string, string>} c contenido plano de la ficha
 */
export function revisarFicha3(c = {}) {
  const puntos = []
  const ids = []
  for (let i = 1; i <= NUMERO_ATRIBUTOS; i += 1) {
    const k = camposAtributo(i)
    ids.push(c[k.atributo])
    const completo = lleno(c[k.atributo]) && lleno(c[k.significa]) && lleno(c[k.criterio]) && lleno(c[k.prueba])
    const criterio = validarCriterio(c[k.criterio])
    puntos.push({
      id: `atributo-${i}`,
      texto: `Atributo ${i}${lleno(c[k.atributo]) ? ` (${nombreAtributo(c[k.atributo]).split(' (')[0]})` : ''}: significado, criterio y prueba escritos`,
      ok: completo,
    })
    puntos.push({
      id: `criterio-${i}`,
      texto: `Atributo ${i}: el criterio se puede medir o comprobar`,
      ok: lleno(c[k.criterio]) && criterio.ok,
      pista: lleno(c[k.criterio]) ? criterio.pista : null,
    })
  }
  const repetidos = atributosRepetidos(ids)
  puntos.push({
    id: 'distintos',
    texto: 'Los tres atributos son distintos',
    ok: repetidos.length === 0 && ids.every(lleno),
    pista: repetidos.length > 0 ? 'Repetiste un atributo de calidad. Elige tres diferentes.' : null,
  })
  puntos.push({
    id: 'importante',
    texto: 'Dijeron cuál es el más importante y por qué',
    ok: lleno(c.mas_importante) && lleno(c.por_que),
  })
  // Para entregar basta con los tres atributos completos y lo del más importante.
  const puedeEntregar =
    [1, 2, 3].every((i) => {
      const k = camposAtributo(i)
      return lleno(c[k.atributo]) && lleno(c[k.significa]) && lleno(c[k.criterio]) && lleno(c[k.prueba])
    }) &&
    repetidos.length === 0 &&
    lleno(c.mas_importante) &&
    lleno(c.por_que)
  return { puntos, puedeEntregar, repetidos }
}
