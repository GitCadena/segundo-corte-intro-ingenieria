import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, hayConfiguracion, motivoSinConfiguracion } from '../lib/supabase.js'

const Contexto = createContext(null)

const CLAVE_DEMO_PERFIL = 'segundo-corte-perfil-demo-v1'

/**
 * Sesión del estudiante.
 *
 * Con Supabase configurado usa Supabase Auth (correo y contraseña, con
 * recuperación por correo). Sin configuración entra en modo demostración:
 * un perfil local, claramente rotulado, para poder recorrer la aplicación.
 *
 * El código estudiantil es un dato del perfil, nunca una credencial.
 */
export function SesionProvider({ children }) {
  const [cargando, setCargando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [grupos, setGrupos] = useState([])
  const [errorPerfil, setErrorPerfil] = useState(null)
  const [recuperacionPendiente, setRecuperacionPendiente] = useState(false)

  /* ------------------------------ modo demo ------------------------------ */

  const entrarDemo = useCallback((datos) => {
    const p = {
      id: 'demo-local',
      nombres: datos?.nombres || 'Estudiante',
      apellidos: datos?.apellidos || 'de prueba',
      correo: datos?.correo || 'demostracion@local',
      codigo_estudiantil: datos?.codigo_estudiantil || null,
      grupo_id: null,
      grupo: datos?.grupo || 'Grupo de demostración',
      rol: datos?.rol || 'estudiante',
      demo: true,
    }
    try {
      window.localStorage.setItem(CLAVE_DEMO_PERFIL, JSON.stringify(p))
    } catch {
      /* si el navegador bloquea el almacenamiento, la sesión dura lo que la pestaña */
    }
    setPerfil(p)
    setUsuario({ id: p.id, email: p.correo })
  }, [])

  /* --------------------------- carga del perfil -------------------------- */

  const cargarPerfil = useCallback(async (id) => {
    if (!supabase || !id) return
    // Hay que nombrar la clave foránea: `perfiles` se relaciona con `grupos`
    // por dos caminos (grupo_id y, para docentes, docente_grupos), y sin
    // desambiguar PostgREST responde 300 en vez de traer el perfil.
    const { data, error } = await supabase
      .from('perfiles')
      .select('*, grupos!perfiles_grupo_id_fkey(nombre)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      setErrorPerfil(
        `No se pudo leer tu perfil: ${error.message}. Revisa que las migraciones de Supabase estén aplicadas.`,
      )
      return
    }
    if (!data) {
      setErrorPerfil(
        'Tu cuenta existe pero no tiene perfil asociado. Avísale al docente: falta ejecutar la migración que crea el perfil al registrarse.',
      )
      return
    }
    setErrorPerfil(null)
    setPerfil({ ...data, grupo: data.grupos?.nombre ?? null })
  }, [])

  /* ------------------------------ arranque ------------------------------- */

  useEffect(() => {
    let vivo = true

    if (!hayConfiguracion) {
      try {
        const crudo = window.localStorage.getItem(CLAVE_DEMO_PERFIL)
        if (crudo) {
          const p = JSON.parse(crudo)
          setPerfil(p)
          setUsuario({ id: p.id, email: p.correo })
        }
      } catch {
        /* sin sesión previa */
      }
      setCargando(false)
      return () => {
        vivo = false
      }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!vivo) return
      const u = data.session?.user ?? null
      setUsuario(u)
      if (u) await cargarPerfil(u.id)
      setCargando(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (evento, sesion) => {
      if (!vivo) return
      // Supabase dispara este evento apenas detecta, en la URL, el enlace de
      // recuperación de contraseña — sin importar en qué página haya caído.
      // Con eso alcanza para llevar al estudiante a la pantalla correcta,
      // aunque el enlace lo haya mandado el panel de Supabase (que no sabe
      // de la ruta /acceso) en vez del botón «Olvidé mi contraseña» de la app.
      if (evento === 'PASSWORD_RECOVERY') setRecuperacionPendiente(true)
      const u = sesion?.user ?? null
      setUsuario(u)
      if (u) await cargarPerfil(u.id)
      else setPerfil(null)
    })

    supabase
      .from('grupos')
      .select('id, nombre')
      .eq('activo', true)
      .order('nombre')
      .then(({ data }) => vivo && setGrupos(data ?? []))

    return () => {
      vivo = false
      sub?.subscription?.unsubscribe()
    }
  }, [cargarPerfil])

  /* ------------------------------- acciones ------------------------------ */

  const registrar = useCallback(
    async ({ nombres, apellidos, grupo, correo, contrasena, codigoEstudiantil }) => {
      if (!hayConfiguracion) {
        entrarDemo({ nombres, apellidos, correo, grupo, codigo_estudiantil: codigoEstudiantil })
        return { ok: true, demo: true }
      }
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: contrasena,
        options: {
          // Estos metadatos los consume el trigger manejar_usuario_nuevo().
          // El rol NO viaja aquí: siempre se crea como 'estudiante'.
          data: {
            nombres: nombres.trim(),
            apellidos: apellidos.trim(),
            grupo: grupo || '',
            codigo_estudiantil: (codigoEstudiantil || '').trim(),
          },
          emailRedirectTo: `${window.location.origin}/acceso`,
        },
      })
      if (error) return { ok: false, error: traducirError(error.message) }
      const necesitaConfirmar = !data.session
      return { ok: true, necesitaConfirmar }
    },
    [entrarDemo],
  )

  const iniciarSesion = useCallback(
    async ({ correo, contrasena }) => {
      if (!hayConfiguracion) {
        entrarDemo({ correo })
        return { ok: true, demo: true }
      }
      const { error } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena })
      if (error) return { ok: false, error: traducirError(error.message) }
      return { ok: true }
    },
    [entrarDemo],
  )

  const recuperar = useCallback(async (correo) => {
    if (!hayConfiguracion) {
      return { ok: false, error: 'La recuperación de cuenta necesita Supabase configurado.' }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: `${window.location.origin}/acceso?recuperar=1`,
    })
    if (error) return { ok: false, error: traducirError(error.message) }
    return { ok: true }
  }, [])

  const cambiarContrasena = useCallback(async (nueva) => {
    if (!hayConfiguracion) return { ok: false, error: 'Necesita Supabase configurado.' }
    const { error } = await supabase.auth.updateUser({ password: nueva })
    if (error) return { ok: false, error: traducirError(error.message) }
    return { ok: true }
  }, [])

  const cerrarSesion = useCallback(async () => {
    if (!hayConfiguracion) {
      try {
        window.localStorage.removeItem(CLAVE_DEMO_PERFIL)
      } catch {
        /* nada que limpiar */
      }
      setPerfil(null)
      setUsuario(null)
      return
    }
    await supabase.auth.signOut()
    setPerfil(null)
    setUsuario(null)
  }, [])

  const actualizarPerfil = useCallback(
    async (cambios) => {
      if (!hayConfiguracion) {
        const p = { ...perfil, ...cambios }
        try {
          window.localStorage.setItem(CLAVE_DEMO_PERFIL, JSON.stringify(p))
        } catch {
          /* sin persistencia */
        }
        setPerfil(p)
        return { ok: true }
      }
      // `rol` nunca se envía: el trigger proteger_rol() rechazaría el cambio.
      const { rol, id, ...permitidos } = cambios
      const { error } = await supabase.from('perfiles').update(permitidos).eq('id', usuario.id)
      if (error) return { ok: false, error: error.message }
      await cargarPerfil(usuario.id)
      return { ok: true }
    },
    [perfil, usuario, cargarPerfil],
  )

  const valor = useMemo(
    () => ({
      cargando,
      usuario,
      perfil,
      grupos,
      errorPerfil,
      recuperacionPendiente,
      modoDemo: !hayConfiguracion,
      motivoSinConfiguracion,
      esDocente: perfil?.rol === 'docente' || perfil?.rol === 'admin',
      registrar,
      iniciarSesion,
      recuperar,
      cambiarContrasena,
      cerrarSesion,
      actualizarPerfil,
      entrarDemo,
    }),
    [
      cargando,
      usuario,
      perfil,
      grupos,
      errorPerfil,
      recuperacionPendiente,
      registrar,
      iniciarSesion,
      recuperar,
      cambiarContrasena,
      cerrarSesion,
      actualizarPerfil,
      entrarDemo,
    ],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useSesion() {
  const c = useContext(Contexto)
  if (!c) throw new Error('useSesion debe usarse dentro de SesionProvider')
  return c
}

/** Mensajes de Supabase Auth en español, sin revelar si un correo existe. */
function traducirError(mensaje) {
  const m = (mensaje || '').toLowerCase()
  if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Falta confirmar tu correo. Revisa la bandeja de entrada.'
  if (m.includes('user already registered')) return 'Ese correo ya tiene una cuenta. Inicia sesión o recupera tu contraseña.'
  if (m.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (m.includes('unable to validate email')) return 'El correo no tiene un formato válido.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.'
  return mensaje
}
