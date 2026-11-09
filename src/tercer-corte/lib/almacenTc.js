/**
 * Acceso a datos del tercer corte.
 *
 * Con Supabase configurado usa las funciones tercer_corte_* de la migración
 * 20261109000000_tercer_corte.sql. Sin configuración (modo demostración) guarda
 * todo en el navegador, con la misma interfaz, para poder probar la interfaz
 * sin tocar datos reales.
 */
import { supabase, hayConfiguracion } from '../../lib/supabase.js'

const mensajeDe = (error) => {
  const m = String(error?.message ?? error ?? 'Ocurrió un error.')
  // Los mensajes que escribimos en las funciones ya son claros para el estudiante.
  return m.replace(/^.*?Error:\s*/, '')
}

function lanzar(error) {
  if (error) throw new Error(mensajeDe(error))
}

/* ------------------------------- Supabase -------------------------------- */

const remoto = {
  async miEquipo() {
    const { data, error } = await supabase.rpc('tercer_corte_mi_equipo')
    lanzar(error)
    return data ?? null
  },
  async crearEquipo(nombre) {
    const { data, error } = await supabase.rpc('tercer_corte_crear_equipo', { p_nombre: nombre })
    lanzar(error)
    return data
  },
  async unirse(codigo) {
    const { data, error } = await supabase.rpc('tercer_corte_unirse', { p_codigo: codigo })
    lanzar(error)
    return data
  },
  async obtenerFicha(equipoId, ficha) {
    const { data, error } = await supabase.rpc('tercer_corte_ficha', { p_equipo: equipoId, p_ficha: ficha })
    lanzar(error)
    return data
  },
  async guardar(equipoId, ficha, campos) {
    const { data, error } = await supabase.rpc('tercer_corte_guardar', { p_equipo: equipoId, p_ficha: ficha, p_campos: campos })
    lanzar(error)
    return data
  },
  async entregar(equipoId, ficha) {
    const { error } = await supabase.rpc('tercer_corte_entregar', { p_equipo: equipoId, p_ficha: ficha })
    lanzar(error)
  },
  async reabrir(equipoId, ficha) {
    const { error } = await supabase.rpc('tercer_corte_reabrir', { p_equipo: equipoId, p_ficha: ficha })
    lanzar(error)
  },
  async listado() {
    const { data, error } = await supabase.rpc('tercer_corte_listado')
    lanzar(error)
    return data ?? []
  },
  async comentar(equipoId, ficha, seccion, texto, autorId) {
    const { error } = await supabase
      .from('tercer_corte_comentarios')
      .insert({ equipo_id: equipoId, ficha, seccion, texto, autor_id: autorId })
    lanzar(error)
  },
}

/* ----------------------------- modo demostración ------------------------- */

const CLAVE = 'segundo-corte-tercer-corte-demo-v1'

function leer() {
  try {
    return JSON.parse(window.localStorage.getItem(CLAVE)) ?? { equipos: [], miembros: [], fichas: [], comentarios: [] }
  } catch {
    return { equipos: [], miembros: [], fichas: [], comentarios: [] }
  }
}
function escribir(bd) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(bd))
  } catch {
    /* sin almacenamiento local */
  }
}

let yo = { id: 'demo', nombres: 'Estudiante', apellidos: 'Demo' }
export function fijarUsuarioDemo(perfil) {
  if (perfil) yo = { id: perfil.id ?? 'demo', nombres: perfil.nombres ?? 'Estudiante', apellidos: perfil.apellidos ?? 'Demo' }
}

const local = {
  async miEquipo() {
    const bd = leer()
    const m = bd.miembros.find((x) => x.perfil_id === yo.id)
    if (!m) return null
    const e = bd.equipos.find((x) => x.id === m.equipo_id)
    return {
      id: e.id,
      nombre: e.nombre,
      codigo: e.codigo,
      miembros: bd.miembros
        .filter((x) => x.equipo_id === e.id)
        .map((x) => ({ perfil_id: x.perfil_id, nombres: x.nombres, apellidos: x.apellidos })),
      fichas: bd.fichas
        .filter((f) => f.equipo_id === e.id)
        .map((f) => ({ ficha: f.ficha, estado: f.estado, actualizado_en: f.actualizado_en })),
    }
  },
  async crearEquipo(nombre) {
    const bd = leer()
    if (bd.miembros.some((x) => x.perfil_id === yo.id)) throw new Error('Ya perteneces a un equipo.')
    if (String(nombre ?? '').trim().length < 3) throw new Error('El nombre del proyecto necesita al menos 3 caracteres.')
    const id = `eq-${Date.now()}`
    const codigo = Math.random().toString(36).slice(2, 8).toUpperCase()
    bd.equipos.push({ id, nombre: nombre.trim(), codigo, creado_por: yo.id })
    bd.miembros.push({ equipo_id: id, perfil_id: yo.id, nombres: yo.nombres, apellidos: yo.apellidos })
    escribir(bd)
    return id
  },
  async unirse(codigo) {
    const bd = leer()
    if (bd.miembros.some((x) => x.perfil_id === yo.id)) throw new Error('Ya perteneces a un equipo.')
    const e = bd.equipos.find((x) => x.codigo === String(codigo ?? '').trim().toUpperCase())
    if (!e) throw new Error('No existe un equipo con ese código.')
    if (bd.miembros.filter((x) => x.equipo_id === e.id).length >= 4) throw new Error('El equipo ya tiene 4 integrantes.')
    bd.miembros.push({ equipo_id: e.id, perfil_id: yo.id, nombres: yo.nombres, apellidos: yo.apellidos })
    escribir(bd)
    return e.id
  },
  async obtenerFicha(equipoId, ficha) {
    const bd = leer()
    const f = bd.fichas.find((x) => x.equipo_id === equipoId && x.ficha === ficha)
    return {
      ficha,
      contenido: f?.contenido ?? {},
      estado: f?.estado ?? 'en_progreso',
      entregada_en: f?.entregada_en ?? null,
      actualizado_en: f?.actualizado_en ?? null,
      actualizado_por: f?.actualizado_por ?? null,
      comentarios: bd.comentarios.filter((c) => c.equipo_id === equipoId && c.ficha === ficha),
    }
  },
  async guardar(equipoId, ficha, campos) {
    const bd = leer()
    let f = bd.fichas.find((x) => x.equipo_id === equipoId && x.ficha === ficha)
    if (f?.estado === 'entregada') throw new Error('La ficha ya fue entregada: el docente debe reabrirla para editarla.')
    if (!f) {
      f = { equipo_id: equipoId, ficha, contenido: {}, estado: 'en_progreso' }
      bd.fichas.push(f)
    }
    f.contenido = { ...f.contenido, ...campos }
    f.actualizado_en = new Date().toISOString()
    f.actualizado_por = `${yo.nombres} ${yo.apellidos}`
    escribir(bd)
    return f.actualizado_en
  },
  async entregar(equipoId, ficha) {
    const bd = leer()
    const f = bd.fichas.find((x) => x.equipo_id === equipoId && x.ficha === ficha && x.estado === 'en_progreso')
    if (!f) throw new Error('No hay una ficha en progreso para entregar.')
    f.estado = 'entregada'
    f.entregada_en = new Date().toISOString()
    escribir(bd)
  },
  async reabrir(equipoId, ficha) {
    const bd = leer()
    const f = bd.fichas.find((x) => x.equipo_id === equipoId && x.ficha === ficha)
    if (f) {
      f.estado = 'en_progreso'
      f.entregada_en = null
      escribir(bd)
    }
  },
  async listado() {
    const bd = leer()
    return bd.equipos.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      codigo: e.codigo,
      miembros: bd.miembros
        .filter((m) => m.equipo_id === e.id)
        .map((m) => ({ nombres: m.nombres, apellidos: m.apellidos, grupo: 'Demostración' })),
      fichas: bd.fichas
        .filter((f) => f.equipo_id === e.id)
        .map((f) => ({ ficha: f.ficha, estado: f.estado, actualizado_en: f.actualizado_en, entregada_en: f.entregada_en })),
    }))
  },
  async comentar(equipoId, ficha, seccion, texto) {
    const bd = leer()
    bd.comentarios.push({
      id: `c-${Date.now()}`,
      equipo_id: equipoId,
      ficha,
      seccion,
      texto,
      autor: `${yo.nombres} ${yo.apellidos}`,
      creado_en: new Date().toISOString(),
    })
    escribir(bd)
  },
}

export const almacenTc = hayConfiguracion ? remoto : local
export const modoDemostracionTc = !hayConfiguracion
