import { useState } from 'react'
import { FASES } from '../data/cdvs-fases.js'

/**
 * Línea de tiempo de las siete fases del ciclo de vida del desarrollo de
 * sistemas. Se toca una fase para ver qué es, qué hacen los profesionales,
 * qué resultado deja y un ejemplo. Es teoría: no puntúa.
 */
export default function LineaFases() {
  const [activa, setActiva] = useState(0)
  const fase = FASES[activa]

  return (
    <div className="fases">
      <ol className="fases__linea" aria-label="Las siete fases del ciclo de vida">
        {FASES.map((f, i) => (
          <li key={f.id} className="fases__paso">
            <button
              type="button"
              className={'fases__boton' + (i === activa ? ' fases__boton--activa' : '') + (i < activa ? ' fases__boton--previa' : '')}
              aria-current={i === activa ? 'step' : undefined}
              aria-controls="fase-detalle"
              onClick={() => setActiva(i)}
            >
              <span className="fases__numero">{f.numero}</span>
              <span className="fases__corto">{f.corto}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="fases__detalle" id="fase-detalle" role="region" aria-live="polite" aria-label={`Fase ${fase.numero}`}>
        <p className="fases__etiqueta">Fase {fase.numero} de 7</p>
        <h4 className="fases__titulo">{fase.nombre}</h4>
        <p className="fases__pregunta">{fase.pregunta}</p>
        <p>{fase.explicacion}</p>

        <div className="fases__columnas">
          <div>
            <p className="fases__subtitulo">Qué hacen los profesionales</p>
            <ul className="lista">
              {fase.queHacen.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="fases__subtitulo">Qué resultado deja</p>
            <p>{fase.resultado}</p>
            <p className="fases__subtitulo">Ejemplo</p>
            <p>{fase.ejemplo}</p>
          </div>
        </div>

        <div className="fases__navegacion">
          <button type="button" className="boton boton--texto" disabled={activa === 0} onClick={() => setActiva((a) => a - 1)}>
            Fase anterior
          </button>
          <button type="button" className="boton boton--secundario boton--pequeno" disabled={activa === FASES.length - 1} onClick={() => setActiva((a) => a + 1)}>
            Fase siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
