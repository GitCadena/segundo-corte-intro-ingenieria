/*
 * Intérprete de pseudocódigo en español (estilo PSeInt).
 * Soporta: Algoritmo/FinAlgoritmo, Definir, Dimension, Leer, Escribir,
 * asignación (<-, =), Si/Entonces/Sino/FinSi, Mientras/Hacer/FinMientras,
 * Repetir/Hasta Que, Para/Hasta/Con Paso/FinPara, arreglos de 1 dimensión,
 * operadores aritméticos, relacionales y lógicos, y funciones básicas.
 */

const KEYWORDS = new Set([
  'algoritmo', 'proceso', 'finalgoritmo', 'finproceso', 'definir', 'como',
  'dimension', 'dimensionar', 'leer', 'escribir', 'imprimir', 'mostrar',
  'si', 'entonces', 'sino', 'finsi', 'mientras', 'hacer', 'finmientras',
  'repetir', 'hasta', 'que', 'para', 'con', 'paso', 'finpara',
  'y', 'o', 'no', 'mod', 'verdadero', 'falso',
])

const TYPES = new Set([
  'entero', 'enteros', 'real', 'reales', 'numero', 'numerico', 'caracter',
  'caracteres', 'cadena', 'texto', 'logico', 'logicos', 'booleano',
])

/* ---------------------------------- léxico --------------------------------- */

function tokenize(src) {
  const tokens = []
  let i = 0
  let line = 1
  const push = (type, value) => tokens.push({ type, value, line })

  while (i < src.length) {
    const c = src[i]

    if (c === '\n') { push('nl', '\n'); line++; i++; continue }
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue }

    // comentarios: // y /* */
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') line++
        i++
      }
      i += 2
      continue
    }

    // cadenas
    if (c === '"' || c === "'") {
      const quote = c
      let value = ''
      i++
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\n') throw err(line, 'Falta cerrar la comilla de una cadena.')
        value += src[i++]
      }
      if (i >= src.length) throw err(line, 'Falta cerrar la comilla de una cadena.')
      i++
      push('str', value)
      continue
    }

    // números
    if (/[0-9]/.test(c)) {
      let value = ''
      while (i < src.length && /[0-9]/.test(src[i])) value += src[i++]
      if (src[i] === '.' && /[0-9]/.test(src[i + 1] || '')) {
        value += src[i++]
        while (i < src.length && /[0-9]/.test(src[i])) value += src[i++]
      }
      push('num', parseFloat(value))
      continue
    }

    // identificadores y palabras clave
    if (/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_]/.test(c)) {
      let value = ''
      while (i < src.length && /[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ_]/.test(src[i])) value += src[i++]
      const lower = value.toLowerCase()
      if (KEYWORDS.has(lower) || TYPES.has(lower)) push('kw', lower)
      else push('id', value)
      continue
    }

    // operadores
    const three = src.slice(i, i + 3)
    if (three === '<--') { push('op', '<-'); i += 3; continue }
    const two = src.slice(i, i + 2)
    if (two === '<-' || two === '<=' || two === '>=' || two === '<>' || two === '==' || two === '!=' || two === ':=') {
      push('op', two === ':=' ? '<-' : two)
      i += 2
      continue
    }
    if ('←'.includes(c)) { push('op', '<-'); i++; continue }
    if ('+-*/%^()[],<>='.includes(c)) { push('op', c); i++; continue }
    if (c === ';') { push('nl', ';'); i++; continue }

    throw err(line, `No entiendo el símbolo "${c}".`)
  }
  push('nl', '\n')
  push('eof', null)
  return tokens
}

function err(line, message) {
  const e = new Error(`Línea ${line}: ${message}`)
  e.pseudoLine = line
  return e
}

/* --------------------------------- sintaxis -------------------------------- */

function parse(tokens) {
  let p = 0
  const peek = (k = 0) => tokens[p + k]
  const at = (type, value) => peek().type === type && (value === undefined || peek().value === value)
  const next = () => tokens[p++]
  const skipNl = () => { while (at('nl')) p++ }

  function expect(type, value, what) {
    if (!at(type, value)) {
      throw err(peek().line, `Esperaba ${what || `"${value}"`} y encontré "${peek().value ?? 'fin del código'}".`)
    }
    return next()
  }

  function parseProgram() {
    skipNl()
    if (at('kw', 'algoritmo') || at('kw', 'proceso')) {
      next()
      while (!at('nl') && !at('eof')) next()
    }
    const body = parseBlock(['finalgoritmo', 'finproceso'])
    if (at('kw', 'finalgoritmo') || at('kw', 'finproceso')) next()
    return body
  }

  function parseBlock(terminators) {
    const stmts = []
    for (;;) {
      skipNl()
      if (at('eof')) break
      if (peek().type === 'kw' && terminators.includes(peek().value)) break
      stmts.push(parseStatement())
    }
    return stmts
  }

  function parseStatement() {
    const tok = peek()

    const CIERRES = {
      finsi: '"Si … Entonces"',
      finmientras: '"Mientras … Hacer"',
      finpara: '"Para … Hacer"',
      finalgoritmo: '"Algoritmo"',
      finproceso: '"Proceso"',
      sino: '"Si … Entonces"',
      hasta: '"Repetir"',
    }
    if (tok.type === 'kw' && CIERRES[tok.value] && !['si', 'mientras', 'para', 'repetir'].includes(tok.value)) {
      // Llegar aquí significa que un bloque quedó sin cerrar más arriba.
      throw err(
        tok.line,
        `Encontré "${tok.value}" sin su apertura correspondiente. Revisa si falta cerrar un bloque ` +
          `con FinSi, FinMientras o FinPara antes de esta línea.`,
      )
    }

    if (tok.type === 'kw') {
      switch (tok.value) {
        case 'definir': return parseDefinir()
        case 'dimension':
        case 'dimensionar': return parseDimension()
        case 'leer': return parseLeer()
        case 'escribir':
        case 'imprimir':
        case 'mostrar': return parseEscribir()
        case 'si': return parseSi()
        case 'mientras': return parseMientras()
        case 'repetir': return parseRepetir()
        case 'para': return parsePara()
        default:
          throw err(tok.line, `La palabra "${tok.value}" no puede iniciar una instrucción aquí.`)
      }
    }

    if (tok.type === 'id') return parseAsignacion()
    throw err(tok.line, `No entiendo la instrucción que empieza en "${tok.value}".`)
  }

  function parseDefinir() {
    const line = next().line
    const names = []
    names.push(expect('id', undefined, 'un nombre de variable').value)
    while (at('op', ',')) { next(); names.push(expect('id', undefined, 'un nombre de variable').value) }
    if (at('kw', 'como')) { next(); if (peek().type === 'kw') next() }
    return { kind: 'definir', names, line }
  }

  function parseDimension() {
    const line = next().line
    const arrays = []
    for (;;) {
      const name = expect('id', undefined, 'un nombre de arreglo').value
      expect('op', '[')
      const size = parseExpr()
      expect('op', ']')
      arrays.push({ name, size })
      if (at('op', ',')) { next(); continue }
      break
    }
    return { kind: 'dimension', arrays, line }
  }

  function parseLeer() {
    const line = next().line
    const targets = [parseTarget()]
    while (at('op', ',')) { next(); targets.push(parseTarget()) }
    return { kind: 'leer', targets, line }
  }

  function parseEscribir() {
    const line = next().line
    const exprs = [parseExpr()]
    while (at('op', ',')) { next(); exprs.push(parseExpr()) }
    return { kind: 'escribir', exprs, line }
  }

  function parseSi() {
    const line = next().line
    const cond = parseExpr()
    if (at('kw', 'entonces')) next()
    const then = parseBlock(['sino', 'finsi'])
    let otherwise = []
    if (at('kw', 'sino')) {
      next()
      otherwise = parseBlock(['finsi'])
    }
    expect('kw', 'finsi', '"FinSi"')
    return { kind: 'si', cond, then, otherwise, line }
  }

  function parseMientras() {
    const line = next().line
    const cond = parseExpr()
    if (at('kw', 'hacer')) next()
    const body = parseBlock(['finmientras'])
    expect('kw', 'finmientras', '"FinMientras"')
    return { kind: 'mientras', cond, body, line }
  }

  function parseRepetir() {
    const line = next().line
    const body = parseBlock(['hasta'])
    expect('kw', 'hasta', '"Hasta Que"')
    if (at('kw', 'que')) next()
    const cond = parseExpr()
    return { kind: 'repetir', body, cond, line }
  }

  function parsePara() {
    const line = next().line
    const name = expect('id', undefined, 'la variable del ciclo').value
    if (at('op', '<-') || at('op', '=')) next()
    const from = parseExpr()
    expect('kw', 'hasta', '"Hasta"')
    const to = parseExpr()
    let step = null
    if (at('kw', 'con')) { next(); expect('kw', 'paso', '"Paso"'); step = parseExpr() }
    else if (at('kw', 'paso')) { next(); step = parseExpr() }
    if (at('kw', 'hacer')) next()
    const body = parseBlock(['finpara'])
    expect('kw', 'finpara', '"FinPara"')
    return { kind: 'para', name, from, to, step, body, line }
  }

  function parseTarget() {
    const tok = expect('id', undefined, 'un nombre de variable')
    if (at('op', '[')) {
      next()
      const index = parseExpr()
      expect('op', ']')
      return { name: tok.value, index, line: tok.line }
    }
    return { name: tok.value, index: null, line: tok.line }
  }

  function parseAsignacion() {
    const target = parseTarget()
    if (!at('op', '<-') && !at('op', '=')) {
      throw err(peek().line, `Falta el operador de asignación "<-" después de "${target.name}".`)
    }
    next()
    const expr = parseExpr()
    return { kind: 'asignar', target, expr, line: target.line }
  }

  /* expresiones */
  function parseExpr() { return parseO() }

  function parseO() {
    let left = parseY()
    while (at('kw', 'o')) { const line = next().line; left = { kind: 'bin', op: 'o', left, right: parseY(), line } }
    return left
  }
  function parseY() {
    let left = parseNo()
    while (at('kw', 'y')) { const line = next().line; left = { kind: 'bin', op: 'y', left, right: parseNo(), line } }
    return left
  }
  function parseNo() {
    if (at('kw', 'no')) { const line = next().line; return { kind: 'un', op: 'no', expr: parseNo(), line } }
    return parseComparacion()
  }
  function parseComparacion() {
    let left = parseSuma()
    while (peek().type === 'op' && ['=', '==', '<>', '!=', '<', '<=', '>', '>='].includes(peek().value)) {
      const tok = next()
      left = { kind: 'bin', op: tok.value, left, right: parseSuma(), line: tok.line }
    }
    return left
  }
  function parseSuma() {
    let left = parseProducto()
    while (peek().type === 'op' && ['+', '-'].includes(peek().value)) {
      const tok = next()
      left = { kind: 'bin', op: tok.value, left, right: parseProducto(), line: tok.line }
    }
    return left
  }
  function parseProducto() {
    let left = parsePotencia()
    while ((peek().type === 'op' && ['*', '/', '%'].includes(peek().value)) || at('kw', 'mod')) {
      const tok = next()
      const op = tok.type === 'kw' ? '%' : tok.value
      left = { kind: 'bin', op, left, right: parsePotencia(), line: tok.line }
    }
    return left
  }
  function parsePotencia() {
    const base = parseUnario()
    if (at('op', '^')) {
      const tok = next()
      return { kind: 'bin', op: '^', left: base, right: parsePotencia(), line: tok.line }
    }
    return base
  }
  function parseUnario() {
    if (at('op', '-')) { const tok = next(); return { kind: 'un', op: '-', expr: parseUnario(), line: tok.line } }
    if (at('op', '+')) { next(); return parseUnario() }
    return parsePrimario()
  }
  function parsePrimario() {
    const tok = peek()
    if (tok.type === 'num') { next(); return { kind: 'num', value: tok.value, line: tok.line } }
    if (tok.type === 'str') { next(); return { kind: 'str', value: tok.value, line: tok.line } }
    if (at('kw', 'verdadero')) { next(); return { kind: 'bool', value: true, line: tok.line } }
    if (at('kw', 'falso')) { next(); return { kind: 'bool', value: false, line: tok.line } }
    if (at('op', '(')) {
      next()
      const e = parseExpr()
      expect('op', ')', '")"')
      return e
    }
    if (tok.type === 'id') {
      next()
      if (at('op', '(')) {
        next()
        const args = []
        if (!at('op', ')')) {
          args.push(parseExpr())
          while (at('op', ',')) { next(); args.push(parseExpr()) }
        }
        expect('op', ')', '")"')
        return { kind: 'llamada', name: tok.value.toLowerCase(), args, line: tok.line }
      }
      if (at('op', '[')) {
        next()
        const index = parseExpr()
        expect('op', ']', '"]"')
        return { kind: 'indice', name: tok.value, index, line: tok.line }
      }
      return { kind: 'var', name: tok.value, line: tok.line }
    }
    throw err(tok.line, `Esperaba un valor y encontré "${tok.value ?? 'fin del código'}".`)
  }

  const program = parseProgram()
  skipNl()
  if (!at('eof')) throw err(peek().line, 'Hay instrucciones después del final del algoritmo.')
  return program
}

/* --------------------------------- ejecución -------------------------------- */

const MAX_STEPS = 400000
const MAX_OUTPUT = 400
const MAX_TRAZA = 600

/**
 * Ejecuta pseudocódigo.
 *
 * @param {string} codigo
 * @param {Array} entradas   datos que consumirá Leer, uno por elemento
 * @param {{traza?: boolean, maxTraza?: number}} opciones
 *        traza: registra el estado de las variables después de cada
 *        instrucción. Se usa en el laboratorio y en los juegos de seguimiento.
 * @returns {{salida: string[], variables: Map, traza: Array, declaradas: string[]}}
 */
export function ejecutar(codigo, entradas = [], opciones = {}) {
  const salida = []
  const cola = entradas.map((v) => String(v))
  let steps = 0
  const vars = new Map()
  const declaradas = []
  const traza = []
  const conTraza = opciones.traza === true
  const topeTraza = opciones.maxTraza || MAX_TRAZA
  let trazaLlena = false

  const ast = parse(tokenize(codigo))

  /** Copia legible del estado actual de las variables. */
  function fotoVariables() {
    const foto = {}
    for (const nombre of declaradas) foto[nombre] = '—'
    for (const [k, v] of vars) {
      const visible = declaradas.find((d) => d.toLowerCase() === k) || k
      foto[visible] = mostrar(v)
    }
    return foto
  }

  function anotar(st, etiqueta) {
    if (!conTraza || trazaLlena) return
    if (traza.length >= topeTraza) {
      trazaLlena = true
      return
    }
    traza.push({
      paso: traza.length + 1,
      linea: st.line || 0,
      instruccion: etiqueta,
      variables: fotoVariables(),
      salidas: salida.length,
    })
  }

  const key = (name) => name.toLowerCase()

  function getVar(name, line) {
    const k = key(name)
    if (!vars.has(k)) throw err(line, `La variable "${name}" se usa sin haber recibido un valor.`)
    return vars.get(k)
  }

  function setVar(name, value) { vars.set(key(name), value) }

  function truthy(value, line) {
    if (typeof value === 'boolean') return value
    throw err(line, 'La condición debe ser verdadera o falsa (usa comparaciones o Y/O/NO).')
  }

  function numero(value, line, ctx) {
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return Number(value)
    throw err(line, `${ctx} necesita un número y recibió "${mostrar(value)}".`)
  }

  function evalExpr(node) {
    switch (node.kind) {
      case 'num': case 'str': case 'bool': return node.value
      case 'var': return getVar(node.name, node.line)
      case 'indice': {
        const arr = getVar(node.name, node.line)
        if (!arr || arr.__arreglo !== true) throw err(node.line, `"${node.name}" no es un arreglo.`)
        const idx = Math.trunc(numero(evalExpr(node.index), node.line, 'El índice'))
        if (idx < 1 || idx > arr.items.length) {
          throw err(node.line, `El índice ${idx} está fuera de "${node.name}" (1 a ${arr.items.length}).`)
        }
        const v = arr.items[idx - 1]
        if (v === undefined) throw err(node.line, `"${node.name}[${idx}]" todavía no tiene valor.`)
        return v
      }
      case 'un': {
        const v = evalExpr(node.expr)
        if (node.op === '-') return -numero(v, node.line, 'El signo negativo')
        return !truthy(v, node.line)
      }
      case 'bin': return evalBin(node)
      case 'llamada': return evalLlamada(node)
      default: throw err(node.line, 'Expresión no reconocida.')
    }
  }

  function evalBin(node) {
    const { op, line } = node
    if (op === 'y') return truthy(evalExpr(node.left), line) && truthy(evalExpr(node.right), line)
    if (op === 'o') return truthy(evalExpr(node.left), line) || truthy(evalExpr(node.right), line)

    const a = evalExpr(node.left)
    const b = evalExpr(node.right)

    switch (op) {
      case '+':
        if (typeof a === 'string' || typeof b === 'string') return mostrar(a) + mostrar(b)
        return numero(a, line, 'La suma') + numero(b, line, 'La suma')
      case '-': return numero(a, line, 'La resta') - numero(b, line, 'La resta')
      case '*': return numero(a, line, 'La multiplicación') * numero(b, line, 'La multiplicación')
      case '/': {
        const d = numero(b, line, 'La división')
        if (d === 0) throw err(line, 'División entre cero.')
        return numero(a, line, 'La división') / d
      }
      case '%': {
        const d = numero(b, line, 'El módulo')
        if (d === 0) throw err(line, 'Módulo entre cero.')
        return numero(a, line, 'El módulo') % d
      }
      case '^': return Math.pow(numero(a, line, 'La potencia'), numero(b, line, 'La potencia'))
      case '=': case '==': return igual(a, b)
      case '<>': case '!=': return !igual(a, b)
      case '<': return comparar(a, b, line) < 0
      case '<=': return comparar(a, b, line) <= 0
      case '>': return comparar(a, b, line) > 0
      case '>=': return comparar(a, b, line) >= 0
      default: throw err(line, `Operador "${op}" no soportado.`)
    }
  }

  function igual(a, b) {
    if (typeof a === 'string' && typeof b === 'string') return a.toLowerCase() === b.toLowerCase()
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-9
    return a === b
  }

  function comparar(a, b, line) {
    if (typeof a === 'string' && typeof b === 'string') return a.toLowerCase() < b.toLowerCase() ? -1 : (a.toLowerCase() > b.toLowerCase() ? 1 : 0)
    const x = numero(a, line, 'La comparación')
    const y = numero(b, line, 'La comparación')
    return x < y ? -1 : (x > y ? 1 : 0)
  }

  function evalLlamada(node) {
    const args = node.args.map(evalExpr)
    const n = (k, ctx) => numero(args[k], node.line, ctx)
    switch (node.name) {
      case 'raiz': return Math.sqrt(n(0, 'raiz'))
      case 'abs': return Math.abs(n(0, 'abs'))
      case 'trunc': return Math.trunc(n(0, 'trunc'))
      case 'redon': case 'redondear': return Math.round(n(0, 'redondear'))
      case 'sen': return Math.sin(n(0, 'sen'))
      case 'cos': return Math.cos(n(0, 'cos'))
      case 'ln': return Math.log(n(0, 'ln'))
      case 'exp': return Math.exp(n(0, 'exp'))
      case 'longitud': return mostrar(args[0]).length
      case 'mayusculas': return mostrar(args[0]).toUpperCase()
      case 'minusculas': return mostrar(args[0]).toLowerCase()
      case 'subcadena': {
        const s = mostrar(args[0])
        const desde = Math.trunc(n(1, 'subcadena'))
        const hasta = Math.trunc(n(2, 'subcadena'))
        return s.slice(desde - 1, hasta)
      }
      case 'concatenar': return args.map(mostrar).join('')
      case 'convertiranumero': return Number(mostrar(args[0]))
      case 'convertiratexto': return mostrar(args[0])
      default: throw err(node.line, `La función "${node.name}" no existe en este entorno.`)
    }
  }

  function asignarDestino(target, value) {
    if (target.index === null) { setVar(target.name, value); return }
    const arr = getVar(target.name, target.line)
    if (!arr || arr.__arreglo !== true) throw err(target.line, `"${target.name}" no es un arreglo.`)
    const idx = Math.trunc(numero(evalExpr(target.index), target.line, 'El índice'))
    if (idx < 1 || idx > arr.items.length) {
      throw err(target.line, `El índice ${idx} está fuera de "${target.name}" (1 a ${arr.items.length}).`)
    }
    arr.items[idx - 1] = value
  }

  function run(stmts) {
    for (const st of stmts) {
      if (++steps > MAX_STEPS) throw new Error('El algoritmo se pasó del límite de pasos. Revisa si algún ciclo nunca termina.')
      switch (st.kind) {
        case 'definir':
          for (const n of st.names) if (!declaradas.includes(n)) declaradas.push(n)
          anotar(st, `Definir ${st.names.join(', ')}`)
          break
        case 'dimension':
          for (const a of st.arrays) {
            const size = Math.trunc(numero(evalExpr(a.size), st.line, 'El tamaño del arreglo'))
            if (size < 1 || size > 10000) throw err(st.line, 'El tamaño del arreglo debe estar entre 1 y 10000.')
            if (!declaradas.includes(a.name)) declaradas.push(a.name)
            setVar(a.name, { __arreglo: true, items: new Array(size) })
          }
          anotar(st, `Dimension ${st.arrays.map((a) => a.name).join(', ')}`)
          break
        case 'asignar': {
          const valor = evalExpr(st.expr)
          asignarDestino(st.target, valor)
          if (!declaradas.includes(st.target.name)) declaradas.push(st.target.name)
          anotar(st, `${st.target.name}${st.target.index ? '[…]' : ''} <- ${mostrar(valor)}`)
          break
        }
        case 'leer':
          for (const t of st.targets) {
            if (cola.length === 0) throw err(st.line, 'El algoritmo pidió más datos de los que hay en la entrada.')
            const raw = cola.shift()
            const value = raw.trim() !== '' && !isNaN(Number(raw)) ? Number(raw) : raw
            asignarDestino(t, value)
            if (!declaradas.includes(t.name)) declaradas.push(t.name)
          }
          anotar(st, `Leer ${st.targets.map((t) => t.name).join(', ')}`)
          break
        case 'escribir': {
          const texto = st.exprs.map((e) => mostrar(evalExpr(e))).join('')
          salida.push(texto)
          if (salida.length > MAX_OUTPUT) throw new Error('El algoritmo escribió demasiadas líneas. Revisa los ciclos.')
          anotar(st, `Escribir → ${texto}`)
          break
        }
        case 'si': {
          const rama = truthy(evalExpr(st.cond), st.line)
          anotar(st, `Si … ${rama ? 'verdadero' : 'falso'}`)
          if (rama) run(st.then)
          else run(st.otherwise)
          break
        }
        case 'mientras':
          for (;;) {
            const sigue = truthy(evalExpr(st.cond), st.line)
            anotar(st, `Mientras … ${sigue ? 'verdadero' : 'falso'}`)
            if (!sigue) break
            if (++steps > MAX_STEPS) throw new Error('El ciclo Mientras nunca termina.')
            run(st.body)
          }
          break
        case 'repetir':
          for (;;) {
            if (++steps > MAX_STEPS) throw new Error('El ciclo Repetir nunca termina.')
            run(st.body)
            const fin = truthy(evalExpr(st.cond), st.line)
            anotar(st, `Hasta Que … ${fin ? 'verdadero' : 'falso'}`)
            if (fin) break
          }
          break
        case 'para': {
          const desde = numero(evalExpr(st.from), st.line, 'El inicio del Para')
          const hasta = numero(evalExpr(st.to), st.line, 'El final del Para')
          const paso = st.step === null ? 1 : numero(evalExpr(st.step), st.line, 'El paso del Para')
          if (paso === 0) throw err(st.line, 'El paso del Para no puede ser 0.')
          setVar(st.name, desde)
          if (!declaradas.includes(st.name)) declaradas.push(st.name)
          for (;;) {
            const actual = numero(getVar(st.name, st.line), st.line, 'La variable del Para')
            const sigue = paso > 0 ? actual <= hasta : actual >= hasta
            anotar(st, `Para ${st.name} = ${mostrar(actual)} … ${sigue ? 'entra' : 'sale'}`)
            if (!sigue) break
            if (++steps > MAX_STEPS) throw new Error('El ciclo Para nunca termina.')
            run(st.body)
            setVar(st.name, numero(getVar(st.name, st.line), st.line, 'La variable del Para') + paso)
          }
          break
        }
        default:
          throw err(st.line || 0, 'Instrucción no reconocida.')
      }
    }
  }

  run(ast)
  return { salida, variables: vars, traza, declaradas, trazaLlena }
}

/**
 * Igual que ejecutar(), pero no lanza: devuelve el error como dato.
 * Es lo que usan la consola y los juegos, para poder señalar la línea.
 */
export function ejecutarSeguro(codigo, entradas = [], opciones = {}) {
  try {
    const r = ejecutar(codigo, entradas, opciones)
    return { ok: true, ...r, error: null, linea: null }
  } catch (e) {
    return {
      ok: false,
      salida: [],
      traza: [],
      declaradas: [],
      variables: new Map(),
      error: e.message,
      linea: e.pseudoLine ?? null,
    }
  }
}

export function mostrar(value) {
  if (typeof value === 'boolean') return value ? 'VERDADERO' : 'FALSO'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return String(value)
    return String(Math.round(value * 1e6) / 1e6)
  }
  if (value && value.__arreglo) return `[${value.items.map((v) => (v === undefined ? '-' : mostrar(v))).join(', ')}]`
  return String(value)
}

function normalizar(linea) {
  const t = String(linea).trim().replace(/\s+/g, ' ')
  const n = Number(t.replace(',', '.'))
  if (t !== '' && !isNaN(n)) return String(Math.round(n * 1e6) / 1e6)
  return t.toLowerCase()
}

/** Corre el código contra una lista de casos de prueba. */
export function evaluarCasos(codigo, casos) {
  return casos.map((caso) => {
    try {
      const { salida } = ejecutar(codigo, caso.entradas || [])
      const obtenido = salida.map(normalizar).filter((l) => l !== '')
      const esperado = (caso.esperado || []).map(normalizar).filter((l) => l !== '')
      const ok = obtenido.length === esperado.length && esperado.every((v, i) => v === obtenido[i])
      return { ...caso, ok, salida, error: null }
    } catch (e) {
      return { ...caso, ok: false, salida: [], error: e.message }
    }
  })
}
