/**
 * Prueba de escritorio guiada. Convierte el recorrido del intérprete en una
 * tabla específica del algoritmo del equipo: una fila por línea ejecutada y una
 * casilla solo donde una línea CAMBIA el valor de una variable. Lógica pura.
 */
import { valorSimple, camposUsados } from './interprete.js'

export const LIMITE_FILAS = 30

const esEscalar = (v) => typeof v === 'string' && !/^(lista de|\{|\[)/.test(v)

/** Qué clase de línea es, a partir de su texto. */
export function tipoDePaso(texto) {
  const t = String(texto ?? '').trim().toUpperCase()
  if (/^(ENTRADAS?|LEER)\b/.test(t)) return 'entrada'
  if (/^(SALIDA|ESCRIBIR|IMPRIMIR|MOSTRAR)\b/.test(t)) return 'salida'
  if (/^(SI|MIENTRAS)\b/.test(t) || /^HASTA QUE\b/.test(t)) return 'decide'
  if (/^PARA\b/.test(t)) return 'vuelta'
  return 'asigna'
}

export const ETIQUETA_DE_TIPO = {
  entrada: 'Entran los datos del caso',
  asigna: 'Guarda un valor',
  decide: 'Decide',
  vuelta: 'Empieza una vuelta del ciclo',
  salida: 'Entrega un resultado',
}

/** Casillas que debe llenar el equipo, por fila y variable. */
export function construirTabla(pasos) {
  const usados = pasos.slice(0, LIMITE_FILAS)
  const columnas = []
  for (const p of usados) {
    for (const [k, v] of Object.entries(p.vars)) if (esEscalar(v) && !columnas.includes(k)) columnas.push(k)
  }
  const filas = usados.map((p, i) => {
    const tipo = tipoDePaso(p.texto)
    const prev = i > 0 ? usados[i - 1].vars : {}
    const celdas = {}
    for (const col of columnas) {
      const v = p.vars[col]
      if (v === undefined || !esEscalar(v)) celdas[col] = { modo: 'sin' }
      else if (tipo === 'entrada') celdas[col] = { modo: 'dado', valor: v }
      else if ((prev[col] === undefined || prev[col] !== v) && (tipo === 'asigna' || tipo === 'vuelta')) celdas[col] = { modo: 'pedir', valor: v, antes: prev[col] }
      else celdas[col] = { modo: 'igual', valor: v }
    }
    const cond = tipo === 'decide' ? (/es verdadera|se cumple/.test(p.nota) && !/no se cumple/.test(p.nota) ? 'Sí' : 'No') : null
    return {
      indice: i,
      paso: p.paso,
      linea: p.linea,
      texto: p.texto,
      tipo,
      // Solo las vueltas de PARA CADA muestran el registro: es dato del caso, no una respuesta.
      contexto: tipo === 'vuelta' && /registro/.test(p.nota) ? p.nota : null,
      cond,
      celdas,
    }
  })
  const pedidas = filas.reduce((n, f) => n + Object.values(f.celdas).filter((c) => c.modo === 'pedir').length + (f.cond ? 1 : 0), 0)
  return { columnas, filas, pedidas, truncado: pasos.length > LIMITE_FILAS, total: pasos.length }
}

export const claveDeCelda = (fila, columna) => `${fila}|${columna}`
export const claveDeCondicion = (fila) => `${fila}|?`

/** ¿Lo que escribió el equipo coincide con el valor esperado? Números con tolerancia, textos sin mayúsculas. */
export function celdaCoincide(esperado, escrito) {
  const e = String(esperado ?? '').trim()
  const s = String(escrito ?? '').trim()
  if (s === '') return false
  const a = valorSimple(e)
  const b = valorSimple(s)
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 0.005
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase()
}

/** Marca cada casilla pedida como correcta o no. Devuelve { ok: {clave: bool}, todas: bool, buenas, total }. */
export function revisarTabla(tabla, respuestas) {
  const ok = {}
  for (const f of tabla.filas) {
    for (const [col, c] of Object.entries(f.celdas)) {
      if (c.modo === 'pedir') ok[claveDeCelda(f.indice, col)] = celdaCoincide(c.valor, respuestas[claveDeCelda(f.indice, col)])
    }
    if (f.cond) ok[claveDeCondicion(f.indice)] = respuestas[claveDeCondicion(f.indice)] === f.cond
  }
  const valores = Object.values(ok)
  const buenas = valores.filter(Boolean).length
  return { ok, todas: valores.length > 0 && buenas === valores.length, buenas, total: valores.length }
}

/** Respuestas correctas de toda la tabla (para «mostrar la tabla correcta»). */
export function respuestasCorrectas(tabla) {
  const r = {}
  for (const f of tabla.filas) {
    for (const [col, c] of Object.entries(f.celdas)) if (c.modo === 'pedir') r[claveDeCelda(f.indice, col)] = c.valor
    if (f.cond) r[claveDeCondicion(f.indice)] = f.cond
  }
  return r
}

/* --------------------------------- caso sugerido --------------------------------- */

function valorDeCampo(campo, n) {
  if (/precio|valor|costo|monto|tarifa/i.test(campo)) return n === 1 ? 500 : 1500
  if (/cantidad|unidades|veces|intentos/i.test(campo)) return n === 1 ? 10 : 2
  if (/nota|puntaje/i.test(campo)) return n === 1 ? 4 : 3
  if (/nombre|tipo|categor|producto|texto/i.test(campo)) return n === 1 ? 'pan' : 'torta'
  return n === 1 ? 10 : 20
}

/** Un caso pequeño para empezar, con los nombres de SU algoritmo. Hay que cambiarlo por uno real de su proyecto. */
export function sugerirCaso(programa, pseudo) {
  const campos = camposUsados(pseudo)
  const caso = {}
  for (const e of programa.entradas) {
    const tipo = e.tipo ?? ''
    let texto
    if (/lista/i.test(tipo)) {
      const cs = campos.length > 0 ? campos : ['valor']
      texto = [1, 2].map((n) => cs.map((c) => `${c}=${valorDeCampo(c, n)}`).join(', ')).join('\n')
    } else if (/texto|cadena|palabra/i.test(tipo)) texto = 'ejemplo'
    else if (/verdadero|falso|booleano|l[oó]gico/i.test(tipo)) texto = 'verdadero'
    else if (/precio|valor|costo|monto/i.test(e.nombre)) texto = '1000'
    else if (/cantidad|unidades|edad|intentos/i.test(e.nombre)) texto = '3'
    else if (/nota/i.test(e.nombre)) texto = '4'
    else texto = '10'
    caso[`caso__${e.nombre}`] = texto
  }
  return caso
}
