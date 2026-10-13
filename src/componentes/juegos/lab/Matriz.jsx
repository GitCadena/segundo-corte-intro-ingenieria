import { CARACTERISTICAS } from '../../../data/lab-cdvs.js'

/**
 * Matriz de calidad de la información: cada decisión del sistema se relaciona
 * con la característica que busca. Una opción por fila (radios nativos, que se
 * manejan también con el teclado).
 */
export default function Matriz({ items, colocadas, retro, revisiones, bloqueado, onElegir }) {
  return (
    <div className="tabla-envoltura">
      <table className="lab-matriz">
        <thead>
          <tr>
            <th scope="col">Decisión del sistema</th>
            {CARACTERISTICAS.map((c) => (
              <th scope="col" key={c.id} className="lab-matriz__col">
                {c.nombre}
                <span className="lab-matriz__ayuda">{c.ayuda}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((it) => {
            const estado = retro[it.id]
            return (
              <tr key={it.id} className={estado ? `lab-matriz__fila--${estado}` : ''}>
                <th scope="row">
                  {estado && <span aria-hidden="true">{estado === 'ok' ? '✓ ' : '✗ '}</span>}
                  {it.texto}
                  {estado === 'mal' && !bloqueado && (
                    <span className="lab-matriz__nota">{revisiones <= 1 ? `Pista: ${it.pista}` : `Por qué: ${it.porque}`}</span>
                  )}
                  {bloqueado && <span className="lab-matriz__nota">{it.porque}</span>}
                </th>
                {CARACTERISTICAS.map((c) => (
                  <td key={c.id} className="lab-matriz__celda">
                    <input
                      type="radio"
                      name={`matriz-${it.id}`}
                      checked={colocadas[it.id] === c.id}
                      disabled={bloqueado}
                      onChange={() => onElegir(it.id, c.id)}
                      aria-label={`${c.nombre}: ${it.texto}`}
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
