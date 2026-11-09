import { useMemo, useState } from 'react'
import { correr, valorDeEntrada } from '../lib/interprete.js'
import {
  CASO_EJEMPLO,
  ESPERADO_EJEMPLO,
  EXPLICACION_FALLA,
  LINEAS_CON_FALLA,
  LINEAS_EJEMPLO,
  LINEA_DE_LA_FALLA,
  PSEUDO_CON_FALLA,
  PSEUDO_EJEMPLO,
} from '../data/pseudocodigo.js'

const PALETA = ['#2563eb', '#dc2626', '#ea580c', '#16a34a', '#9333ea', '#0d9488', '#c2410c', '#0891b2', '#a21caf', '#4f46e5']
const entradasEjemplo = () => ({ productos: valorDeEntrada(CASO_EJEMPLO, 'lista').valor })
const fmt = (n) => new Intl.NumberFormat('es-CO').format(n)

/* ============================ contenido del juego 1 ============================ */

const ZONAS_ESTRUCTURA = [
  { id: 'preparar', titulo: '1. Preparar', ayuda: 'Cómo se llama, qué datos entran y con qué valores se empieza.' },
  { id: 'repetir', titulo: '2. Repetir', ayuda: 'Lo que se hace una vez por cada producto.' },
  { id: 'decidir', titulo: '3. Decidir', ayuda: 'Qué pasa si se cumple una condición y qué pasa si no.' },
  { id: 'entregar', titulo: '4. Entregar', ayuda: 'El cálculo final y lo que sale del proceso.' },
]

const DATOS_FICHAS = {
  l1: ['preparar', 'Todo algoritmo empieza diciendo cómo se llama el proceso.'],
  l2: ['preparar', 'Las entradas van primero: son los datos con los que se trabaja.'],
  l3: ['preparar', 'Los acumuladores (total, unidades) se dejan en 0 antes de empezar a sumar.'],
  l4: ['preparar', 'Los acumuladores (total, unidades) se dejan en 0 antes de empezar a sumar.'],
  l5: ['repetir', 'Esta línea abre el ciclo: lo de adentro se repite una vez por cada producto.'],
  l6: ['repetir', 'Se hace una vez por cada producto, por eso va dentro del ciclo.'],
  l7: ['repetir', 'Se hace una vez por cada producto, por eso va dentro del ciclo.'],
  l8: ['repetir', 'Cierra el ciclo que abrió «PARA CADA».'],
  l9: ['decidir', 'Aquí se decide si hay descuento. Se pregunta cuando ya se sumó todo el pedido.'],
  l10: ['decidir', 'Es lo que pasa cuando la condición es verdadera: hay descuento.'],
  l11: ['decidir', '«SI NO» separa lo que pasa cuando la condición es falsa.'],
  l12: ['decidir', 'Es lo que pasa cuando la condición es falsa: no hay descuento.'],
  l13: ['decidir', 'Cierra la decisión que abrió «SI».'],
  l14: ['entregar', 'Con el descuento ya calculado, se obtiene el total final.'],
  l15: ['entregar', 'La salida va al final: es lo que el proceso entrega.'],
}

// Las fichas se muestran desordenadas, de forma fija (no cambian al recargar).
const ORDEN_DE_FICHAS = [8, 2, 12, 0, 5, 14, 3, 10, 6, 1, 13, 9, 4, 11, 7]
const FICHAS_ESTRUCTURA = ORDEN_DE_FICHAS.map((i) => LINEAS_EJEMPLO[i]).map((l) => ({ ...l, zona: DATOS_FICHAS[l.id][0], porque: DATOS_FICHAS[l.id][1] }))

/**
 * Bloque A · Aprende con el ejemplo (unos 8 minutos). Son juegos de arrastrar,
 * como «Diseca un sistema real»: no se guardan y no cuentan para entregar; sirven
 * para entender cómo se organiza un algoritmo y cómo se comprueba a mano.
 */
export default function Aprende() {
  const [j1, setJ1] = useState(false)
  const [j2, setJ2] = useState(false)

  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-aprende">
      <h2 id="tc-aprende" className="tc-bloque__titulo">A · Aprende con el ejemplo</h2>
      <p className="tc-objetivo">
        La panadería «La Esquina» calcula el total de un pedido: suma cada producto y, si el pedido tiene 10 unidades o más, descuenta el 10 %.
        Son tres juegos cortos (unos 8 minutos): armar el algoritmo, hacer su prueba de escritorio y encontrar una falla. No cuentan para entregar.
      </p>
      <Juego1 hecho={j1} onHecho={() => setJ1(true)} />
      <Juego2 habilitado={j1} hecho={j2} onHecho={() => setJ2(true)} />
      <Juego3 habilitado={j2} />
    </section>
  )
}

/* ======================= Juego 1 · arma el algoritmo (arrastrar) ======================= */

function Juego1({ hecho, onHecho }) {
  const [ubic, setUbic] = useState({}) // fichaId → zonaId
  const [seleccion, setSeleccion] = useState(null)
  const [revisado, setRevisado] = useState(false)
  const [fallos, setFallos] = useState(0)

  const colocadas = Object.keys(ubic).length
  const completo = colocadas === FICHAS_ESTRUCTURA.length
  const bien = (f) => ubic[f.id] === f.zona

  const mover = (id, zona) => {
    if (hecho) return
    setUbic((p) => ({ ...p, [id]: zona }))
    setSeleccion(null)
    setRevisado(false)
  }
  const devolver = (id) => {
    if (hecho) return
    setUbic((p) => {
      const n = { ...p }
      delete n[id]
      return n
    })
    setRevisado(false)
  }

  function comprobar() {
    setRevisado(true)
    if (FICHAS_ESTRUCTURA.every(bien)) onHecho()
    else setFallos((n) => n + 1)
  }
  function solucion() {
    setUbic(Object.fromEntries(FICHAS_ESTRUCTURA.map((f) => [f.id, f.zona])))
    setRevisado(true)
    onHecho()
  }

  return (
    <div className="tc-paso">
      <h3>Juego 1 · Arma el algoritmo</h3>
      <p>
        Estas son las 15 líneas de <code>calcularTotal</code>, desordenadas. Arrástralas (o toca una y luego «Colocar aquí») al bloque al que pertenecen:
        todo algoritmo se arma con las mismas cuatro partes.
      </p>
      <div className="diseca">
        <div className="diseca__banco" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
          e.preventDefault()
          const id = e.dataTransfer.getData('text/plain')
          if (FICHAS_ESTRUCTURA.some((f) => f.id === id)) devolver(id)
        }}>
          <p className="etiqueta-campo">Líneas por ubicar ({FICHAS_ESTRUCTURA.length - colocadas})</p>
          <div className="diseca__fichas">
            {FICHAS_ESTRUCTURA.map((f, i) =>
              ubic[f.id] !== undefined ? null : (
                <button
                  key={f.id}
                  type="button"
                  className={'diseca__ficha tc-ficha-codigo' + (seleccion === f.id ? ' diseca__ficha--elegida' : '')}
                  style={{ background: PALETA[i % PALETA.length] }}
                  draggable={!hecho}
                  disabled={hecho}
                  aria-pressed={seleccion === f.id}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', f.id)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onClick={() => setSeleccion((s) => (s === f.id ? null : f.id))}
                >
                  {f.texto}
                </button>
              ),
            )}
            {completo && <p className="diseca__vacio">Todas las líneas están en un bloque. ¡Revisa tu armado!</p>}
          </div>
        </div>

        <div className="diseca__zonas">
          {ZONAS_ESTRUCTURA.map((z) => {
            const dentro = FICHAS_ESTRUCTURA.filter((f) => ubic[f.id] === z.id)
            return (
              <div key={z.id} className="diseca__zona">
                <div className="diseca__zona-cabecera">
                  <h4>{z.titulo}</h4>
                  <span className="diseca__zona-conteo">{dentro.length}</span>
                </div>
                <p className="diseca__zona-ayuda">{z.ayuda}</p>
                <div className="diseca__zona-lista" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                  e.preventDefault()
                  const id = e.dataTransfer.getData('text/plain')
                  if (FICHAS_ESTRUCTURA.some((f) => f.id === id)) mover(id, z.id)
                }}>
                  {dentro.map((f) => (
                    <div key={f.id} className={'diseca__colocada' + (revisado && bien(f) ? ' diseca__colocada--ok' : '') + (revisado && !bien(f) ? ' diseca__colocada--mal' : '')}>
                      <p>
                        {revisado && <span aria-hidden="true">{bien(f) ? '✓ ' : '✗ '}</span>}
                        <code>{f.texto}</code>
                      </p>
                      {revisado && !bien(f) && <p className="diseca__porque">{f.porque}</p>}
                      {!hecho && (
                        <button type="button" className="boton boton--texto" onClick={() => devolver(f.id)}>Quitar</button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="boton boton--secundario boton--pequeno diseca__colocar"
                  disabled={seleccion === null || hecho}
                  onClick={() => mover(seleccion, z.id)}
                >
                  Colocar aquí
                </button>
              </div>
            )
          })}
        </div>
        <p className="diseca__progreso">{colocadas} de {FICHAS_ESTRUCTURA.length} líneas ubicadas</p>
      </div>

      {!hecho && (
        <div className="tc-acciones">
          <button type="button" className="boton boton--principal" onClick={comprobar} disabled={!completo}>
            {completo ? 'Revisar mi armado' : 'Ubica todas las líneas para revisar'}
          </button>
          {fallos >= 2 && <button type="button" className="boton boton--texto" onClick={solucion}>Mostrar cómo queda y seguir</button>}
        </div>
      )}
      {revisado && !hecho && <p className="aviso aviso--nota" role="status">Las marcadas con ✗ están en otro bloque. Lee el motivo y muévelas.</p>}
      {hecho && (
        <div className="aviso aviso--ok" role="status">
          <p>
            Así queda armado. Casi todos los algoritmos tienen estas cuatro partes: <strong>preparar</strong>, <strong>repetir</strong>, <strong>decidir</strong> y{' '}
            <strong>entregar</strong>. Revisa que el tuyo las tenga.
          </p>
          <pre className="tc-codigo-final">{PSEUDO_EJEMPLO}</pre>
        </div>
      )}
    </div>
  )
}

/* ================= Juego 2 · prueba de escritorio con fichas de valores ================= */

function pasosDelEjemplo() {
  const r = correr(PSEUDO_EJEMPLO, entradasEjemplo())
  return r.pasos.filter((p) => p.texto.includes('←') && !p.texto.startsWith('descuento'))
}
const numero = (s) => (s === undefined ? null : Number(String(s).replace(',', '.')))

function Juego2({ habilitado, hecho, onHecho }) {
  const pasos = useMemo(pasosDelEjemplo, [])
  const filas = useMemo(
    () =>
      pasos.map((p) => ({
        paso: p.paso,
        linea: p.linea,
        texto: p.texto,
        total: numero(p.vars.total),
        unidades: numero(p.vars.unidades),
      })),
    [pasos],
  )
  // Fichas de valores: los que aparecen en la tabla más algunos que confunden.
  const fichas = useMemo(() => {
    const reales = new Set(filas.flatMap((f) => [f.total, f.unidades]).filter((v) => v !== null))
    ;[15000, 500, 50000, 2].forEach((v) => reales.add(v))
    return [...reales].sort((a, b) => a - b)
  }, [filas])

  const [celdas, setCeldas] = useState({})
  const [seleccion, setSeleccion] = useState(null)
  const [estado, setEstado] = useState(null) // { 'i-var': true|false }
  const [intentos, setIntentos] = useState(0)

  if (!habilitado) {
    return (
      <div className="tc-paso tc-paso--cerrado">
        <h3>Juego 2 · Haz la prueba de escritorio</h3>
        <p>Primero arma el algoritmo del juego 1.</p>
      </div>
    )
  }

  const clave = (i, v) => `${i}-${v}`
  const pedidas = filas.flatMap((f, i) => ['total', 'unidades'].filter((v) => f[v] !== null).map((v) => clave(i, v)))
  const llenas = pedidas.filter((k) => celdas[k] !== undefined).length

  const poner = (k, valor) => {
    if (hecho) return
    setCeldas((p) => ({ ...p, [k]: valor }))
    setSeleccion(null)
    setEstado(null)
  }
  const quitar = (k) => {
    if (hecho) return
    setCeldas((p) => {
      const n = { ...p }
      delete n[k]
      return n
    })
    setEstado(null)
  }

  function comprobar() {
    const ok = {}
    filas.forEach((f, i) => ['total', 'unidades'].forEach((v) => {
      if (f[v] !== null) ok[clave(i, v)] = celdas[clave(i, v)] === f[v]
    }))
    setEstado(ok)
    setIntentos((n) => n + 1)
    if (Object.values(ok).every(Boolean)) onHecho()
  }
  function mostrar() {
    const todas = {}
    filas.forEach((f, i) => ['total', 'unidades'].forEach((v) => { if (f[v] !== null) todas[clave(i, v)] = f[v] }))
    setCeldas(todas)
    setEstado(Object.fromEntries(Object.keys(todas).map((k) => [k, true])))
    onHecho()
  }

  return (
    <div className="tc-paso">
      <h3>Juego 2 · Haz la prueba de escritorio</h3>
      <p>
        Una prueba de escritorio es seguir el algoritmo <strong>como si fueras el computador</strong>: una línea a la vez, anotando cuánto vale cada variable
        <strong> después</strong> de ejecutarla. El pedido es de 10 panes a $500 y 2 tortas a $15.000. Arrastra cada valor a su casilla (o toca el valor y luego la casilla).
      </p>
      <p className="etiqueta-campo">Valores</p>
      <div className="tc-valores" role="group" aria-label="Valores para ubicar">
        {fichas.map((v, i) => (
          <button
            key={v}
            type="button"
            className={'diseca__ficha tc-valor' + (seleccion === v ? ' diseca__ficha--elegida' : '')}
            style={{ background: PALETA[i % PALETA.length] }}
            draggable={!hecho}
            disabled={hecho}
            aria-pressed={seleccion === v}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(v))
              e.dataTransfer.effectAllowed = 'copy'
            }}
            onClick={() => setSeleccion((s) => (s === v ? null : v))}
          >
            {fmt(v)}
          </button>
        ))}
      </div>

      <div className="tabla-envoltura">
        <table className="tabla tc-tabla-juego">
          <thead>
            <tr>
              <th scope="col">Línea que se ejecuta</th>
              <th scope="col">total</th>
              <th scope="col">unidades</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.paso}>
                <th scope="row"><code>{f.texto}</code></th>
                {['total', 'unidades'].map((v) => {
                  if (f[v] === null) {
                    return <td key={v}><span className="tc-celda tc-celda--sin">todavía sin valor</span></td>
                  }
                  const k = clave(i, v)
                  const puesto = celdas[k]
                  const veredicto = estado ? estado[k] : null
                  return (
                    <td key={v}>
                      <div
                        className={'tc-celda' + (veredicto === true ? ' tc-celda--ok' : veredicto === false ? ' tc-celda--mal' : '')}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const valor = Number(e.dataTransfer.getData('text/plain'))
                          if (Number.isFinite(valor)) poner(k, valor)
                        }}
                      >
                        <button
                          type="button"
                          className="tc-celda__boton"
                          disabled={hecho || seleccion === null}
                          onClick={() => poner(k, seleccion)}
                          aria-label={`${v} después de «${f.texto}»${puesto !== undefined ? `: ${fmt(puesto)}` : ': vacío'}`}
                        >
                          {puesto !== undefined ? fmt(puesto) : seleccion !== null ? 'Poner aquí' : 'Suelta aquí'}
                        </button>
                        {puesto !== undefined && !hecho && (
                          <button type="button" className="tc-celda__quitar" aria-label="Quitar el valor" onClick={() => quitar(k)}>✕</button>
                        )}
                        {veredicto === false && <span className="tc-celda__pista">Valía {fmt(f[v])}</span>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="diseca__progreso">{llenas} de {pedidas.length} casillas llenas</p>

      {!hecho && (
        <div className="tc-acciones">
          <button type="button" className="boton boton--principal" onClick={comprobar} disabled={llenas < pedidas.length}>
            {llenas < pedidas.length ? 'Llena todas las casillas' : 'Comprobar mi tabla'}
          </button>
          {intentos >= 2 && <button type="button" className="boton boton--texto" onClick={mostrar}>Mostrar la tabla correcta y seguir</button>}
        </div>
      )}
      {estado && !hecho && <p className="aviso aviso--nota" role="status">Las casillas en rojo no coinciden. Recuerda: cada línea cambia solo la variable que nombra, y el valor anterior se conserva.</p>}
      {hecho && (
        <p className="aviso aviso--ok" role="status">
          Tabla completa. Fíjate en lo que acabas de hacer: leer una línea, calcular, anotar. En el bloque C vas a hacer exactamente esto con tu propio algoritmo
          y tu propio caso.
        </p>
      )}
    </div>
  )
}

/* ============================ Juego 3 · encuentra el error ============================ */

function Juego3({ habilitado }) {
  const [elegida, setElegida] = useState(null)
  const [fallos, setFallos] = useState(0)
  const r = useMemo(() => correr(PSEUDO_CON_FALLA, entradasEjemplo()), [])

  if (!habilitado) {
    return (
      <div className="tc-paso tc-paso--cerrado">
        <h3>Juego 3 (opcional) · Encuentra el error</h3>
        <p>Primero termina el juego 2.</p>
      </div>
    )
  }
  const acerto = elegida === LINEA_DE_LA_FALLA

  return (
    <div className="tc-paso">
      <h3>Juego 3 (opcional) · Encuentra el error</h3>
      <p>
        Esta versión tiene una falla. Con el mismo pedido (12 unidades) debería dar <strong>{fmt(ESPERADO_EJEMPLO)}</strong>, pero da{' '}
        <strong>{fmt(r.resultado)}</strong>. Toca la línea donde está el error. Así es como una prueba de escritorio te avisa que algo está mal.
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
      {acerto && <p className="aviso aviso--ok" role="status">¡Esa es! {EXPLICACION_FALLA}</p>}
    </div>
  )
}

