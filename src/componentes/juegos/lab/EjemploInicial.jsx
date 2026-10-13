import { useState } from 'react'
import Clasificador from './Clasificador.jsx'

const PIEZA = {
  id: 'ej1',
  texto: 'Entrevistar a las personas que usarán el sistema sobre cómo trabajan hoy.',
  zona: 'f2',
  pista: 'Todavía se está averiguando lo que la gente necesita.',
  porque: 'Entrevistar usuarios es una técnica para determinar requerimientos: es la fase 2.',
}
const ZONAS = [
  { id: 'f1', titulo: '1. Identificar el problema', ayuda: 'Qué pasa hoy y qué se quiere lograr.' },
  { id: 'f2', titulo: '2. Requerimientos', ayuda: 'Qué necesita cada usuario.' },
]

/** Ejemplo corto de cómo se arrastra una pieza. Hay que completarlo antes de empezar. */
export default function EjemploInicial({ onListo }) {
  const [colocadas, setColocadas] = useState({})
  const [intento, setIntento] = useState(null) // null | 'ok' | 'mal'

  const colocada = colocadas[PIEZA.id]

  function comprobar() {
    setIntento(colocada === PIEZA.zona ? 'ok' : 'otra')
  }

  return (
    <div className="lab-ejemplo">
      <h4>Antes de empezar: cómo se trabaja</h4>
      <p>
        En todo el laboratorio ubicarán piezas en su lugar. Prueben con esta: <strong>arrástrenla</strong> hasta la fase que
        le corresponde. Si prefieren no arrastrar, <strong>toquen la pieza</strong> y luego «Colocar aquí» en la fase.
      </p>
      <Clasificador
        items={[PIEZA]}
        zonas={ZONAS}
        colocadas={colocadas}
        retro={intento ? { [PIEZA.id]: intento } : {}}
        revisiones={1}
        bloqueado={!!intento}
        onColocar={(id, z) => {
          setColocadas({ [id]: z })
          setIntento(null)
        }}
        onDevolver={() => {
          setColocadas({})
          setIntento(null)
        }}
      />
      {!intento ? (
        <button type="button" className="boton boton--secundario" disabled={!colocada} onClick={comprobar}>
          Ver comentario
        </button>
      ) : (
        <div className="lab-ejemplo__ok">
          <p>
            Así funciona todo el laboratorio: ubican según su criterio y al final ven comentarios. No hay una única respuesta, y
            los comentarios no son errores.
          </p>
          <button type="button" className="boton boton--principal" onClick={onListo}>
            Empezar el laboratorio
          </button>
        </div>
      )}
    </div>
  )
}
