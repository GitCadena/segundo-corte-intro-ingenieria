import { useState } from 'react'
import { EJEMPLO_ASISTENTE, armarPseudocodigo, faltantes } from '../lib/asistente.js'

const VACIO = { lista: '', item: '', acumulador: '', suma: '', condicion: '', si: '', no: '', final: '', salida: '' }

const PREGUNTAS = [
  { k: 'lista', t: '1. ¿Qué lista de cosas recorre el proceso?', ayuda: 'Los datos que llegan, varios del mismo tipo. En la panadería: los productos del pedido.', ej: 'productos' },
  { k: 'item', t: '2. ¿Cómo se llama cada una de esas cosas, en singular?', ayuda: 'Una sola palabra. En la panadería: producto.', ej: 'producto', opcional: true },
  { k: 'acumulador', t: '3. ¿Qué número va acumulando el proceso?', ayuda: 'Algo que empieza en 0 y va creciendo. En la panadería: el total.', ej: 'total' },
  { k: 'suma', t: '4. ¿Qué se le suma por cada una?', ayuda: 'Una cuenta con los datos de cada elemento. En la panadería: cantidad por precio.', ej: 'producto.cantidad × producto.precio' },
  { k: 'condicion', t: '5. ¿Qué pregunta hace el proceso al terminar de sumar?', ayuda: 'Algo que se cumple o no. En la panadería: ¿el total llega a 50000?', ej: 'total ≥ 50000' },
  { k: 'si', t: '6. Si la respuesta es SÍ, ¿qué pasa?', ayuda: 'Una línea con la flecha ←. En la panadería: se calcula el 10 % de descuento.', ej: 'descuento ← total × 0,1' },
  { k: 'no', t: '7. Si la respuesta es NO, ¿qué pasa?', ayuda: 'Otra línea con la flecha ←. En la panadería: no hay descuento.', ej: 'descuento ← 0' },
  { k: 'final', t: '8. Después de decidir, ¿hay un cálculo final? (opcional)', ayuda: 'Una línea con la flecha ←. En la panadería: restar el descuento al total.', ej: 'total ← total − descuento', opcional: true },
  { k: 'salida', t: '9. ¿Qué entrega el proceso al terminar?', ayuda: 'El nombre del resultado. En la panadería: total.', ej: 'total' },
]

/**
 * Asistente del Grupo 3: en vez de escribir el pseudocódigo desde cero, el equipo
 * responde preguntas y la página arma el algoritmo con la misma forma del ejemplo.
 * Después pueden editarlo libremente. Solo escribe en el campo «pseudo» al pulsar el botón.
 */
export default function AsistenteSencillo({ c, f, bloqueada }) {
  const [r, setR] = useState(VACIO)
  const [aviso, setAviso] = useState(null)
  const [confirmar, setConfirmar] = useState(false)
  const hayTexto = String(c.pseudo ?? '').trim() !== ''
  const falta = faltantes(r)

  const poner = (k, v) => {
    setR((p) => ({ ...p, [k]: v }))
    setAviso(null)
  }
  function armar(forzar = false) {
    if (falta.length > 0) {
      setAviso(`Falta responder: ${PREGUNTAS.filter((p) => falta.includes(p.k)).map((p) => p.t.split('.')[0]).join(', ')}.`)
      return
    }
    if (hayTexto && !forzar) {
      setConfirmar(true)
      return
    }
    f.cambiar('pseudo', armarPseudocodigo(c.proceso, r))
    setConfirmar(false)
    setAviso('Listo: el pseudocódigo quedó escrito más abajo, en «El pseudocódigo». Revísenlo y cámbienlo si quieren.')
  }

  if (bloqueada) return null

  return (
    <section className="tarjeta tc-bloque tc-asistente" aria-labelledby="tc-asistente">
      <h2 id="tc-asistente" className="tc-bloque__titulo">Asistente: armen su pseudocódigo respondiendo preguntas</h2>
      <p className="tc-objetivo">
        Respondan con datos de <strong>su proceso</strong> (el que eligieron arriba). Con sus respuestas la página escribe el pseudocódigo en la forma del
        ejemplo de la panadería. Si algo de su proceso no encaja, no se preocupen: después pueden editar el texto como quieran.
      </p>
      <div className="tc-acciones">
        <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => setR({ ...EJEMPLO_ASISTENTE })}>
          Ver las respuestas del ejemplo de la panadería
        </button>
        {Object.values(r).some(Boolean) && (
          <button type="button" className="boton boton--texto boton--pequeno" onClick={() => setR(VACIO)}>Borrar respuestas</button>
        )}
      </div>
      <div className="tc-asistente__preguntas">
        {PREGUNTAS.map((p) => (
          <div key={p.k} className="campo-grupo">
            <label htmlFor={`tc-as-${p.k}`} className="etiqueta-campo">{p.t}</label>
            <p className="tc-nota" id={`tc-as-${p.k}-ayuda`}>{p.ayuda}</p>
            <input
              id={`tc-as-${p.k}`}
              className="campo"
              aria-describedby={`tc-as-${p.k}-ayuda`}
              placeholder={`Ejemplo: ${p.ej}`}
              value={r[p.k]}
              onChange={(e) => poner(p.k, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="tc-acciones">
        <button type="button" className="boton boton--principal" onClick={() => armar(false)}>Armar mi pseudocódigo</button>
      </div>
      {confirmar && (
        <div className="tc-confirmar" role="alert">
          <p><strong>Ya hay un pseudocódigo escrito.</strong> Si siguen, se reemplaza por el que arma el asistente.</p>
          <button type="button" className="boton boton--principal" onClick={() => armar(true)}>Sí, reemplazarlo</button>{' '}
          <button type="button" className="boton boton--texto" onClick={() => setConfirmar(false)}>No, dejarlo como está</button>
        </div>
      )}
      {aviso && <p className={'aviso ' + (aviso.startsWith('Listo') ? 'aviso--ok' : 'aviso--nota')} role="status">{aviso}</p>}
    </section>
  )
}
