import { useEffect, useState } from 'react'
import { useSesion } from '../estado/SesionProvider.jsx'

/** Registro, inicio de sesión y recuperación de cuenta. */
export default function Acceso() {
  const { registrar, iniciarSesion, recuperar, cambiarContrasena, grupos, modoDemo } = useSesion()
  const [modo, setModo] = useState('entrar')
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)
  const [ocupado, setOcupado] = useState(false)

  // Supabase devuelve al usuario aquí tras pedir el enlace de recuperación.
  useEffect(() => {
    const hash = window.location.hash || ''
    if (hash.includes('type=recovery') || window.location.search.includes('recuperar=1')) {
      setModo('nueva-contrasena')
    }
  }, [])

  return (
    <section className="acceso">
      <div className="acceso__intro">
        <h1>Tu cuenta del segundo corte</h1>
        <p>
          Con una cuenta tu avance queda guardado en el servidor del curso: puedes empezar en la sala
          de cómputo y continuar desde el celular sin perder nada.
        </p>
        <ul className="acceso__lista">
          <li>El registro pide nombre, apellido, grupo, correo y contraseña.</li>
          <li>
            El código estudiantil es <strong>opcional</strong> y nunca sirve para entrar: es un dato
            administrativo de tu perfil, no una credencial.
          </li>
          <li>Si olvidas la contraseña, se recupera con un enlace enviado a tu correo.</li>
        </ul>
        {modoDemo && (
          <p className="aviso aviso--nota">
            La aplicación está en modo demostración: no hay servidor configurado. Puedes entrar con
            cualquier dato para recorrerla, pero el avance se queda en este navegador.
          </p>
        )}
      </div>

      <div className="acceso__tarjeta">
        <div className="pestanas" role="tablist" aria-label="Acceso">
          {[
            ['entrar', 'Iniciar sesión'],
            ['registrar', 'Crear cuenta'],
            ['recuperar', 'Olvidé mi contraseña'],
          ].map(([valor, texto]) => (
            <button
              key={valor}
              type="button"
              role="tab"
              aria-selected={modo === valor}
              className={modo === valor ? 'pestana pestana--activa' : 'pestana'}
              onClick={() => {
                setModo(valor)
                setError(null)
                setMensaje(null)
              }}
            >
              {texto}
            </button>
          ))}
        </div>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="aviso aviso--ok" role="status">
            {mensaje}
          </p>
        )}

        {modo === 'entrar' && (
          <FormEntrar
            ocupado={ocupado}
            alEnviar={async (datos) => {
              setOcupado(true)
              setError(null)
              const r = await iniciarSesion(datos)
              setOcupado(false)
              if (!r.ok) setError(r.error)
            }}
          />
        )}

        {modo === 'registrar' && (
          <FormRegistro
            grupos={grupos}
            modoDemo={modoDemo}
            ocupado={ocupado}
            alEnviar={async (datos) => {
              setOcupado(true)
              setError(null)
              setMensaje(null)
              const r = await registrar(datos)
              setOcupado(false)
              if (!r.ok) {
                setError(r.error)
                return
              }
              if (r.necesitaConfirmar) {
                setMensaje(
                  'Cuenta creada. Te llegó un correo de confirmación: ábrelo para activar la cuenta y después inicia sesión.',
                )
                setModo('entrar')
              }
            }}
          />
        )}

        {modo === 'recuperar' && (
          <FormRecuperar
            ocupado={ocupado}
            alEnviar={async (correo) => {
              setOcupado(true)
              setError(null)
              const r = await recuperar(correo)
              setOcupado(false)
              if (!r.ok) setError(r.error)
              else
                setMensaje(
                  'Si ese correo tiene una cuenta, le enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de correo no deseado.',
                )
            }}
          />
        )}

        {modo === 'nueva-contrasena' && (
          <FormNuevaContrasena
            ocupado={ocupado}
            alEnviar={async (nueva) => {
              setOcupado(true)
              setError(null)
              const r = await cambiarContrasena(nueva)
              setOcupado(false)
              if (!r.ok) setError(r.error)
              else {
                setMensaje('Contraseña actualizada. Ya puedes usar la aplicación.')
                setModo('entrar')
              }
            }}
          />
        )}
      </div>
    </section>
  )
}

/* -------------------------------- entrar -------------------------------- */

function FormEntrar({ alEnviar, ocupado }) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')

  return (
    <form
      className="formulario"
      onSubmit={(e) => {
        e.preventDefault()
        alEnviar({ correo: correo.trim(), contrasena })
      }}
    >
      <Campo id="entrar-correo" etiqueta="Correo" tipo="email" valor={correo} alCambiar={setCorreo} autoComplete="email" requerido />
      <Campo
        id="entrar-clave"
        etiqueta="Contraseña"
        tipo="password"
        valor={contrasena}
        alCambiar={setContrasena}
        autoComplete="current-password"
        requerido
      />
      <button className="boton boton--principal boton--ancho" type="submit" disabled={ocupado}>
        {ocupado ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}

/* ------------------------------- registro -------------------------------- */

function FormRegistro({ alEnviar, grupos, modoDemo, ocupado }) {
  const [d, setD] = useState({
    nombres: '',
    apellidos: '',
    grupo: '',
    correo: '',
    contrasena: '',
    repetir: '',
    codigoEstudiantil: '',
  })
  const [aviso, setAviso] = useState(null)
  const set = (k) => (v) => setD((p) => ({ ...p, [k]: v }))

  function enviar(e) {
    e.preventDefault()
    if (d.contrasena.length < 8) {
      setAviso('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (d.contrasena !== d.repetir) {
      setAviso('Las dos contraseñas no coinciden.')
      return
    }
    if (!d.grupo) {
      setAviso('Elige tu grupo.')
      return
    }
    setAviso(null)
    alEnviar(d)
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      {aviso && (
        <p className="aviso aviso--error" role="alert">
          {aviso}
        </p>
      )}
      <div className="formulario__par">
        <Campo id="reg-nombres" etiqueta="Nombres" valor={d.nombres} alCambiar={set('nombres')} autoComplete="given-name" requerido />
        <Campo id="reg-apellidos" etiqueta="Apellidos" valor={d.apellidos} alCambiar={set('apellidos')} autoComplete="family-name" requerido />
      </div>

      <label className="campo-envoltura" htmlFor="reg-grupo">
        <span className="campo-envoltura__etiqueta">Grupo</span>
        {grupos.length > 0 ? (
          <select id="reg-grupo" className="campo" value={d.grupo} onChange={(e) => set('grupo')(e.target.value)} required>
            <option value="">Elige tu grupo…</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.nombre}>
                {g.nombre}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="reg-grupo"
            className="campo"
            value={d.grupo}
            onChange={(e) => set('grupo')(e.target.value)}
            placeholder={modoDemo ? 'Grupo 1' : 'Escribe el nombre de tu grupo'}
            required
          />
        )}
      </label>

      <Campo id="reg-correo" etiqueta="Correo institucional" tipo="email" valor={d.correo} alCambiar={set('correo')} autoComplete="email" requerido />

      <div className="formulario__par">
        <Campo
          id="reg-clave"
          etiqueta="Contraseña"
          tipo="password"
          valor={d.contrasena}
          alCambiar={set('contrasena')}
          autoComplete="new-password"
          ayuda="Mínimo 8 caracteres."
          requerido
        />
        <Campo
          id="reg-clave2"
          etiqueta="Repite la contraseña"
          tipo="password"
          valor={d.repetir}
          alCambiar={set('repetir')}
          autoComplete="new-password"
          requerido
        />
      </div>

      <Campo
        id="reg-codigo"
        etiqueta="Código estudiantil"
        valor={d.codigoEstudiantil}
        alCambiar={set('codigoEstudiantil')}
        ayuda="Opcional. Sirve para que el docente te identifique en sus listas; no se usa para iniciar sesión."
        opcional
      />

      <button className="boton boton--principal boton--ancho" type="submit" disabled={ocupado}>
        {ocupado ? 'Creando la cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  )
}

/* ------------------------------- recuperar ------------------------------- */

function FormRecuperar({ alEnviar, ocupado }) {
  const [correo, setCorreo] = useState('')
  return (
    <form
      className="formulario"
      onSubmit={(e) => {
        e.preventDefault()
        alEnviar(correo.trim())
      }}
    >
      <p className="formulario__texto">
        Escribe el correo con el que te registraste. Te llegará un enlace para crear una contraseña
        nueva.
      </p>
      <Campo id="rec-correo" etiqueta="Correo" tipo="email" valor={correo} alCambiar={setCorreo} autoComplete="email" requerido />
      <button className="boton boton--principal boton--ancho" type="submit" disabled={ocupado}>
        {ocupado ? 'Enviando…' : 'Enviar el enlace'}
      </button>
    </form>
  )
}

function FormNuevaContrasena({ alEnviar, ocupado }) {
  const [clave, setClave] = useState('')
  const [repetir, setRepetir] = useState('')
  const [aviso, setAviso] = useState(null)

  return (
    <form
      className="formulario"
      onSubmit={(e) => {
        e.preventDefault()
        if (clave.length < 8) return setAviso('La contraseña debe tener al menos 8 caracteres.')
        if (clave !== repetir) return setAviso('Las dos contraseñas no coinciden.')
        setAviso(null)
        alEnviar(clave)
      }}
    >
      <p className="formulario__texto">Crea tu nueva contraseña.</p>
      {aviso && (
        <p className="aviso aviso--error" role="alert">
          {aviso}
        </p>
      )}
      <Campo id="nueva-clave" etiqueta="Nueva contraseña" tipo="password" valor={clave} alCambiar={setClave} autoComplete="new-password" requerido />
      <Campo id="nueva-clave2" etiqueta="Repite la contraseña" tipo="password" valor={repetir} alCambiar={setRepetir} autoComplete="new-password" requerido />
      <button className="boton boton--principal boton--ancho" type="submit" disabled={ocupado}>
        {ocupado ? 'Guardando…' : 'Guardar la contraseña'}
      </button>
    </form>
  )
}

/* -------------------------------- campo ---------------------------------- */

function Campo({ id, etiqueta, tipo = 'text', valor, alCambiar, ayuda, requerido, opcional, autoComplete }) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined
  return (
    <label className="campo-envoltura" htmlFor={id}>
      <span className="campo-envoltura__etiqueta">
        {etiqueta}
        {opcional && <em className="campo-envoltura__opcional">opcional</em>}
        {requerido && <em className="campo-envoltura__requerido">obligatorio</em>}
      </span>
      <input
        id={id}
        className="campo"
        type={tipo}
        value={valor}
        required={requerido}
        autoComplete={autoComplete}
        aria-describedby={idAyuda}
        onChange={(e) => alCambiar(e.target.value)}
      />
      {ayuda && (
        <span className="campo-envoltura__ayuda" id={idAyuda}>
          {ayuda}
        </span>
      )}
    </label>
  )
}
