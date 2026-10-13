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
  RESULTADOS,
  REVISION,
  SECTORES,
  PUNTOS,
  COMPONENTES,
  REQUISITOS_DEPENDENCIAS,
} from '../data/lab-cdvs.js'
import { faseDe } from '../data/cdvs-fases.js'

const VERSION = 1

const visibles = (lista, modo) => lista.filter((x) => modo === '120' || !x.ampliada)

/* ------------------------- contenido según modalidad ---------------------- */

export const itemsRuta = (modo) => visibles(ACCIONES_RUTA, modo).map((a) => ({ ...a, zona: a.fase }))
export const itemsFlujo = (modo) => visibles(ELEMENTOS_FLUJO, modo).map((e) => ({ ...e, zona: e.etapa }))
export const itemsCalidad = (modo) => visibles(SITUACIONES_CALIDAD, modo).map((q) => ({ ...q, zona: q.caracteristica }))
export const sectoresDe = (modo) => visibles(SECTORES, modo)

export function itemsTransferencia(modo) {
  return sectoresDe(modo).flatMap((s) => [
    ...s.acciones.map((a) => ({ ...a, zona: a.fase, grupo: 'acciones', sector: s.id })),
    ...s.elementos.map((e) => ({ ...e, zona: e.etapa, grupo: 'elementos', sector: s.id })),
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
      rechazos: 0,
      revision: { elegidas: [], intentos: 0, primeroOk: null, completo: false },
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

function evaluar(items, colocadas) {
  const ok = {}
  let correctos = 0
  for (const it of items) {
    const bien = colocadas[it.id] === it.zona
    ok[it.id] = bien
    if (bien) correctos += 1
  }
  return { ok, correctos, total: items.length, completo: items.length > 0 && correctos === items.length }
}

const estaCompleta = (estado) => !!estado.revisado && estado.revisado.correctos === estado.revisado.total

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

/** Revisa un componente de clasificación. Solo cuenta si ya se colocó todo. */
export function revisar(sesion, componente) {
  const estado = sesion[componente]
  const items = itemsDe(componente, sesion.modo)
  if (estaCompleta(estado)) return sesion
  if (Object.keys(estado.colocadas).length < items.length) return sesion
  const r = evaluar(items, estado.colocadas)
  const retro = {}
  for (const it of items) retro[it.id] = r.ok[it.id] ? 'ok' : 'mal'
  return {
    ...sesion,
    [componente]: {
      ...estado,
      revisiones: estado.revisiones + 1,
      primero: estado.primero ?? r.correctos,
      revisado: { correctos: r.correctos, total: r.total },
      retro,
    },
  }
}

/* ------------------------------- dependencias ------------------------------ */

const tituloResultado = (id) => RESULTADOS.find((r) => r.id === id)?.corto ?? id

export function mensajeRechazo(desde, hacia) {
  const inverso = ENLACES.find((e) => e.desde === hacia && e.hacia === desde && e.tipo === 'avance')
  if (inverso) {
    return `El flujo natural va al revés: primero «${tituloResultado(hacia)}» y después «${tituloResultado(desde)}».`
  }
  return `Entre «${tituloResultado(desde)}» y «${tituloResultado(hacia)}» no hay una dependencia directa: antes se necesitan otros resultados.`
}

/**
 * Intenta construir una conexión. Devuelve la sesión nueva y el resultado:
 * { tipo: 'aceptada' | 'repetida' | 'sin-relacion' | 'razon-incorrecta', mensaje }
 */
export function intentarEnlace(sesion, desde, hacia, opcion) {
  if (desde === hacia) return { sesion, resultado: { tipo: 'sin-relacion', mensaje: 'Elige dos resultados distintos.', contada: false } }
  const dep = sesion.dependencias
  const enlace = ENLACES.find((e) => e.desde === desde && e.hacia === hacia)

  if (!enlace) {
    return {
      sesion: { ...sesion, dependencias: { ...dep, rechazos: dep.rechazos + 1 } },
      resultado: { tipo: 'sin-relacion', mensaje: mensajeRechazo(desde, hacia), contada: true },
    }
  }
  if (dep.enlaces.some((e) => e.id === enlace.id)) {
    return { sesion, resultado: { tipo: 'repetida', mensaje: 'Esa conexión ya está construida.', contada: false } }
  }
  if (opcion !== enlace.correcta) {
    return {
      sesion: { ...sesion, dependencias: { ...dep, rechazos: dep.rechazos + 1 } },
      resultado: {
        tipo: 'razon-incorrecta',
        mensaje: 'La conexión tiene sentido, pero la razón que elegiste no la explica. Piensa qué aporta el primer resultado al segundo.',
        contada: true,
      },
    }
  }
  return {
    sesion: { ...sesion, dependencias: { ...dep, enlaces: [...dep.enlaces, { id: enlace.id, desde, hacia, tipo: enlace.tipo }] } },
    resultado: { tipo: 'aceptada', mensaje: enlace.porque, contada: true },
  }
}

/** Revisión de decisiones (solo modalidad de 120 minutos). */
export function revisarDecision(sesion, elegidas) {
  const dep = sesion.dependencias
  if (dep.revision.completo) return { sesion, ok: true }
  const a = [...elegidas].sort().join(',')
  const b = [...REVISION.correctas].sort().join(',')
  const ok = a === b
  return {
    ok,
    sesion: {
      ...sesion,
      dependencias: {
        ...dep,
        revision: {
          elegidas: [...elegidas],
          intentos: dep.revision.intentos + 1,
          primeroOk: dep.revision.primeroOk ?? ok,
          completo: ok,
        },
      },
    },
  }
}

export function estadoDependencias(sesion) {
  const dep = sesion.dependencias
  const req = REQUISITOS_DEPENDENCIAS[sesion.modo]
  const aceptadas = new Set(dep.enlaces.map((e) => e.id))
  const avances = req.avance.filter((id) => aceptadas.has(id)).length
  const revisionesHechas = ENLACES.filter((e) => e.tipo === 'revision' && aceptadas.has(e.id)).length
  const revisiones = Math.min(req.revisiones, revisionesHechas)
  const total = req.avance.length + req.revisiones
  const correctos = avances + revisiones
  const decision = sesion.modo === '120'
  const completo = correctos === total && (!decision || dep.revision.completo)
  return { avances, revisiones, correctos, total, decision, completo, necesariasAvance: req.avance.length, necesariasRevision: req.revisiones }
}

/* -------------------------------- resultados ------------------------------- */

const redondear = (n) => Math.round(n * 10) / 10

function resultadoClasificacion(sesion, id) {
  const max = PUNTOS[id]
  const e = sesion[id]
  const total = itemsDe(id, sesion.modo).length
  const ratio = e.revisado ? e.revisado.correctos / e.revisado.total : 0
  const completo = estaCompleta(e)
  const precision = e.primero !== null ? e.primero / total : 0
  return {
    id,
    max,
    puntos: redondear(max * ratio),
    competitivo: redondear(max * (completo ? 0.5 : 0) + max * 0.5 * precision),
    completo,
    intentos: e.revisiones,
    avance: ratio,
  }
}

function resultadoDependencias(sesion) {
  const max = PUNTOS.dependencias
  const est = estadoDependencias(sesion)
  const dep = sesion.dependencias
  const parteEnlaces = est.decision ? 20 : 25
  const parteDecision = est.decision ? 5 : 0
  const puntos = parteEnlaces * (est.correctos / est.total) + (est.decision && dep.revision.completo ? parteDecision : 0)
  // Precisión: conexiones aceptadas sobre el total de conexiones intentadas;
  // en la modalidad ampliada, la revisión de decisiones cuenta como un intento
  // más y solo suma si salió bien al primer intento.
  const intentosEnlace = dep.enlaces.length + dep.rechazos
  const denominador = intentosEnlace + (est.decision ? 1 : 0)
  const aciertos = dep.enlaces.length + (est.decision && dep.revision.primeroOk ? 1 : 0)
  const precision = denominador > 0 ? aciertos / denominador : 0
  return {
    id: 'dependencias',
    max,
    puntos: redondear(puntos),
    competitivo: redondear(max * (est.completo ? 0.5 : 0) + max * 0.5 * Math.min(1, precision)),
    completo: est.completo,
    intentos: intentosEnlace + dep.revision.intentos,
    avance: est.total === 0 ? 0 : est.correctos / est.total,
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
