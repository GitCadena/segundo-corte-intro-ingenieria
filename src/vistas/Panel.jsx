import { Link } from 'react-router-dom'
import { useSesion } from '../estado/SesionProvider.jsx'
import { useProgreso } from '../estado/ProgresoProvider.jsx'
import { estaciones, catalogoActividades } from '../data/catalogo.js'
import glosario from '../data/glosario.js'

/** Panel del estudiante: dónde estoy, qué sigue y qué conviene repasar. */
export default function Panel() {
  const { perfil, errorPerfil } = useSesion()
  const { resumen, cargando, logros, logrosCatalogo, ultimoError, pendientes, reintentar } = useProgreso()

  if (cargando) {
    return (
      <p className="cargando" role="status">
        Cargando tu progreso…
      </p>
    )
  }

  const empezando = resumen.completadas === 0 && resumen.intentadas === 0
  const siguiente = resumen.siguiente
  const estacionSiguiente = siguiente && estaciones.find((e) => e.id === siguiente.estacionId)

  return (
    <div className="panel">
      <header className="panel__cabecera">
        <p className="panel__saludo">Hola, {perfil?.nombres ?? 'estudiante'}</p>
        <h1 className="panel__titulo">
          {empezando ? 'Empecemos por la primera estación' : 'Continúa donde ibas'}
        </h1>
        {perfil?.grupo && <p className="panel__grupo">{perfil.grupo}</p>}
      </header>

      {errorPerfil && (
        <p className="aviso aviso--error" role="alert">
          {errorPerfil}
        </p>
      )}

      {ultimoError && (
        <p className="aviso aviso--error" role="alert">
          {ultimoError}{' '}
          {pendientes > 0 && (
            <button type="button" className="boton boton--texto" onClick={reintentar}>
              Reintentar ahora
            </button>
          )}
        </p>
      )}

      {/* ------------------------- acción principal ------------------------ */}
      {siguiente ? (
        <section className="continuar">
          <p className="continuar__etiqueta">Tu siguiente paso</p>
          <h2 className="continuar__titulo">{siguiente.titulo}</h2>
          <p className="continuar__donde">
            Estación {estacionSiguiente?.orden}: {estacionSiguiente?.titulo}
          </p>
          <Link className="boton boton--principal boton--grande" to={`/estacion/${siguiente.estacionId}#${siguiente.id}`}>
            {empezando ? 'Empezar' : 'Continuar donde iba'}
          </Link>
        </section>
      ) : (
        <section className="continuar continuar--fin">
          <p className="continuar__etiqueta">Ruta principal terminada</p>
          <h2 className="continuar__titulo">Completaste todas las actividades base</h2>
          <p className="continuar__donde">
            Quedan los desafíos opcionales y el reto final de práctica, que puedes repetir cuantas
            veces quieras.
          </p>
          <Link className="boton boton--principal boton--grande" to="/estacion/reto-final">
            Ir al reto final de práctica
          </Link>
        </section>
      )}

      {/* ---------------------------- cifras ------------------------------ */}
      <section className="cifras" aria-label="Resumen de tu avance">
        <Cifra
          valor={resumen.completadas}
          de={resumen.totalActividades}
          etiqueta="actividades completadas"
          vacio="Todavía no has completado ninguna."
        />
        <Cifra
          valor={resumen.dominadas}
          etiqueta="con dominio demostrado"
          nota="Resueltas al primer intento y sin pistas."
          vacio="Ninguna aún."
        />
        <Cifra valor={resumen.puntosObtenidos} etiqueta="puntos acumulados" vacio="Sin puntos todavía." />
        <Cifra
          valor={logros.length}
          de={logrosCatalogo.length}
          etiqueta="logros"
          vacio="Los logros se ganan con evidencia de aprendizaje."
        />
      </section>

      {/* --------------------------- estaciones --------------------------- */}
      <section className="panel__seccion">
        <h2 className="titulo-seccion">Las seis estaciones</h2>
        <ul className="estaciones__lista">
          {estaciones.map((e) => {
            const p = resumen.porEstacion[e.id]
            return (
              <li key={e.id}>
                <Link className="estacion" to={`/estacion/${e.id}`}>
                  <span className="estacion__numero">{e.orden}</span>
                  <span className="estacion__cuerpo">
                    <span className="estacion__sesion">{e.sesion}</span>
                    <span className="estacion__titulo">{e.titulo}</span>
                    <span className="estacion__objetivo">{e.aprenderas.objetivo}</span>
                    <span className="medidor" role="img" aria-label={`Avance ${p.avance} por ciento`}>
                      <span className="medidor__relleno" style={{ width: `${p.avance}%` }} />
                    </span>
                    <span className="estacion__meta">
                      {p.completadas === 0
                        ? `Sin empezar · ${p.total} actividades`
                        : `${p.completadas} de ${p.total} actividades · ${p.puntos} de ${p.puntosMax} pts`}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ------------------------ pendientes y hechas ---------------------- */}
      <div className="panel__columnas">
        <section className="panel__seccion">
          <h2 className="titulo-seccion">Actividades pendientes</h2>
          {resumen.completadas === resumen.totalActividades ? (
            <p className="vacio-util">No queda ninguna pendiente. Puedes repetir las que quieras para mejorar tu puntaje.</p>
          ) : (
            <ul className="lista-tareas">
              {catalogoActividades
                .filter((a) => a.puntos > 0 && !['completada', 'dominada'].includes(resumen.estadoDe(a.id)))
                .slice(0, 8)
                .map((a) => (
                  <li key={a.id}>
                    <Link to={`/estacion/${a.estacionId}#${a.id}`}>
                      <span className="lista-tareas__titulo">{a.titulo}</span>
                      <span className="lista-tareas__meta">
                        {estaciones.find((e) => e.id === a.estacionId)?.titulo} ·{' '}
                        {resumen.estadoDe(a.id) === 'intentada' ? 'Intentada, sin resolver' : `${a.puntos} pts`}
                        {a.nivel === 'opcional' && ' · opcional'}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <section className="panel__seccion">
          <h2 className="titulo-seccion">Conceptos para repasar</h2>
          {resumen.aRepasar.length === 0 ? (
            <p className="vacio-util">
              {resumen.completadas === 0
                ? 'Aparecerán aquí los conceptos de las actividades que te cuesten, con el enlace a la teoría que los explica.'
                : 'Ninguno por ahora: no has necesitado pistas ni reintentos.'}
            </p>
          ) : (
            <ul className="repaso">
              {resumen.aRepasar.slice(0, 6).map((r) => (
                <li key={r.concepto}>
                  <p className="repaso__concepto">{glosario[r.concepto]?.termino ?? r.concepto}</p>
                  <p className="repaso__definicion">{glosario[r.concepto]?.definicion}</p>
                  <p className="repaso__donde">
                    Apareció en {r.veces} actividad{r.veces > 1 ? 'es' : ''} que aún no dominas:{' '}
                    {r.actividades.slice(0, 2).map((a, i) => (
                      <span key={a.id}>
                        {i > 0 && ', '}
                        <Link to={`/estacion/${a.estacionId}#${a.id}`}>{a.titulo}</Link>
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="panel__nota">
            Esto no es una medición de lo que sabes: es una lista derivada de las actividades donde
            usaste pistas o reintentaste.
          </p>
        </section>
      </div>

      {/* ------------------------------ logros ---------------------------- */}
      <section className="panel__seccion">
        <h2 className="titulo-seccion">Logros</h2>
        <ul className="logros">
          {logrosCatalogo.map((l) => {
            const tiene = logros.includes(l.id)
            return (
              <li key={l.id} className={tiene ? 'logro logro--obtenido' : 'logro'}>
                <span className="logro__marca" aria-hidden="true">{tiene ? '✓' : '○'}</span>
                <span className="logro__cuerpo">
                  <span className="logro__titulo">{l.titulo}</span>
                  <span className="logro__descripcion">{tiene ? l.descripcion : l.evidencia}</span>
                </span>
              </li>
            )
          })}
        </ul>
        <p className="panel__nota">
          Cada logro exige una evidencia concreta en tus datos. Ninguno se obtiene por abrir
          contenido ni por repetir una actividad ya resuelta.
        </p>
      </section>

      {/* -------------------------- otras secciones ------------------------ */}
      <section className="panel__seccion panel__atajos">
        <Link className="atajo" to="/laboratorio">
          <span className="atajo__titulo">Laboratorio de pseudocódigo</span>
          <span className="atajo__texto">
            Espacio libre para probar un algoritmo, ver la evolución de las variables y resolver
            ejercicios del tablero. Sin puntaje.
          </span>
        </Link>
        <Link className="atajo" to="/progreso">
          <span className="atajo__titulo">Mi progreso</span>
          <span className="atajo__texto">
            Qué actividades hiciste, cuántos intentos y pistas usaste, y tus mejores resultados.
          </span>
        </Link>
        <Link className="atajo" to="/glosario">
          <span className="atajo__titulo">Glosario</span>
          <span className="atajo__texto">
            Los {Object.keys(glosario).length} términos del corte, con definición de trabajo y un
            ejemplo.
          </span>
        </Link>
      </section>

      {/* ------------------------ desafíos opcionales ---------------------- */}
      <section className="panel__seccion">
        <h2 className="titulo-seccion">Desafíos opcionales</h2>
        <p className="panel__nota">
          No hacen falta para completar la ruta principal ni cuentan para la nota orientativa. Están
          para quien quiera ir más lejos.
        </p>
        <ul className="lista-tareas">
          {catalogoActividades
            .filter((a) => a.nivel === 'opcional')
            .map((a) => (
              <li key={a.id}>
                <Link to={`/estacion/${a.estacionId}#${a.id}`}>
                  <span className="lista-tareas__titulo">{a.titulo}</span>
                  <span className="lista-tareas__meta">
                    {estaciones.find((e) => e.id === a.estacionId)?.titulo} ·{' '}
                    {resumen.etiquetaEstado(a.id)}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}

function Cifra({ valor, de, etiqueta, nota, vacio }) {
  const vacia = valor === 0
  return (
    <div className="cifra">
      <span className="cifra__valor">
        {valor}
        {de !== undefined && <span className="cifra__de">/{de}</span>}
      </span>
      <span className="cifra__etiqueta">{etiqueta}</span>
      {vacia && vacio ? <span className="cifra__vacio">{vacio}</span> : nota && <span className="cifra__nota">{nota}</span>}
    </div>
  )
}
