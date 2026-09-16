/**
 * Resultado de ejecutar un algoritmo contra sus casos de prueba.
 *
 * Muestra entradas, salida esperada y salida obtenida de cada caso que falla,
 * porque decir solo "falló" no permite corregir nada. Los casos que pasan se
 * resumen, para que la atención quede donde hace falta.
 */
export default function TablaCasos({ resultados }) {
  const pasan = resultados.filter((r) => r.ok).length
  const total = resultados.length

  return (
    <section className="casos" aria-label="Resultado de los casos de prueba">
      <p className={pasan === total ? 'casos__marcador casos__marcador--ok' : 'casos__marcador'}>
        <span aria-hidden="true">{pasan === total ? '✓' : '✗'}</span> {pasan} de {total} casos de prueba
        pasan
      </p>
      <ul className="casos__lista">
        {resultados.map((c, i) => (
          <li key={i} className={c.ok ? 'caso caso--ok' : 'caso caso--mal'}>
            <p className="caso__titulo">
              <span className="caso__marca" aria-hidden="true">
                {c.ok ? '✓' : '✗'}
              </span>
              <span className="caso__estado">{c.ok ? 'Pasa' : 'Falla'}</span>
              {c.descripcion}
            </p>
            {!c.ok && (
              <dl className="caso__detalle">
                <div>
                  <dt>Entradas</dt>
                  <dd>{(c.entradas ?? []).join(', ') || 'ninguna'}</dd>
                </div>
                <div>
                  <dt>Se esperaba</dt>
                  <dd>
                    {(c.esperado ?? []).map((l, k) => (
                      <span key={k} className="caso__linea">
                        {l}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>Se obtuvo</dt>
                  <dd>
                    {c.error ? (
                      <span className="caso__error">{c.error}</span>
                    ) : c.salida.length === 0 ? (
                      <em>nada</em>
                    ) : (
                      c.salida.map((l, k) => (
                        <span key={k} className="caso__linea">
                          {l}
                        </span>
                      ))
                    )}
                  </dd>
                </div>
              </dl>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
