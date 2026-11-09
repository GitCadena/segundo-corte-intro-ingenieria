import { useMemo, useState } from 'react'
import { correr, valorDeEntrada, valorSimple } from '../lib/interprete.js'
import {
  CASO_EJEMPLO,
  ESPERADO_EJEMPLO,
  EXPLICACION_FALLA,
  LINEAS_CON_FALLA,
  LINEAS_EJEMPLO,
  LINEA_DE_LA_FALLA,
  PSEUDO_CON_FALLA,
  PSEUDO_EJEMPLO,
  textoDeLineas,
} from '../data/pseudocodigo.js'

const PERMUTACION = [8, 2, 12, 0, 5, 14, 3, 10, 6, 1, 13, 9, 4, 11, 7]
const entradasEjemplo = () => ({ productos: valorDeEntrada(CASO_EJEMPLO, 'lista').valor })
const fmt = (n) => new Intl.NumberFormat('es-CO').format(n)

/**
 * Bloque A · Aprende con el ejemplo (unos 8 minutos). Es guiado y no se guarda:
 * sirve para entender cómo se escribe y cómo se comprueba un algoritmo.
 */
export default function Aprende() {
  const [paso1Hecho, setPaso1Hecho] = useState(false)
  const [paso2Hecho, setPaso2Hecho] = useState(false)

  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-aprende">
      <h2 id="tc-aprende" className="tc-bloque__titulo">A · Aprende con el ejemplo</h2>
      <p className="tc-objetivo">
        La panadería «La Esquina» calcula el total de un pedido: suma cada producto y, si el pedido tiene 10 unidades o más, descuenta el
        10 %. Van a ordenar el algoritmo, predecir qué valores toman las variables y encontrar una falla. Son unos 8 minutos y no cuenta para la entrega.
      </p>
      <Paso1 hecho={paso1Hecho} onHecho={() => setPaso1Hecho(true)} />
      <Paso2 habilitado={paso1Hecho} hecho={paso2Hecho} onHecho={() => setPaso2Hecho(true)} />
      <Paso3 habilitado={paso2Hecho} />
    </section>
  )
}

/* ------------------------------ Paso 1: ordenar ------------------------------ */

function Paso1({ hecho, onHecho }) {
  const [orden, setOrden] = useState(() => PERMUTACION.map((i) => LINEAS_EJEMPLO[i].id))
  const [mensaje, setMensaje] = useState(null)
  const [fallos, setFallos] = useState(0)
  const [arrastrado, setArrastrado] = useState(null)
  const porId = useMemo(() => Object.fromEntries(LINEAS_EJEMPLO.map((l) => [l.id, l])), [])

  const mover = (desde, hasta) => {
    if (hasta < 0 || hasta >= orden.length || desde === hasta) return
    const copia = [...orden]
    const [x] = copia.splice(desde, 1)
    copia.splice(hasta, 0, x)
    setOrden(copia)
    setMensaje(null)
  }

  function comprobar() {
    const texto = textoDeLineas(orden.map((id) => porId[id]))
    const r = correr(texto, entradasEjemplo())
    if (!r.ok && r.errores?.length > 0) {
      setFallos((n) => n + 1)
      setMensaje({ ok: false, texto: `Todavía no se puede ejecutar: ${r.errores[0].mensaje} ${r.errores[0].pista ?? ''}` })
    } else if (!r.ok) {
      setFallos((n) => n + 1)
      setMensaje({ ok: false, texto: `Al ejecutarlo falla: ${r.error.mensaje} ${r.error.pista ?? ''}` })
    } else if (Math.abs(r.resultado - ESPERADO_EJEMPLO) > 0.005) {
      setFallos((n) => n + 1)
      setMensaje({ ok: false, texto: `Se ejecuta, pero da ${fmt(r.resultado)} y debería dar ${fmt(ESPERADO_EJEMPLO)}. Revisa el orden de las líneas de cuenta.` })
    } else {
      setMensaje({ ok: true, texto: 'Bien: el algoritmo se ejecuta y da 31.500. Fíjate en el orden: primero se prepara (PROCESO, ENTRADA, variables en 0), luego se repite, luego se decide y al final sale el resultado.' })
      onHecho()
    }
  }

  function verSolucion() {
    setOrden(LINEAS_EJEMPLO.map((l) => l.id))
    setMensaje({ ok: true, texto: 'Este es el orden correcto. Léelo de arriba abajo antes de seguir.' })
    onHecho()
  }

  return (
    <div className="tc-paso">
      <h3>Paso 1 · Ordena las líneas</h3>
      <p>Las líneas del algoritmo están desordenadas. Arrástralas (o usa los botones ↑ ↓) hasta que se pueda ejecutar y dé el total correcto.</p>
      <ol className="tc-orden" aria-label="Líneas del algoritmo">
        {orden.map((id, i) => {
          const l = porId[id]
          return (
            <li
              key={id}
              className={`tc-orden__linea${arrastrado === i ? ' tc-orden__linea--arrastrando' : ''}`}
              style={{ paddingLeft: `${0.6 + l.s * 1.4}rem` }}
              draggable={!hecho}
              onDragStart={(e) => {
                setArrastrado(i)
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', String(i))
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                mover(Number(e.dataTransfer.getData('text/plain')), i)
                setArrastrado(null)
              }}
              onDragEnd={() => setArrastrado(null)}
            >
              <code>{l.texto}</code>
              {!hecho && (
                <span className="tc-orden__botones">
                  <button type="button" className="boton boton--texto boton--pequeno" aria-label={`Subir la línea «${l.texto}»`} disabled={i === 0} onClick={() => mover(i, i - 1)}>↑</button>
                  <button type="button" className="boton boton--texto boton--pequeno" aria-label={`Bajar la línea «${l.texto}»`} disabled={i === orden.length - 1} onClick={() => mover(i, i + 1)}>↓</button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!hecho && (
        <div className="tc-acciones">
          <button type="button" className="boton boton--principal" onClick={comprobar}>Comprobar el orden</button>
          {fallos >= 2 && <button type="button" className="boton boton--texto" onClick={verSolucion}>Mostrar el orden correcto y seguir</button>}
        </div>
      )}
      {mensaje && <p className={`aviso ${mensaje.ok ? 'aviso--ok' : 'aviso--error'}`} role="status">{mensaje.texto}</p>}
    </div>
  )
}

/* ------------------------- Paso 2: predecir la prueba de escritorio ------------------------- */

function Paso2({ habilitado, hecho, onHecho }) {
  const pasos = useMemo(() => {
    const r = correr(PSEUDO_EJEMPLO, entradasEjemplo())
    return r.pasos.filter((p) => p.texto.includes('←') && !p.texto.startsWith('descuento'))
  }, [])
  const [i, setI] = useState(0)
  const [resp, setResp] = useState({ total: '', unidades: '' })
  const [revelado, setRevelado] = useState(false)
  const [aciertos, setAciertos] = useState(0)

  if (!habilitado) {
    return (
      <div className="tc-paso tc-paso--cerrado">
        <h3>Paso 2 · Predice la prueba de escritorio</h3>
        <p>Primero termina el paso 1.</p>
      </div>
    )
  }
  if (hecho) {
    return (
      <div className="tc-paso">
        <h3>Paso 2 · Predice la prueba de escritorio</h3>
        <p className="aviso aviso--ok" role="status">
          Terminaste la prueba de escritorio del ejemplo: acertaste {aciertos} de {pasos.length * 2} valores. Esa tabla de «qué vale cada variable después de cada
          línea» es exactamente lo que harán con su propio algoritmo en el bloque C.
        </p>
      </div>
    )
  }

  const p = pasos[i]
  const real = {
    total: p.vars.total !== undefined ? Number(String(p.vars.total).replace(',', '.')) : null,
    unidades: p.vars.unidades !== undefined ? Number(String(p.vars.unidades).replace(',', '.')) : null,
  }
  const acerto = (k) => real[k] === null || valorSimple(resp[k]) === real[k]

  function comprobar() {
    setRevelado(true)
    setAciertos((n) => n + ['total', 'unidades'].filter((k) => real[k] === null || acerto(k)).length)
  }
  function siguiente() {
    if (i + 1 >= pasos.length) onHecho()
    else {
      setI(i + 1)
      setResp({ total: '', unidades: '' })
      setRevelado(false)
    }
  }

  return (
    <div className="tc-paso">
      <h3>Paso 2 · Predice la prueba de escritorio</h3>
      <p>
        Pedido: 10 panes a $500 y 2 tortas a $15.000. Antes de ver los valores, escribe cuánto vale cada variable <strong>después de ejecutar la línea</strong>.
        Cuenta {i + 1} de {pasos.length}.
      </p>
      <p className="tc-linea-actual"><span className="etiqueta-campo">Línea que se ejecuta</span><code>{p.texto}</code></p>
      <div className="tc-prediccion">
        {['total', 'unidades'].map((k) => (
          <div key={k} className="campo-envoltura">
            <label className="campo-envoltura__etiqueta" htmlFor={`pred-${k}`}>¿Cuánto vale «{k}»?</label>
            {real[k] === null ? (
              <input id={`pred-${k}`} className="campo campo--mini" value="todavía sin valor" disabled />
            ) : (
              <input
                id={`pred-${k}`}
                className={`campo campo--mini${revelado ? (acerto(k) ? ' campo--ok' : ' campo--mal') : ''}`}
                inputMode="decimal"
                value={resp[k]}
                disabled={revelado}
                onChange={(e) => setResp((r) => ({ ...r, [k]: e.target.value }))}
              />
            )}
            {revelado && real[k] !== null && (
              <span className="campo-envoltura__ayuda">{acerto(k) ? '✓ Correcto' : `Valía ${fmt(real[k])}`}</span>
            )}
          </div>
        ))}
      </div>
      {revelado && (
        <p className="tc-pista" role="status">
          {p.nota}. {explicacion(p)}
        </p>
      )}
      <div className="tc-acciones">
        {!revelado ? (
          <button type="button" className="boton boton--principal" onClick={comprobar} disabled={['total', 'unidades'].some((k) => real[k] !== null && resp[k].trim() === '')}>
            Comprobar
          </button>
        ) : (
          <button type="button" className="boton boton--principal" onClick={siguiente}>
            {i + 1 >= pasos.length ? 'Terminar' : 'Siguiente línea'}
          </button>
        )}
      </div>
    </div>
  )
}

function explicacion(p) {
  if (p.texto.startsWith('total ← 0')) return 'Se empieza en cero para ir sumando.'
  if (p.texto.startsWith('unidades ← 0')) return 'El contador de unidades también empieza en cero.'
  if (p.texto.includes('item.cantidad ×')) return 'Se suma lo que cuesta este producto: cantidad × precio. El total anterior se conserva y se le agrega esto.'
  if (p.texto.includes('item.cantidad') && p.texto.startsWith('unidades')) return 'Se cuentan las unidades de este producto sin tocar el total.'
  if (p.texto.includes('− descuento')) return 'Al total completo se le resta el descuento que se calculó antes: 35.000 − 3.500.'
  return ''
}

/* ----------------------------- Paso 3: encontrar el error ----------------------------- */

function Paso3({ habilitado }) {
  const [elegida, setElegida] = useState(null)
  const [fallos, setFallos] = useState(0)
  const r = useMemo(() => correr(PSEUDO_CON_FALLA, entradasEjemplo()), [])

  if (!habilitado) {
    return (
      <div className="tc-paso tc-paso--cerrado">
        <h3>Paso 3 (opcional) · Encuentra el error</h3>
        <p>Primero termina el paso 2.</p>
      </div>
    )
  }
  const acerto = elegida === LINEA_DE_LA_FALLA

  return (
    <div className="tc-paso">
      <h3>Paso 3 (opcional) · Encuentra el error</h3>
      <p>
        Esta versión tiene una falla. Con el mismo pedido (12 unidades) debería dar <strong>{fmt(ESPERADO_EJEMPLO)}</strong>, pero da{' '}
        <strong>{fmt(r.resultado)}</strong>. Toca la línea donde está el error.
      </p>
      <ol className="tc-orden" aria-label="Algoritmo con una falla">
        {LINEAS_CON_FALLA.map((l) => (
          <li key={l.id} style={{ paddingLeft: `${0.6 + l.s * 1.4}rem` }}>
            <button
              type="button"
              className={`tc-orden__elegir${elegida === l.id ? (acerto ? ' tc-orden__elegir--ok' : ' tc-orden__elegir--mal') : ''}`}
              onClick={() => {
                setElegida(l.id)
                if (l.id !== LINEA_DE_LA_FALLA) setFallos((n) => n + 1)
              }}
              aria-pressed={elegida === l.id}
            >
              <code>{l.texto}</code>
            </button>
          </li>
        ))}
      </ol>
      {elegida && !acerto && (
        <p className="aviso aviso--nota" role="status">
          Esa línea no es. {fallos >= 2 ? 'Pista: mira qué condición decide si hay descuento y compárala con la regla («10 unidades o más»).' : 'Piensa en qué línea decide si el pedido recibe descuento.'}
        </p>
      )}
      {acerto && (
        <p className="aviso aviso--ok" role="status">
          ¡Esa es! {EXPLICACION_FALLA}
        </p>
      )}
    </div>
  )
}
