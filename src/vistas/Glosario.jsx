import { useMemo, useState } from 'react'
import { terminosOrdenados } from '../data/glosario.js'
import { estaciones } from '../data/catalogo.js'
import { Link } from 'react-router-dom'

/** Glosario completo del corte, buscable y con el enlace a la estación donde se usa. */
export default function Glosario() {
  const [busqueda, setBusqueda] = useState('')

  const dondeAparece = useMemo(() => {
    const mapa = {}
    for (const e of estaciones) {
      for (const clave of e.glosario ?? []) {
        if (!mapa[clave]) mapa[clave] = []
        mapa[clave].push(e)
      }
    }
    return mapa
  }, [])

  const limpio = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const filtrados = terminosOrdenados.filter(
    (t) =>
      busqueda.trim() === '' ||
      limpio(t.termino).includes(limpio(busqueda)) ||
      limpio(t.definicion).includes(limpio(busqueda)),
  )

  return (
    <div className="glosario-vista">
      <header className="glosario-vista__cabecera">
        <h1>Glosario</h1>
        <p>
          Los {terminosOrdenados.length} términos del segundo corte. Cada definición dice qué es el
          concepto y cómo se reconoce, no repite el nombre con otras palabras.
        </p>
        <label className="campo-envoltura" htmlFor="buscar-glosario">
          <span className="campo-envoltura__etiqueta">Buscar</span>
          <input
            id="buscar-glosario"
            className="campo"
            type="search"
            value={busqueda}
            placeholder="Escribe un término o parte de su definición"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
        <p className="glosario-vista__conteo" role="status">
          {filtrados.length} de {terminosOrdenados.length} términos
        </p>
      </header>

      {filtrados.length === 0 ? (
        <p className="vacio-util">
          Ningún término coincide con «{busqueda}». Prueba con una palabra más corta.
        </p>
      ) : (
        <dl className="glosario">
          {filtrados.map((t) => (
            <div key={t.clave} className="glosario__entrada" id={`termino-${t.clave}`}>
              <dt>{t.termino}</dt>
              <dd>
                <p>{t.definicion}</p>
                {t.ejemplo && <p className="glosario__ejemplo">Ejemplo: {t.ejemplo}</p>}
                {dondeAparece[t.clave] && (
                  <p className="glosario__donde">
                    Se usa en:{' '}
                    {dondeAparece[t.clave].map((e, i) => (
                      <span key={e.id}>
                        {i > 0 && ' · '}
                        <Link to={`/estacion/${e.id}#comprende`}>{e.titulo}</Link>
                      </span>
                    ))}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
