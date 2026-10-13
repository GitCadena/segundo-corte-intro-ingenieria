import { useState } from 'react'
import { RESULTADOS, ENLACES, REVISION } from '../../../data/lab-cdvs.js'
import { FASES } from '../../../data/cdvs-fases.js'
import { intentarEnlace, quitarEnlace, estadoDependencias, revisarDecision } from '../../../lib/labCdvs.js'

const ANCHO_NODO = 118
const ALTO_NODO = 54
const PASO = 135
const Y = 103
const posicion = (id) => RESULTADOS.findIndex((r) => r.id === id)
const centro = (i) => 10 + i * PASO + ANCHO_NODO / 2

function trazo(desde, hacia) {
  const a = posicion(desde)
  const b = posicion(hacia)
  if (b === a + 1) {
    return { d: `M ${10 + a * PASO + ANCHO_NODO} ${Y + ALTO_NODO / 2} L ${10 + b * PASO - 2} ${Y + ALTO_NODO / 2}`, tipo: 'avance' }
  }
  if (b > a + 1) {
    return { d: `M ${centro(a)} ${Y} C ${centro(a)} 28, ${centro(b)} 28, ${centro(b)} ${Y - 2}`, tipo: 'avance' }
  }
  const base = Y + ALTO_NODO
  return { d: `M ${centro(a)} ${base} C ${centro(a)} ${base + 78}, ${centro(b)} ${base + 78}, ${centro(b)} ${base + 2}`, tipo: 'revision' }
}

const nombreResultado = (id) => RESULTADOS.find((r) => r.id === id)?.titulo ?? id

/**
 * Dependencias del proyecto: conectar los resultados de las fases con una razón.
 * Una conexión solo queda construida si existe y si se eligió la razón correcta.
 */
export default function Dependencias({ sesion, onCambio }) {
  const [desde, setDesde] = useState('')
  const [hacia, setHacia] = useState('')
  const [pendiente, setPendiente] = useState(null) // enlace válido esperando su razón
  const [opcion, setOpcion] = useState(null)
  const [razon, setRazon] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [elegidas, setElegidas] = useState(sesion.dependencias.revision.elegidas)

  const est = estadoDependencias(sesion)
  const dep = sesion.dependencias
  const decisionCompleta = dep.revision.completo

  function elegirNodo(id) {
    if (!desde || (desde && hacia)) {
      setDesde(id)
      setHacia('')
    } else {
      setHacia(id)
    }
    setPendiente(null)
  }

  function conectar() {
    if (!desde || !hacia || desde === hacia) {
      setMensaje({ tipo: 'sin-relacion', mensaje: 'Elige dos resultados distintos.' })
      return
    }
    if (dep.enlaces.some((e) => e.id === `${desde}>${hacia}`)) {
      setMensaje({ tipo: 'repetida', mensaje: 'Esa conexión ya está construida.' })
      return
    }
    // Si coincide con una dependencia habitual se elige la razón; si no, se escribe la propia.
    setPendiente(ENLACES.find((e) => e.desde === desde && e.hacia === hacia) ?? { propia: true })
    setOpcion(null)
    setRazon('')
    setMensaje(null)
  }

  function confirmar() {
    const r = intentarEnlace(sesion, desde, hacia, pendiente?.propia ? null : opcion, razon)
    onCambio(r.sesion)
    setMensaje(r.resultado)
    if (r.resultado.tipo === 'aceptada') {
      setPendiente(null)
      setDesde('')
      setHacia('')
      setRazon('')
    }
  }

  function enviarDecision() {
    onCambio(revisarDecision(sesion, elegidas).sesion)
  }

  const enlacesPendientes = !est.completo || (est.decision && !decisionCompleta)

  return (
    <div className="lab-dep">
      <p className="lab-ayuda">
        Armen el ciclo como ustedes creen que debe ser: conecten los resultados de las fases (¿qué resultado necesita otro para poder existir?).
        No hay un único camino. Hagan al menos {est.total} conexiones, y que {est.necesariasAtras === 1 ? 'una' : `${est.necesariasAtras}`} de
        ellas vuelva{est.necesariasAtras === 1 ? '' : 'n'} a una decisión anterior.
      </p>

      <div className="lab-dep__diagrama">
        <svg viewBox="0 0 960 250" role="img" aria-label="Diagrama de dependencias entre los resultados de las siete fases">
          <defs>
            <marker id="lab-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="lab-dep__punta" />
            </marker>
            <marker id="lab-flecha-rev" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="lab-dep__punta lab-dep__punta--rev" />
            </marker>
          </defs>
          {dep.enlaces.map((e) => {
            const t = trazo(e.desde, e.hacia)
            return (
              <path
                key={e.id}
                d={t.d}
                className={'lab-dep__enlace' + (t.tipo === 'revision' ? ' lab-dep__enlace--rev' : '')}
                markerEnd={t.tipo === 'revision' ? 'url(#lab-flecha-rev)' : 'url(#lab-flecha)'}
              />
            )
          })}
          {RESULTADOS.map((r, i) => {
            const seleccionado = r.id === desde || r.id === hacia
            return (
              <g
                key={r.id}
                role="button"
                tabIndex={0}
                aria-label={`${i + 1}. ${r.titulo}`}
                className={'lab-dep__nodo' + (seleccionado ? ' lab-dep__nodo--elegido' : '')}
                onClick={() => elegirNodo(r.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    elegirNodo(r.id)
                  }
                }}
              >
                <rect x={10 + i * PASO} y={Y} width={ANCHO_NODO} height={ALTO_NODO} rx="8" />
                <text x={10 + i * PASO + ANCHO_NODO / 2} y={Y + 22} textAnchor="middle" className="lab-dep__fase">
                  Fase {i + 1}
                </text>
                <text x={10 + i * PASO + ANCHO_NODO / 2} y={Y + 41} textAnchor="middle" className="lab-dep__texto">
                  {r.corto}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {enlacesPendientes && (
        <div className="lab-dep__form">
          <p className="etiqueta-campo">Nueva conexión (también puedes tocar los resultados del diagrama)</p>
          <div className="lab-dep__selects">
            <label>
              <span className="lab-ayuda">Este resultado…</span>
              <select className="campo" value={desde} onChange={(e) => { setDesde(e.target.value); setPendiente(null) }}>
                <option value="">Elige uno</option>
                {RESULTADOS.map((r, i) => (
                  <option key={r.id} value={r.id}>{i + 1}. {r.titulo}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="lab-ayuda">…alimenta a este</span>
              <select className="campo" value={hacia} onChange={(e) => { setHacia(e.target.value); setPendiente(null) }}>
                <option value="">Elige uno</option>
                {RESULTADOS.map((r, i) => (
                  <option key={r.id} value={r.id}>{i + 1}. {r.titulo}</option>
                ))}
              </select>
            </label>
            <button type="button" className="boton boton--secundario" onClick={conectar} disabled={!desde || !hacia}>
              Conectar
            </button>
          </div>

          {pendiente && (
            <fieldset className="lab-dep__razon">
              <legend>¿Por qué «{nombreResultado(desde)}» alimenta a «{nombreResultado(hacia)}»?</legend>
              {pendiente.propia ? (
                <textarea
                  className="campo"
                  rows={2}
                  maxLength={160}
                  value={razon}
                  placeholder="Escriban en una frase su razón"
                  onChange={(e) => setRazon(e.target.value)}
                />
              ) : (
                pendiente.opciones.map((o, i) => (
                  <label key={i} className="lab-dep__opcion">
                    <input type="radio" name="razon" checked={opcion === i} onChange={() => setOpcion(i)} />
                    <span>{o}</span>
                  </label>
                ))
              )}
              <button
                type="button"
                className="boton boton--principal boton--pequeno"
                disabled={pendiente.propia ? razon.trim().length < 8 : opcion === null}
                onClick={confirmar}
              >
                Confirmar conexión
              </button>
            </fieldset>
          )}

          {mensaje && (
            <p className="lab-mensaje lab-mensaje--ok" role="status">
              {mensaje.tipo === 'aceptada' ? <strong>Conexión construida. </strong> : null}
              {mensaje.mensaje}
            </p>
          )}
        </div>
      )}

      <p className="lab-progreso">
        Conexiones: {est.hechas} de {est.total} · De ellas, las que vuelven atrás: {est.atras} de {est.necesariasAtras}
      </p>

      {dep.enlaces.length > 0 && (
        <ul className="lab-dep__lista">
          {dep.enlaces.map((e) => (
            <li key={e.id}>
              <strong>{nombreResultado(e.desde)}</strong> → <strong>{nombreResultado(e.hacia)}</strong>
              {e.tipo === 'revision' && <span className="chip chip--opcional"> vuelve atrás</span>}
              {e.razon && <span className="lab-dep__porque">{e.razon}</span>}
              {!est.completo && (
                <button type="button" className="boton boton--texto" onClick={() => onCambio(quitarEnlace(sesion, e.id))}>
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {est.decision && (
        <fieldset className="lab-dep__decision">
          <legend>Revisión de decisiones</legend>
          <p>{REVISION.texto}</p>
          <div className="lab-dep__fases">
            {FASES.map((f) => (
              <label key={f.id} className="lab-dep__opcion">
                <input
                  type="checkbox"
                  disabled={decisionCompleta}
                  checked={elegidas.includes(f.id)}
                  onChange={() => setElegidas((prev) => (prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id]))}
                />
                <span>{f.numero}. {f.corto}</span>
              </label>
            ))}
          </div>
          {!decisionCompleta && (
            <button type="button" className="boton boton--secundario" disabled={elegidas.length === 0} onClick={enviarDecision}>
              Registrar decisión
            </button>
          )}
          {decisionCompleta && (
            <p className="lab-mensaje lab-mensaje--ok" role="status">
              Su decisión quedó registrada. Lo más habitual: {REVISION.porque}
            </p>
          )}
        </fieldset>
      )}
    </div>
  )
}
