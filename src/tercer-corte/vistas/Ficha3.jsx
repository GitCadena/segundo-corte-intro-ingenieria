import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../estado/SesionProvider.jsx'
import { almacenTc } from '../lib/almacenTc.js'
import { useFicha } from '../lib/useFicha.js'
import { ATRIBUTOS_ISO, EJEMPLO_LA_ESQUINA, NUMERO_ATRIBUTOS, nombreAtributo } from '../data/iso.js'
import { camposAtributo, revisarFicha3, validarCriterio } from '../lib/validadores.js'
import { Campo, Comentarios as ComentariosFicha, EstadoFicha } from './componentes.jsx'
import './tercer-corte.css'

/**
 * Ficha 3 · Calidad (ISO/IEC 25010). La edita el equipo; el docente la ve en
 * modo lectura (modo = 'docente'), comenta por sección y puede reabrirla.
 */
export default function Ficha3({ equipo, modo = 'equipo' }) {
  return <FichaTres key={`${equipo.id}-3`} equipo={equipo} modo={modo} />
}

function FichaTres({ equipo, modo }) {
  const { perfil } = useSesion()
  const f = useFicha(equipo.id, 3)
  const [confirmando, setConfirmando] = useState(false)
  const [avisoEntrega, setAvisoEntrega] = useState(null)
  const esDocente = modo === 'docente'
  const entregada = f.estado === 'entregada'
  const bloqueada = entregada || esDocente

  const revision = useMemo(() => revisarFicha3(f.contenido), [f.contenido])
  const ids = [1, 2, 3].map((i) => f.contenido[camposAtributo(i).atributo])

  async function entregar() {
    setAvisoEntrega(null)
    try {
      await f.entregar()
      setConfirmando(false)
    } catch (e) {
      setAvisoEntrega(e.message)
    }
  }

  if (f.cargando) return <p className="cargando" role="status">Cargando la ficha…</p>

  return (
    <div className="tc">
      <nav className="migas" aria-label="Dónde estás">
        <Link to={esDocente ? '/tercer-corte/docente' : '/tercer-corte'}>Tercer corte</Link>
        <span aria-hidden="true">›</span>
        <span>Ficha 3</span>
      </nav>

      <header className="tc-cabecera">
        <div>
          <p className="etiqueta-campo">Proyecto: {equipo.nombre}</p>
          <h1>Ficha 3 · Calidad con números</h1>
          <p className="tc-objetivo">
            Elijan tres atributos de calidad de ISO/IEC 25010 para su sistema y digan, para cada uno, qué significa, cómo se mide y
            cómo se prueba. La idea es medir la calidad con números o con un sí/no que se pueda comprobar, no con opiniones.
          </p>
        </div>
        <EstadoFicha f={f} entregada={entregada} esDocente={esDocente} />
      </header>

      {entregada && (
        <p className="aviso aviso--ok tc-aviso">
          {esDocente
            ? 'Esta ficha está entregada y bloqueada para el equipo.'
            : 'Ficha entregada. Ya no se puede editar; si necesitan cambiar algo, pídanle al docente que la reabra.'}
        </p>
      )}
      {f.error && <p className="aviso aviso--error tc-aviso" role="alert">{f.error}</p>}

      {!esDocente && (
        <details className="tc-ejemplo">
          <summary>{EJEMPLO_LA_ESQUINA.titulo}</summary>
          <p>{EJEMPLO_LA_ESQUINA.intro}</p>
          <div className="tabla-envoltura">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Atributo</th>
                  <th scope="col">Qué significa</th>
                  <th scope="col">Criterio medible</th>
                  <th scope="col">Cómo se prueba</th>
                </tr>
              </thead>
              <tbody>
                {EJEMPLO_LA_ESQUINA.atributos.map((a) => (
                  <tr key={a.atributo}>
                    <th scope="row">{a.atributo}</th>
                    <td>{a.significa}</td>
                    <td>{a.criterio}</td>
                    <td>{a.prueba}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{EJEMPLO_LA_ESQUINA.importante}</p>
        </details>
      )}

      {Array.from({ length: NUMERO_ATRIBUTOS }, (_, n) => n + 1).map((i) => {
        const k = camposAtributo(i)
        const criterio = validarCriterio(f.contenido[k.criterio])
        const repetido = revision.repetidos.includes(f.contenido[k.atributo])
        return (
          <section key={i} className="tarjeta tc-bloque" aria-labelledby={`tc-a${i}`}>
            <h2 id={`tc-a${i}`} className="tc-bloque__titulo">
              <span className="seccion__numero">{i}</span> Atributo {i}
            </h2>

            <Campo etiqueta="¿Qué atributo de calidad es?" id={`tc-a${i}-atributo`}>
              <select
                id={`tc-a${i}-atributo`}
                className="campo"
                value={f.contenido[k.atributo] ?? ''}
                disabled={bloqueada}
                onChange={(e) => f.cambiar(k.atributo, e.target.value)}
              >
                <option value="">Elige un atributo…</option>
                {ATRIBUTOS_ISO.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              {repetido && (
                <span className="tc-pista tc-pista--alerta" role="status">
                  Ya elegiste este atributo en otra tarjeta. Cada ficha necesita tres atributos distintos.
                </span>
              )}
            </Campo>

            <Campo etiqueta="¿Qué significa en su sistema?" id={`tc-a${i}-significa`}>
              <textarea
                id={`tc-a${i}-significa`}
                className="campo campo--area"
                rows={2}
                disabled={bloqueada}
                value={f.contenido[k.significa] ?? ''}
                onChange={(e) => f.cambiar(k.significa, e.target.value)}
              />
            </Campo>

            <Campo
              etiqueta="Criterio medible"
              ayuda="Un número o algo que se conteste con sí o no. Ejemplo: «registrar un pedido toma menos de 2 minutos»."
              id={`tc-a${i}-criterio`}
            >
              <textarea
                id={`tc-a${i}-criterio`}
                className="campo campo--area"
                rows={2}
                disabled={bloqueada}
                value={f.contenido[k.criterio] ?? ''}
                onChange={(e) => f.cambiar(k.criterio, e.target.value)}
              />
              {criterio.pista && !bloqueada && (
                <span className="tc-pista" role="status">{criterio.pista}</span>
              )}
            </Campo>

            <Campo etiqueta="¿Cómo se prueba? (con qué caso y quién)" id={`tc-a${i}-prueba`}>
              <textarea
                id={`tc-a${i}-prueba`}
                className="campo campo--area"
                rows={2}
                disabled={bloqueada}
                value={f.contenido[k.prueba] ?? ''}
                onChange={(e) => f.cambiar(k.prueba, e.target.value)}
              />
            </Campo>

            <Comentarios seccion={`a${i}`} f={f} equipo={equipo} esDocente={esDocente} autorId={perfil?.id} />
          </section>
        )
      })}

      <section className="tarjeta tc-bloque" aria-labelledby="tc-importante">
        <h2 id="tc-importante" className="tc-bloque__titulo">
          <span className="seccion__numero">4</span> El más importante
        </h2>
        <Campo etiqueta="¿Cuál de los tres es el más importante?" id="tc-mas-importante">
          <select
            id="tc-mas-importante"
            className="campo"
            value={f.contenido.mas_importante ?? ''}
            disabled={bloqueada}
            onChange={(e) => f.cambiar('mas_importante', e.target.value)}
          >
            <option value="">Elige uno…</option>
            {[1, 2, 3].map((i) => (
              <option key={i} value={`a${i}`}>
                Atributo {i}{ids[i - 1] ? `: ${nombreAtributo(ids[i - 1]).split(' (')[0]}` : ''}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="¿Por qué es el más importante para su sistema?" id="tc-por-que">
          <textarea
            id="tc-por-que"
            className="campo campo--area"
            rows={3}
            disabled={bloqueada}
            value={f.contenido.por_que ?? ''}
            onChange={(e) => f.cambiar('por_que', e.target.value)}
          />
        </Campo>
        <Comentarios seccion="importante" f={f} equipo={equipo} esDocente={esDocente} autorId={perfil?.id} />
      </section>

      <section className="tarjeta tc-revision" aria-labelledby="tc-revision">
        <h2 id="tc-revision" className="tc-bloque__titulo">Revisión de la ficha</h2>
        <ul className="tc-lista">
          {revision.puntos.map((p) => (
            <li key={p.id} className={p.ok ? 'tc-lista__ok' : 'tc-lista__pendiente'}>
              <span aria-hidden="true">{p.ok ? '✓' : '○'}</span>{' '}
              <span>{p.texto}</span>
              <span className="visualmente-oculto">{p.ok ? ': listo' : ': pendiente'}</span>
            </li>
          ))}
        </ul>
        <p className="tc-nota">
          Los criterios que no se pueden medir no impiden entregar, pero el docente los va a comentar. Para entregar necesitan los tres
          atributos completos y distintos, y decir cuál es el más importante.
        </p>

        {!esDocente && !entregada && (
          <div className="tc-entrega">
            {!confirmando ? (
              <button type="button" className="boton boton--principal" disabled={!revision.puedeEntregar} onClick={() => setConfirmando(true)}>
                {revision.puedeEntregar ? 'Entregar la ficha' : 'Completa los tres atributos para entregar'}
              </button>
            ) : (
              <div className="tc-confirmar" role="alert">
                <p><strong>¿Entregar ahora?</strong> La ficha se bloquea para todo el equipo y solo el docente puede reabrirla.</p>
                <button type="button" className="boton boton--principal" onClick={entregar}>Sí, entregar</button>{' '}
                <button type="button" className="boton boton--texto" onClick={() => setConfirmando(false)}>Todavía no</button>
              </div>
            )}
            {avisoEntrega && <p className="aviso aviso--error" role="alert">{avisoEntrega}</p>}
          </div>
        )}

        {esDocente && entregada && (
          <div className="tc-entrega">
            <button
              type="button"
              className="boton boton--secundario"
              onClick={async () => {
                await almacenTc.reabrir(equipo.id, 3)
                f.recargar()
              }}
            >
              Reabrir la ficha para el equipo
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function Comentarios(props) {
  return <ComentariosFicha ficha={3} {...props} />
}
