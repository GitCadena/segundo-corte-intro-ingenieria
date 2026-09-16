import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSesion } from './SesionProvider.jsx'
import {
  elegirAlmacen,
  nuevoClienteId,
  encolar,
  leerCola,
  drenarCola,
} from '../lib/almacen.js'
import {
  catalogoActividades,
  actividadesDe,
  actividadPorId,
  puntosDeEstacion,
  estaciones,
} from '../data/catalogo.js'
import logrosCatalogo from '../data/logros.js'
import { ETIQUETA_ESTADO } from '../lib/puntaje.js'

const Contexto = createContext(null)

/**
 * Progreso del estudiante.
 *
 * Estados de guardado que se muestran en pantalla, sin mentir nunca:
 *   'inactivo'   nada que guardar
 *   'guardando'  la escritura está en curso
 *   'guardado'   el servidor confirmó
 *   'pendiente'  falló y quedó en cola; se reintenta
 */
export function ProgresoProvider({ children }) {
  const { usuario, perfil, modoDemo } = useSesion()
  const almacen = useMemo(() => elegirAlmacen(), [])

  const [mejores, setMejores] = useState({})
  const [intentos, setIntentos] = useState([])
  const [borradores, setBorradores] = useState({})
  const [logros, setLogros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [estadoGuardado, setEstadoGuardado] = useState('inactivo')
  const [pendientes, setPendientes] = useState(0)
  const [ultimoError, setUltimoError] = useState(null)

  // Evita que dos envíos simultáneos de la misma actividad creen dos intentos.
  const enVuelo = useRef(new Set())

  /* ------------------------------- carga --------------------------------- */

  const recargar = useCallback(async () => {
    if (!usuario) {
      setMejores({})
      setIntentos([])
      setBorradores({})
      setLogros([])
      setCargando(false)
      return
    }
    setCargando(true)
    const [prog, bor, lgs] = await Promise.all([
      almacen.cargarProgreso(),
      almacen.cargarBorradores(),
      almacen.cargarLogros(),
    ])
    if (prog.ok) {
      const mapa = {}
      for (const m of prog.mejores) mapa[m.actividad_id] = m
      setMejores(mapa)
      setIntentos(prog.intentos ?? [])
      setUltimoError(null)
    } else {
      setUltimoError(prog.error)
    }
    if (bor.ok) setBorradores(bor.borradores)
    if (lgs.ok) setLogros(lgs.logros)
    setPendientes(leerCola().length)
    setCargando(false)
  }, [usuario, almacen])

  useEffect(() => {
    recargar()
  }, [recargar])

  /* --------------------- reintento de la cola pendiente ------------------- */

  const reintentar = useCallback(async () => {
    if (!usuario || leerCola().length === 0) return
    setEstadoGuardado('guardando')
    const quedan = await drenarCola(almacen)
    setPendientes(quedan)
    if (quedan === 0) {
      setEstadoGuardado('guardado')
      await recargar()
    } else {
      setEstadoGuardado('pendiente')
    }
  }, [usuario, almacen, recargar])

  useEffect(() => {
    if (!usuario) return undefined
    reintentar()
    const alVolver = () => reintentar()
    window.addEventListener('online', alVolver)
    const id = setInterval(() => {
      if (leerCola().length > 0) reintentar()
    }, 30000)
    return () => {
      window.removeEventListener('online', alVolver)
      clearInterval(id)
    }
  }, [usuario, reintentar])

  /* ---------------------------- registrar intento ------------------------- */

  /**
   * Guarda la evidencia de un intento. El puntaje lo calcula el servidor.
   * @returns {{ok:boolean, pendiente?:boolean, mejor?:object}}
   */
  const registrar = useCallback(
    async ({ actividadId, correcto, pistas = 0, intentosFallidos = 0, solucionVista = false, datos = {} }) => {
      if (!usuario) return { ok: false, error: 'Sin sesión iniciada.' }
      if (!actividadPorId(actividadId)) {
        return { ok: false, error: `La actividad "${actividadId}" no está en el catálogo.` }
      }
      if (enVuelo.current.has(actividadId)) return { ok: false, ocupado: true }
      enVuelo.current.add(actividadId)

      const evidencia = {
        actividad_id: actividadId,
        correcto: !!correcto,
        pistas,
        intentos_fallidos: intentosFallidos,
        solucion_vista: !!solucionVista,
        datos,
        cliente_id: nuevoClienteId(actividadId),
      }

      setEstadoGuardado('guardando')
      setUltimoError(null)

      try {
        const r = await almacen.registrarIntento(evidencia)
        if (r.ok) {
          setEstadoGuardado('guardado')
          if (r.mejor) {
            setMejores((prev) => ({ ...prev, [actividadId]: r.mejor }))
          }
          setIntentos((prev) => [{ ...evidencia, creado_en: new Date().toISOString() }, ...prev].slice(0, 200))
          return { ok: true, mejor: r.mejor }
        }
        // Falló: se encola y se avisa con honestidad. No se dice "Guardado".
        const cuantas = encolar(evidencia)
        setPendientes(cuantas)
        setEstadoGuardado('pendiente')
        setUltimoError(r.error ?? 'No se pudo guardar.')
        return { ok: false, pendiente: true, error: r.error }
      } catch (e) {
        const cuantas = encolar(evidencia)
        setPendientes(cuantas)
        setEstadoGuardado('pendiente')
        setUltimoError(e.message)
        return { ok: false, pendiente: true, error: e.message }
      } finally {
        enVuelo.current.delete(actividadId)
      }
    },
    [usuario, almacen],
  )

  /* ------------------------------ borradores ------------------------------ */

  const guardarBorrador = useCallback(
    async (actividadId, contenido) => {
      if (!usuario) return { ok: false }
      setBorradores((prev) => ({
        ...prev,
        [actividadId]: { contenido, actualizado_en: new Date().toISOString() },
      }))
      return almacen.guardarBorrador(actividadId, contenido)
    },
    [usuario, almacen],
  )

  /* -------------------------------- resumen ------------------------------- */

  const resumen = useMemo(() => construirResumen(mejores), [mejores])

  /* --------------------------------- logros ------------------------------- */

  useEffect(() => {
    if (!usuario || cargando) return
    const nuevos = logrosCatalogo
      .filter((l) => !logros.includes(l.id))
      .filter((l) => {
        try {
          return l.condicion(resumen)
        } catch {
          return false
        }
      })
      .map((l) => l.id)
    if (nuevos.length === 0) return
    setLogros((prev) => [...prev, ...nuevos])
    almacen.guardarLogros(nuevos)
  }, [usuario, cargando, resumen, logros, almacen])

  const valor = useMemo(
    () => ({
      cargando,
      mejores,
      intentos,
      borradores,
      logros,
      logrosCatalogo,
      resumen,
      estadoGuardado,
      pendientes,
      ultimoError,
      modoDemo,
      perfil,
      registrar,
      guardarBorrador,
      reintentar,
      recargar,
    }),
    [
      cargando,
      mejores,
      intentos,
      borradores,
      logros,
      resumen,
      estadoGuardado,
      pendientes,
      ultimoError,
      modoDemo,
      perfil,
      registrar,
      guardarBorrador,
      reintentar,
      recargar,
    ],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useProgreso() {
  const c = useContext(Contexto)
  if (!c) throw new Error('useProgreso debe usarse dentro de ProgresoProvider')
  return c
}

/* ------------------------------- resumen -------------------------------- */

/**
 * Deriva todas las cifras que muestran el panel, Mi progreso y los logros.
 * Se calcula una sola vez y se comparte, para que ninguna vista invente
 * su propio criterio.
 */
function construirResumen(mejores) {
  const estadoDe = (id) => mejores[id]?.estado ?? null
  const puntajeDe = (id) => mejores[id]?.mejor_puntaje ?? 0

  const completadas = catalogoActividades.filter(
    (a) => a.puntos > 0 && ['completada', 'dominada'].includes(estadoDe(a.id)),
  )
  const dominadas = catalogoActividades.filter((a) => estadoDe(a.id) === 'dominada')
  const intentadas = catalogoActividades.filter((a) => estadoDe(a.id) === 'intentada')

  const puntosObtenidos = catalogoActividades.reduce((s, a) => s + puntajeDe(a.id), 0)
  const puntosNotaObtenidos = catalogoActividades
    .filter((a) => a.cuentaNota)
    .reduce((s, a) => s + puntajeDe(a.id), 0)

  const porEstacion = {}
  for (const e of estaciones) {
    const act = actividadesDe(e.id).filter((a) => a.puntos > 0)
    const base = act.filter((a) => a.nivel === 'base')
    const hechas = act.filter((a) => ['completada', 'dominada'].includes(estadoDe(a.id)))
    const maximo = act.reduce((s, a) => s + a.puntos, 0)
    const obtenido = act.reduce((s, a) => s + puntajeDe(a.id), 0)
    porEstacion[e.id] = {
      id: e.id,
      titulo: e.titulo,
      orden: e.orden,
      total: act.length,
      completadas: hechas.length,
      dominadas: act.filter((a) => estadoDe(a.id) === 'dominada').length,
      pendientes: act.filter((a) => !['completada', 'dominada'].includes(estadoDe(a.id))),
      baseTotal: base.length,
      baseCompletas: base.filter((a) => ['completada', 'dominada'].includes(estadoDe(a.id))).length,
      puntosMax: maximo,
      puntos: obtenido,
      porcentaje: maximo === 0 ? 0 : Math.round((obtenido / maximo) * 100),
      avance: act.length === 0 ? 0 : Math.round((hechas.length / act.length) * 100),
    }
  }

  // Conceptos que conviene repasar: los que aparecen en actividades no
  // completadas o completadas con pistas. Se ordena por cuántas veces aparece.
  const conteo = {}
  for (const a of catalogoActividades) {
    if (a.puntos === 0) continue
    const estado = estadoDe(a.id)
    const flojo =
      estado === 'intentada' ||
      (estado === 'completada' && (mejores[a.id]?.pistas_minimas ?? 0) > 0) ||
      (estado === 'completada' && (mejores[a.id]?.intentos_totales ?? 0) > 1)
    if (!flojo) continue
    for (const c of a.conceptos) {
      if (!conteo[c]) conteo[c] = { concepto: c, veces: 0, actividades: [] }
      conteo[c].veces += 1
      conteo[c].actividades.push({ id: a.id, titulo: a.titulo, estacionId: a.estacionId })
    }
  }
  const aRepasar = Object.values(conteo).sort((a, b) => b.veces - a.veces)

  // Siguiente actividad pendiente, en orden de estación y de aparición.
  const ordenadas = [...catalogoActividades].sort((a, b) => {
    const ea = estaciones.find((e) => e.id === a.estacionId)?.orden ?? 99
    const eb = estaciones.find((e) => e.id === b.estacionId)?.orden ?? 99
    return ea - eb || a.orden - b.orden
  })
  const siguiente = ordenadas.find(
    (a) => a.puntos > 0 && a.nivel === 'base' && !['completada', 'dominada'].includes(estadoDe(a.id)),
  )

  return {
    completadas: completadas.length,
    dominadas: dominadas.length,
    intentadas: intentadas.length,
    totalActividades: catalogoActividades.filter((a) => a.puntos > 0).length,
    puntosObtenidos,
    puntosNotaObtenidos,
    porEstacion,
    aRepasar,
    siguiente,
    estadoDe,
    puntajeDe,
    etiquetaEstado: (id) => (estadoDe(id) ? ETIQUETA_ESTADO[estadoDe(id)] : 'Sin empezar'),
    completadasPorTipo: (tipo) =>
      catalogoActividades.filter(
        (a) => a.tipo === tipo && ['completada', 'dominada'].includes(estadoDe(a.id)),
      ).length,
    completadasOpcionales: catalogoActividades.filter(
      (a) => a.nivel === 'opcional' && ['completada', 'dominada'].includes(estadoDe(a.id)),
    ).length,
    estacionBaseCompleta: (id) => {
      const p = porEstacion[id]
      return !!p && p.baseTotal > 0 && p.baseCompletas === p.baseTotal
    },
    porcentajeEstacion: (id) => porEstacion[id]?.porcentaje ?? 0,
    puntosMaxEstacion: (id) => puntosDeEstacion(id),
  }
}
