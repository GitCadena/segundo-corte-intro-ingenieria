import { supabase, hayConfiguracion } from './supabase.js'
import { calcularPuntaje, calcularEstado, mejorEstado } from './puntaje.js'
import { catalogoActividades } from '../data/catalogo.js'

/**
 * Capa de persistencia.
 *
 * Dos implementaciones con la misma interfaz:
 *   - almacenSupabase: la fuente de verdad del curso.
 *   - almacenDemo: modo demostración, en este navegador, siempre rotulado.
 *
 * Ninguna de las dos confirma una escritura que falló: registrarIntento()
 * devuelve { ok:false } y la interfaz muestra "Pendiente de sincronización".
 */

const CLAVE_DEMO = 'segundo-corte-demo-v2'
const CLAVE_COLA = 'segundo-corte-cola-v1'
const CLAVE_BORRADORES = 'segundo-corte-borradores-v1'

/* ------------------------------- utilidades ------------------------------- */

function leerLocal(clave, porDefecto) {
  try {
    const crudo = window.localStorage.getItem(clave)
    return crudo ? JSON.parse(crudo) : porDefecto
  } catch {
    return porDefecto
  }
}

function escribirLocal(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

/** Identificador estable por envío: evita que el doble clic cuente dos veces. */
export function nuevoClienteId(actividadId) {
  const aleatorio =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${actividadId}:${aleatorio}`
}

function puntosMaxDe(actividadId) {
  return catalogoActividades.find((a) => a.id === actividadId)?.puntos ?? 0
}

/** Aplica un intento sobre el mapa de mejores resultados (mismo criterio que el SQL). */
function fusionar(mejores, intento) {
  const puntosMax = puntosMaxDe(intento.actividad_id)
  const puntaje = calcularPuntaje({
    puntosMax,
    correcto: intento.correcto,
    pistas: intento.pistas,
    intentosFallidos: intento.intentos_fallidos,
    solucionVista: intento.solucion_vista,
  })
  const estado = calcularEstado({
    correcto: intento.correcto,
    pistas: intento.pistas,
    intentosFallidos: intento.intentos_fallidos,
    solucionVista: intento.solucion_vista,
  })
  const previo = mejores[intento.actividad_id]
  mejores[intento.actividad_id] = {
    actividad_id: intento.actividad_id,
    mejor_puntaje: Math.max(previo?.mejor_puntaje ?? 0, puntaje),
    estado: mejorEstado(previo?.estado, estado),
    pistas_minimas:
      estado === 'intentada'
        ? previo?.pistas_minimas ?? intento.pistas
        : Math.min(previo?.pistas_minimas ?? Infinity, intento.pistas),
    intentos_totales: (previo?.intentos_totales ?? 0) + 1,
    actualizado_en: new Date().toISOString(),
  }
  return mejores[intento.actividad_id]
}

/* ------------------------------ modo demostración ------------------------- */

export const almacenDemo = {
  modo: 'demo',

  async cargarProgreso() {
    const datos = leerLocal(CLAVE_DEMO, { mejores: {}, intentos: [] })
    return { ok: true, mejores: Object.values(datos.mejores), intentos: datos.intentos.slice(-200) }
  },

  async registrarIntento(evidencia) {
    const datos = leerLocal(CLAVE_DEMO, { mejores: {}, intentos: [] })
    const yaEsta = datos.intentos.some((i) => i.cliente_id === evidencia.cliente_id)
    if (yaEsta) {
      return { ok: true, duplicado: true, mejor: datos.mejores[evidencia.actividad_id] ?? null }
    }
    datos.intentos.push({ ...evidencia, creado_en: new Date().toISOString() })
    const mejor = fusionar(datos.mejores, evidencia)
    const escrito = escribirLocal(CLAVE_DEMO, datos)
    if (!escrito) return { ok: false, error: 'El navegador bloqueó el almacenamiento local.' }
    return { ok: true, mejor }
  },

  async guardarBorrador(actividadId, contenido) {
    const b = leerLocal(CLAVE_BORRADORES, {})
    b[actividadId] = { contenido, actualizado_en: new Date().toISOString() }
    return { ok: escribirLocal(CLAVE_BORRADORES, b) }
  },

  async cargarBorradores() {
    return { ok: true, borradores: leerLocal(CLAVE_BORRADORES, {}) }
  },

  async guardarLogros(ids) {
    const datos = leerLocal(CLAVE_DEMO, { mejores: {}, intentos: [], logros: [] })
    datos.logros = Array.from(new Set([...(datos.logros || []), ...ids]))
    escribirLocal(CLAVE_DEMO, datos)
    return { ok: true }
  },

  async cargarLogros() {
    return { ok: true, logros: leerLocal(CLAVE_DEMO, { logros: [] }).logros || [] }
  },

  async reiniciar() {
    try {
      window.localStorage.removeItem(CLAVE_DEMO)
      window.localStorage.removeItem(CLAVE_BORRADORES)
      return { ok: true }
    } catch {
      return { ok: false }
    }
  },
}

/* --------------------------------- Supabase ------------------------------- */

export const almacenSupabase = {
  modo: 'supabase',

  async cargarProgreso() {
    if (!supabase) return { ok: false, error: 'Sin configuración de Supabase.' }
    const [mejores, intentos] = await Promise.all([
      supabase.from('mejores').select('*'),
      supabase
        .from('intentos')
        .select('actividad_id, correcto, puntaje, pistas_usadas, intentos_fallidos, creado_en')
        .order('creado_en', { ascending: false })
        .limit(200),
    ])
    if (mejores.error) return { ok: false, error: mejores.error.message }
    return {
      ok: true,
      mejores: mejores.data ?? [],
      intentos: intentos.data ?? [],
    }
  },

  async registrarIntento(evidencia) {
    if (!supabase) return { ok: false, error: 'Sin configuración de Supabase.' }
    const { data, error } = await supabase.rpc('registrar_intento', {
      p_actividad_id: evidencia.actividad_id,
      p_correcto: evidencia.correcto,
      p_pistas: evidencia.pistas,
      p_intentos_fallidos: evidencia.intentos_fallidos,
      p_solucion_vista: evidencia.solucion_vista,
      p_datos: evidencia.datos ?? {},
      p_cliente_id: evidencia.cliente_id,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true, mejor: data }
  },

  async guardarBorrador(actividadId, contenido) {
    if (!supabase) return { ok: false }
    const { data: sesion } = await supabase.auth.getUser()
    if (!sesion?.user) return { ok: false, error: 'Sin sesión.' }
    const { error } = await supabase.from('borradores').upsert(
      {
        perfil_id: sesion.user.id,
        actividad_id: actividadId,
        contenido,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: 'perfil_id,actividad_id' },
    )
    return { ok: !error, error: error?.message }
  },

  async cargarBorradores() {
    if (!supabase) return { ok: false, borradores: {} }
    const { data, error } = await supabase.from('borradores').select('actividad_id, contenido, actualizado_en')
    if (error) return { ok: false, borradores: {}, error: error.message }
    const mapa = {}
    for (const b of data ?? []) mapa[b.actividad_id] = { contenido: b.contenido, actualizado_en: b.actualizado_en }
    return { ok: true, borradores: mapa }
  },

  async guardarLogros(ids) {
    if (!supabase || ids.length === 0) return { ok: true }
    const { data: sesion } = await supabase.auth.getUser()
    if (!sesion?.user) return { ok: false }
    const filas = ids.map((logro_id) => ({ perfil_id: sesion.user.id, logro_id }))
    const { error } = await supabase.from('logros_obtenidos').upsert(filas, { onConflict: 'perfil_id,logro_id' })
    return { ok: !error, error: error?.message }
  },

  async cargarLogros() {
    if (!supabase) return { ok: true, logros: [] }
    const { data, error } = await supabase.from('logros_obtenidos').select('logro_id')
    if (error) return { ok: false, logros: [], error: error.message }
    return { ok: true, logros: (data ?? []).map((l) => l.logro_id) }
  },
}

/* --------------------------- cola de pendientes --------------------------- */
/*
 * Si una escritura falla (sin red, servidor caído), la evidencia se guarda en
 * una cola local y se reintenta. Nunca se le dice al estudiante "Guardado"
 * mientras la cola tenga elementos suyos: la interfaz muestra "Pendiente de
 * sincronización" y el número de envíos en espera.
 */

export function leerCola() {
  return leerLocal(CLAVE_COLA, [])
}

export function encolar(evidencia) {
  const cola = leerCola()
  if (cola.some((e) => e.cliente_id === evidencia.cliente_id)) return cola.length
  cola.push(evidencia)
  escribirLocal(CLAVE_COLA, cola)
  return cola.length
}

export function quitarDeCola(clienteId) {
  const cola = leerCola().filter((e) => e.cliente_id !== clienteId)
  escribirLocal(CLAVE_COLA, cola)
  return cola.length
}

export function vaciarCola() {
  escribirLocal(CLAVE_COLA, [])
}

/** Reintenta la cola completa contra el almacén indicado. Devuelve cuántas quedaron. */
export async function drenarCola(almacen) {
  const cola = leerCola()
  for (const evidencia of cola) {
    const r = await almacen.registrarIntento(evidencia)
    if (r.ok) quitarDeCola(evidencia.cliente_id)
    else break // si falla una, probablemente fallan todas: no insistir
  }
  return leerCola().length
}

export function elegirAlmacen() {
  return hayConfiguracion ? almacenSupabase : almacenDemo
}
