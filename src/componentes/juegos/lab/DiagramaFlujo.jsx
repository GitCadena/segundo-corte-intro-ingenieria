import { useState } from 'react'
import { ETAPAS_FLUJO } from '../../../data/lab-cdvs.js'

const RECORRIDO = [
  'El paciente entrega sus datos y pide un turno: la información entra al sistema.',
  'El sistema busca horarios libres y asigna el turno: se procesa la solicitud.',
  'El turno asignado queda registrado en la base de datos: se almacena.',
  'El paciente recibe su confirmación y la dirección puede ver el reporte: se distribuye.',
]

/** Resultado visual del flujo armado, con un recorrido paso a paso de un turno. */
export default function DiagramaFlujo({ items, colocadas }) {
  const [paso, setPaso] = useState(null)

  return (
    <div className="lab-flujo">
      <ol className="lab-flujo__etapas" aria-label="Flujo de la información del hospital">
        {ETAPAS_FLUJO.map((e, i) => (
          <li key={e.id} className={'lab-flujo__etapa' + (paso === i ? ' lab-flujo__etapa--activa' : '')}>
            <p className="lab-flujo__nombre">
              <span className="lab-flujo__numero">{i + 1}</span> {e.nombre}
            </p>
            <ul>
              {items
                .filter((it) => colocadas[it.id] === e.id)
                .map((it) => (
                  <li key={it.id}>{it.texto}</li>
                ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="lab-flujo__recorrido">
        {paso === null ? (
          <button type="button" className="boton boton--secundario" onClick={() => setPaso(0)}>
            Ver el recorrido de un turno
          </button>
        ) : (
          <>
            <p role="status">
              <strong>Paso {paso + 1} de 4.</strong> {RECORRIDO[paso]}
            </p>
            <div className="lab-flujo__botones">
              <button type="button" className="boton boton--texto" disabled={paso === 0} onClick={() => setPaso((p) => p - 1)}>
                Anterior
              </button>
              {paso < RECORRIDO.length - 1 ? (
                <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => setPaso((p) => p + 1)}>
                  Siguiente
                </button>
              ) : (
                <button type="button" className="boton boton--texto" onClick={() => setPaso(null)}>
                  Cerrar recorrido
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
