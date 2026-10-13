/**
 * Lógica del «Laboratorio de ingeniería: del problema al sistema».
 *
 * Todo es determinista y explicable: ninguna respuesta la decide una IA.
 * Cada función recibe el estado de la sesión y devuelve uno nuevo (sin mutar),
 * así se prueba en Node y la interfaz solo dibuja.
 *
 * Dos puntuaciones separadas:
 *  - Académica (0 a 100): cuánto del proyecto quedó bien al final. Corregir
 *    todo lo necesario permite el máximo; la velocidad no la reduce.
 *  - Competitiva (0 a 100): por cada componente, la mitad por completarlo y la
 *    otra mitad por la precisión del primer intento. El tiempo solo desempata.
 */

import {
  ACCIONES_RUTA,
  ELEMENTOS_FLUJO,
  SITUACIONES_CALIDAD,
  ENLACES,
  ETAPAS_FLUJO,
  ALTERNAS_CALIDAD,
  RESULTADOS,
  REVISION,
  SECTORES,
  PUNTOS,
  COMPONENTES,
  REQUISITOS_DEPENDENCIAS,
} from '../data/lab-cdvs.js'
import { FASES, faseDe } from '../data/cdvs-fases.js'

const VERSION = 1

const visibles = (lista, modo) => lista.filter((x) => modo === '120' || !x.ampliada)

/* ------------------------- contenido según modalidad ---------------------- */

const vecinas = (orden, id) => {
  const i = orden.indexOf(id)
  return [orden[i - 1], orden[i + 1]].filter(Boolean)
}
const ORDEN_FASES = FASES.map((f) => f.id)
const ORDEN_ETAPAS = ETAPAS_FLUJO.map((e) => e.id)

// Una ubicación «defendible» es la de la fase o etapa vecina: el ciclo se solapa.
export const itemsRuta = (modo) => visibles(ACCIONES_RUTA, modo).map((a) => ({ ...a, zona: a.fase, alt: vecinas(ORDEN_FASES, a.fase) }))
export const itemsFlujo = (modo) => visibles(ELEMENTOS_FLUJO, modo).map((e) => ({ ...e, zona: e.etapa, alt: vecinas(ORDEN_ETAPAS, e.etapa) }))
export const itemsCalidad = (modo) =>
  visibles(SITUACIONES_CALIDAD, modo).map((q) => ({ ...q, zona: q.caracteristica, alt: ALTERNAS_CALIDAD[q.caracteristica] ?? [] }))
export const sectoresDe = (modo) => visibles(SECTORES, modo)

export function itemsTransferencia(modo) {
  return sectoresDe(modo).flatMap((s) => [
    ...s.acciones.map((a) => ({ ...a, zona: a.fase, alt: vecinas(ORDEN_FASES, a.fase), grupo: 'acciones', sector: s.id })),
    ...s.elementos.map((e) => ({ ...e, zona: e.etapa, alt: vecinas(ORDEN_ETAPAS, e.etapa), grupo: 'elementos', sector: s.id })),
  ])
}

export const itemsDe = (componente, modo) =>
  ({ ruta: itemsRuta, flujo: itemsFlujo, calidad: itemsCalidad, transferencia: itemsTransferencia })[componente](modo)

/* --------------------------------- registro -------------------------------- */

export function validarRegistro({ alias, integrantes }) {
  const errores = { alias: null, integrantes: [] }
  const a = (alias ?? '').trim()
  if (a.length < 3) errores.alias = 'El nombre del equipo necesita al menos 3 caracteres.'
  else if (a.length > 24) errores.alias = 'El nombre del equipo admite hasta 24 caracteres.'

  const vistos = new Set()
  integrantes.forEach((n, i) => {
    const nombre = (n ?? '').trim().replace(/\s+/g, ' ')
    const opcional = i === 3
    if (nombre === '') {
      errores.integrantes[i] = opcional ? null : 'Escribe el nombre completo.'
      return
    }
    const palabras = nombre.split(' ').filter((p) => p.length >= 2)
    if (palabras.length < 2) {
      errores.integrantes[i] = 'Escribe nombre y apellido.'
      return
    }
    const clave = nombre.toLowerCase()
    if (vistos.has(clave)) {
      errores.integrantes[i] = 'Este nombre ya está en el equipo.'
      return
    }
    vistos.add(clave)
    errores.integrantes[i] = null
  })
  const ok = !errores.alias && errores.integrantes.every((e) => !e)
  return { ok, errores }
}

const clasificacionVacia = () => ({ colocadas: {}, revisiones: 0, primero: null, revisado: null, retro: {} })

export function crearSesion({ alias, integrantes, modo, id, ahora = new Date() }) {
  return {
    version: VERSION,
    id,
    alias: alias.trim(),
    integrantes: integrantes.map((n) => n.trim().replace(/\s+/g, ' ')).filter(Boolean),
    modo,
    inicio: ahora.toISOString(),
    fin: null,
    ejemploHecho: false,
    ruta: clasificacionVacia(),
    flujo: clasificacionVacia(),
    calidad: clasificacionVacia(),
    dependencias: {
      enlaces: [],
      revision: { elegidas: [], intentos: 0, primeroOk: null, credito: 0, completo: false },
    },
    transferencia: clasificacionVacia(),
  }
}

/** Valida lo que se lee del almacenamiento: si no es de esta versión, no se usa. */
export function normalizarSesion(obj) {
  if (!obj || obj.version !== VERSION || !obj.id || !obj.modo) return null
  const base = crearSesion({ alias: obj.alias ?? 'Equipo', integrantes: obj.integrantes ?? [], modo: obj.modo, id: obj.id, ahora: new Date(obj.inicio ?? Date.now()) })
  return {
    ...base,
    ...obj,
    dependencias: { ...base.dependencias, ...obj.dependencias, revision: { ...base.dependencias.revision, ...(obj.dependencias?.revision ?? {}) } },
  }
}

/* ---------------------------- clasificaciones ----------------------------- */

// Criterio propio: no hay una única respuesta. La ubicación habitual vale 1; una
// defendible (fase o función vecina, o característica cercana) vale 0,7; cualquier
// otra lectura vale 0,4. Nada se marca como «mal».
const CREDITO = { ok: 1, alt: 0.7, otra: 0.4 }

function evaluar(items, colocadas) {
  const retro = {}
  let credito = 0
  let exactos = 0
  for (const it of items) {
    const z = colocadas[it.id]
    const nivel = z === it.zona ? 'ok' : (it.alt ?? []).includes(z) ? 'alt' : 'otra'
    retro[it.id] = nivel
    credito += CREDITO[nivel]
    if (nivel === 'ok') exactos += 1
  }
  return { retro, credito, exactos, total: items.length }
}

const estaCompleta = (estado) => !!estado.revisado

/** Coloca (o cambia de zona) una pieza. Un componente completo queda cerrado. */
export function colocar(sesion, componente, itemId, zona) {
  const estado = sesion[componente]
  if (estaCompleta(estado)) return sesion
  const retro = { ...estado.retro }
  delete retro[itemId]
  return { ...sesion, [componente]: { ...estado, colocadas: { ...estado.colocadas, [itemId]: zona }, retro } }
}

export function devolver(sesion, componente, itemId) {
  const estado = sesion[componente]
  if (estaCompleta(estado)) return sesion
  const colocadas = { ...estado.colocadas }
  delete colocadas[itemId]
  const retro = { ...estado.retro }
  delete retro[itemId]
  return { ...sesion, [componente]: { ...estado, colocadas, retro } }
}

/** Cierra un componente de clasificación con comentarios. Solo si ya se colocó todo. */
export function revisar(sesion, componente) {
  const estado = sesion[componente]
  const items = itemsDe(componente, sesion.modo)
  if (estaCompleta(estado)) return sesion
  if (Object.keys(estado.colocadas).length < items.length) return sesion
  const r = evaluar(items, estado.colocadas)
  return {
    ...sesion,
    [componente]: {
      ...estado,
      revisiones: estado.revisiones + 1,
      primero: r.exactos,
      revisado: { correctos: r.credito, exactos: r.exactos, total: r.total },
      retro: r.retro,
    },
  }
}

/* ------------------------------- dependencias ------------------------------ */

const posResultado = (id) => RESULTADOS.findIndex((r) => r.id === id)

/**
 * Registra una conexión elegida por el equipo. Cualquier par distinto es válido:
 * si coincide con una dependencia habitual del ciclo se elige la razón entre
 * opciones (cualquiera se acepta); si no, el equipo escribe su propia razón.
 * Devuelve { sesion, resultado: { tipo: 'aceptada' | 'repetida' | 'falta', mensaje } }.
 */
export function intentarEnlace(sesion, desde, hacia, opcion, razon = '') {
  if (!desde || !hacia || desde === hacia) return { sesion, resultado: { tipo: 'falta', mensaje: 'Elige dos resultados distintos.' } }
  const dep = sesion.dependencias
  const id = `${desde}>${hacia}`
  if (dep.enlaces.some((e) => e.id === id)) return { sesion, resultado: { tipo: 'repetida', mensaje: 'Esa conexión ya está construida.' } }

  const habitual = ENLACES.find((e) => e.desde === desde && e.hacia === hacia)
  const tipo = posResultado(hacia) < posResultado(desde) ? 'revision' : 'avance'
  let credito
  let mensaje
  let texto = ''
  if (habitual) {
    if (opcion === null || opcion === undefined) return { sesion, resultado: { tipo: 'falta', mensaje: 'Elige la razón que más se acerque a lo que piensan.' } }
    credito = opcion === habitual.correcta ? 1 : 0.8
    mensaje = credito === 1 ? habitual.porque : `Es otra forma de verlo. Lo más habitual: ${habitual.porque}`
    texto = habitual.opciones[opcion] ?? ''
  } else {
    texto = (razon ?? '').trim()
    if (texto.length < 8) return { sesion, resultado: { tipo: 'falta', mensaje: 'Escriban en una frase por qué creen que existe esa conexión.' } }
    credito = 0.6
    mensaje = 'Conexión propia anotada. No es la más habitual del ciclo, pero con su razón puede tener sentido: coméntenla con el docente.'
  }
  return {
    sesion: { ...sesion, dependencias: { ...dep, enlaces: [...dep.enlaces, { id, desde, hacia, tipo, credito, razon: texto }] } },
    resultado: { tipo: 'aceptada', mensaje },
  }
}

export function quitarEnlace(sesion, id) {
  const dep = sesion.dependencias
  return { ...sesion, dependencias: { ...dep, enlaces: dep.enlaces.filter((e) => e.id !== id) } }
}

/** Revisión de decisiones (solo modalidad de 120 minutos): se acepta cualquier selección. */
export function revisarDecision(sesion, elegidas) {
  const dep = sesion.dependencias
  if (dep.revision.completo) return { sesion, ok: true }
  const buenas = REVISION.correctas
  const comunes = elegidas.filter((x) => buenas.includes(x)).length
  const union = new Set([...elegidas, ...buenas]).size
  const credito = union === 0 ? 0 : comunes / union
  return {
    ok: true,
    sesion: {
      ...sesion,
      dependencias: {
        ...dep,
        revision: { elegidas: [...elegidas], intentos: dep.revision.intentos + 1, primeroOk: credito === 1, credito, completo: true },
      },
    },
  }
}

export function estadoDependencias(sesion) {
  const dep = sesion.dependencias
  const req = REQUISITOS_DEPENDENCIAS[sesion.modo]
  const total = req.avance.length
  const hechas = dep.enlaces.length
  const atras = dep.enlaces.filter((e) => e.tipo === 'revision').length
  const decision = sesion.modo === '120'
  const completo = hechas >= total && atras >= req.revisiones && (!decision || dep.revision.completo)
  return { hechas, total, atras, necesariasAtras: req.revisiones, decision, completo }
}

/* -------------------------------- resultados ------------------------------- */

const redondear = (n) => Math.round(n * 10) / 10
// Nadie baja de 80: lo construido con criterio ya es un buen trabajo; el resto sube hasta 100.
const piso = (max, ratio) => redondear(max * (0.8 + 0.2 * Math.max(0, Math.min(1, ratio))))

function resultadoClasificacion(sesion, id) {
  const max = PUNTOS[id]
  const e = sesion[id]
  const total = itemsDe(id, sesion.modo).length
  const completo = estaCompleta(e)
  const ratio = completo ? e.revisado.correctos / e.revisado.total : 0
  const exactos = completo ? (e.revisado.exactos ?? e.revisado.correctos) / total : 0
  return {
    id,
    max,
    puntos: completo ? piso(max, ratio) : 0,
    competitivo: completo ? piso(max, exactos) : 0,
    completo,
    intentos: e.revisiones,
    avance: completo ? 1 : 0,
  }
}

function resultadoDependencias(sesion) {
  const max = PUNTOS.dependencias
  const est = estadoDependencias(sesion)
  const dep = sesion.dependencias
  const credito = dep.enlaces.reduce((acc, e) => acc + (e.credito ?? 1), 0)
  const exactos = dep.enlaces.filter((e) => (e.credito ?? 1) === 1).length
  const decisionRatio = est.decision ? dep.revision.credito ?? 0 : 0
  const mezcla = (parte) => (est.decision ? 0.8 * parte + 0.2 * decisionRatio : parte)
  const ratio = mezcla(Math.min(1, credito / est.total))
  const ratioExacto = mezcla(Math.min(1, exactos / est.total))
  return {
    id: 'dependencias',
    max,
    puntos: est.completo ? piso(max, ratio) : 0,
    competitivo: est.completo ? piso(max, ratioExacto) : 0,
    completo: est.completo,
    intentos: dep.enlaces.length + dep.revision.intentos,
    avance: est.completo ? 1 : Math.min(1, est.hechas / est.total),
  }
}

export function resultadosPorComponente(sesion) {
  return COMPONENTES.map((c) => (c.id === 'dependencias' ? resultadoDependencias(sesion) : resultadoClasificacion(sesion, c.id)))
}

export function resumenSesion(sesion, ahora = new Date()) {
  const comps = resultadosPorComponente(sesion)
  const academico = redondear(comps.reduce((s, c) => s + c.puntos, 0))
  const competitivo = redondear(comps.reduce((s, c) => s + c.competitivo, 0))
  const completos = comps.filter((c) => c.completo).length
  const intentos = comps.reduce((s, c) => s + c.intentos, 0)
  const fin = sesion.fin ? new Date(sesion.fin) : null
  const segundos = Math.max(0, Math.round(((fin ?? ahora) - new Date(sesion.inicio)) / 1000))
  return {
    id: sesion.id,
    alias: sesion.alias,
    integrantes: sesion.integrantes,
    modo: sesion.modo,
    inicio: sesion.inicio,
    fin: sesion.fin,
    segundos,
    componentes: comps,
    completos,
    totalComponentes: comps.length,
    terminada: completos === comps.length,
    academico,
    competitivo,
    intentos,
  }
}

/** Orden para la clasificación del docente: precisión y componentes; el tiempo solo desempata. */
export function compararCompetitivo(a, b) {
  return (
    b.competitivo - a.competitivo ||
    b.completos - a.completos ||
    (a.terminada && b.terminada ? a.segundos - b.segundos : 0) ||
    a.alias.localeCompare(b.alias, 'es')
  )
}

export function formatearDuracion(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Recorrido de repaso para la pantalla final: qué fase quedó con qué acciones. */
export function repasoPorFase(sesion) {
  return itemsRuta(sesion.modo).reduce((acc, a) => {
    if (!acc[a.fase]) acc[a.fase] = { fase: faseDe(a.fase), acciones: [] }
    acc[a.fase].acciones.push(a)
    return acc
  }, {})
}

/* ------------------------------ consultas útiles --------------------------- */

/** ¿Está completo un componente? (revisado y todo correcto; en dependencias, todas las conexiones). */
export function componenteCompleto(sesion, id) {
  if (id === 'dependencias') return estadoDependencias(sesion).completo
  return estaCompleta(sesion[id])
}

export function colocadasDe(sesion, id) {
  return Object.keys(sesion[id].colocadas).length
}

export function componentesCompletos(sesion) {
  return COMPONENTES.filter((c) => componenteCompleto(sesion, c.id)).length
}

/** Marca la sesión como terminada una sola vez. */
export function finalizar(sesion, ahora = new Date()) {
  if (sesion.fin || componentesCompletos(sesion) !== COMPONENTES.length) return sesion
  return { ...sesion, fin: ahora.toISOString() }
}

export function actualizarIntegrantes(sesion, alias, integrantes) {
  return {
    ...sesion,
    alias: alias.trim(),
    integrantes: integrantes.map((n) => n.trim().replace(/\s+/g, ' ')).filter(Boolean),
  }
}
