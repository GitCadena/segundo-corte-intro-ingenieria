import { useCallback, useEffect, useRef, useState } from 'react'
import { almacenTc } from './almacenTc.js'

const RETARDO_GUARDADO = 900
const INTERVALO_ACTUALIZAR = 8000

/**
 * Carga una ficha de un equipo, la guarda sola (solo los campos que cambiaron),
 * y trae los cambios de los compañeros cada pocos segundos sin pisar lo que el
 * usuario está escribiendo.
 *
 * Se usa siempre con `key={`${equipoId}-${ficha}`}` en el componente que lo
 * llama, para que cada ficha tenga su propio estado.
 */
export function useFicha(equipoId, ficha) {
  const [contenido, setContenido] = useState({})
  const [estado, setEstado] = useState('en_progreso')
  const [comentarios, setComentarios] = useState([])
  const [actualizadoPor, setActualizadoPor] = useState(null)
  const [actualizadoEn, setActualizadoEn] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardado, setGuardado] = useState('inactivo') // inactivo | guardando | guardado | error
  const [error, setError] = useState(null)

  const sucios = useRef(new Set())
  const contenidoRef = useRef({})
  const temporizador = useRef(null)
  const guardando = useRef(false)
  const vivo = useRef(true)

  useEffect(() => {
    vivo.current = true
    return () => {
      vivo.current = false
      clearTimeout(temporizador.current)
    }
  }, [])

  const aplicarRemoto = useCallback((r) => {
    setEstado(r.estado)
    setComentarios(r.comentarios ?? [])
    setActualizadoPor(r.actualizado_por ?? null)
    setActualizadoEn(r.actualizado_en ?? null)
    // Lo remoto solo reemplaza los campos que el usuario no tiene pendientes.
    const mezcla = { ...(r.contenido ?? {}) }
    for (const k of sucios.current) mezcla[k] = contenidoRef.current[k]
    contenidoRef.current = mezcla
    setContenido(mezcla)
  }, [])

  const cargar = useCallback(async () => {
    try {
      const r = await almacenTc.obtenerFicha(equipoId, ficha)
      if (vivo.current) aplicarRemoto(r)
    } catch (e) {
      if (vivo.current) setError(e.message)
    } finally {
      if (vivo.current) setCargando(false)
    }
  }, [equipoId, ficha, aplicarRemoto])

  useEffect(() => {
    cargar()
    const id = setInterval(() => {
      if (!guardando.current && sucios.current.size === 0) cargar()
    }, INTERVALO_ACTUALIZAR)
    return () => clearInterval(id)
  }, [cargar])

  const volcar = useCallback(async () => {
    if (guardando.current || sucios.current.size === 0) return
    guardando.current = true
    const claves = [...sucios.current]
    const campos = Object.fromEntries(claves.map((k) => [k, contenidoRef.current[k] ?? '']))
    setGuardado('guardando')
    try {
      await almacenTc.guardar(equipoId, ficha, campos)
      // Si siguió escribiendo en esos campos mientras guardaba, se vuelven a enviar.
      for (const k of claves) {
        if ((contenidoRef.current[k] ?? '') === campos[k]) sucios.current.delete(k)
      }
      if (vivo.current) {
        setGuardado(sucios.current.size === 0 ? 'guardado' : 'guardando')
        setError(null)
      }
    } catch (e) {
      if (vivo.current) {
        setGuardado('error')
        setError(e.message)
      }
    } finally {
      guardando.current = false
      if (sucios.current.size > 0 && vivo.current) {
        clearTimeout(temporizador.current)
        temporizador.current = setTimeout(volcar, RETARDO_GUARDADO)
      }
    }
  }, [equipoId, ficha])

  const cambiar = useCallback(
    (campo, valor) => {
      contenidoRef.current = { ...contenidoRef.current, [campo]: valor }
      sucios.current.add(campo)
      setContenido(contenidoRef.current)
      setGuardado('guardando')
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(volcar, RETARDO_GUARDADO)
    },
    [volcar],
  )

  const guardarYa = useCallback(async () => {
    clearTimeout(temporizador.current)
    for (let i = 0; i < 6 && sucios.current.size > 0; i += 1) {
      if (guardando.current) await new Promise((r) => setTimeout(r, 300))
      else await volcar()
    }
  }, [volcar])

  const entregar = useCallback(async () => {
    await guardarYa()
    try {
      await almacenTc.entregar(equipoId, ficha)
      await cargar()
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [equipoId, ficha, guardarYa, cargar])

  return { ficha, contenido, estado, comentarios, actualizadoPor, actualizadoEn, cargando, guardado, error, cambiar, entregar, recargar: cargar }
}
