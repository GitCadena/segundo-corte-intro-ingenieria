import { useState } from 'react'
import { MODALIDADES, CASO, INSTRUCCION_INICIAL } from '../../../data/lab-cdvs.js'
import { validarRegistro, crearSesion } from '../../../lib/labCdvs.js'

function nuevoId() {
  const c = globalThis.crypto
  if (c?.randomUUID) return c.randomUUID()
  return 'ses-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

/** Pantalla de identificación del equipo. Todo se guarda con la cuenta de quien registra. */
export default function Registro({ onComenzar }) {
  const [alias, setAlias] = useState('')
  const [nombres, setNombres] = useState(['', '', '', ''])
  const [modo, setModo] = useState('60')
  const [errores, setErrores] = useState(null)

  function cambiarNombre(i, valor) {
    setNombres((n) => n.map((x, j) => (j === i ? valor : x)))
  }

  function enviar(e) {
    e.preventDefault()
    const v = validarRegistro({ alias, integrantes: nombres })
    setErrores(v.errores)
    if (!v.ok) return
    onComenzar(crearSesion({ alias, integrantes: nombres, modo, id: nuevoId() }))
  }

  return (
    <form className="lab-registro" onSubmit={enviar} noValidate>
      <div className="lab-caso">
        <p className="etiqueta-campo">El caso</p>
        <h4>{CASO.titulo}</h4>
        <p>{CASO.texto}</p>
        <p className="lab-caso__consigna">{INSTRUCCION_INICIAL}</p>
      </div>

      <h4 className="lab-registro__titulo">Identifiquen al equipo</h4>
      <p className="lab-ayuda">
        Una sola persona registra al equipo y lo maneja desde su cuenta. Los nombres solo se usan en el comprobante para el docente.
      </p>

      <label className="lab-campo">
        <span className="etiqueta-campo">Nombre del equipo (aparece en la clasificación del docente)</span>
        <input className="campo" value={alias} maxLength={24} onChange={(e) => setAlias(e.target.value)} aria-invalid={!!errores?.alias} />
        {errores?.alias && <span className="lab-error">{errores.alias}</span>}
      </label>

      {nombres.map((n, i) => (
        <label className="lab-campo" key={i}>
          <span className="etiqueta-campo">
            Nombre completo del integrante {i + 1} {i === 3 ? '(opcional)' : ''}
          </span>
          <input className="campo" value={n} onChange={(e) => cambiarNombre(i, e.target.value)} autoComplete="off" aria-invalid={!!errores?.integrantes?.[i]} />
          {errores?.integrantes?.[i] && <span className="lab-error">{errores.integrantes[i]}</span>}
        </label>
      ))}

      <fieldset className="lab-modo">
        <legend className="etiqueta-campo">Modalidad que indicó el docente</legend>
        {MODALIDADES.map((m) => (
          <label key={m.id} className="lab-modo__opcion">
            <input type="radio" name="modalidad" value={m.id} checked={modo === m.id} onChange={() => setModo(m.id)} />
            <span>
              <strong>{m.etiqueta}</strong>
              <span className="lab-ayuda"> · {m.ayuda}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <button type="submit" className="boton boton--principal">
        Comenzar proyecto
      </button>
    </form>
  )
}
