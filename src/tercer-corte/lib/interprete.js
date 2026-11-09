/**
 * Intérprete SEGURO del pseudocódigo en español de la Ficha 4.
 *
 * No usa eval ni Function: el texto se convierte en un árbol (tokenizador +
 * analizador descendente) y se ejecuta paso a paso. Solo conoce lo que está en
 * esta gramática:
 *
 *   PROCESO nombre                     (y, si quieren, FIN PROCESO al final)
 *   ENTRADA: nombre (tipo), nombre (tipo), ...   (también LEER nombre)
 *   SALIDA: expresión                  (también ESCRIBIR / IMPRIMIR / MOSTRAR; varios valores separados por coma)
 *   x ← expresión                      (también  x <- expresión)
 *   SI condición ENTONCES
 *     ...
 *   SI NO                              (opcional)
 *     ...
 *   FIN SI
 *   MIENTRAS condición
 *     ...
 *   FIN MIENTRAS
 *   PARA CADA item EN lista
 *     ...
 *   FIN PARA
 *
 * Expresiones: números (con coma o punto decimal), textos entre comillas,
 * variables, campos de registro (item.precio), + − × ÷ (también * y /), %,
 * comparaciones (= ≠ > < ≥ ≤ y sus equivalentes ASCII: <> != >= <= ==),
 * Y, O, NO, VERDADERO, FALSO y paréntesis.
 *
 * Todos los mensajes de error están en lenguaje simple y traen una pista.
 */

import { normalizarLineas } from './normalizar.js'

export const MAX_PASOS = 1000

const LETRA = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ_'
const RE_IDENT = new RegExp(`^[${LETRA}][${LETRA}0-9]*`)
const RE_ASIGNACION = new RegExp(`^([${LETRA}][${LETRA}0-9]*)\\s*(?:←|<-|:=)\\s*(.*)$`)

// Números: «15.000» son quince mil (miles con punto, como se escribe en Colombia);
// «0,1», «2,5» y «2.5» son decimales. Los miles solo se reconocen si el primer grupo no empieza en 0.
const NUMERO = /^(?:[1-9]\d{0,2}(?:\.\d{3})+(?:,\d+)?(?![\d.])|\d+(?:[.,]\d+)?)/
const NUMERO_COMPLETO = new RegExp(`${NUMERO.source}$`)

function numeroDeTexto(t) {
  const s = String(t).trim()
  if (/^[1-9]\d{0,2}(?:\.\d{3})+(?:,\d+)?$/.test(s)) return Number(s.replace(/\./g, '').replace(',', '.'))
  return Number(s.replace(',', '.'))
}

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '')
const mayus = (t) => sinTildes(t).toUpperCase()

class ErrorPseudo extends Error {
  constructor(mensaje, pista, linea) {
    super(mensaje)
    this.pista = pista ?? null
    this.linea = linea ?? null
  }
}

/* -------------------------------- tokenizador -------------------------------- */

const OPERADORES = ['>=', '<=', '<>', '!=', '==', '≥', '≤', '≠', '>', '<', '=', '+', '-', '−', '×', '*', '÷', '/', '%', '(', ')', '[', ']', ',']

function tokenizar(texto, linea) {
  const tokens = []
  let i = 0
  while (i < texto.length) {
    const c = texto[i]
    if (/\s/.test(c)) {
      i += 1
      continue
    }
    const resto = texto.slice(i)
    let m = resto.match(NUMERO)
    if (m) {
      tokens.push({ t: 'num', v: numeroDeTexto(m[0]) })
      i += m[0].length
      continue
    }
    if (c === '"' || c === '“' || c === "'") {
      const cierre = c === '“' ? '”' : c
      const fin = texto.indexOf(cierre, i + 1)
      if (fin === -1) {
        throw new ErrorPseudo('Falta cerrar unas comillas.', 'Cada texto va entre comillas, por ejemplo «pan».', linea)
      }
      tokens.push({ t: 'txt', v: texto.slice(i + 1, fin) })
      i = fin + 1
      continue
    }
    m = resto.match(RE_IDENT)
    if (m) {
      let nombre = m[0]
      i += nombre.length
      const partes = [nombre]
      // Campos de registro: item.precio
      while (texto[i] === '.' && RE_IDENT.test(texto.slice(i + 1))) {
        const campo = texto.slice(i + 1).match(RE_IDENT)[0]
        partes.push(campo)
        i += 1 + campo.length
      }
      const clave = mayus(partes[0])
      // Y, O y NO se reconocen por su posición (ver el analizador): así «y» y «o» también sirven como nombres de variable.
      if (partes.length === 1 && (clave === 'VERDADERO' || clave === 'FALSO')) {
        tokens.push({ t: 'bool', v: clave === 'VERDADERO' })
      } else {
        tokens.push({ t: 'id', partes })
      }
      continue
    }
    // Campo después de una posición de lista: productos[1].precio
    const campo = resto.match(new RegExp(`^\\.(${LETRA.length ? `[${LETRA}][${LETRA}0-9]*` : ''})`))
    if (campo && tokens.length > 0 && tokens[tokens.length - 1].t === 'op' && tokens[tokens.length - 1].v === ']') {
      tokens.push({ t: 'campo', v: campo[1] })
      i += campo[0].length
      continue
    }
    const op = OPERADORES.find((o) => resto.startsWith(o))
    if (op) {
      tokens.push({ t: 'op', v: op })
      i += op.length
      continue
    }
    throw new ErrorPseudo(
      `No entiendo el símbolo «${c}».`,
      'Usa números, nombres de variables y los signos + − × ÷ ( ) = ≠ > < ≥ ≤. Si es código de un lenguaje de programación, escríbelo con palabras en español.',
      linea,
    )
  }
  return tokens
}

/* ------------------------------- analizador de expresiones ------------------------------- */

const NORMAL_OP = { '−': '-', '×': '*', '÷': '/', '≥': '>=', '≤': '<=', '≠': '!=', '<>': '!=', '==': '=' }
const norm = (o) => NORMAL_OP[o] ?? o

function analizarExpresion(texto, linea) {
  const tokens = tokenizar(texto, linea)
  if (tokens.length === 0) throw new ErrorPseudo('Falta escribir la expresión.', 'Escribe un valor, una variable o una cuenta.', linea)
  let p = 0
  const sig = () => tokens[p]
  const esOp = (...ops) => sig()?.t === 'op' && ops.includes(sig().v)
  const esPalabra = (w) => sig()?.t === 'id' && sig().partes.length === 1 && mayus(sig().partes[0]) === w
  // «NO» niega solo si lo que sigue empieza un valor; si sigue un signo (no = 5), es un nombre de variable.
  const niega = () => {
    if (!esPalabra('NO')) return false
    const t = tokens[p + 1]
    if (!t) return false
    if (t.t === 'op') return t.v === '(' || t.v === '-' || t.v === '−'
    return true
  }

  function disyuncion() {
    let izq = conjuncion()
    while (esPalabra('O')) {
      p += 1
      izq = { t: 'bin', op: 'O', izq, der: conjuncion() }
    }
    return izq
  }
  function conjuncion() {
    let izq = negacion()
    while (esPalabra('Y')) {
      p += 1
      izq = { t: 'bin', op: 'Y', izq, der: negacion() }
    }
    return izq
  }
  function negacion() {
    if (niega()) {
      p += 1
      return { t: 'no', e: negacion() }
    }
    return comparacion()
  }
  function comparacion() {
    const izq = suma()
    if (esOp('=', '==', '!=', '<>', '≠', '>', '<', '>=', '<=', '≥', '≤')) {
      const op = norm(sig().v)
      p += 1
      return { t: 'bin', op, izq, der: suma() }
    }
    return izq
  }
  function suma() {
    let izq = producto()
    while (esOp('+', '-', '−')) {
      const op = norm(sig().v)
      p += 1
      izq = { t: 'bin', op, izq, der: producto() }
    }
    return izq
  }
  function producto() {
    let izq = unario()
    while (esOp('*', '×', '/', '÷', '%')) {
      const op = norm(sig().v)
      p += 1
      izq = { t: 'bin', op, izq, der: unario() }
    }
    return izq
  }
  function unario() {
    if (esOp('-', '−')) {
      p += 1
      return { t: 'neg', e: unario() }
    }
    return primario()
  }
  function primario() {
    const tk = sig()
    if (!tk) {
      throw new ErrorPseudo('La expresión está incompleta.', 'Parece que falta un valor después del último signo.', linea)
    }
    if (tk.t === 'num') {
      p += 1
      return { t: 'num', v: tk.v }
    }
    if (tk.t === 'txt') {
      p += 1
      return { t: 'txt', v: tk.v }
    }
    if (tk.t === 'bool') {
      p += 1
      return { t: 'bool', v: tk.v }
    }
    if (tk.t === 'id') {
      p += 1
      const siguiente = sig()
      // Función: LONGITUD(lista), REDONDEAR(x), MAX(a, b)…
      if (siguiente?.t === 'op' && siguiente.v === '(' && tk.partes.length === 1) {
        const nombre = mayus(tk.partes[0])
        if (!FUNCIONES[nombre]) {
          throw new ErrorPseudo(
            `No conozco la función «${tk.partes[0]}».`,
            `Las que sí conozco son: ${FUNCIONES_VISIBLES}. Si «${tk.partes[0]}» es una variable, quita los paréntesis.`,
            linea,
          )
        }
        p += 1
        const args = []
        if (!esOp(')')) {
          args.push(disyuncion())
          while (esOp(',')) {
            p += 1
            args.push(disyuncion())
          }
        }
        if (!esOp(')')) throw new ErrorPseudo('Falta cerrar un paréntesis.', 'Cada «(» necesita su «)».', linea)
        p += 1
        return { t: 'fn', nombre, args }
      }
      // Posición de una lista: precios[2], productos[i + 1].precio
      if (siguiente?.t === 'op' && siguiente.v === '[' && tk.partes.length === 1) {
        p += 1
        const indice = disyuncion()
        if (!esOp(']')) throw new ErrorPseudo('Falta cerrar un corchete.', 'Cada «[» necesita su «]».', linea)
        p += 1
        let nodo = { t: 'idx', base: { t: 'var', partes: tk.partes }, indice }
        while (sig()?.t === 'campo') {
          nodo = { t: 'campoDe', e: nodo, campo: sig().v }
          p += 1
        }
        return nodo
      }
      return { t: 'var', partes: tk.partes }
    }
    if (tk.t === 'op' && tk.v === '(') {
      p += 1
      const e = disyuncion()
      if (!esOp(')')) throw new ErrorPseudo('Falta cerrar un paréntesis.', 'Cada «(» necesita su «)».', linea)
      p += 1
      return e
    }
    throw new ErrorPseudo(
      `No esperaba «${tk.v ?? '?'}» en ese lugar.`,
      'Revisa que entre dos valores haya un signo (+ − × ÷) y que no sobren signos.',
      linea,
    )
  }

  const e = disyuncion()
  if (p < tokens.length) {
    const tk = tokens[p]
    throw new ErrorPseudo(
      `Sobra algo al final: «${tk.v ?? tk.partes?.join('.') ?? '?'}».`,
      'Revisa si falta un signo (+ − × ÷) entre dos valores.',
      linea,
    )
  }
  return e
}

// Separa «"Total: ", total» en sus partes. Una coma entre dos dígitos es decimal (0,5), no separador.
function separarArgumentos(texto) {
  const partes = []
  let actual = ''
  let comilla = null
  let profundidad = 0
  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i]
    if (comilla) {
      actual += c
      if (c === comilla) comilla = null
    } else if (c === '"' || c === "'" || c === '“') {
      comilla = c === '“' ? '”' : c
      actual += c
    } else if (c === '(') {
      profundidad += 1
      actual += c
    } else if (c === ')') {
      profundidad -= 1
      actual += c
    } else if (c === ',' && profundidad === 0 && !(/\d/.test(texto[i - 1] ?? '') && /\d/.test(texto[i + 1] ?? ''))) {
      partes.push(actual)
      actual = ''
    } else actual += c
  }
  partes.push(actual)
  return partes.map((p) => p.trim()).filter((p) => p !== '')
}

const FUNCIONES = {
  LONGITUD: (a) => longitudDe(a),
  LARGO: (a) => longitudDe(a),
  TAMANO: (a) => longitudDe(a),
  LEN: (a) => longitudDe(a),
  REDONDEAR: (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d,
  ROUND: (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d,
  TRUNC: (x) => Math.trunc(x),
  TRUNCAR: (x) => Math.trunc(x),
  ENTERO: (x) => Math.trunc(x),
  ABS: (x) => Math.abs(x),
  RAIZ: (x) => Math.sqrt(x),
  SQRT: (x) => Math.sqrt(x),
  POTENCIA: (x, y) => x ** y,
  POW: (x, y) => x ** y,
  MAX: (...v) => Math.max(...v.flat()),
  MAXIMO: (...v) => Math.max(...v.flat()),
  MIN: (...v) => Math.min(...v.flat()),
  MINIMO: (...v) => Math.min(...v.flat()),
  SUMA: (...v) => v.flat().reduce((s, x) => s + x, 0),
  SUM: (...v) => v.flat().reduce((s, x) => s + x, 0),
  PROMEDIO: (...v) => v.flat().reduce((s, x) => s + x, 0) / v.flat().length,
  MEDIA: (...v) => v.flat().reduce((s, x) => s + x, 0) / v.flat().length,
}
const FUNCIONES_VISIBLES = 'LONGITUD, REDONDEAR, TRUNCAR, ABS, RAIZ, POTENCIA, MAX, MIN, SUMA, PROMEDIO'
function longitudDe(a) {
  if (Array.isArray(a) || typeof a === 'string') return a.length
  return NaN
}

function variablesDe(expr, acumulado = new Set()) {
  if (!expr) return acumulado
  if (expr.t === 'var') acumulado.add(expr.partes[0])
  else if (expr.t === 'idx') {
    variablesDe(expr.base, acumulado)
    variablesDe(expr.indice, acumulado)
  } else if (expr.t === 'fn') expr.args.forEach((a) => variablesDe(a, acumulado))
  else if (expr.t === 'campoDe') variablesDe(expr.e, acumulado)
  else if (expr.t === 'bin') {
    variablesDe(expr.izq, acumulado)
    variablesDe(expr.der, acumulado)
  } else if (expr.t === 'no' || expr.t === 'neg') variablesDe(expr.e, acumulado)
  return acumulado
}

/* ------------------------------- analizador de líneas ------------------------------- */

export function lineasDe(texto) {
  return String(texto ?? '')
    .split(/\r?\n/)
    .map((crudo, i) => ({ n: i + 1, crudo, texto: crudo.trim() }))
}

const esVacia = (l) => l.texto === '' || l.texto.startsWith('//') || l.texto.startsWith('#')

const COMO_ESCRIBIR = {
  si: 'SI condición ENTONCES … SI NO … FIN SI',
  mientras: 'MIENTRAS condición … FIN MIENTRAS',
  para: 'PARA CADA item EN lista … FIN PARA   (o   PARA i ← 1 HASTA n … FIN PARA)',
}

/**
 * Convierte el pseudocódigo en un programa. No lanza: devuelve errores y avisos.
 * @returns {{ ok: boolean, programa: object|null, errores: {linea:number, mensaje:string, pista:string|null}[], resumen: object }}
 */
export function analizar(texto) {
  // El pseudocódigo pegado de otras fuentes se lleva primero a la forma canónica, línea por línea.
  const lineas = lineasDe(normalizarLineas(texto).texto)
  const errores = []
  const resumen = { proceso: null, entradas: [], tieneSi: false, tieneSiNo: false, tieneRepetir: false, tieneSalida: false, lineasUtiles: 0 }
  let idx = 0

  const agregar = (e) => errores.push({ linea: e.linea, mensaje: e.message, pista: e.pista })

  function saltarVacias() {
    while (idx < lineas.length && esVacia(lineas[idx])) idx += 1
  }

  // Devuelve { cuerpo, fin } donde fin es el terminador encontrado ('FIN SI', 'SI NO', ... o null).
  function bloque(terminadores, abre) {
    const cuerpo = []
    for (;;) {
      saltarVacias()
      if (idx >= lineas.length) return { cuerpo, fin: null }
      const l = lineas[idx]
      const M = mayus(l.texto).replace(/\s+/g, ' ')
      const F = M.replace(/^FIN ?(SI|MIENTRAS|PARA)$/, 'FIN $1')
      const sinoSi = l.texto.match(/^SINO\s*SI\s+(.+?)(?:\s+ENTONCES)?\s*$/i)
      if (terminadores.includes('SINOSI') && sinoSi) {
        idx += 1
        return { cuerpo, fin: 'SINOSI', condSinoSi: sinoSi[1], lineaFin: l.n, textoFin: l.texto }
      }
      const hastaQue = l.texto.match(/^HASTA\s+QUE\s+(.+)$/i)
      if (terminadores.includes('HASTA QUE') && hastaQue) {
        idx += 1
        return { cuerpo, fin: 'HASTA QUE', condHasta: hastaQue[1], lineaFin: l.n, textoFin: l.texto }
      }
      if (terminadores.includes(F) || (terminadores.includes('SI NO') && /^SI ?NO:?$/.test(M))) {
        idx += 1
        return { cuerpo, fin: /^SI ?NO/.test(M) ? 'SI NO' : F, lineaFin: l.n }
      }
      if (/^FIN ?(SI|MIENTRAS|PARA)$/.test(M) || /^SI ?NO:?$/.test(M)) {
        // Un cierre que no corresponde al bloque abierto.
        const esperado = abre ? `«${terminadores.filter((t) => t !== 'SI NO').join('» o «')}»` : 'ningún cierre'
        agregar(
          new ErrorPseudo(
            `El «${l.texto}» de la línea ${l.n} no corresponde: ${abre ? `se esperaba ${esperado}` : 'no hay ningún bloque abierto'}.`,
            'Cada SI, MIENTRAS y PARA CADA se cierra con su propio FIN, en el orden contrario al que se abrieron.',
            l.n,
          ),
        )
        idx += 1
        continue
      }
      const s = sentencia()
      if (s) cuerpo.push(s)
    }
  }

  function sentencia() {
    const l = lineas[idx]
    const M = mayus(l.texto).replace(/\s+/g, ' ')
    try {
      // Asignación a una posición de lista: precios[2] ← 10
      const asigIdx = l.texto.match(new RegExp(`^([${LETRA}][${LETRA}0-9]*)\\s*\\[(.+?)\\]\\s*(?:←|<-|:=)\\s*(.*)$`))
      if (asigIdx) {
        idx += 1
        resumen.lineasUtiles += 1
        if (asigIdx[3].trim() === '') {
          throw new ErrorPseudo(`A «${asigIdx[1]}[${asigIdx[2]}]» le falta el valor (línea ${l.n}).`, 'Escribe algo después de la flecha.', l.n)
        }
        return { t: 'asigIdx', linea: l.n, destino: asigIdx[1], indice: analizarExpresion(asigIdx[2], l.n), expr: analizarExpresion(asigIdx[3], l.n), texto: l.texto }
      }
      // Asignación (se mira primero para que «total ← ...» no se confunda con otra cosa).
      const asig = l.texto.match(RE_ASIGNACION)
      if (asig) {
        idx += 1
        resumen.lineasUtiles += 1
        if (asig[2].trim() === '') {
          throw new ErrorPseudo(`A la variable «${asig[1]}» le falta el valor (línea ${l.n}).`, 'Escribe algo después de la flecha, por ejemplo «total ← 0».', l.n)
        }
        return { t: 'asig', linea: l.n, destino: asig[1], expr: analizarExpresion(asig[2], l.n), texto: l.texto }
      }
      let m
      // «FIN PROCESO» (o FIN ALGORITMO) cierra el proceso: es opcional y no hace nada.
      if (/^FIN ?(PROCESO|ALGORITMO)$/.test(M)) {
        idx += 1
        return null
      }
      // «DEFINIR x COMO tipo» (como en PSeInt): se acepta y se ignora.
      if (/^DEFINIR\b/.test(M)) {
        idx += 1
        return null
      }
      if ((m = M.match(/^(?:PROCESO|ALGORITMO)\b\s*:?\s*(.*)$/))) {
        idx += 1
        resumen.proceso = l.texto.replace(/^[^\s:]+\s*:?\s*/, '').trim()
        resumen.lineasUtiles += 1
        return { t: 'proceso', linea: l.n, nombre: resumen.proceso, texto: l.texto }
      }
      if ((m = l.texto.match(/^(ENTRADAS?|LEER)\b\s*:?\s*(.*)$/i))) {
        idx += 1
        resumen.lineasUtiles += 1
        const declaradas = declararEntradas(m[2], l.n)
        if (declaradas.length === 0) {
          throw new ErrorPseudo(`A la línea ${l.n} le falta el nombre de lo que entra.`, 'Escribe, por ejemplo, «ENTRADA: precio (número)».', l.n)
        }
        resumen.entradas.push(...declaradas)
        return { t: 'entrada', linea: l.n, entradas: declaradas, texto: l.texto, leer: /^LEER/i.test(l.texto) }
      }
      if ((m = l.texto.match(/^(SALIDA|ESCRIBIR|IMPRIMIR|MOSTRAR)\b\s*:?\s*(.*)$/i))) {
        idx += 1
        resumen.lineasUtiles += 1
        resumen.tieneSalida = true
        if (m[2].trim() === '') throw new ErrorPseudo(`A la ${m[1].toUpperCase()} le falta lo que se entrega (línea ${l.n}).`, 'Escribe, por ejemplo, «SALIDA: total».', l.n)
        const exprs = separarArgumentos(m[2]).map((t) => analizarExpresion(t, l.n))
        return { t: 'salida', linea: l.n, exprs, texto: l.texto }
      }
      if ((m = l.texto.match(/^SI\s+(.+?)(?:\s+ENTONCES)?\s*$/i))) {
        idx += 1
        resumen.lineasUtiles += 1
        resumen.tieneSi = true
        return armarSi(m[1], l.n, l.texto)
      }
      if (/^SI\b/.test(M)) {
        idx += 1
        throw new ErrorPseudo(
          `La línea ${l.n} empieza con SI pero no termina con ENTONCES.`,
          `Se escribe así: ${COMO_ESCRIBIR.si}.`,
          l.n,
        )
      }
      if ((m = l.texto.match(/^MIENTRAS\s+(.+?)(?:\s+HACER)?\s*$/i))) {
        idx += 1
        resumen.lineasUtiles += 1
        resumen.tieneRepetir = true
        const cond = analizarExpresion(m[1], l.n)
        const a = bloque(['FIN MIENTRAS'], true)
        if (a.fin !== 'FIN MIENTRAS') abierto('MIENTRAS', l.n, 'FIN MIENTRAS')
        return { t: 'mientras', linea: l.n, cond, cuerpo: a.cuerpo, lineaFin: a.lineaFin, texto: l.texto }
      }
      if (/^REPETIR\s*$/i.test(l.texto)) {
        idx += 1
        resumen.lineasUtiles += 1
        resumen.tieneRepetir = true
        const a = bloque(['HASTA QUE'], true)
        if (a.fin !== 'HASTA QUE') {
          abierto('REPETIR', l.n, 'HASTA QUE condición')
          return { t: 'repetir', linea: l.n, cond: { t: 'bool', v: true }, cuerpo: a.cuerpo, lineaFin: l.n, textoFin: 'HASTA QUE', texto: l.texto }
        }
        return { t: 'repetir', linea: l.n, cond: analizarExpresion(a.condHasta, a.lineaFin), cuerpo: a.cuerpo, lineaFin: a.lineaFin, textoFin: a.textoFin, texto: l.texto }
      }
      if ((m = l.texto.match(new RegExp(`^PARA\\s+([${LETRA}][${LETRA}0-9]*)\\s*(?:←|<-|:=)\\s*(.+?)\\s+HASTA\\s+(.+?)(?:\\s+CON\\s+PASO\\s+(.+?)|\\s+PASO\\s+(.+?))?(?:\\s+HACER)?\\s*$`, 'i'))) && !/^CADA$/i.test(m[1])) {
        idx += 1
        resumen.lineasUtiles += 1
        resumen.tieneRepetir = true
        const desde = analizarExpresion(m[2], l.n)
        const hasta = analizarExpresion(m[3], l.n)
        const pasoTxt = m[4] ?? m[5]
        const paso = pasoTxt ? analizarExpresion(pasoTxt, l.n) : null
        const a = bloque(['FIN PARA'], true)
        if (a.fin !== 'FIN PARA') abierto('PARA', l.n, 'FIN PARA')
        return { t: 'paraNum', linea: l.n, variable: m[1], desde, hasta, paso, cuerpo: a.cuerpo, lineaFin: a.lineaFin, texto: l.texto }
      }
      if ((m = l.texto.match(new RegExp(`^PARA\\s+CADA\\s+([${LETRA}][${LETRA}0-9]*)\\s+EN\\s+(.+?)(?:\\s+HACER)?\\s*$`, 'i')))) {
        idx += 1
        resumen.lineasUtiles += 1
        resumen.tieneRepetir = true
        const lista = analizarExpresion(m[2], l.n)
        const a = bloque(['FIN PARA'], true)
        if (a.fin !== 'FIN PARA') abierto('PARA CADA', l.n, 'FIN PARA')
        return { t: 'para', linea: l.n, item: m[1], lista, cuerpo: a.cuerpo, lineaFin: a.lineaFin, texto: l.texto }
      }
      if (/^(MIENTRAS|PARA|REPETIR)\b/.test(M)) {
        idx += 1
        const clave = /^MIENTRAS/.test(M) ? 'mientras' : 'para'
        throw new ErrorPseudo(`No entiendo cómo escribiste la línea ${l.n}.`, `Se escribe así: ${COMO_ESCRIBIR[clave]}.`, l.n)
      }
      idx += 1
      throw new ErrorPseudo(
        `No entiendo la línea ${l.n}: «${l.texto}».`,
        'Cada línea es una asignación (total ← 0), una SALIDA, o un bloque SI / MIENTRAS / PARA / REPETIR. Para guardar un valor usa la flecha ← (o <-).',
        l.n,
      )
    } catch (e) {
      if (e instanceof ErrorPseudo) {
        agregar(e)
        return null
      }
      throw e
    }
  }

  // SI … [SINO SI …]* [SI NO …] FIN SI. El «SINO SI» se guarda como un SI anidado dentro del SI NO.
  function armarSi(condTexto, linea, texto) {
    const cond = analizarExpresion(condTexto, linea)
    const a = bloque(['FIN SI', 'SI NO', 'SINOSI'], true)
    let sino = null
    let lineaSino = null
    let lineaFin = a.lineaFin
    if (a.fin === 'SI NO') {
      resumen.tieneSiNo = true
      lineaSino = a.lineaFin
      const b = bloque(['FIN SI'], true)
      sino = b.cuerpo
      lineaFin = b.lineaFin
      if (b.fin !== 'FIN SI') abierto('SI', linea, 'FIN SI')
    } else if (a.fin === 'SINOSI') {
      resumen.tieneSiNo = true
      lineaSino = a.lineaFin
      let anidado = null
      try {
        anidado = armarSi(a.condSinoSi, a.lineaFin, a.textoFin)
      } catch (e) {
        if (!(e instanceof ErrorPseudo)) throw e
        agregar(e)
      }
      sino = anidado ? [anidado] : []
      lineaFin = anidado?.lineaFin ?? a.lineaFin
    } else if (a.fin !== 'FIN SI') abierto('SI', linea, 'FIN SI')
    return { t: 'si', linea, cond, entonces: a.cuerpo, sino, lineaSino, lineaFin, texto }
  }

  function abierto(que, linea, cierre) {
    agregar(new ErrorPseudo(`El ${que} de la línea ${linea} no está cerrado.`, `Al final del bloque falta una línea que diga «${cierre}».`, linea))
  }

  function declararEntradas(texto, linea) {
    const lista = []
    const trozos = texto.split(/,(?![^(]*\))/).map((t) => t.trim()).filter(Boolean)
    for (const trozo of trozos) {
      const m = trozo.match(new RegExp(`^([${LETRA}][${LETRA}0-9]*)\\s*(?:\\(([^)]*)\\)|:\\s*(.+))?$`))
      if (!m) {
        throw new ErrorPseudo(`No entiendo la entrada «${trozo}» (línea ${linea}).`, 'Se escribe: ENTRADA: nombre (tipo), otro (tipo). Por ejemplo: ENTRADA: productos (lista).', linea)
      }
      lista.push({ nombre: m[1], tipo: (m[2] ?? m[3] ?? '').trim() })
    }
    return lista
  }

  const cuerpo = []
  for (;;) {
    saltarVacias()
    if (idx >= lineas.length) break
    const l = lineas[idx]
    const M = mayus(l.texto).replace(/\s+/g, ' ')
    if (/^FIN ?(SI|MIENTRAS|PARA)$/.test(M) || /^SI ?NO:?$/.test(M)) {
      agregar(new ErrorPseudo(`El «${l.texto}» de la línea ${l.n} sobra: no hay ningún bloque abierto.`, 'Revisa que cada FIN tenga un SI, MIENTRAS o PARA CADA que lo abra.', l.n))
      idx += 1
      continue
    }
    const s = sentencia()
    if (s) cuerpo.push(s)
  }

  if (lineas.every(esVacia)) {
    return { ok: false, programa: null, errores: [{ linea: 1, mensaje: 'Todavía no escribieron el pseudocódigo.', pista: 'Empiecen con «PROCESO nombre» y la línea ENTRADA.' }], resumen }
  }

  // Las entradas pueden venir de varias líneas ENTRADA.
  const programa = { nombre: resumen.proceso, entradas: resumen.entradas, cuerpo }
  errores.sort((a, b) => (a.linea ?? 0) - (b.linea ?? 0))
  return { ok: errores.length === 0, programa, errores, resumen }
}

/* ---------------------------- revisión estática ---------------------------- */

/** Variables que se leen pero nunca reciben valor (ni son entrada ni variable de PARA CADA). */
export function variablesSinAsignar(programa) {
  const asignadas = new Set(programa.entradas.map((e) => e.nombre))
  const leidas = []
  function recorrer(cuerpo, activas) {
    for (const s of cuerpo) {
      const usar = (expr) => variablesDe(expr).forEach((v) => !activas.has(v) && leidas.push({ nombre: v, linea: s.linea }))
      if (s.t === 'asig') {
        usar(s.expr)
        activas.add(s.destino)
      } else if (s.t === 'asigIdx') {
        usar(s.expr)
        usar(s.indice)
        if (!activas.has(s.destino)) leidas.push({ nombre: s.destino, linea: s.linea })
      } else if (s.t === 'paraNum') {
        usar(s.desde)
        usar(s.hasta)
        if (s.paso) usar(s.paso)
        const dentro = new Set(activas)
        dentro.add(s.variable)
        recorrer(s.cuerpo, dentro)
      } else if (s.t === 'repetir') {
        // El cuerpo se ejecuta al menos una vez: lo que se asigna adentro vale para la condición.
        const dentro = new Set(activas)
        recorrer(s.cuerpo, dentro)
        variablesDe(s.cond).forEach((v) => !dentro.has(v) && leidas.push({ nombre: v, linea: s.lineaFin }))
        for (const v of dentro) activas.add(v)
      } else if (s.t === 'salida') s.exprs.forEach(usar)
      else if (s.t === 'si') {
        usar(s.cond)
        const a1 = new Set(activas)
        recorrer(s.entonces, a1)
        const a2 = new Set(activas)
        if (s.sino) recorrer(s.sino, a2)
        // Queda asignada solo si se asigna en las dos ramas.
        for (const v of a1) if (s.sino && a2.has(v)) activas.add(v)
      } else if (s.t === 'mientras') {
        usar(s.cond)
        recorrer(s.cuerpo, new Set(activas))
      } else if (s.t === 'para') {
        usar(s.lista)
        const dentro = new Set(activas)
        dentro.add(s.item)
        recorrer(s.cuerpo, dentro)
      }
    }
  }
  recorrer(programa.cuerpo, new Set(asignadas))
  const vistos = new Set()
  return leidas.filter((x) => (vistos.has(x.nombre) ? false : vistos.add(x.nombre)))
}

const PATRONES_DE_CODIGO = [
  [/\bprint\s*\(/i, 'print('],
  [/\bconsole\.log\b/i, 'console.log'],
  [/\bfor\s+\w+\s+in\b/i, 'for … in'],
  [/\brange\s*\(/i, 'range('],
  [/\bfor\s*\(/i, 'for ('],
  [/\bif\s*\(/i, 'if ('],
  [/\bwhile\s*\(/i, 'while ('],
  [/\bdef\s+\w+\s*\(/i, 'def …('],
  [/\bfunction\b/i, 'function'],
  [/\breturn\b/i, 'return'],
  [/\belif\b/i, 'elif'],
  [/\bvar\s+\w+\s*=|\blet\s+\w+\s*=|\bconst\s+\w+\s*=/i, 'var / let / const'],
  [/[{}]/, '{ }'],
  [/;\s*$/m, 'un «;» al final de la línea'],
  [/\+\+|--/, '++ o --'],
]

/** Rastros de código de un lenguaje de programación. Devuelve una lista de lo que encontró. */
export function detectarCodigo(texto) {
  const t = String(texto ?? '')
  return PATRONES_DE_CODIGO.filter(([re]) => re.test(t)).map(([, nombre]) => nombre)
}

/* ------------------------------ ejecución ------------------------------ */

const redondear = (n) => (Number.isInteger(n) ? n : Math.round(n * 1e6) / 1e6)

const textoPlano = (v) => (typeof v === 'string' ? v : typeof v === 'boolean' ? (v ? 'verdadero' : 'falso') : typeof v === 'number' ? String(redondear(v)).replace('.', ',') : mostrarValor(v))

export function mostrarValor(v) {
  if (Array.isArray(v)) {
    if (v.length > 0 && v.length <= 12 && v.every((x) => x === null || typeof x !== 'object')) return `[${v.map(mostrarValor).join(', ')}]`
    return `lista de ${v.length} ${v.length === 1 ? 'registro' : 'registros'}`
  }
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${k}=${mostrarValor(x)}`).join(', ')} }`
  if (typeof v === 'boolean') return v ? 'verdadero' : 'falso'
  if (typeof v === 'number') return String(redondear(v)).replace('.', ',')
  if (typeof v === 'string') return `"${v}"`
  return '—'
}

function buscarCampo(obj, campo, linea) {
  const k = Object.keys(obj).find((x) => mayus(x) === mayus(campo))
  if (k === undefined) {
    throw new ErrorPseudo(
      `El registro no tiene el campo «${campo}» (línea ${linea}).`,
      `Los campos que tiene son: ${Object.keys(obj).join(', ') || 'ninguno'}. Revisa cómo los escribiste en el caso de prueba.`,
      linea,
    )
  }
  return obj[k]
}

function evaluar(e, vars, linea) {
  switch (e.t) {
    case 'num':
    case 'txt':
    case 'bool':
      return e.v
    case 'var': {
      const clave = Object.keys(vars).find((k) => k === e.partes[0]) ?? Object.keys(vars).find((k) => mayus(k) === mayus(e.partes[0]))
      if (clave === undefined) {
        throw new ErrorPseudo(
          `La variable «${e.partes[0]}» se usa en la línea ${linea}, pero todavía no tiene valor.`,
          `Dale un valor antes (por ejemplo «${e.partes[0]} ← 0») o revisa que esté escrita igual en todas partes.`,
          linea,
        )
      }
      let valor = vars[clave]
      for (const campo of e.partes.slice(1)) {
        if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
          throw new ErrorPseudo(`«${e.partes[0]}» no es un registro, así que no tiene el campo «${campo}» (línea ${linea}).`, 'Los campos solo se piden de un registro, por ejemplo el «item» de un PARA CADA.', linea)
        }
        valor = buscarCampo(valor, campo, linea)
      }
      return valor
    }
    case 'idx': {
      const lista = evaluar(e.base, vars, linea)
      const i = evaluar(e.indice, vars, linea)
      if (!Array.isArray(lista)) {
        throw new ErrorPseudo(`«${e.base.partes[0]}» no es una lista, así que no tiene posiciones (línea ${linea}).`, 'Las posiciones se piden de una entrada de tipo lista, por ejemplo precios[1].', linea)
      }
      aNumero(i, linea)
      if (!Number.isInteger(i) || i < 1 || i > lista.length) {
        throw new ErrorPseudo(
          `La posición ${mostrarValor(i)} no existe en «${e.base.partes[0]}» (línea ${linea}): la lista tiene ${lista.length} ${lista.length === 1 ? 'elemento' : 'elementos'}.`,
          'Las posiciones empiezan en 1 y llegan hasta la cantidad de elementos.',
          linea,
        )
      }
      return lista[i - 1]
    }
    case 'campoDe': {
      const reg = evaluar(e.e, vars, linea)
      if (!reg || typeof reg !== 'object' || Array.isArray(reg)) {
        throw new ErrorPseudo(`Eso no es un registro, así que no tiene el campo «${e.campo}» (línea ${linea}).`, 'Los campos solo se piden de un registro.', linea)
      }
      return buscarCampo(reg, e.campo, linea)
    }
    case 'fn': {
      const args = e.args.map((a) => evaluar(a, vars, linea))
      const f = FUNCIONES[e.nombre]
      const necesitaLista = ['LONGITUD', 'LARGO', 'TAMANO', 'LEN'].includes(e.nombre)
      if (!necesitaLista) args.flat().forEach((a) => aNumero(a, linea))
      const r = f(...args)
      if (typeof r === 'number' && Number.isNaN(r)) {
        throw new ErrorPseudo(`No se pudo calcular ${e.nombre}(…) en la línea ${linea}.`, necesitaLista ? 'LONGITUD pide una lista o un texto.' : 'Revisa los valores que le das: por ejemplo, RAIZ no acepta números negativos y PROMEDIO no acepta una lista vacía.', linea)
      }
      return r
    }
    case 'neg': {
      const v = evaluar(e.e, vars, linea)
      aNumero(v, linea)
      return -v
    }
    case 'no': {
      const v = evaluar(e.e, vars, linea)
      aBooleano(v, linea)
      return !v
    }
    case 'bin': {
      if (e.op === 'Y') {
        const a = evaluar(e.izq, vars, linea)
        aBooleano(a, linea)
        if (!a) return false
        const b = evaluar(e.der, vars, linea)
        aBooleano(b, linea)
        return b
      }
      if (e.op === 'O') {
        const a = evaluar(e.izq, vars, linea)
        aBooleano(a, linea)
        if (a) return true
        const b = evaluar(e.der, vars, linea)
        aBooleano(b, linea)
        return b
      }
      const a = evaluar(e.izq, vars, linea)
      const b = evaluar(e.der, vars, linea)
      if (e.op === '+' && (typeof a === 'string' || typeof b === 'string')) return `${typeof a === 'string' ? a : mostrarValor(a)}${typeof b === 'string' ? b : mostrarValor(b)}`
      if (['+', '-', '*', '/', '%'].includes(e.op)) {
        aNumero(a, linea)
        aNumero(b, linea)
        if ((e.op === '/' || e.op === '%') && b === 0) {
          throw new ErrorPseudo(`Se está dividiendo entre cero en la línea ${linea}.`, 'Antes de dividir, pregunta con un SI si el divisor es distinto de cero.', linea)
        }
        return e.op === '+' ? a + b : e.op === '-' ? a - b : e.op === '*' ? a * b : e.op === '/' ? a / b : a % b
      }
      if (e.op === '=' || e.op === '!=') {
        const igual = typeof a === 'string' && typeof b === 'string' ? a.trim().toLowerCase() === b.trim().toLowerCase() : a === b
        return e.op === '=' ? igual : !igual
      }
      aNumero(a, linea)
      aNumero(b, linea)
      return e.op === '>' ? a > b : e.op === '<' ? a < b : e.op === '>=' ? a >= b : a <= b
    }
    default:
      throw new ErrorPseudo('No se pudo calcular esta expresión.', null, linea)
  }
}

function aNumero(v, linea) {
  if (typeof v !== 'number' || Number.isNaN(v)) {
    throw new ErrorPseudo(`En la línea ${linea} se hace una cuenta con algo que no es un número (${mostrarValor(v)}).`, 'Revisa que las variables de la cuenta tengan números y que el caso de prueba los traiga bien escritos.', linea)
  }
}

function aBooleano(v, linea) {
  if (typeof v !== 'boolean') {
    throw new ErrorPseudo(`La condición de la línea ${linea} no da verdadero ni falso (da ${mostrarValor(v)}).`, 'Una condición compara dos cosas, por ejemplo «unidades ≥ 10».', linea)
  }
}

const copiar = (v) => (Array.isArray(v) ? v.map(copiar) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copiar(x)])) : v)

/**
 * Ejecuta un programa ya analizado con los valores de entrada, y devuelve el
 * recorrido paso a paso.
 * @param {object} programa  resultado de analizar().programa
 * @param {Record<string, any>} entradas valores por nombre de entrada
 */
export function ejecutarPrograma(programa, entradas = {}) {
  const vars = {}
  const pasos = []
  let resultado
  let truncado = false
  let error = null

  const instantanea = () => Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, mostrarValor(v)]))
  const registrar = (linea, texto, nota) => {
    if (pasos.length >= MAX_PASOS) {
      truncado = true
      throw new ErrorPseudo(
        `Se detuvo después de ${MAX_PASOS} pasos.`,
        'Puede que haya un ciclo que nunca termina: revisa que dentro del MIENTRAS cambie algo que haga falsa la condición.',
        linea,
      )
    }
    pasos.push({ paso: pasos.length + 1, linea, texto, nota, vars: instantanea(), resultado: resultado === undefined ? null : mostrarValor(resultado) })
  }

  function ejecutar(cuerpo) {
    for (const s of cuerpo) {
      if (s.t === 'proceso') continue
      if (s.t === 'entrada') {
        for (const e of s.entradas) {
          if (!(e.nombre in entradas) || entradas[e.nombre] === undefined || entradas[e.nombre] === null || entradas[e.nombre] === '') {
            throw new ErrorPseudo(`Falta el valor de la entrada «${e.nombre}» en el caso de prueba.`, 'Escribe el valor de cada entrada en el caso de prueba.', s.linea)
          }
          vars[e.nombre] = copiar(entradas[e.nombre])
        }
        registrar(s.linea, s.texto, `${s.leer ? 'Se leen' : 'Entran'} los valores: ${s.entradas.map((e) => `${e.nombre} = ${mostrarValor(vars[e.nombre])}`).join(', ')}`)
      } else if (s.t === 'asig') {
        const v = evaluar(s.expr, vars, s.linea)
        vars[s.destino] = v
        registrar(s.linea, s.texto, `${s.destino} vale ahora ${mostrarValor(v)}`)
      } else if (s.t === 'asigIdx') {
        const lista = vars[s.destino]
        const i = evaluar(s.indice, vars, s.linea)
        const v = evaluar(s.expr, vars, s.linea)
        if (!Array.isArray(lista)) {
          throw new ErrorPseudo(`«${s.destino}» no es una lista (línea ${s.linea}).`, 'Solo se puede asignar a una posición de una lista.', s.linea)
        }
        aNumero(i, s.linea)
        if (!Number.isInteger(i) || i < 1 || i > lista.length + 1) {
          throw new ErrorPseudo(`La posición ${mostrarValor(i)} no existe en «${s.destino}» (línea ${s.linea}): la lista tiene ${lista.length} elementos.`, 'Las posiciones empiezan en 1; para agregar uno nuevo usa la siguiente a la última.', s.linea)
        }
        lista[i - 1] = v
        registrar(s.linea, s.texto, `${s.destino}[${mostrarValor(i)}] vale ahora ${mostrarValor(v)}`)
      } else if (s.t === 'paraNum') {
        const desde = evaluar(s.desde, vars, s.linea)
        const hasta = evaluar(s.hasta, vars, s.linea)
        const paso = s.paso ? evaluar(s.paso, vars, s.linea) : 1
        aNumero(desde, s.linea)
        aNumero(hasta, s.linea)
        aNumero(paso, s.linea)
        if (paso === 0) throw new ErrorPseudo(`El paso del PARA de la línea ${s.linea} es cero: nunca terminaría.`, 'Usa un paso distinto de cero, por ejemplo 1.', s.linea)
        let entro = false
        for (let i = desde; paso > 0 ? i <= hasta : i >= hasta; i += paso) {
          entro = true
          vars[s.variable] = i
          registrar(s.linea, s.texto, `${s.variable} vale ${mostrarValor(i)}`)
          ejecutar(s.cuerpo)
        }
        if (!entro) registrar(s.linea, s.texto, 'El rango está vacío: no entra al ciclo')
      } else if (s.t === 'repetir') {
        for (;;) {
          ejecutar(s.cuerpo)
          const c = evaluar(s.cond, vars, s.lineaFin)
          aBooleano(c, s.lineaFin)
          registrar(s.lineaFin, s.textoFin ?? 'HASTA QUE', c ? 'La condición se cumple: sale del ciclo' : 'La condición no se cumple: repite')
          if (c) break
        }
      } else if (s.t === 'salida') {
        const valores = s.exprs.map((x) => evaluar(x, vars, s.linea))
        // Un solo valor conserva su tipo (para compararlo con lo esperado); varios se unen en un texto.
        resultado = valores.length === 1 ? valores[0] : valores.map(textoPlano).join('')
        registrar(s.linea, s.texto, `${s.texto.match(/^\w+/)?.[0]?.toUpperCase() === 'SALIDA' ? 'El resultado es' : 'Se muestra'} ${mostrarValor(resultado)}`)
      } else if (s.t === 'si') {
        const c = evaluar(s.cond, vars, s.linea)
        aBooleano(c, s.linea)
        registrar(s.linea, s.texto, c ? 'La condición es verdadera: entra al SI' : s.sino ? 'La condición es falsa: va al SI NO' : 'La condición es falsa: se salta el SI')
        if (c) ejecutar(s.entonces)
        else if (s.sino) ejecutar(s.sino)
      } else if (s.t === 'mientras') {
        for (;;) {
          const c = evaluar(s.cond, vars, s.linea)
          aBooleano(c, s.linea)
          registrar(s.linea, s.texto, c ? 'La condición es verdadera: repite' : 'La condición es falsa: sale del ciclo')
          if (!c) break
          ejecutar(s.cuerpo)
        }
      } else if (s.t === 'para') {
        const lista = evaluar(s.lista, vars, s.linea)
        if (!Array.isArray(lista)) {
          throw new ErrorPseudo(`«${s.lista.partes?.join('.') ?? 'eso'}» no es una lista, así que no se puede recorrer con PARA CADA (línea ${s.linea}).`, 'PARA CADA necesita una entrada de tipo lista.', s.linea)
        }
        for (let k = 0; k < lista.length; k += 1) {
          vars[s.item] = copiar(lista[k])
          registrar(s.linea, s.texto, `${s.item} es el registro ${k + 1} de ${lista.length}: ${mostrarValor(lista[k])}`)
          ejecutar(s.cuerpo)
        }
        if (lista.length === 0) registrar(s.linea, s.texto, 'La lista está vacía: no entra al ciclo')
      }
    }
  }

  try {
    ejecutar(programa.cuerpo)
  } catch (e) {
    if (!(e instanceof ErrorPseudo)) throw e
    error = { linea: e.linea, mensaje: e.message, pista: e.pista }
  }
  return { ok: error === null, error, pasos, resultado, truncado }
}

/* --------------------------- valores del caso de prueba --------------------------- */

const aNumeroTexto = (t) => {
  const limpio = String(t).trim().replace(/[$\s]/g, '')
  const signo = limpio.startsWith('-') ? -1 : 1
  const sinSigno = limpio.replace(/^-/, '')
  if (NUMERO_COMPLETO.test(sinSigno)) return signo * numeroDeTexto(sinSigno)
  return null
}

/** Convierte el texto de una celda del caso en número, texto o booleano. */
export function valorSimple(t) {
  const s = String(t ?? '').trim()
  const n = aNumeroTexto(s)
  if (n !== null) return n
  if (/^verdadero$/i.test(s)) return true
  if (/^falso$/i.test(s)) return false
  return s.replace(/^["“']|["”']$/g, '')
}

/**
 * Valor de una entrada escrita a mano. Una lista se escribe con un registro por
 * línea: «cantidad=10, precio=500».
 * @returns {{ valor: any, error: string|null }}
 */
export function valorDeEntrada(texto, tipo = '') {
  const t = String(texto ?? '').trim()
  if (t === '') return { valor: undefined, error: null }
  const esLista = /lista/i.test(tipo) || /\n/.test(t) || /=/.test(t)
  if (!esLista) return { valor: valorSimple(t), error: null }
  const registros = []
  for (const linea of t.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)) {
    const registro = {}
    for (const par of linea.split(/[;,](?=\s*[^\d])|;/).map((x) => x.trim()).filter(Boolean)) {
      const m = par.match(new RegExp(`^([${LETRA}][${LETRA}0-9]*)\\s*[=:]\\s*(.+)$`))
      if (!m) {
        return { valor: undefined, error: `No entiendo «${par}». En cada línea escribe campo=valor separados por coma, por ejemplo: cantidad=10, precio=500.` }
      }
      registro[m[1]] = valorSimple(m[2])
    }
    registros.push(registro)
  }
  return { valor: registros, error: null }
}

/** Campos de registro que usa el pseudocódigo (item.precio → «precio»), para ayudar a escribir el caso. */
export function camposUsados(texto) {
  const campos = new Set()
  const re = new RegExp(`[${LETRA}][${LETRA}0-9]*\\.([${LETRA}][${LETRA}0-9]*)`, 'g')
  for (const m of String(texto ?? '').matchAll(re)) campos.add(m[1])
  return [...campos]
}

/** ¿Coinciden el resultado obtenido y el esperado? Números con tolerancia; textos sin mayúsculas. */
export function resultadosCoinciden(obtenido, esperado) {
  const e = String(esperado ?? '').trim()
  if (e === '' || obtenido === undefined || obtenido === null) return false
  const ne = aNumeroTexto(e)
  const no = typeof obtenido === 'number' ? obtenido : aNumeroTexto(obtenido)
  if (ne !== null && no !== null) return Math.abs(ne - no) < 0.005
  const o = typeof obtenido === 'boolean' ? (obtenido ? 'verdadero' : 'falso') : String(obtenido)
  return o.trim().toLowerCase() === e.toLowerCase()
}

/** Atajo: analiza y ejecuta con entradas ya convertidas (para pruebas). */
export function correr(texto, entradas) {
  const a = analizar(texto)
  if (!a.ok) return { ok: false, errores: a.errores, pasos: [] }
  return { ...ejecutarPrograma(a.programa, entradas), errores: [] }
}
