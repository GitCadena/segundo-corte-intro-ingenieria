import { useMemo, useState } from 'react'
import { ejecutarSeguro, evaluarCasos } from '../../lib/pseudo.js'
import { mezclar } from './marco.jsx'
import Editor from '../Editor.jsx'
import TablaCasos from '../TablaCasos.jsx'

/* ================================= TRAZA ================================== */
/*
 * Los valores esperados no están escritos en los datos: los calcula el
 * intérprete al montar la actividad. Así el enunciado y la solución no se
 * pueden desincronizar.
 */

export function Traza({ actividad, ctrl }) {
  const traza = useMemo(() => {
    const r = ejecutarSeguro(actividad.codigo, actividad.entradas ?? [], { traza: true })
    return r.ok ? r.traza : []
  }, [actividad])

  const [celdas, setCeldas] = useState({})
  const [verReal, setVerReal] = useState(false)
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null
  const vars = actividad.variables

  // Solo se piden las filas donde algo cambia respecto de la anterior.
  const filas = useMemo(
    () =>
      traza.map((paso, i) => ({
        ...paso,
        cambia: vars.filter((v) => (traza[i - 1]?.variables?.[v] ?? '—') !== (paso.variables[v] ?? '—')),
      })),
    [traza, vars],
  )

  function valorEsperado(i, v) {
    return filas[i]?.variables?.[v] ?? '—'
  }

  function celdaOk(i, v) {
    const esperado = valorEsperado(i, v)
    const escrito = (celdas[`${i}-${v}`] ?? '').trim().replace(',', '.')
    if (esperado === '—') return escrito === '' || escrito === '—' || escrito === '-'
    return escrito === esperado || Number(escrito) === Number(esperado)
  }

  const completo = filas.every((_, i) => vars.every((v) => (celdas[`${i}-${v}`] ?? '').trim() !== ''))

  async function verificar() {
    const fallos = []
    filas.forEach((_, i) => vars.forEach((v) => !celdaOk(i, v) && fallos.push(`paso ${i + 1}, ${v}`)))
    const correcto = fallos.length === 0
    await ctrl.enviar(correcto, {
      datos: { celdas },
      mensaje: correcto
        ? `Trazaste correctamente los ${filas.length} pasos.`
        : `${filas.length * vars.length - fallos.length} de ${filas.length * vars.length} casillas correctas.`,
    })
  }

  if (filas.length === 0) {
    return <p className="aviso aviso--error">El algoritmo de esta actividad no se pudo ejecutar.</p>
  }

  return (
    <div className="juego juego--traza">
      <figure className="bloque-codigo">
        <figcaption>Algoritmo</figcaption>
        <pre>{actividad.codigo}</pre>
      </figure>

      <p className="ayuda-teclado">
        Escribe el valor de cada variable justo después de ejecutar la instrucción de esa fila. Si
        una variable todavía no tiene valor, escribe un guion.
      </p>

      <div className="tabla-envoltura">
        <table className="tabla tabla--traza">
          <thead>
            <tr>
              <th>Paso</th>
              <th>Instrucción</th>
              {vars.map((v) => (
                <th key={v}>
                  <code>{v}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={i} className={revisado ? (vars.every((v) => celdaOk(i, v)) ? 'fila--ok' : 'fila--mal') : ''}>
                <td>{i + 1}</td>
                <td>
                  <code>{f.instruccion}</code>
                  <span className="traza__linea">línea {f.linea}</span>
                </td>
                {vars.map((v) => {
                  const bien = revisado && celdaOk(i, v)
                  const mal = revisado && !celdaOk(i, v)
                  return (
                    <td key={v}>
                      <input
                        className={`campo campo--celda ${bien ? 'campo--ok' : ''} ${mal ? 'campo--mal' : ''}`}
                        value={celdas[`${i}-${v}`] ?? ''}
                        disabled={bloqueado}
                        aria-label={`Valor de ${v} en el paso ${i + 1}`}
                        onChange={(e) => {
                          setCeldas((p) => ({ ...p, [`${i}-${v}`]: e.target.value }))
                          if (revisado) ctrl.reintentar()
                        }}
                      />
                      {(mal || verReal) && <span className="traza__real">{valorEsperado(i, v)}</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="acciones">
        {!bloqueado && (
          <button
            type="button"
            className="boton boton--principal"
            onClick={verificar}
            disabled={!completo || ctrl.enviando}
          >
            {completo ? 'Verificar la traza' : 'Completa toda la tabla'}
          </button>
        )}
        {(bloqueado || revisado) && (
          <button type="button" className="boton boton--texto" onClick={() => setVerReal((v) => !v)}>
            {verReal ? 'Ocultar la traza real' : 'Ver la traza que produce el intérprete'}
          </button>
        )}
      </div>
    </div>
  )
}

/* ============================= ARMAR ALGORITMO ============================ */
/*
 * El algoritmo armado SE EJECUTA contra los casos de prueba. No se compara con
 * un orden guardado, así que cualquier orden que funcione se acepta.
 */

export function ArmarAlgoritmo({ actividad, ctrl }) {
  const inicial = useMemo(() => mezclar(actividad.bloques, actividad.id), [actividad])
  const [orden, setOrden] = useState(inicial)
  const [resultados, setResultados] = useState(null)
  const bloqueado = ctrl.acertado

  const codigo = useMemo(
    () =>
      [
        actividad.cabecera,
        ...orden.map((b) => '\t'.repeat(b.indent) + b.codigo),
        actividad.pie,
      ].join('\n'),
    [orden, actividad],
  )

  function mover(i, delta) {
    if (bloqueado) return
    const j = i + delta
    if (j < 0 || j >= orden.length) return
    const copia = [...orden]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    setOrden(copia)
    setResultados(null)
    if (ctrl.resultado) ctrl.reintentar()
  }

  function moverA(i, destino) {
    if (bloqueado || destino === i || destino < 0 || destino >= orden.length) return
    const copia = [...orden]
    const [item] = copia.splice(i, 1)
    copia.splice(destino, 0, item)
    setOrden(copia)
    setResultados(null)
    if (ctrl.resultado) ctrl.reintentar()
  }

  async function verificar() {
    const res = evaluarCasos(codigo, actividad.casos)
    setResultados(res)
    const correcto = res.every((r) => r.ok)
    await ctrl.enviar(correcto, {
      datos: { orden: orden.map((b) => b.id) },
      mensaje: correcto
        ? 'Tu algoritmo pasa todos los casos de prueba, incluidos los límites.'
        : `Pasan ${res.filter((r) => r.ok).length} de ${res.length} casos.`,
    })
  }

  return (
    <div className="juego juego--armar">
      <p className="ayuda-teclado">
        Ordena los bloques con los botones o el selector de posición. La sangría ya está puesta.
      </p>
      <ol className="bloques">
        <li className="bloques__fijo">
          <code>{actividad.cabecera}</code>
        </li>
        {orden.map((b, i) => (
          <li key={b.id} className="bloques__item" style={{ '--sangria': b.indent }}>
            <code className="bloques__codigo">{b.codigo}</code>
            <span className="orden__controles">
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0 || bloqueado} aria-label={`Subir bloque: ${b.codigo}`}>
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === orden.length - 1 || bloqueado}
                aria-label={`Bajar bloque: ${b.codigo}`}
              >
                ↓
              </button>
              <label className="orden__salto">
                <span className="visualmente-oculto">Mover a la posición</span>
                <select value={i} disabled={bloqueado} onChange={(e) => moverA(i, Number(e.target.value))}>
                  {orden.map((_, k) => (
                    <option key={k} value={k}>
                      {k + 1}
                    </option>
                  ))}
                </select>
              </label>
            </span>
          </li>
        ))}
        <li className="bloques__fijo">
          <code>{actividad.pie}</code>
        </li>
      </ol>

      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
          Ejecutar contra los casos de prueba
        </button>
      )}

      {resultados && <TablaCasos resultados={resultados} />}
    </div>
  )
}

/* =========================== COMPLETAR PSEUDOCÓDIGO ======================= */

export function Completar({ actividad, ctrl }) {
  const claves = Object.keys(actividad.huecos)
  const [elegidas, setElegidas] = useState({})
  const [resultados, setResultados] = useState(null)
  const [traza, setTraza] = useState(null)
  const bloqueado = ctrl.acertado
  const completo = claves.every((k) => elegidas[k] !== undefined)

  const codigo = useMemo(() => {
    let c = actividad.plantilla
    for (const k of claves) c = c.replaceAll(`{{${k}}}`, elegidas[k] ?? `{{${k}}}`)
    return c
  }, [actividad, elegidas, claves])

  async function verificar() {
    const res = evaluarCasos(codigo, actividad.casos)
    setResultados(res)
    const correcto = res.every((r) => r.ok)
    if (correcto && actividad.mostrarTraza) {
      const r = ejecutarSeguro(codigo, actividad.trazaEntradas ?? [], { traza: true })
      if (r.ok) setTraza(r.traza)
    }
    await ctrl.enviar(correcto, {
      datos: { elegidas },
      mensaje: correcto ? 'El algoritmo completo pasa todos los casos.' : `Pasan ${res.filter((r) => r.ok).length} de ${res.length} casos.`,
      detalle: correcto ? null : <FeedbackHuecos actividad={actividad} elegidas={elegidas} />,
    })
  }

  return (
    <div className="juego juego--completar">
      <div className="huecos">
        {claves.map((k) => (
          <label key={k} className="hueco">
            <span className="hueco__etiqueta">{actividad.huecos[k].etiqueta}</span>
            <select
              value={elegidas[k] ?? ''}
              disabled={bloqueado}
              onChange={(e) => {
                setElegidas((p) => ({ ...p, [k]: e.target.value }))
                setResultados(null)
                if (ctrl.resultado) ctrl.reintentar()
              }}
            >
              <option value="">Elige…</option>
              {actividad.huecos[k].opciones.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {actividad.huecos[k].nota && bloqueado && (
              <span className="hueco__nota">{actividad.huecos[k].nota}</span>
            )}
          </label>
        ))}
      </div>

      <figure className="bloque-codigo">
        <figcaption>Cómo queda el algoritmo</figcaption>
        <pre>{codigo}</pre>
      </figure>

      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Ejecutar contra los casos de prueba' : 'Completa todos los huecos'}
        </button>
      )}

      {resultados && <TablaCasos resultados={resultados} />}
      {traza && <VistaTraza traza={traza} />}
    </div>
  )
}

function FeedbackHuecos({ actividad, elegidas }) {
  const mensajes = []
  for (const [k, hueco] of Object.entries(actividad.huecos)) {
    const v = elegidas[k]
    const razon = hueco.porQueNo?.[v]
    if (razon) mensajes.push({ etiqueta: hueco.etiqueta, valor: v, razon })
  }
  if (mensajes.length === 0) return null
  return (
    <ul className="resultado__lista">
      {mensajes.map((m, i) => (
        <li key={i}>
          <strong>
            {m.etiqueta}: <code>{m.valor}</code>
          </strong>{' '}
          {m.razon}
        </li>
      ))}
    </ul>
  )
}

function VistaTraza({ traza }) {
  const vars = Object.keys(traza[0]?.variables ?? {})
  return (
    <details className="traza-detalle" open>
      <summary>Evolución de las variables</summary>
      <div className="tabla-envoltura">
        <table className="tabla tabla--traza">
          <thead>
            <tr>
              <th>Paso</th>
              <th>Instrucción</th>
              {vars.map((v) => (
                <th key={v}>
                  <code>{v}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {traza.map((p, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <code>{p.instruccion}</code>
                </td>
                {vars.map((v) => (
                  <td key={v}>{p.variables[v]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

/* ============================== PSEUDOCÓDIGO ============================== */

export function Pseudo({ actividad, ctrl }) {
  const [codigo, setCodigo] = useState(actividad.plantilla)
  const [resultados, setResultados] = useState(null)
  const [verSolucion, setVerSolucion] = useState(false)
  const bloqueado = ctrl.acertado

  async function verificar() {
    const res = evaluarCasos(codigo, actividad.casos)
    setResultados(res)
    const correcto = res.every((r) => r.ok)
    await ctrl.enviar(correcto, {
      datos: { longitud: codigo.length },
      mensaje: correcto
        ? 'Todas las pruebas pasan, incluidos los casos límite.'
        : `Pasan ${res.filter((r) => r.ok).length} de ${res.length} casos. Abajo se detalla cuál falló y con qué entrada.`,
    })
  }

  function mostrarSolucion() {
    setVerSolucion(true)
    ctrl.verSolucion()
  }

  return (
    <div className="juego juego--pseudo">
      {actividad.requisitos && (
        <div className="requisitos">
          <p className="requisitos__titulo">Lo que debe hacer</p>
          <ul>
            {actividad.requisitos.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <Editor valor={codigo} alCambiar={setCodigo} etiqueta="Editor de pseudocódigo" filas={16} deshabilitado={bloqueado} />

      <div className="acciones">
        {!bloqueado && (
          <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
            Ejecutar pruebas
          </button>
        )}
        <button
          type="button"
          className="boton boton--texto"
          onClick={() => {
            setCodigo(actividad.plantilla)
            setResultados(null)
          }}
        >
          Volver a la plantilla
        </button>
        {!bloqueado && actividad.solucion && !verSolucion && (
          <button type="button" className="boton boton--texto" onClick={mostrarSolucion}>
            Ver una solución · esta actividad pasaría a valer 0 puntos
          </button>
        )}
      </div>

      {resultados && <TablaCasos resultados={resultados} />}

      {(verSolucion || bloqueado) && actividad.solucion && (
        <details className="solucion" open={verSolucion}>
          <summary>Una solución posible</summary>
          <figure className="bloque-codigo">
            <pre>{actividad.solucion}</pre>
          </figure>
          <p className="solucion__nota">
            No es la única. Cualquier algoritmo que pase los casos de prueba es válido.
          </p>
        </details>
      )}
    </div>
  )
}
