import { useState } from 'react'
import { almacenTc } from '../lib/almacenTc.js'

export const formatearHora = (iso) => {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return null
  }
}

export function Campo({ etiqueta, ayuda, id, children }) {
  return (
    <div className="campo-envoltura tc-campo">
      <label className="campo-envoltura__etiqueta" htmlFor={id}>{etiqueta}</label>
      {ayuda && <span className="campo-envoltura__ayuda">{ayuda}</span>}
      {children}
    </div>
  )
}

export function IndicadorGuardado({ estado }) {
  const texto = {
    inactivo: 'Se guarda solo mientras escriben.',
    guardando: 'Guardando…',
    guardado: 'Guardado',
    error: 'No se pudo guardar. Reintentando al seguir escribiendo.',
  }[estado]
  const clase = estado === 'guardado' ? 'guardado--ok' : estado === 'error' ? 'guardado--pendiente' : 'guardado--proceso'
  return <p className={`guardado ${clase}`} role="status">{texto}</p>
}

/** Comentarios del docente por sección. El docente escribe; el equipo solo los lee. */
export function Comentarios({ ficha, seccion, f, equipo, esDocente, autorId }) {
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const lista = f.comentarios.filter((c) => c.seccion === seccion)
  if (!esDocente && lista.length === 0) return null

  async function enviar() {
    if (!texto.trim()) return
    setEnviando(true)
    try {
      await almacenTc.comentar(equipo.id, ficha, seccion, texto.trim(), autorId)
      setTexto('')
      await f.recargar()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="tc-comentarios">
      {lista.map((c) => (
        <p key={c.id} className="tc-comentario">
          <strong>{c.autor ?? 'Docente'}:</strong> {c.texto}
        </p>
      ))}
      {esDocente && (
        <div className="tc-comentar">
          <label className="visualmente-oculto" htmlFor={`com-${ficha}-${seccion}`}>Comentario para esta sección</label>
          <textarea
            id={`com-${ficha}-${seccion}`}
            className="campo campo--area"
            rows={2}
            placeholder="Comentario para esta sección"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button type="button" className="boton boton--secundario boton--pequeno" onClick={enviar} disabled={enviando || !texto.trim()}>
            Comentar
          </button>
        </div>
      )}
    </div>
  )
}

/** Estado de la ficha arriba: chip, guardado y último cambio. */
export function EstadoFicha({ f, entregada, esDocente }) {
  return (
    <div className="tc-estado">
      <span className={`chip ${entregada ? 'chip--tipo' : ''}`}>{entregada ? 'Entregada' : 'En progreso'}</span>
      {!esDocente && <IndicadorGuardado estado={f.guardado} />}
      {f.actualizadoEn && (
        <p className="tc-ultimo">
          Último cambio: {formatearHora(f.actualizadoEn)}
          {f.actualizadoPor ? ` · ${f.actualizadoPor}` : ''}
        </p>
      )}
    </div>
  )
}
