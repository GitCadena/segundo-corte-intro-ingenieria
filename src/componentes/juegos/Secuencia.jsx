import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CuerpoJuego, useActividad } from './index.jsx'
import { Pistas, Resultado } from './marco.jsx'
import { useProgreso } from '../../estado/ProgresoProvider.jsx'
import { actividadPorId } from '../../data/catalogo.js'
import glosarioCompleto from '../../data/glosario.js'

/**
 * Reto por pasos.
 *
 * Cada paso es una actividad del catálogo con su propio identificador
 * (`retoId:pasoId`), así que el puntaje es parcial por paso y el informe por
 * concepto sale sin casos especiales. El contenedor solo coordina.
 */
export default function Secuencia({ reto, estacion }) {
  const { mejores } = useProgreso()
  const [visibles, setVisibles] = useState(1)
  const [cronometro, setCronometro] = useState(null)

  const pasos = reto.pasos.map((p, i) => ({
    ...p,
    idCatalogo: `${reto.id}:${p.id}`,
    numero: i + 1,
    titulo: p.titulo ?? `Paso ${i + 1}`,
    puntos: actividadPorId(`${reto.id}:${p.id}`)?.puntos ?? 0,
  }))

  const resueltos = pasos.filter((p) =>
    ['completada', 'dominada'].includes(mejores[p.idCatalogo]?.estado),
  ).length
  const terminado = resueltos === pasos.length

  // Se abre el siguiente paso cuando el anterior queda resuelto, pero el
  // estudiante también puede abrirlos todos: bloquear el avance castigaría a
  // quien se atasca en un paso que no depende de los demás.
  useEffect(() => {
    setVisibles((v) => Math.max(v, Math.min(resueltos + 1, pasos.length)))
  }, [resueltos, pasos.length])

  return (
    <section className="secuencia" aria-labelledby="reto-titulo">
      <header className="secuencia__cabecera">
        <p className="secuencia__etiqueta">Ponlo a prueba</p>
        <h2 className="secuencia__titulo" id="reto-titulo">
          {reto.titulo}
        </h2>
        {reto.objetivo && <p className="secuencia__objetivo">{reto.objetivo}</p>}
        {reto.instrucciones && <p className="secuencia__instrucciones">{reto.instrucciones}</p>}
        {reto.contexto && <blockquote className="escenario">{reto.contexto}</blockquote>}
        <p className="secuencia__marcador" role="status">
          {resueltos} de {pasos.length} pasos resueltos
        </p>
      </header>

      {reto.cronometroOpcional && (
        <Cronometro minutos={estacion.duracionMinutos ?? 45} estado={cronometro} setEstado={setCronometro} />
      )}

      <ol className="secuencia__pasos">
        {pasos.map((paso, i) => (
          <li key={paso.id}>
            {i < visibles ? (
              <PasoSecuencia paso={paso} reto={reto} />
            ) : (
              <div className="paso paso--cerrado">
                <p>
                  Paso {paso.numero} · {paso.puntos} pts
                </p>
                <button type="button" className="boton boton--texto" onClick={() => setVisibles(i + 1)}>
                  Abrir este paso sin resolver el anterior
                </button>
              </div>
            )}
          </li>
        ))}
        {visibles < pasos.length && (
          <li>
            <button type="button" className="boton boton--secundario" onClick={() => setVisibles(pasos.length)}>
              Abrir todos los pasos
            </button>
          </li>
        )}
      </ol>

      {terminado && <InformePorConcepto reto={reto} pasos={pasos} />}

      {terminado && reto.explicacion && (
        <div className="explicacion explicacion--cierre">
          <p className="explicacion__titulo">Qué acabas de recorrer</p>
          <p>{reto.explicacion}</p>
        </div>
      )}
    </section>
  )
}

/* ------------------------------- un paso -------------------------------- */

function PasoSecuencia({ paso, reto }) {
  const actividad = useMemo(
    () => ({
      ...paso,
      // Los pasos heredan lo que no declaran por su cuenta.
      pistas: paso.pistas ?? [],
      puntos: paso.puntos,
      titulo: paso.titulo,
      nivel: reto.nivel ?? 'base',
    }),
    [paso, reto],
  )
  const ctrl = useActividad(actividad, { idCatalogo: paso.idCatalogo })
  const estado = ctrl.mejor?.estado

  return (
    <article className={`paso paso--${estado ?? 'nuevo'}`} id={paso.idCatalogo}>
      <header className="paso__cabecera">
        <span className="paso__numero">{paso.numero}</span>
        <span className="chip chip--puntos">{paso.puntos} pts</span>
        {estado && <span className={`chip chip--estado chip--${estado}`}>{estado === 'dominada' ? 'Dominio' : 'Completado'}</span>}
      </header>
      {paso.instrucciones && <p className="paso__instrucciones">{paso.instrucciones}</p>}
      <CuerpoJuego actividad={actividad} ctrl={ctrl} />
      <Pistas ctrl={ctrl} />
      <Resultado ctrl={ctrl} actividad={actividad} />
    </article>
  )
}

/* -------------------------- informe por concepto ------------------------- */

function InformePorConcepto({ reto, pasos }) {
  const { mejores } = useProgreso()

  const porConcepto = {}
  for (const p of pasos) {
    const m = mejores[p.idCatalogo]
    const bien = m?.estado === 'dominada'
    const hecho = ['completada', 'dominada'].includes(m?.estado)
    for (const c of p.conceptos ?? reto.conceptos ?? []) {
      if (!porConcepto[c]) porConcepto[c] = { concepto: c, total: 0, dominados: 0, hechos: 0, seccion: p.seccion }
      porConcepto[c].total += 1
      if (bien) porConcepto[c].dominados += 1
      if (hecho) porConcepto[c].hechos += 1
      if (p.seccion) porConcepto[c].seccion = p.seccion
    }
  }

  const filas = Object.values(porConcepto).sort((a, b) => a.dominados / a.total - b.dominados / b.total)
  const puntos = pasos.reduce((s, p) => s + (mejores[p.idCatalogo]?.mejor_puntaje ?? 0), 0)
  const maximo = pasos.reduce((s, p) => s + p.puntos, 0)

  return (
    <section className="informe" aria-label="Resultado por concepto">
      <h3 className="informe__titulo">Tu resultado por concepto</h3>
      <p className="informe__puntaje">
        {puntos} de {maximo} puntos · {Math.round((puntos / maximo) * 100)} %
      </p>
      <p className="informe__nota">
        «Dominio» significa resuelto al primer intento y sin pistas. Lo demás está completado, que
        también cuenta, pero conviene repasarlo.
      </p>
      <ul className="informe__lista">
        {filas.map((f) => {
          const entrada = glosarioCompleto[f.concepto]
          const bien = f.dominados === f.total
          return (
            <li key={f.concepto} className={bien ? 'informe__fila informe__fila--ok' : 'informe__fila'}>
              <span className="informe__concepto">{entrada?.termino ?? f.concepto}</span>
              <span className="informe__cifra">
                {f.dominados} de {f.total} con dominio
              </span>
              {!bien && f.seccion && (
                <Link className="informe__enlace" to={`/estacion/${f.seccion.estacion}#comprende`}>
                  Repasar: {f.seccion.titulo}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ------------------------------- cronómetro ------------------------------ */

function Cronometro({ minutos, estado, setEstado }) {
  const [restante, setRestante] = useState(minutos * 60)

  useEffect(() => {
    if (estado !== 'corriendo') return undefined
    const id = setInterval(() => setRestante((r) => (r > 0 ? r - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [estado])

  if (estado === null) {
    return (
      <div className="cronometro cronometro--eleccion">
        <p className="cronometro__pregunta">¿Con cronómetro o sin él?</p>
        <p className="cronometro__ayuda">
          El reloj no bloquea nada cuando llega a cero: solo lo señala. Si es tu primera vez, hazlo
          sin cronómetro.
        </p>
        <div className="cronometro__acciones">
          <button type="button" className="boton boton--principal" onClick={() => setEstado('sin')}>
            Sin cronómetro
          </button>
          <button type="button" className="boton boton--secundario" onClick={() => setEstado('corriendo')}>
            Con cronómetro de {minutos} minutos
          </button>
        </div>
      </div>
    )
  }

  if (estado === 'sin') {
    return (
      <p className="cronometro cronometro--sin">
        Sin límite de tiempo.{' '}
        <button type="button" className="boton boton--texto" onClick={() => setEstado('corriendo')}>
          Activar el cronómetro
        </button>
      </p>
    )
  }

  const mm = String(Math.floor(restante / 60)).padStart(2, '0')
  const ss = String(restante % 60).padStart(2, '0')

  return (
    <div className={restante === 0 ? 'cronometro cronometro--fin' : 'cronometro'} role="timer" aria-live="off">
      <span className="cronometro__reloj">
        {mm}:{ss}
      </span>
      <span className="cronometro__texto">
        {restante === 0 ? 'Se acabó el tiempo. Puedes seguir: nada se bloquea.' : 'Tiempo del reto'}
      </span>
      <div className="cronometro__acciones">
        <button
          type="button"
          className="boton boton--texto"
          onClick={() => setEstado(estado === 'corriendo' ? 'pausa' : 'corriendo')}
        >
          {estado === 'corriendo' ? 'Pausar' : 'Reanudar'}
        </button>
        <button
          type="button"
          className="boton boton--texto"
          onClick={() => {
            setRestante(minutos * 60)
            setEstado('sin')
          }}
        >
          Quitar el cronómetro
        </button>
      </div>
    </div>
  )
}
