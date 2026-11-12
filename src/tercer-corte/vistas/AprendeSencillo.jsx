import { useState } from 'react'

const PALETA = ['#2563eb', '#dc2626', '#ea580c', '#16a34a', '#9333ea', '#0d9488', '#c2410c', '#0891b2']

/* ============================ contenido ============================ */

const PALABRAS = [
  { id: 'entrada', texto: 'ENTRADA', pista: 'Piensa en los ingredientes de una receta: es lo primero que necesitas.' },
  { id: 'flecha', texto: '←', pista: 'Es una flecha: el valor de la derecha se guarda en el nombre de la izquierda.' },
  { id: 'paracada', texto: 'PARA CADA', pista: 'Cada uno de la lista: «para cada alumno, tomar lista».' },
  { id: 'si', texto: 'SI … SI NO', pista: 'Es una pregunta con dos caminos: si pasa una cosa, haces una; si no, haces otra.' },
  { id: 'salida', texto: 'SALIDA', pista: 'Es el plato terminado: lo que el proceso te da al final.' },
]

const SIGNIFICADOS = [
  { id: 'entrada', texto: 'Los datos con los que empieza el proceso, como los ingredientes de una receta.' },
  { id: 'flecha', texto: 'Guardar un valor en un nombre. Ejemplo: total ← 0 (el total empieza en cero).' },
  { id: 'paracada', texto: 'Repetir lo mismo con cada elemento de una lista. Ejemplo: con cada producto del pedido.' },
  { id: 'si', texto: 'Decidir entre dos caminos según se cumpla o no una condición.' },
  { id: 'salida', texto: 'Lo que el proceso entrega al terminar: el resultado.' },
]

// Una receta de la vida real, con las mismas partes que un algoritmo.
const PASOS_JUGO = [
  { id: 'p1', texto: 'Tener las naranjas y el azúcar', parte: 'Entrada', color: '#2563eb' },
  { id: 'p2', texto: 'Lavar las naranjas', parte: 'Paso normal', color: '#64748b' },
  { id: 'p3', texto: 'Exprimir cada naranja', parte: 'Se repite (para cada naranja)', color: '#ea580c' },
  { id: 'p4', texto: 'Si el jugo está agrio, echarle azúcar; si no, dejarlo así', parte: 'Decisión (si… si no)', color: '#9333ea' },
  { id: 'p5', texto: 'Servir el jugo en un vaso', parte: 'Paso normal', color: '#64748b' },
  { id: 'p6', texto: 'Entregar el vaso con el jugo', parte: 'Salida', color: '#16a34a' },
]
const ORDEN_INICIAL = ['p4', 'p6', 'p2', 'p5', 'p1', 'p3']

const HUECOS_CODIGO = [
  { id: 'h1', respuesta: 'entrada', ayuda: 'los datos que entran' },
  { id: 'h2', respuesta: 'flecha', ayuda: 'guardar un valor' },
  { id: 'h3', respuesta: 'paracada', ayuda: 'repetir con cada uno' },
  { id: 'h4', respuesta: 'si', ayuda: 'preguntar' },
  { id: 'h5', respuesta: 'salida', ayuda: 'lo que entrega' },
]

/**
 * Bloque A de la versión sencilla (Grupo 3): explica qué se hace en la ficha y
 * enseña el vocabulario con tres juegos distintos a los del bloque A normal.
 * No se guardan y no cuentan para entregar.
 */
export default function AprendeSencillo() {
  const [j1, setJ1] = useState(false)
  const [j2, setJ2] = useState(false)
  const [j3, setJ3] = useState(false)

  return (
    <>
      <section className="tarjeta tc-bloque" aria-labelledby="tc-camino">
        <h2 id="tc-camino" className="tc-bloque__titulo">¿Qué hay que hacer en esta ficha?</h2>
        <p className="tc-objetivo">
          Un <strong>pseudocódigo</strong> es una receta escrita en español para que el computador (o un compañero) la pueda seguir paso a paso.
          No necesitas saber programar. Se hace en cuatro pasos:
        </p>
        <ol className="tc-camino">
          <li><span>1</span><div><strong>Aprende el vocabulario</strong><p>Tres juegos cortos (unos 6 minutos) aquí abajo. No cuentan para entregar.</p></div></li>
          <li><span>2</span><div><strong>Escojan un proceso de su sistema</strong><p>Algo que el sistema hace, como «calcular el total de un pedido».</p></div></li>
          <li><span>3</span><div><strong>Escríbanlo con el asistente</strong><p>Responden unas preguntas y la página arma el pseudocódigo por ustedes. Luego lo pueden cambiar.</p></div></li>
          <li><span>4</span><div><strong>Pruébenlo con números</strong><p>Siguen su receta con un caso real y comprueban que da lo esperado. Después entregan.</p></div></li>
        </ol>
      </section>

      <section className="tarjeta tc-bloque" aria-labelledby="tc-aprende-sencillo">
        <h2 id="tc-aprende-sencillo" className="tc-bloque__titulo">A · Aprende el vocabulario</h2>
        <Juego1 hecho={j1} onHecho={() => setJ1(true)} />
        <Juego2 habilitado={j1} hecho={j2} onHecho={() => setJ2(true)} />
        <Juego3 habilitado={j2} hecho={j3} onHecho={() => setJ3(true)} />
        {j3 && (
          <p className="aviso aviso--ok" role="status">
            ¡Listo! Ya conoces las palabras que necesitas. Ahora bajen a la parte B: elijan su proceso y usen el asistente para escribirlo.
          </p>
        )}
      </section>
    </>
  )
}

/* ============== pieza reutilizable: fichas que se sueltan en huecos ============== */

/**
 * Arrastra (o toca la ficha y luego el hueco). Cada vez que se suelta, se revisa
 * al instante: si es la correcta se queda; si no, vuelve y se explica.
 */
function Relacionar({ fichas, huecos, hecho, onHecho, pintar, textoPista }) {
  const [puestas, setPuestas] = useState({}) // huecoId → fichaId
  const [elegida, setElegida] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [errores, setErrores] = useState({}) // fichaId → n

  const usadas = new Set(Object.values(puestas))
  const sueltas = fichas.filter((f) => !usadas.has(f.id))

  function soltar(huecoId, fichaId) {
    if (hecho || !fichaId || puestas[huecoId]) return
    const hueco = huecos.find((h) => h.id === huecoId)
    const ficha = fichas.find((f) => f.id === fichaId)
    if (!hueco || !ficha || usadas.has(fichaId)) return
    if (hueco.respuesta === fichaId) {
      const nuevas = { ...puestas, [huecoId]: fichaId }
      setPuestas(nuevas)
      setMensaje({ ok: true, texto: '¡Correcto!' })
      if (Object.keys(nuevas).length === huecos.length) onHecho()
    } else {
      const n = (errores[fichaId] ?? 0) + 1
      setErrores((e) => ({ ...e, [fichaId]: n }))
      setMensaje({ ok: false, texto: `«${ficha.texto}» no va ahí.${n >= 2 ? ` Pista: ${textoPista(ficha)}` : ' Prueba con otro lugar.'}` })
    }
    setElegida(null)
  }

  const sitios = {}
  for (const h of huecos) {
    const f = puestas[h.id] ? fichas.find((x) => x.id === puestas[h.id]) : null
    sitios[h.id] = (
      <span
        className={'tc-hueco' + (f ? ' tc-hueco--ok' : '') + (elegida && !f ? ' tc-hueco--listo' : '')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          soltar(h.id, e.dataTransfer.getData('text/plain'))
        }}
      >
        {f ? (
          <code>{f.texto}</code>
        ) : (
          <button type="button" className="tc-hueco__boton" disabled={!elegida || hecho} onClick={() => soltar(h.id, elegida)}>
            {elegida ? 'Poner aquí' : 'Suelta aquí'}
          </button>
        )}
      </span>
    )
  }

  return (
    <div className="tc-relacionar">
      <div className="diseca__banco tc-relacionar__banco">
        <p className="etiqueta-campo">Fichas ({sueltas.length})</p>
        <div className="diseca__fichas">
          {sueltas.map((f) => (
            <button
              key={f.id}
              type="button"
              className={'diseca__ficha tc-ficha-codigo' + (elegida === f.id ? ' diseca__ficha--elegida' : '')}
              style={{ background: PALETA[fichas.indexOf(f) % PALETA.length] }}
              draggable={!hecho}
              aria-pressed={elegida === f.id}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', f.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onClick={() => setElegida((s) => (s === f.id ? null : f.id))}
            >
              {f.texto}
            </button>
          ))}
          {sueltas.length === 0 && <p className="diseca__vacio">Ya usaste todas las fichas.</p>}
        </div>
      </div>

      <div className="tc-relacionar__huecos">{pintar(sitios)}</div>
      <p className={mensaje ? 'aviso ' + (mensaje.ok ? 'aviso--ok' : 'aviso--nota') : 'tc-nota'} role="status" aria-live="polite">
        {mensaje?.texto ?? 'Arrastra una ficha a su lugar, o toca la ficha y luego el lugar.'}
      </p>
    </div>
  )
}

/* ======================= Juego 1 · une cada palabra con su significado ======================= */

function Juego1({ hecho, onHecho }) {
  return (
    <div className="tc-paso">
      <h3>Juego 1 · Une cada palabra con lo que significa</h3>
      <p>Estas son las palabras que usarán para escribir su pseudocódigo. Lleva cada una a la explicación que le corresponde.</p>
      <Relacionar
        fichas={PALABRAS}
        huecos={SIGNIFICADOS.map((s) => ({ id: s.id, respuesta: s.id, texto: s.texto }))}
        hecho={hecho}
        onHecho={onHecho}
        textoPista={(f) => f.pista}
        pintar={(sitios) =>
          SIGNIFICADOS.map((s) => (
            <div key={s.id} className="tc-relacionar__fila">
              {sitios[s.id]}
              <p className="tc-relacionar__texto">{s.texto}</p>
            </div>
          ))
        }
      />
      {hecho && <p className="aviso aviso--ok" role="status">¡Las cinco palabras! Con ellas se escribe casi cualquier proceso.</p>}
    </div>
  )
}

/* ======================= Juego 2 · ordena una receta de la vida real ======================= */

function Juego2({ habilitado, hecho, onHecho }) {
  const [orden, setOrden] = useState(ORDEN_INICIAL)
  const [arrastra, setArrastra] = useState(null)
  const [revisado, setRevisado] = useState(false)
  const [fallos, setFallos] = useState(0)

  if (!habilitado) {
    return (
      <div className="tc-paso tc-paso--cerrado">
        <h3>Juego 2 · Ordena una receta</h3>
        <p>Primero termina el juego 1.</p>
      </div>
    )
  }

  const correcto = (i) => orden[i] === PASOS_JUGO[i].id
  const mover = (i, d) => {
    if (hecho) return
    const j = i + d
    if (j < 0 || j >= orden.length) return
    const n = [...orden]
    ;[n[i], n[j]] = [n[j], n[i]]
    setOrden(n)
    setRevisado(false)
  }
  const soltarEn = (j) => {
    if (arrastra === null || arrastra === j) return
    const n = [...orden]
    const [x] = n.splice(arrastra, 1)
    n.splice(j, 0, x)
    setOrden(n)
    setArrastra(null)
    setRevisado(false)
  }
  function comprobar() {
    setRevisado(true)
    if (PASOS_JUGO.every((_, i) => correcto(i))) onHecho()
    else setFallos((n) => n + 1)
  }
  const dePaso = (id) => PASOS_JUGO.find((p) => p.id === id)

  return (
    <div className="tc-paso">
      <h3>Juego 2 · Ordena una receta</h3>
      <p>
        Un algoritmo también existe en la vida diaria. Estos son los pasos para hacer un jugo de naranja, pero están desordenados. Arrástralos (o usa las
        flechas) hasta dejarlos en el orden correcto, del primero al último.
      </p>
      <ol className="tc-orden tc-orden--receta">
        {orden.map((id, i) => {
          const p = dePaso(id)
          return (
            <li
              key={id}
              className={'tc-orden__linea' + (arrastra === i ? ' tc-orden__linea--arrastrando' : '') + (revisado && correcto(i) ? ' tc-orden__linea--ok' : '') + (revisado && !correcto(i) ? ' tc-orden__linea--mal' : '')}
              draggable={!hecho}
              onDragStart={() => setArrastra(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                soltarEn(i)
              }}
              onDragEnd={() => setArrastra(null)}
            >
              <span>
                <span className="tc-orden__n">{i + 1}</span> {revisado && <span aria-hidden="true">{correcto(i) ? '✓ ' : '✗ '}</span>}
                {p.texto}
                {hecho && <em className="tc-orden__parte" style={{ background: p.color }}>{p.parte}</em>}
              </span>
              {!hecho && (
                <span className="tc-orden__botones">
                  <button type="button" className="boton boton--texto boton--pequeno" disabled={i === 0} onClick={() => mover(i, -1)} aria-label={`Subir: ${p.texto}`}>↑</button>
                  <button type="button" className="boton boton--texto boton--pequeno" disabled={i === orden.length - 1} onClick={() => mover(i, 1)} aria-label={`Bajar: ${p.texto}`}>↓</button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!hecho && (
        <div className="tc-acciones">
          <button type="button" className="boton boton--principal" onClick={comprobar}>Comprobar el orden</button>
          {fallos >= 2 && (
            <button type="button" className="boton boton--texto" onClick={() => { setOrden(PASOS_JUGO.map((p) => p.id)); setRevisado(true); onHecho() }}>
              Mostrar el orden y seguir
            </button>
          )}
        </div>
      )}
      {revisado && !hecho && <p className="aviso aviso--nota" role="status">Los marcados con ✗ no están en su lugar. Piensa qué se hace primero: ¿qué necesitas antes de exprimir? ¿cuándo pruebas el jugo?</p>}
      {hecho && (
        <p className="aviso aviso--ok" role="status">
          ¡Ese es el orden! Fíjate en que tiene las mismas partes de un pseudocódigo: una <strong>entrada</strong>, algo que se <strong>repite</strong>,
          una <strong>decisión</strong> y una <strong>salida</strong>.
        </p>
      )}
    </div>
  )
}

/* ======================= Juego 3 · completa los huecos del código ======================= */

function Juego3({ habilitado, hecho, onHecho }) {
  if (!habilitado) {
    return (
      <div className="tc-paso tc-paso--cerrado">
        <h3>Juego 3 · Completa el pseudocódigo</h3>
        <p>Primero termina el juego 2.</p>
      </div>
    )
  }
  const hueco = (id) => HUECOS_CODIGO.find((h) => h.id === id)
  // Cada línea del ejemplo; los huecos se pintan donde falta una palabra.
  const LINEAS = [
    ['PROCESO calcularTotal'],
    [{ h: 'h1' }, ': productos (lista)'],
    ['total ', { h: 'h2' }, ' 0'],
    [{ h: 'h3' }, ' producto EN productos'],
    ['    total ← total + producto.cantidad × producto.precio'],
    ['FIN PARA'],
    [{ h: 'h4' }, ' total ≥ 50000 ENTONCES'],
    ['    descuento ← total × 0,1'],
    ['  SI NO'],
    ['    descuento ← 0'],
    ['FIN SI'],
    ['total ← total − descuento'],
    [{ h: 'h5' }, ': total'],
  ]
  const huecos = HUECOS_CODIGO.map((h) => ({ id: h.id, respuesta: h.respuesta }))

  return (
    <div className="tc-paso">
      <h3>Juego 3 · Completa el pseudocódigo</h3>
      <p>
        Este es el pseudocódigo de la panadería que calcula el total de un pedido y da 10 % de descuento a los pedidos grandes. Le faltan cinco palabras:
        llévalas a su lugar. Al lado de cada hueco hay una pista de lo que hace.
      </p>
      <Relacionar
        fichas={PALABRAS.map((p) => (p.id === 'si' ? { ...p, texto: 'SI' } : p))}
        huecos={huecos}
        hecho={hecho}
        onHecho={onHecho}
        textoPista={(f) => f.pista}
        pintar={(sitios) => (
          <div className="tc-codigo-hueco">
            {LINEAS.map((l, n) => {
              const h = l.find((x) => typeof x === 'object')?.h
              return (
                <div key={n} className="tc-codigo-hueco__fila">
                  <code className="tc-codigo-hueco__linea">
                    {l.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <span key={i}>{sitios[x.h]}</span>))}
                  </code>
                  {h && <span className="tc-codigo-hueco__ayuda">← {hueco(h).ayuda}</span>}
                </div>
              )
            })}
          </div>
        )}
      />
      {hecho && <pre className="tc-codigo-final">{LINEAS.map((l) => l.map((x) => (typeof x === 'string' ? x : { h1: 'ENTRADA', h2: '←', h3: 'PARA CADA', h4: 'SI', h5: 'SALIDA' }[x.h])).join('')).join('\n')}</pre>}
    </div>
  )
}
