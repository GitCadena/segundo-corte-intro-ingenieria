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
            const habitual = CARACTERISTICAS.find((c) => c.id === it.zona)?.nombre
            return (
              <tr key={it.id}>
                <th scope="row">
                  {it.texto}
                  {bloqueado && (
                    <span className="lab-matriz__nota">
                      {estado === 'ok' && `Coincide con lo más habitual. ${it.porque}`}
                      {estado === 'alt' && `También se puede defender. Lo más habitual es «${habitual}». ${it.porque}`}
                      {estado === 'otra' && `Es otra lectura posible. Lo más habitual es «${habitual}». ${it.porque}`}
                      {!estado && it.porque}
                    </span>
                  )}
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
