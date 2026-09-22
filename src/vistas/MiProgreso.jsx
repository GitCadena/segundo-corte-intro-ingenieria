import { Link } from 'react-router-dom'
import { useProgreso } from '../estado/ProgresoProvider.jsx'
import { useSesion } from '../estado/SesionProvider.jsx'
import { estaciones, catalogoActividades, puntosNota } from '../data/catalogo.js'
import glosario from '../data/glosario.js'
import { ETIQUETA_ESTADO } from '../lib/puntaje.js'

/** Mi progreso: qué hice, con cuántos intentos y pistas, y qué conviene repasar. */
export default function MiProgreso() {
  const { perfil } = useSesion()
  const { resumen, mejores, cargando } = useProgreso()

  if (cargando) return <p className="cargando" role="status">Cargando…</p>

  const conIntento = catalogoActividades.filter((a) => mejores[a.id])
  const nota = puntosNota === 0 ? 0 : (resumen.puntosNotaObtenidos / puntosNota) * 5

  return (
    <div className="progreso">
      <header className="progreso__cabecera">
        <h1>Mi progreso</h1>
        <p>
          {perfil?.nombres} {perfil?.apellidos}
          {perfil?.grupo && ` · ${perfil.grupo}`}
          {perfil?.codigo_estudiantil && ` · código ${perfil.codigo_estudiantil}`}
        </p>
      </header>

      <section className="progreso__resumen">
        <div className="cifra">
          <span className="cifra__valor">{resumen.completadas}<span className="cifra__de">/{resumen.totalActividades}</span></span>
          <span className="cifra__etiqueta">actividades completadas</span>
        </div>
        <div className="cifra">
          <span className="cifra__valor">{resumen.dominadas}</span>
          <span className="cifra__etiqueta">con dominio demostrado</span>
          <span className="cifra__nota">Al primer intento y sin pistas.</span>
        </div>
        <div className="cifra">
          <span className="cifra__valor">{resumen.puntosObtenidos}</span>
          <span className="cifra__etiqueta">puntos acumulados</span>
        </div>
        <div className="cifra">
          <span className="cifra__valor">{nota.toFixed(1)}</span>
          <span className="cifra__etiqueta">nota orientativa sobre 5,0</span>
          <span className="cifra__nota">No es tu nota del curso.</span>
        </div>
      </section>

      <section className="explicacion explicacion--metrica">
        <p className="explicacion__titulo">Cómo se calcula la nota orientativa</p>
        <p>
          Puntos obtenidos ÷ puntos posibles × 5,0, contando <strong>solo</strong> las actividades de
          nivel base ({puntosNota} puntos posibles). Se excluyen los desafíos opcionales, los
          talleres y el laboratorio. Es una referencia para que sepas cómo vas: la nota académica del
          corte la define el docente con el parcial y los entregables, no esta aplicación.
        </p>
      </section>

      <section className="progreso__seccion">
        <h2 className="titulo-seccion">Avance por estación</h2>
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">Estación</th>
                <th scope="col">Completadas</th>
                <th scope="col">Con dominio</th>
                <th scope="col">Puntos</th>
                <th scope="col">Avance</th>
              </tr>
            </thead>
            <tbody>
              {estaciones.map((e) => {
                const p = resumen.porEstacion[e.id]
                return (
                  <tr key={e.id}>
                    <th scope="row">
                      <Link to={`/estacion/${e.id}`}>{e.orden}. {e.titulo}</Link>
                    </th>
                    <td>{p.completadas} de {p.total}</td>
                    <td>{p.dominadas}</td>
                    <td>{p.puntos} de {p.puntosMax}</td>
                    <td>
                      <span className="medidor medidor--mini" role="img" aria-label={`${p.avance} por ciento`}>
                        <span className="medidor__relleno" style={{ width: `${p.avance}%` }} />
                      </span>
                      {p.avance} %
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="progreso__seccion">
        <h2 className="titulo-seccion">Actividades que has trabajado</h2>
        {conIntento.length === 0 ? (
          <p className="vacio-util">
            Todavía no has enviado ninguna actividad. Cuando lo hagas aparecerán aquí con tus
            intentos, las pistas que usaste y tu mejor resultado.{' '}
            <Link to="/panel">Ir al panel</Link>
          </p>
        ) : (
          <div className="tabla-envoltura">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Actividad</th>
                  <th scope="col">Estación</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Mejor puntaje</th>
                  <th scope="col">Intentos</th>
                  <th scope="col">Pistas</th>
                </tr>
              </thead>
              <tbody>
                {conIntento.map((a) => {
                  const m = mejores[a.id]
                  return (
                    <tr key={a.id}>
                      <th scope="row">
                        <Link to={`/estacion/${a.estacionId}#${a.id}`}>{a.titulo}</Link>
                        {a.nivel === 'opcional' && <span className="chip chip--opcional">opcional</span>}
                      </th>
                      <td>{estaciones.find((e) => e.id === a.estacionId)?.titulo}</td>
                      <td>
                        <span className={`chip chip--estado chip--${m.estado}`}>{ETIQUETA_ESTADO[m.estado]}</span>
                      </td>
                      <td>{a.puntos > 0 ? `${m.mejor_puntaje} de ${a.puntos}` : '—'}</td>
                      <td>{m.intentos_totales}</td>
                      <td>{m.estado === 'intentada' ? '—' : m.pistas_minimas}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="panel__nota">
          «Intentos» cuenta cada envío registrado, incluidos los fallidos. «Pistas» es el mínimo de
          pistas con el que lograste resolverla: si la resolviste sin pistas en un intento posterior,
          aquí aparece 0.
        </p>
      </section>

      <section className="progreso__seccion">
        <h2 className="titulo-seccion">Recomendaciones de repaso</h2>
        {resumen.aRepasar.length === 0 ? (
          <p className="vacio-util">
            No hay recomendaciones: las actividades que has hecho las resolviste sin pistas y sin
            reintentos.
          </p>
        ) : (
          <ol className="repaso">
            {resumen.aRepasar.map((r) => (
              <li key={r.concepto}>
                <p className="repaso__concepto">{glosario[r.concepto]?.termino ?? r.concepto}</p>
                <p className="repaso__definicion">{glosario[r.concepto]?.definicion}</p>
                <p className="repaso__donde">
                  Vuelve a:{' '}
                  {r.actividades.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ' · '}
                      <Link to={`/estacion/${a.estacionId}#${a.id}`}>{a.titulo}</Link>
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ol>
        )}
        <p className="panel__nota">
          Esta lista se deriva de las actividades donde abriste pistas o reintentaste. Es una
          inferencia a partir de tu actividad, no una medición de lo que sabes.
        </p>
      </section>
    </div>
  )
}
