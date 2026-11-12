import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../estado/SesionProvider.jsx'
import { almacenTc } from '../lib/almacenTc.js'
import { useFicha } from '../lib/useFicha.js'
import { LENGUAJES, PARADIGMAS, RESULTADOS, claveDeEstructura, revisarFicha5 } from '../lib/ficha5.js'
import {
  ARGUMENTOS,
  EJEMPLO_PROGRAMAR,
  HERRAMIENTAS,
  LENGUAJES_TRADUCCION,
  PARA_LA_SUSTENTACION,
  PASOS_PARA_PROGRAMAR,
  TRADUCCION,
} from '../data/ficha5.js'
import { Campo, Comentarios as ComentariosFicha, EstadoFicha } from './componentes.jsx'
import './tercer-corte.css'
import './ficha4.css'
import './ficha5.css'

const Comentarios = (props) => <ComentariosFicha ficha={5} {...props} />

/**
 * Ficha 5 · Del pseudocódigo al código (Grupo 3). Ya tienen el plano (ficha 4): aquí
 * lo traducen a código en uno o dos lenguajes, eligen el paradigma y escogen el
 * lenguaje con el que van a programar. El docente la ve en modo lectura.
 */
export default function Ficha5({ equipo, modo = 'equipo' }) {
  return <FichaCinco key={`${equipo.id}-5`} equipo={equipo} modo={modo} />
}

function FichaCinco({ equipo, modo }) {
  const { perfil } = useSesion()
  const f = useFicha(equipo.id, 5)
  const [confirmando, setConfirmando] = useState(false)
  const [avisoEntrega, setAvisoEntrega] = useState(null)
  const esDocente = modo === 'docente'
  const entregada = f.estado === 'entregada'
  const bloqueada = entregada || esDocente
  const c = f.contenido

  const revision = useMemo(() => revisarFicha5(c), [c])
  const ctx = { c, f, equipo, esDocente, bloqueada, perfil, revision, autorId: perfil?.id }

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
        <span>Ficha 5</span>
      </nav>

      <header className="tc-cabecera">
        <div>
          <p className="etiqueta-campo">Proyecto: {equipo.nombre}</p>
          <h1>Ficha 5 · Del pseudocódigo al código</h1>
          <p className="tc-objetivo">
            Ya tienen el plano (la ficha 4). Ahora lo pasan a código en uno o dos lenguajes, deciden cómo se va a organizar el programa y eligen el lenguaje con el
            que van a programar. La próxima clase lo sustentan.
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

      {!esDocente && <PorQueImporto />}

      <BloqueProgramar {...ctx} />
      <BloqueParadigma {...ctx} />
      <BloqueLenguaje {...ctx} />

      {!esDocente && <ParaLaSustentacion />}

      <section className="tarjeta tc-revision" aria-labelledby="tc-revision5">
        <h2 id="tc-revision5" className="tc-bloque__titulo">Revisión de la ficha</h2>
        <ul className="tc-lista">
          {revision.puntos.map((p) => (
            <li key={p.id} className={p.ok ? 'tc-lista__ok' : 'tc-lista__pendiente'}>
              <span aria-hidden="true">{p.ok ? '✓' : '○'}</span> <span>{p.texto}</span>
              <span className="visualmente-oculto">{p.ok ? ': listo' : ': pendiente'}</span>
              {!p.ok && p.pista && <span className="tc-pista">{p.pista}</span>}
            </li>
          ))}
        </ul>
        <p className="tc-nota">
          Para entregar necesitan como mínimo la traducción a código de un lenguaje, el paradigma con su justificación y el lenguaje elegido. Lo ideal es dejar todos
          los puntos en verde: el docente revisa la ficha completa antes de la sustentación.
        </p>

        {!esDocente && !entregada && (
          <div className="tc-entrega">
            {!confirmando ? (
              <button type="button" className="boton boton--principal" disabled={!revision.puedeEntregar} onClick={() => setConfirmando(true)}>
                {revision.puedeEntregar ? 'Entregar la ficha' : 'Falta el código, el paradigma o el lenguaje para entregar'}
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
                await almacenTc.reabrir(equipo.id, 5)
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

/* ------------------------- A · por qué importó el pseudocódigo ------------------------- */

function PorQueImporto() {
  const [lenguaje, setLenguaje] = useState('python')
  const info = LENGUAJES_TRADUCCION.find((l) => l.id === lenguaje)
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-importo">
      <h2 id="tc-importo" className="tc-bloque__titulo">A · Por qué el pseudocódigo que hicieron importa</h2>
      <p className="tc-objetivo">
        Escribir el pseudocódigo y probarlo a mano pudo parecer un paso de más. No lo fue: es lo que les permite programar y elegir lenguaje con la cabeza fría.
        Cuatro razones:
      </p>
      <div className="tc-argumentos">
        {ARGUMENTOS.map((a, i) => (
          <article key={a.titulo} className="tc-argumento">
            <span className="tc-argumento__n" aria-hidden="true">{i + 1}</span>
            <h3>{a.titulo}</h3>
            <p>{a.texto}</p>
          </article>
        ))}
      </div>

      <h3 className="tc-subtitulo">Su guía para traducir: el mismo algoritmo en tres lenguajes</h3>
      <p>
        Este es el pseudocódigo de la panadería de la ficha 4, traducido línea por línea. Cambia el lenguaje y miren qué cambia (los símbolos) y qué no (los pasos).
        Úsenla como guía cuando traduzcan el suyo.
      </p>
      <div className="tc-pestanas" role="tablist" aria-label="Lenguaje de la traducción">
        {LENGUAJES_TRADUCCION.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={lenguaje === l.id}
            className={'tc-pestana' + (lenguaje === l.id ? ' tc-pestana--activa' : '')}
            onClick={() => setLenguaje(l.id)}
          >
            {l.nombre}
          </button>
        ))}
      </div>
      <div className="tabla-envoltura">
        <table className="tabla tc-traduccion">
          <thead>
            <tr>
              <th scope="col">Parte</th>
              <th scope="col">Pseudocódigo</th>
              <th scope="col">{info.nombre}</th>
            </tr>
          </thead>
          <tbody>
            {TRADUCCION.map((fila, i) => (
              <tr key={i} className={`tc-traduccion__${fila.parte.toLowerCase()}`}>
                <td>{fila.parte}</td>
                <td><pre>{fila.pseudo}</pre></td>
                <td><pre>{fila[lenguaje]}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="aviso aviso--nota" role="status">{info.nota} Las cuatro partes (preparar, repetir, decidir, entregar) están en el mismo orden en los tres.</p>
    </section>
  )
}

/* ------------------------------- B · programen su proceso ------------------------------- */

/** Pseudocódigo de la ficha 4 del equipo, solo para leerlo mientras traducen. */
function usePseudoDeLaFicha4(equipoId) {
  const [datos, setDatos] = useState(undefined)
  useEffect(() => {
    let vivo = true
    almacenTc
      .obtenerFicha(equipoId, 4)
      .then((r) => vivo && setDatos(r.contenido ?? {}))
      .catch(() => vivo && setDatos({}))
    return () => {
      vivo = false
    }
  }, [equipoId])
  return datos
}

function BloqueProgramar({ c, f, bloqueada, equipo, esDocente, autorId }) {
  const ficha4 = usePseudoDeLaFicha4(equipo.id)
  const caso = ficha4
    ? Object.keys(ficha4)
        .filter((k) => k.startsWith('caso__'))
        .sort()
        .map((k) => `${k.replace('caso__', '')} = ${String(ficha4[k]).replace(/\r?\n/g, ' | ')}`)
        .join(' ; ')
    : ''

  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-programar">
      <h2 id="tc-programar" className="tc-bloque__titulo">B · Pasen su pseudocódigo a código</h2>
      <p className="tc-objetivo">
        Aquí no repiten nada: usan lo que ya hicieron. Toman el pseudocódigo de su ficha 4 y lo escriben en un lenguaje de programación. Tienen libertad para probar
        uno o dos y ver cuál se les da mejor: eso les ayudará a decidir en la parte D.
      </p>

      <ol className="tc-como tc-como--pasos" aria-label="Cómo se hace">
        {PASOS_PARA_PROGRAMAR.map((p) => (
          <li key={p.titulo}>
            <strong>{p.titulo}.</strong> {p.texto}
          </li>
        ))}
      </ol>

      <h3 className="tc-subtitulo">Su pseudocódigo de la ficha 4</h3>
      {ficha4 === undefined ? (
        <p className="cargando" role="status">Buscando su pseudocódigo…</p>
      ) : String(ficha4.pseudo ?? '').trim() ? (
        <>
          <pre className="tc-codigo-final">{ficha4.pseudo}</pre>
          {caso && <p className="tc-nota">Caso de su prueba de escritorio: {caso}{ficha4.esperado ? ` · resultado esperado: ${ficha4.esperado}` : ''}</p>}
        </>
      ) : (
        <p className="aviso aviso--nota">
          No encontramos un pseudocódigo guardado en la ficha 4 de este equipo. Pueden traducir el que hicieron en su hoja o terminar la{' '}
          {esDocente ? 'ficha 4' : <Link to="/tercer-corte/ficha/4">ficha 4</Link>}.
        </p>
      )}

      <Campo
        etiqueta="¿Con qué herramienta lo escriben y lo prueban?"
        ayuda="Dónde van a escribir y ejecutar el código. Ejemplos de lo que pueden usar en la lista de abajo."
        id="tc5-herramienta"
      >
        <input id="tc5-herramienta" className="campo" disabled={bloqueada} value={c.como_programan ?? ''} onChange={(e) => f.cambiar('como_programan', e.target.value)} />
      </Campo>
      <ul className="tc-lista tc-lista--ayuda">
        {HERRAMIENTAS.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <Opcion prefijo="op1" titulo="Opción 1 · El lenguaje que van a probar primero" c={c} f={f} bloqueada={bloqueada} />
      <Opcion prefijo="op2" titulo="Opción 2 (opcional) · Otro lenguaje para comparar" c={c} f={f} bloqueada={bloqueada} opcional />

      <h3 className="tc-subtitulo">¿Qué resultado dio con el caso de la ficha 4?</h3>
      <fieldset className="tc-opciones tc-opciones--compactas" disabled={bloqueada}>
        <legend className="visualmente-oculto">Resultado de ejecutar el código</legend>
        {RESULTADOS.map((r) => (
          <label key={r.id} className={'tc-opcion' + (c.prueba_igual === r.id ? ' tc-opcion--elegida' : '')}>
            <input type="radio" name="tc5-resultado" value={r.id} checked={c.prueba_igual === r.id} onChange={() => f.cambiar('prueba_igual', r.id)} />
            <span>{r.texto}</span>
          </label>
        ))}
      </fieldset>
      <Campo etiqueta="Cuéntenlo en una o dos líneas" ayuda="Qué valor les dio, o qué les faltó para poder ejecutarlo." id="tc5-resultado-texto">
        <input id="tc5-resultado-texto" className="campo" disabled={bloqueada} value={c.prueba_resultado ?? ''} onChange={(e) => f.cambiar('prueba_resultado', e.target.value)} />
      </Campo>

      {!esDocente && !bloqueada && (
        <details className="tc-ver-paso">
          <summary>Ver un ejemplo de cómo se llena esta parte (Panadería La Esquina)</summary>
          <div className="tc-ejemplo5">
            <p><strong>Lenguajes que probaron:</strong> {EJEMPLO_PROGRAMAR.lenguaje}</p>
            <p><strong>Herramienta:</strong> {EJEMPLO_PROGRAMAR.herramienta}</p>
            <p><strong>Código (una parte):</strong></p>
            <pre className="tc-codigo-final">{EJEMPLO_PROGRAMAR.codigo}</pre>
            <p><strong>Resultado:</strong> {EJEMPLO_PROGRAMAR.resultado}</p>
            <p><strong>Cómo les fue:</strong> {EJEMPLO_PROGRAMAR.nota}</p>
          </div>
          <p className="tc-nota">Es solo un ejemplo: ustedes escriben el de su proyecto, con su lenguaje y su experiencia.</p>
        </details>
      )}

      <Comentarios seccion="programar" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

function Opcion({ prefijo, titulo, c, f, bloqueada, opcional = false }) {
  const len = c[`${prefijo}_lenguaje`] ?? ''
  return (
    <div className="tc-opcion-lenguaje">
      <h3 className="tc-subtitulo">{titulo}</h3>
      <div className="tc-opcion-lenguaje__cabeza">
        <Campo etiqueta="Lenguaje" id={`tc5-${prefijo}-len`}>
          <select id={`tc5-${prefijo}-len`} className="campo" disabled={bloqueada} value={len} onChange={(e) => f.cambiar(`${prefijo}_lenguaje`, e.target.value)}>
            <option value="">{opcional ? '— sin segunda opción —' : '— elijan uno —'}</option>
            {LENGUAJES.map((l) => (
              <option key={l.id} value={l.id}>{l.nombre}</option>
            ))}
          </select>
        </Campo>
        {len === 'otro' && (
          <Campo etiqueta="¿Cuál?" id={`tc5-${prefijo}-otro`}>
            <input id={`tc5-${prefijo}-otro`} className="campo" disabled={bloqueada} value={c[`${prefijo}_lenguaje_otro`] ?? ''} onChange={(e) => f.cambiar(`${prefijo}_lenguaje_otro`, e.target.value)} />
          </Campo>
        )}
      </div>
      {len && (
        <>
          <Campo
            etiqueta="Su pseudocódigo traducido a ese lenguaje"
            ayuda="Escríbanlo o pégenlo aquí. Si no lo terminaron, pongan lo que alcanzaron: la entrada, el ciclo y la decisión."
            id={`tc5-${prefijo}-codigo`}
          >
            <textarea
              id={`tc5-${prefijo}-codigo`}
              className="campo campo--area tc-codigo-area"
              rows={10}
              spellCheck={false}
              disabled={bloqueada}
              value={c[`${prefijo}_codigo`] ?? ''}
              onChange={(e) => f.cambiar(`${prefijo}_codigo`, e.target.value)}
            />
          </Campo>
          <Campo etiqueta="¿Qué tal les fue con este lenguaje?" ayuda="Qué les resultó fácil, qué les costó y qué no entendieron." id={`tc5-${prefijo}-nota`}>
            <textarea id={`tc5-${prefijo}-nota`} className="campo campo--area" rows={3} disabled={bloqueada} value={c[`${prefijo}_nota`] ?? ''} onChange={(e) => f.cambiar(`${prefijo}_nota`, e.target.value)} />
          </Campo>
        </>
      )}
    </div>
  )
}

/* ------------------------------------ C · paradigma ------------------------------------ */

function BloqueParadigma({ c, f, bloqueada, equipo, esDocente, autorId }) {
  const clave = claveDeEstructura(c)
  const esOO = c.paradigma === 'oo'
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-paradigma">
      <h2 id="tc-paradigma" className="tc-bloque__titulo">C · Elijan el paradigma</h2>
      <p className="tc-objetivo">
        El paradigma es una decisión de diseño: cómo se va a organizar el programa. Hay que defenderla con el problema, no con el gusto.
      </p>

      <fieldset className="tc-opciones" disabled={bloqueada}>
        <legend className="etiqueta-campo">¿Cuál le conviene a su proyecto?</legend>
        {PARADIGMAS.map((p) => (
          <label key={p.id} className={'tc-opcion' + (c.paradigma === p.id ? ' tc-opcion--elegida' : '')}>
            <input type="radio" name="tc5-paradigma" value={p.id} checked={c.paradigma === p.id} onChange={() => f.cambiar('paradigma', p.id)} />
            <span>
              <strong>{p.titulo}</strong>
              <span className="tc-opcion__texto">{p.texto}</span>
              <span className="tc-opcion__cuando">{p.cuando}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <Campo
        etiqueta="Justifiquen su elección en tres líneas"
        ayuda="Hablen de SU problema: qué cosas o pasos tiene, qué reglas, qué podría crecer. Eviten «porque es más fácil»."
        id="tc5-justificacion"
      >
        <textarea id="tc5-justificacion" className="campo campo--area" rows={5} disabled={bloqueada} value={c.justificacion ?? ''} onChange={(e) => f.cambiar('justificacion', e.target.value)} />
      </Campo>

      {c.paradigma && (
        <Campo
          etiqueta={esOO ? 'Clases del programa y qué hace cada una' : 'Funciones principales del programa y qué hace cada una'}
          ayuda={
            esOO
              ? 'Una por línea. Ejemplo: «Pedido: calcula su total», «Producto: guarda nombre y precio».'
              : 'Una por línea. Ejemplo: «calcularTotal: suma los productos y aplica el descuento», «armarListaDeProduccion: junta los pedidos del día».'
          }
          id={`tc5-${clave}`}
        >
          <textarea id={`tc5-${clave}`} className="campo campo--area" rows={5} disabled={bloqueada} value={c[clave] ?? ''} onChange={(e) => f.cambiar(clave, e.target.value)} />
        </Campo>
      )}

      <Comentarios seccion="paradigma" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

/* ------------------------------------ D · lenguaje ------------------------------------ */

function BloqueLenguaje({ c, f, bloqueada, equipo, esDocente, autorId }) {
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-lenguaje">
      <h2 id="tc-lenguaje" className="tc-bloque__titulo">D · Elijan el lenguaje con el que van a programar</h2>
      <p className="tc-objetivo">
        Ya probaron traducir su plano. Ahora decidan: no hay un lenguaje «mejor», hay uno que le sirve más a su proyecto. Apóyense en lo que les pasó en la parte B y
        respondan: ¿qué van a construir y dónde se va a usar?, ¿alguien del equipo ya lo conoce?, ¿encaja con el paradigma que eligieron?
      </p>

      <fieldset className="tc-opciones" disabled={bloqueada}>
        <legend className="etiqueta-campo">Lenguaje elegido</legend>
        {LENGUAJES.map((l) => (
          <label key={l.id} className={'tc-opcion' + (c.lenguaje === l.id ? ' tc-opcion--elegida' : '')}>
            <input type="radio" name="tc5-lenguaje" value={l.id} checked={c.lenguaje === l.id} onChange={() => f.cambiar('lenguaje', l.id)} />
            <span>
              <strong>{l.nombre}</strong>
              <span className="tc-opcion__texto">{l.texto}</span>
              <span className="tc-opcion__cuando">Ideal para: {l.ideal}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {c.lenguaje === 'otro' && (
        <Campo etiqueta="¿Cuál lenguaje?" id="tc5-otro">
          <input id="tc5-otro" className="campo" disabled={bloqueada} value={c.lenguaje_otro ?? ''} onChange={(e) => f.cambiar('lenguaje_otro', e.target.value)} />
        </Campo>
      )}

      <Campo
        etiqueta="¿Por qué ese lenguaje es el adecuado para SU proyecto?"
        ayuda="Den razones concretas: qué les resultó fácil o difícil al probarlo, qué van a construir, dónde se usará, quién lo conoce y por qué encaja con el paradigma."
        id="tc5-porque"
      >
        <textarea id="tc5-porque" className="campo campo--area" rows={4} disabled={bloqueada} value={c.lenguaje_porque ?? ''} onChange={(e) => f.cambiar('lenguaje_porque', e.target.value)} />
      </Campo>

      <Campo
        etiqueta="¿Qué es lo primero que van a programar?"
        ayuda="Escojan una parte pequeña de su pseudocódigo para empezar. Ejemplo: «la entrada y el cálculo del total»."
        id="tc5-primero"
      >
        <input id="tc5-primero" className="campo" disabled={bloqueada} value={c.lenguaje_primero ?? ''} onChange={(e) => f.cambiar('lenguaje_primero', e.target.value)} />
      </Campo>

      <Campo
        etiqueta="Con sus palabras: ¿para qué les sirvió escribir el pseudocódigo y la prueba de escritorio antes de programar?"
        ayuda="Dos o tres líneas, con algo concreto: qué les ahorró al traducir, qué error evitaron, qué entendieron mejor."
        id="tc5-importo"
      >
        <textarea id="tc5-importo" className="campo campo--area" rows={4} disabled={bloqueada} value={c.pseudo_importa ?? ''} onChange={(e) => f.cambiar('pseudo_importa', e.target.value)} />
      </Campo>

      <Comentarios seccion="lenguaje" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

/* -------------------------------- para la sustentación -------------------------------- */

function ParaLaSustentacion() {
  return (
    <section className="tarjeta tc-bloque tc-sustenta" aria-labelledby="tc-sustentacion">
      <p className="tc-sustenta__etiqueta">Próxima clase</p>
      <h2 id="tc-sustentacion" className="tc-bloque__titulo">Ya estamos cerca de la sustentación</h2>
      <p className="tc-objetivo">
        En la siguiente clase cada equipo explica su trabajo frente al grupo. Lleguen con todo esto preparado: no tienen que memorizar, tienen que entender lo que
        hicieron.
      </p>
      <ul className="tc-sustenta__lista">
        {PARA_LA_SUSTENTACION.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="tc-nota">Reparten quién explica cada parte antes de la clase. Quien sustenta debe poder responder: «¿por qué lo hicieron así?».</p>
    </section>
  )
}
