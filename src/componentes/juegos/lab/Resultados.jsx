import { COMPONENTES } from '../../../data/lab-cdvs.js'
import { FASES } from '../../../data/cdvs-fases.js'
import { formatearDuracion, repasoPorFase } from '../../../lib/labCdvs.js'
import { descargarPdf } from '../../../lib/pdfSimple.js'
import { construirPdf, nombreArchivoPdf, resumenDeLoConstruido, fechaLarga, horaCorta } from './evidencia.js'

const num = (n) => String(n).replace('.', ',')

/** Pantalla final: comprobante, puntuaciones separadas, resumen y descarga del PDF. */
export default function Resultados({ sesion, resumen, cuenta, estadoGuardado, modoDemo, onVolver }) {
  const repaso = repasoPorFase(sesion)

  function bajarPdf() {
    descargarPdf(construirPdf(sesion, resumen, cuenta), nombreArchivoPdf(resumen))
  }

  return (
    <div className="lab-resultados">
      <header className="lab-resultados__cabecera">
        <p className="etiqueta-campo">{resumen.terminada ? 'Proyecto terminado' : 'Resumen del avance'}</p>
        <h4>{resumen.alias}</h4>
        <p className="lab-ayuda">
          {resumen.integrantes.join(' · ')} · {fechaLarga(resumen.inicio)} · {horaCorta(resumen.inicio)} a{' '}
          {resumen.fin ? horaCorta(resumen.fin) : 'sin terminar'} · duración {formatearDuracion(resumen.segundos)}
        </p>
      </header>

      <div className="lab-cifras">
        <div className="lab-cifra">
          <span className="lab-cifra__valor">{num(resumen.academico)}</span>
          <span className="lab-cifra__de">de 100</span>
          <span className="lab-cifra__etiqueta">Puntuación académica</span>
          <span className="lab-cifra__nota">Qué tan completo y razonado quedó el proyecto.</span>
        </div>
        <div className="lab-cifra">
          <span className="lab-cifra__valor">{num(resumen.competitivo)}</span>
          <span className="lab-cifra__de">de 100</span>
          <span className="lab-cifra__etiqueta">Puntuación competitiva</span>
          <span className="lab-cifra__nota">Qué tan bien quedó el proyecto frente a los demás equipos.</span>
        </div>
        <div className="lab-cifra">
          <span className="lab-cifra__valor">{resumen.completos}</span>
          <span className="lab-cifra__de">de {resumen.totalComponentes}</span>
          <span className="lab-cifra__etiqueta">Componentes completos</span>
          <span className="lab-cifra__nota">{resumen.intentos} intentos en total.</span>
        </div>
      </div>

      <div className="tabla-envoltura">
        <table className="tabla">
          <thead>
            <tr>
              <th scope="col">Componente</th>
              <th scope="col">Puntos</th>
              <th scope="col">Intentos</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {resumen.componentes.map((r) => {
              const def = COMPONENTES.find((c) => c.id === r.id)
              return (
                <tr key={r.id}>
                  <th scope="row">{def.numero}. {def.titulo}</th>
                  <td>{num(r.puntos)} de {r.max}</td>
                  <td>{r.intentos}</td>
                  <td>{r.completo ? 'Completo' : 'Incompleto'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="lab-resumen">
        {resumenDeLoConstruido(sesion, resumen).map((l) => (
          <details key={l.titulo} className="lab-detalle">
            <summary>{l.titulo}</summary>
            <p>{l.texto}</p>
          </details>
        ))}
        <details className="lab-detalle">
          <summary>Qué acciones van en cada fase</summary>
          <ol className="lab-repaso">
            {FASES.map((f) => (
              <li key={f.id}>
                <strong>{f.numero}. {f.nombre}</strong>
                <ul className="lista">
                  {(repaso[f.id]?.acciones ?? []).map((a) => (
                    <li key={a.id}>{a.texto}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </details>
      </div>

      <div className="lab-acciones">
        <button type="button" className="boton boton--principal" onClick={bajarPdf}>
          Descargar el comprobante (PDF)
        </button>
        <button type="button" className="boton boton--texto" onClick={onVolver}>
          Volver a los componentes
        </button>
      </div>

      <p className={'guardado ' + (!modoDemo && estadoGuardado === 'guardado' ? 'guardado--ok' : 'guardado--pendiente')}>
        {modoDemo && 'Modo demostración: los resultados se guardan solo en este navegador y no se sincronizan. Descarga el comprobante.'}
        {!modoDemo && estadoGuardado === 'guardado' && 'Resultados guardados en el servidor. El docente los puede consultar en su panel.'}
        {!modoDemo && estadoGuardado !== 'guardado' &&
          'Todavía no se confirmó el guardado en el servidor. Tu avance sigue en este navegador. Descarga el comprobante por si acaso y avisa al docente.'}
      </p>
    </div>
  )
}
