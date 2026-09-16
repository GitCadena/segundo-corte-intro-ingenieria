import { useEffect, useState } from 'react'
import { useParams, Link, Navigate, useLocation } from 'react-router-dom'
import { estacionPorId, estaciones, actividadesDe } from '../data/catalogo.js'
import { useProgreso } from '../estado/ProgresoProvider.jsx'
import Actividad from '../componentes/juegos/index.jsx'
import Secuencia from '../componentes/juegos/Secuencia.jsx'
import Bloque from '../componentes/Bloque.jsx'
import Termino from '../componentes/Termino.jsx'

/**
 * Una estación, siempre con las mismas seis secciones:
 * qué aprenderás · comprende · mira un ejemplo · practica jugando ·
 * ponlo a prueba · qué te llevas.
 */
export default function Estacion() {
  const { id } = useParams()
  const ubicacion = useLocation()
  const estacion = estacionPorId(id)
  const { resumen } = useProgreso()

  useEffect(() => {
    if (!ubicacion.hash) return
    const objetivo = document.getElementById(ubicacion.hash.slice(1))
    if (objetivo) {
      objetivo.scrollIntoView({ behavior: 'smooth', block: 'start' })
      objetivo.focus?.({ preventScroll: true })
    }
  }, [ubicacion.hash, id])

  if (!estacion) return <Navigate to="/panel" replace />

  const p = resumen.porEstacion[estacion.id]
  const siguiente = estaciones.find((e) => e.orden === estacion.orden + 1)
  const glosarioClaves = estacion.glosario ?? []

  return (
    <article className="estacion-vista">
      <nav className="migas" aria-label="Dónde estás">
        <Link to="/panel">Panel</Link>
        <span aria-hidden="true">›</span>
        <span>Estación {estacion.orden}</span>
      </nav>

      <header className="estacion-vista__cabecera">
        <p className="estacion-vista__sesion">
          Estación {estacion.orden} · {estacion.sesion}
        </p>
        <h1 className="estacion-vista__titulo">{estacion.titulo}</h1>
        <p className="estacion-vista__gancho">{estacion.gancho}</p>
        <p className="estacion-vista__marcador" role="status">
          {p.completadas} de {p.total} actividades · {p.puntos} de {p.puntosMax} puntos
        </p>
      </header>

      <IndiceSecciones estacion={estacion} />

      {/* ------------------------ 1. Qué aprenderás ------------------------ */}
      <section className="seccion" id="aprenderas" tabIndex={-1}>
        <h2 className="seccion__titulo">
          <span className="seccion__numero">1</span> Qué aprenderás
        </h2>
        <p className="seccion__objetivo">{estacion.aprenderas.objetivo}</p>
        <ul className="lista lista--objetivos">
          {estacion.aprenderas.puntos.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
        <p className="seccion__duracion">Tiempo estimado: {estacion.aprenderas.duracion}</p>
      </section>

      {/* -------------------------- 2. Comprende -------------------------- */}
      <section className="seccion" id="comprende" tabIndex={-1}>
        <h2 className="seccion__titulo">
          <span className="seccion__numero">2</span> Comprende
        </h2>
        <p className="seccion__ayuda">
          Todo lo necesario para resolver las actividades está aquí. Donde hay un término subrayado,
          puedes tocarlo para ver su definición sin salir de la página.
        </p>
        <div className="tarjetas">
          {estacion.comprende.map((leccion, i) => (
            <TarjetaTeoria
              key={leccion.titulo}
              leccion={leccion}
              indice={i + 1}
              profundiza={estacion.profundiza?.[leccion.titulo]}
              glosario={glosarioClaves}
            />
          ))}
        </div>
      </section>

      {/* ------------------------ 3. Mira un ejemplo ---------------------- */}
      {estacion.ejemplo && (
        <section className="seccion" id="ejemplo" tabIndex={-1}>
          <h2 className="seccion__titulo">
            <span className="seccion__numero">3</span> Mira un ejemplo
          </h2>
          <h3 className="ejemplo__titulo">{estacion.ejemplo.titulo}</h3>
          <p className="ejemplo__contexto">
            <Termino texto={estacion.ejemplo.contexto} glosario={glosarioClaves} />
          </p>
          <ol className="ejemplo__pasos">
            {estacion.ejemplo.pasos.map((paso, i) => (
              <li key={i} className="ejemplo__paso">
                <h4 className="ejemplo__paso-titulo">{paso.titulo}</h4>
                <p className="ejemplo__paso-texto">{paso.texto}</p>
                {paso.nota && (
                  <p className="ejemplo__nota">
                    <strong>Ojo:</strong> {paso.nota}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <p className="ejemplo__cierre">{estacion.ejemplo.cierre}</p>
        </section>
      )}

      {/* ----------------------- 4. Practica jugando ---------------------- */}
      {estacion.actividades?.length > 0 && (
        <section className="seccion" id="practica" tabIndex={-1}>
          <h2 className="seccion__titulo">
            <span className="seccion__numero">4</span> Practica jugando
          </h2>
          <p className="seccion__ayuda">
            Cada actividad trae su objetivo, el concepto que necesitas y pistas progresivas. Puedes
            reintentar cuantas veces quieras; se conserva tu mejor resultado.
          </p>
          <div className="actividades">
            {estacion.actividades.map((a, i) => (
              <Actividad key={a.id} actividad={a} glosario={glosarioClaves} numero={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------ 5. Ponlo a prueba ----------------------- */}
      {estacion.reto && (
        <section className="seccion seccion--reto" id="reto" tabIndex={-1}>
          <h2 className="seccion__titulo">
            <span className="seccion__numero">5</span> Ponlo a prueba
          </h2>
          {estacion.reto.tipo === 'secuencia' ? (
            <Secuencia reto={estacion.reto} estacion={estacion} />
          ) : (
            <Actividad actividad={estacion.reto} glosario={glosarioClaves} />
          )}
        </section>
      )}

      {/* ------------------------- 6. Qué te llevas ----------------------- */}
      {estacion.sintesis && (
        <section className="seccion" id="sintesis" tabIndex={-1}>
          <h2 className="seccion__titulo">
            <span className="seccion__numero">6</span> Qué te llevas
          </h2>
          <ul className="sintesis">
            {estacion.sintesis.puntos.map((t, i) => (
              <li key={i}>
                <Termino texto={t} glosario={glosarioClaves} />
              </li>
            ))}
          </ul>
          <div className="conexion">
            <p className="conexion__titulo">Con qué se conecta</p>
            <p>{estacion.sintesis.conexion}</p>
          </div>
        </section>
      )}

      {/* --------------------------- taller ------------------------------- */}
      {estacion.taller && (
        <section className="seccion" id="taller" tabIndex={-1}>
          <h2 className="seccion__titulo">Taller en clase</h2>
          <Actividad actividad={estacion.taller} glosario={glosarioClaves} />
        </section>
      )}

      {/* ------------------------- referencias ---------------------------- */}
      {estacion.referencias && (
        <section className="seccion seccion--referencias" id="referencias" tabIndex={-1}>
          <h2 className="seccion__titulo">Referencias</h2>
          <ul className="referencias">
            {estacion.referencias.map((r, i) => (
              <li key={i}>
                {r.texto}{' '}
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.fuente}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="navegacion-estaciones" aria-label="Continuar">
        <Link className="boton boton--texto" to="/panel">
          Volver al panel
        </Link>
        {siguiente && (
          <Link className="boton boton--principal" to={`/estacion/${siguiente.id}`}>
            Siguiente estación: {siguiente.titulo}
          </Link>
        )}
      </nav>
    </article>
  )
}

/* ------------------------------ índice lateral ---------------------------- */

function IndiceSecciones({ estacion }) {
  const secciones = [
    ['aprenderas', 'Qué aprenderás'],
    ['comprende', 'Comprende'],
    estacion.ejemplo && ['ejemplo', 'Mira un ejemplo'],
    estacion.actividades?.length > 0 && ['practica', 'Practica jugando'],
    estacion.reto && ['reto', 'Ponlo a prueba'],
    estacion.sintesis && ['sintesis', 'Qué te llevas'],
    estacion.taller && ['taller', 'Taller en clase'],
  ].filter(Boolean)

  return (
    <nav className="indice" aria-label="Secciones de la estación">
      {secciones.map(([id, texto], i) => (
        <a key={id} href={`#${id}`} className="indice__enlace">
          <span className="indice__numero">{i + 1}</span>
          {texto}
        </a>
      ))}
    </nav>
  )
}

/* ---------------------------- tarjeta de teoría --------------------------- */

function TarjetaTeoria({ leccion, indice, profundiza, glosario }) {
  const [ampliado, setAmpliado] = useState(false)

  return (
    <section className="tarjeta">
      <h3 className="tarjeta__titulo">
        <span className="tarjeta__numero">{indice}</span>
        {leccion.titulo}
      </h3>
      {leccion.cuerpo.map((b, i) => (
        <Bloque key={i} bloque={b} glosario={glosario} />
      ))}

      {profundiza && (
        <div className="profundiza">
          <button
            type="button"
            className="boton boton--secundario boton--pequeno"
            aria-expanded={ampliado}
            onClick={() => setAmpliado((a) => !a)}
          >
            {ampliado ? 'Cerrar' : 'Quiero entender mejor'}
          </button>
          {ampliado && (
            <div className="profundiza__cuerpo">
              <h4 className="profundiza__titulo">{profundiza.titulo}</h4>
              {profundiza.cuerpo.map((b, i) => (
                <Bloque key={i} bloque={b} glosario={glosario} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
