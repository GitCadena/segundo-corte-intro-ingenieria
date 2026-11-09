/**
 * Normalizador del pseudocódigo pegado.
 *
 * Mucho pseudocódigo llega copiado de una IA o de otras fuentes, con otro
 * formato: viñetas, numeración, bloques de código de markdown, palabras en
 * inglés (IF / THEN / WHILE), «Sino si», «Fin Si», «x = 5» en vez de «x ← 5»…
 * Este módulo lo lleva a la forma que entiende el intérprete SIN agregar ni
 * quitar líneas (cada línea de salida corresponde a la misma línea de entrada),
 * para que los números de línea de los mensajes sigan siendo los de lo que el
 * equipo ve escrito.
 *
 * Es lógica pura: se prueba en Node.
 */

const IDENT = '[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][A-Za-zÁÉÍÓÚÜÑáéíóúüñ_0-9]*'

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Aplica `fn` solo a lo que NO está entre comillas. */
function fueraDeTextos(linea, fn) {
  return linea
    .split(/("[^"]*"|“[^”]*”|'[^']*')/)
    .map((trozo, i) => (i % 2 === 1 ? trozo : fn(trozo)))
    .join('')
}

// Inglés → español. Cada vez que se traduce una de estas, queda anotado para avisar al equipo.
const INGLES = [
  [/\bEND\s*IF\b|\bENDIF\b/gi, 'FIN SI', 'END IF'],
  [/\bEND\s*WHILE\b|\bENDWHILE\b/gi, 'FIN MIENTRAS', 'END WHILE'],
  [/\bEND\s*FOR\b|\bENDFOR\b|\bNEXT\b/gi, 'FIN PARA', 'END FOR'],
  [/\bEND\s*(?:PROCESS|ALGORITHM|FUNCTION|PROCEDURE)\b/gi, 'FIN PROCESO', 'END PROCESS'],
  [/\bELSE\s*IF\b|\bELIF\b/gi, 'SINO SI', 'ELSE IF'],
  [/\bELSE\b/gi, 'SI NO', 'ELSE'],
  [/\bIF\b/gi, 'SI', 'IF'],
  [/\bTHEN\b/gi, 'ENTONCES', 'THEN'],
  [/\bWHILE\b/gi, 'MIENTRAS', 'WHILE'],
  [/\bFOR\s+EACH\b/gi, 'PARA CADA', 'FOR EACH'],
  [/\bFOR\b/gi, 'PARA', 'FOR'],
  [/\bIN\b/gi, 'EN', 'IN'],
  [/\bTO\b/gi, 'HASTA', 'TO'],
  [/\bSTEP\b/gi, 'CON PASO', 'STEP'],
  [/\bREPEAT\b/gi, 'REPETIR', 'REPEAT'],
  [/\bUNTIL\b/gi, 'HASTA QUE', 'UNTIL'],
  [/\bINPUT\b|\bREAD\b|\bGET\b/gi, 'LEER', 'INPUT / READ'],
  [/\bOUTPUT\b|\bPRINT\b|\bDISPLAY\b|\bWRITE\b|\bSHOW\b/gi, 'ESCRIBIR', 'OUTPUT / PRINT'],
  [/\bAND\b/gi, 'Y', 'AND'],
  [/\bOR\b/gi, 'O', 'OR'],
  [/\bNOT\b/gi, 'NO', 'NOT'],
  [/\bTRUE\b/gi, 'VERDADERO', 'TRUE'],
  [/\bFALSE\b/gi, 'FALSO', 'FALSE'],
  [/\bMOD\b/gi, '%', 'MOD'],
  [/\bBEGIN\b|\bSTART\b/gi, 'INICIO', 'BEGIN'],
]

const PALABRAS_INICIO = /^(SI|MIENTRAS|PARA|SALIDA|ENTRADAS?|LEER|ESCRIBIR|IMPRIMIR|MOSTRAR|HASTA|PROCESO|ALGORITMO|DEFINIR|REPETIR|SINO|FIN)\b/

const ENCABEZADOS_ENTRADA = /^(ENTRADAS?|DATOS DE ENTRADA|DATOS)\s*:?\s*$/
const ENCABEZADOS_DESCRIPTIVOS = /^(VARIABLES|CONSTANTES|DECLARACION DE VARIABLES|DATOS DE SALIDA|SALIDAS?|RESULTADO|PROCESO)\s*:\s*$/
const ENCABEZADOS_DE_TITULO = /^(PSEUDOCODIGO|SOLUCION|CODIGO|ALGORITMO EN PSEUDOCODIGO)\s*:?\s*$/

// «precio (número)», «precio: número», «precio como número»
const DECLARACION = new RegExp(`^(${IDENT})\\s*(?:\\(([^)]*)\\)|:\\s*(.+?)|\\s+como\\s+(.+?))\\s*$`, 'i')

function limpiarFormato(linea) {
  let s = linea.replace(/\*\*|__|`/g, '')
  // viñetas y numeración al inicio: «- x», «* x», «3. x», «3) x»
  s = s.replace(/^(\s*)(?:\d+\s*[.)]\s+|[-*•]\s+)/, (_, esp) => esp)
  // comentario al final y punto y coma
  s = fueraDeTextos(s, (t) => t.replace(/\/\/.*$/, ''))
  s = s.replace(/\s*;\s*$/, '')
  return s
}

function traducirIngles(linea, encontradas) {
  return fueraDeTextos(linea, (trozo) => {
    let t = trozo
    for (const [re, es, nombre] of INGLES) {
      if (re.test(t)) {
        re.lastIndex = 0
        encontradas.add(nombre)
        t = t.replace(re, es)
      }
      re.lastIndex = 0
    }
    return t
  })
}

function reescribirLinea(texto) {
  const original = texto
  const sangria = (texto.match(/^\s*/) ?? [''])[0]
  let t = texto.trim()
  if (t === '') return original
  const M = sinTildes(t).toUpperCase().replace(/\s+/g, ' ')

  if (ENCABEZADOS_DE_TITULO.test(M)) return ''
  if (/^(INICIO|COMIENZO)\s*:?$/.test(M)) return ''
  if (/^HACER$/.test(M)) return ''
  if (/^(DE LO CONTRARIO|EN CASO CONTRARIO|CASO CONTRARIO|SINO|SI NO|SI NO,)\s*:?\s*(ENTONCES)?$/.test(M)) return `${sangria}SI NO`
  let m = t.match(/^(?:SINO\s*SI|SI\s+NO\s*,?\s+SI|DE\s+LO\s+CONTRARIO\s*,?\s+SI|EN\s+CASO\s+CONTRARIO\s*,?\s+SI)\s+(.+?)\s*(?:ENTONCES)?\s*:?\s*$/i)
  if (m) return `${sangria}SINO SI ${m[1].replace(/\s+ENTONCES$/i, '')} ENTONCES`
  if (/^(FIN\s*_?\s*SI|FIN DEL SI)$/.test(M)) return `${sangria}FIN SI`
  if (/^(FIN\s*_?\s*MIENTRAS|FIN DEL MIENTRAS)$/.test(M)) return `${sangria}FIN MIENTRAS`
  if (/^(FIN\s*_?\s*PARA|FIN DEL PARA|SIGUIENTE)( \w+)?$/.test(M)) return `${sangria}FIN PARA`
  if (/^FIN\s*_?\s*(PROCESO|ALGORITMO)$/.test(M)) return `${sangria}FIN PROCESO`

  // «HASTA cond» / «HASTA QUE cond» al inicio de línea cierra un REPETIR
  m = t.match(/^HASTA(?:\s+QUE)?\s+(.+)$/i)
  if (m) return `${sangria}HASTA QUE ${m[1]}`

  // Dos puntos al final de SI / MIENTRAS / PARA / REPETIR / ENTONCES
  t = t.replace(/\s*:\s*$/, (x) => (/^(SI|MIENTRAS|PARA|REPETIR)\b/i.test(t) ? '' : x))
  t = t.replace(/\bENTONCES\s*:\s*$/i, 'ENTONCES')

  // PARA CADA x DE|DENTRO DE lista → EN
  t = t.replace(new RegExp(`^(PARA\\s+CADA\\s+${IDENT})\\s+(?:DENTRO\\s+DE|DE)\\s+`, 'i'), '$1 EN ')
  // PARA i DESDE a HASTA b / PARA i = a HASTA b → PARA i ← a HASTA b
  t = t.replace(new RegExp(`^(PARA\\s+${IDENT})\\s*(?:DESDE|=|:=)\\s*`, 'i'), (x, cabeza) => (/^PARA\s+CADA\b/i.test(x) ? x : `${cabeza} ← `))

  // x = expr (o lista[i] = expr) como asignación, si no es una línea con palabra clave
  m = t.match(new RegExp(`^(${IDENT}(?:\\s*\\[[^\\]]*\\])?)\\s*=\\s*([^=].*)$`))
  if (m && !PALABRAS_INICIO.test(sinTildes(m[1]).toUpperCase())) t = `${m[1]} ← ${m[2]}`

  return sangria + t
}

/**
 * Lleva el pseudocódigo a la forma canónica, línea por línea.
 * @returns {{ texto: string, ingles: string[], cambios: boolean }}
 */
export function normalizarLineas(texto) {
  const original = String(texto ?? '')
  const entrada = original.split(/\r?\n/)
  const encontradas = new Set()
  const salida = []

  for (const linea of entrada) {
    if (/^\s*```/.test(linea)) {
      salida.push('')
      continue
    }
    const limpia = limpiarFormato(linea)
    const traducida = traducirIngles(limpia, encontradas)
    salida.push(reescribirLinea(traducida))
  }

  // Secciones con encabezado: «ENTRADA:» seguido de «precio (número)» en líneas aparte.
  for (let i = 0; i < salida.length; i += 1) {
    const M = sinTildes(salida[i].trim()).toUpperCase().replace(/\s+/g, ' ')
    const esEntrada = ENCABEZADOS_ENTRADA.test(M)
    const esDescriptivo = ENCABEZADOS_DESCRIPTIVOS.test(M) && !/^PROCESO:?$/.test(M)
    if (!esEntrada && !esDescriptivo) continue
    const declaraciones = []
    let j = i + 1
    while (j < salida.length && salida[j].trim() !== '' && DECLARACION.test(salida[j].trim().replace(/^[-*•]\s+/, ''))) {
      const d = salida[j].trim().replace(/^[-*•]\s+/, '').match(DECLARACION)
      declaraciones.push({ nombre: d[1], tipo: (d[2] ?? d[3] ?? d[4] ?? '').trim() })
      j += 1
    }
    if (esEntrada && declaraciones.length > 0) {
      salida[i] = `ENTRADA: ${declaraciones.map((d) => (d.tipo ? `${d.nombre} (${d.tipo})` : d.nombre)).join(', ')}`
      for (let k = i + 1; k < j; k += 1) salida[k] = ''
    } else if (esEntrada || esDescriptivo) {
      salida[i] = ''
      for (let k = i + 1; k < j; k += 1) salida[k] = ''
    }
  }

  // Un «FIN» suelto como última línea con contenido cierra el algoritmo: no hace nada.
  for (let i = salida.length - 1; i >= 0; i -= 1) {
    if (salida[i].trim() === '') continue
    if (/^FIN$/i.test(salida[i].trim())) salida[i] = ''
    break
  }

  const resultado = salida.join('\n')
  return { texto: resultado, ingles: [...encontradas], cambios: resultado !== original }
}

/** Texto limpio y traducido, listo para pegar de vuelta en el editor. */
export const limpiarPseudocodigo = (texto) => normalizarLineas(texto).texto

/** Palabras en inglés que se tuvieron que traducir (para pedirle al equipo que escriba en español). */
export const detectarIngles = (texto) => normalizarLineas(texto).ingles
