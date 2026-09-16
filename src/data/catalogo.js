import e1 from './estaciones/e1-proceso.js'
import e2 from './estaciones/e2-calidad.js'
import e3 from './estaciones/e3-robustez.js'
import e4 from './estaciones/e4-sociedad.js'
import e5 from './estaciones/e5-programador.js'
import e6 from './estaciones/e6-reto-final.js'

export const estaciones = [e1, e2, e3, e4, e5, e6]

export const curso = {
  nombre: 'Introducción a la Ingeniería Informática',
  corte: 'Segundo corte',
  programa: 'Institución Universitaria Colegio Mayor del Cauca · Popayán',
  docente: 'Ing. Ángela Patricia Paz Guañarita',
}

/**
 * Catálogo plano de actividades con identificadores estables.
 *
 * Es la misma lista que se siembra en la tabla `actividades` de Supabase
 * (ver scripts/generar-catalogo.mjs). Los identificadores NO se reutilizan ni
 * se renombran: si una actividad cambia de contenido pero mide lo mismo,
 * conserva su id; si mide algo distinto, se crea un id nuevo.
 *
 * Un reto de tipo `secuencia` no es una actividad: cada uno de sus pasos lo es.
 * Así el informe por concepto y el puntaje parcial salen sin casos especiales.
 */

function repartirPuntos(total, cantidad) {
  const base = Math.floor(total / cantidad)
  const sobrante = total - base * cantidad
  return Array.from({ length: cantidad }, (_, i) => base + (i < sobrante ? 1 : 0))
}

function entradasDe(estacion) {
  const filas = []
  let orden = 0

  for (const a of estacion.actividades ?? []) {
    filas.push({
      id: a.id,
      estacionId: estacion.id,
      titulo: a.titulo,
      tipo: a.tipo,
      nivel: a.nivel ?? 'base',
      puntos: a.puntos ?? 0,
      cuentaNota: (a.nivel ?? 'base') === 'base',
      conceptos: a.conceptos ?? [],
      orden: orden++,
      seccion: 'practica',
    })
  }

  const reto = estacion.reto
  if (reto) {
    if (reto.tipo === 'secuencia') {
      const reparto = repartirPuntos(reto.puntos, reto.pasos.length)
      reto.pasos.forEach((paso, i) => {
        filas.push({
          id: `${reto.id}:${paso.id}`,
          estacionId: estacion.id,
          titulo: `${reto.titulo} · paso ${i + 1}`,
          tipo: paso.tipo,
          nivel: reto.nivel ?? 'base',
          puntos: reparto[i],
          cuentaNota: (reto.nivel ?? 'base') === 'base',
          conceptos: paso.conceptos ?? reto.conceptos ?? [],
          orden: orden++,
          seccion: 'reto',
          retoId: reto.id,
        })
      })
    } else {
      filas.push({
        id: reto.id,
        estacionId: estacion.id,
        titulo: reto.titulo,
        tipo: reto.tipo,
        nivel: reto.nivel ?? 'base',
        puntos: reto.puntos ?? 0,
        cuentaNota: (reto.nivel ?? 'base') === 'base',
        conceptos: reto.conceptos ?? [],
        orden: orden++,
        seccion: 'reto',
      })
    }
  }

  if (estacion.taller) {
    filas.push({
      id: estacion.taller.id,
      estacionId: estacion.id,
      titulo: estacion.taller.titulo,
      tipo: 'taller',
      nivel: 'base',
      puntos: 0, // el taller es un entregable físico: esta app no lo califica
      cuentaNota: false,
      conceptos: [],
      orden: orden++,
      seccion: 'taller',
    })
  }

  return filas
}

/**
 * El laboratorio no es una actividad puntuable, pero necesita existir en el
 * catálogo para que su borrador tenga una fila válida en `borradores`.
 */
export const ACTIVIDAD_LABORATORIO = {
  id: 'laboratorio',
  estacionId: 'paradigmas',
  titulo: 'Laboratorio de pseudocódigo',
  tipo: 'laboratorio',
  nivel: 'base',
  puntos: 0,
  cuentaNota: false,
  conceptos: [],
  orden: 99,
  seccion: 'laboratorio',
}

export const catalogoActividades = [...estaciones.flatMap(entradasDe), ACTIVIDAD_LABORATORIO]

export const catalogoEstaciones = estaciones.map((e) => ({
  id: e.id,
  orden: e.orden,
  titulo: e.titulo,
  sesion: e.sesion,
}))

/* ------------------------------ consultas ------------------------------- */

const porId = new Map(catalogoActividades.map((a) => [a.id, a]))
export const actividadPorId = (id) => porId.get(id)

const porEstacion = new Map()
for (const a of catalogoActividades) {
  if (!porEstacion.has(a.estacionId)) porEstacion.set(a.estacionId, [])
  porEstacion.get(a.estacionId).push(a)
}
export const actividadesDe = (estacionId) => porEstacion.get(estacionId) ?? []

export const estacionPorId = (id) => estaciones.find((e) => e.id === id)

/** Puntos máximos que sí cuentan para la nota orientativa. */
export const puntosNota = catalogoActividades
  .filter((a) => a.cuentaNota)
  .reduce((s, a) => s + a.puntos, 0)

/** Puntos máximos totales, incluidos los desafíos opcionales. */
export const puntosTotales = catalogoActividades.reduce((s, a) => s + a.puntos, 0)

export function puntosDeEstacion(estacionId, { soloBase = false } = {}) {
  return actividadesDe(estacionId)
    .filter((a) => (soloBase ? a.nivel === 'base' : true))
    .reduce((s, a) => s + a.puntos, 0)
}

/** Devuelve el objeto de datos completo de una actividad (no solo su ficha). */
export function datosActividad(id) {
  for (const e of estaciones) {
    const suelta = (e.actividades ?? []).find((a) => a.id === id)
    if (suelta) return { actividad: suelta, estacion: e }
    if (e.taller?.id === id) return { actividad: e.taller, estacion: e }
    if (e.reto) {
      if (e.reto.id === id) return { actividad: e.reto, estacion: e }
      if (e.reto.tipo === 'secuencia') {
        const paso = e.reto.pasos.find((p) => `${e.reto.id}:${p.id}` === id)
        if (paso) return { actividad: paso, estacion: e, reto: e.reto }
      }
    }
  }
  return null
}

/* --------------------------- ejemplo de portada -------------------------- */

export const ejemploConsola = `Algoritmo Bienvenida
	Definir nombre Como Cadena
	Definir sesiones, i Como Entero
	Leer nombre
	Leer sesiones
	Escribir "Hola ", nombre, ", vamos por el segundo corte."
	Para i <- 1 Hasta sesiones Hacer
		Escribir "Sesión ", i + 6, " lista"
	FinPara
FinAlgoritmo`
