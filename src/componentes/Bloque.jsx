import Termino from './Termino.jsx'

/** Un bloque de contenido de la teoría. */
export default function Bloque({ bloque, glosario = [] }) {
  switch (bloque.t) {
    case 'p':
      return (
        <p className="parrafo">
          <Termino texto={bloque.texto} glosario={glosario} />
        </p>
      )

    case 'lista':
      return (
        <ul className="lista">
          {bloque.items.map((item, i) => (
            <li key={i}>
              <Termino texto={item} glosario={glosario} />
            </li>
          ))}
        </ul>
      )

    case 'tabla':
      return (
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                {bloque.encabezados.map((h, i) => (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloque.filas.map((fila, i) => (
                <tr key={i}>
                  {fila.map((celda, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {celda}
                      </th>
                    ) : (
                      <td key={j}>{celda}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'clave':
      return (
        <aside className="clave">
          <p className="clave__titulo">{bloque.titulo}</p>
          <p className="clave__texto">
            <Termino texto={bloque.texto} glosario={glosario} />
          </p>
        </aside>
      )

    case 'codigo':
      return (
        <figure className="bloque-codigo">
          {bloque.etiqueta && <figcaption>{bloque.etiqueta}</figcaption>}
          <pre>{bloque.texto}</pre>
        </figure>
      )

    default:
      return null
  }
}
