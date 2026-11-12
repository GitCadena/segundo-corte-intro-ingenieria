import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../estado/SesionProvider.jsx'
import { almacenTc } from '../lib/almacenTc.js'
import { useFicha } from '../lib/useFicha.js'
import { LENGUAJES, PARADIGMAS, claveDeEstructura, revisarFicha5 } from '../lib/ficha5.js'
import { ARGUMENTOS, EJEMPLO_PROCESO_2, LENGUAJES_TRADUCCION, PARA_LA_SUSTENTACION, TRADUCCION } from '../data/ficha5.js'
import { Campo, Comentarios as ComentariosFicha, EstadoFicha } from './componentes.jsx'
import { BloqueDefinir, BloquePrueba, BloquePseudocodigo } from './Ficha4.jsx'
import './tercer-corte.css'
import './ficha4.css'
import './ficha5.css'

const Comentarios = (props) => <ComentariosFicha ficha={5} {...props} />

/**
 * Ficha 5 · Segundo proceso, paradigma y lenguaje (Grupo 3). El equipo repite lo de
 * la ficha 4 con un segundo proceso, elige el paradigma, lo justifica y escoge el
 * lenguaje con el que va a programar. El docente la ve en modo lectura.
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
          <h1>Ficha 5 · Segundo proceso, paradigma y lenguaje</h1>
          <p className="tc-objetivo">
            Repitan lo de la ficha 4 con un segundo proceso, decidan cómo se va a organizar el programa y elijan el lenguaje con el que van a empezar a
            programar. En la próxima clase lo sustentan.
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
      {!esDocente && <Ejemplo />}

      <BloqueDefinir {...ctx} segundo />
      <BloquePseudocodigo {...ctx} />
      <BloquePrueba {...ctx} />

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
          Para entregar necesitan como mínimo el segundo proceso escrito, el paradigma con su justificación y el lenguaje elegido. Lo ideal es dejar todos los
          puntos en verde: el docente revisa la ficha completa antes de la sustentación.
        </p>

        {!esDocente && !entregada && (
          <div className="tc-entrega">
            {!confirmando ? (
              <button type="button" className="boton boton--principal" disabled={!revision.puedeEntregar} onClick={() => setConfirmando(true)}>
                {revision.puedeEntregar ? 'Entregar la ficha' : 'Falta el proceso, el paradigma o el lenguaje para entregar'}
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
        Escribir el pseudocódigo y probarlo a mano pudo parecer un paso de más. No lo fue: es lo que les permite elegir lenguaje con la cabeza fría. Cuatro razones:
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

      <h3 className="tc-subtitulo">El mismo algoritmo, en tres lenguajes</h3>
      <p>
        Este es el pseudocódigo de la panadería de la ficha 4, traducido línea por línea. Cambia el lenguaje y miren qué cambia (los símbolos) y qué no (los pasos).
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

/* -------------------------- ejemplo de la panadería (referencia) -------------------------- */

function Ejemplo() {
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-ejemplo5">
      <h2 id="tc-ejemplo5" className="tc-bloque__titulo">Ejemplo: Panadería La Esquina</h2>
      <p className="tc-objetivo">Así se ve una ficha 5 bien hecha. Es solo un ejemplo: ustedes escriben el de su proyecto.</p>
      <div className="tc-ejemplo5">
        <p><strong>Proceso 2:</strong> {EJEMPLO_PROCESO_2.proceso}</p>
        <p><strong>Paradigma:</strong> {EJEMPLO_PROCESO_2.paradigma}</p>
        <p><strong>Justificación:</strong> {EJEMPLO_PROCESO_2.justificacion}</p>
        <p><strong>Clases:</strong> {EJEMPLO_PROCESO_2.clases}</p>
      </div>
      <p className="aviso aviso--ok">
        <strong>Está lista cuando</strong> la justificación del paradigma habla del problema del grupo, y el segundo proceso se puede seguir paso a paso.
      </p>
    </section>
  )
}

/* ------------------------------------ D · paradigma ------------------------------------ */

function BloqueParadigma({ c, f, bloqueada, equipo, esDocente, autorId }) {
  const clave = claveDeEstructura(c)
  const esOO = c.paradigma === 'oo'
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-paradigma">
      <h2 id="tc-paradigma" className="tc-bloque__titulo">D · Elijan el paradigma</h2>
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
        <textarea
          id="tc5-justificacion"
          className="campo campo--area"
          rows={5}
          disabled={bloqueada}
          value={c.justificacion ?? ''}
          onChange={(e) => f.cambiar('justificacion', e.target.value)}
        />
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
          <textarea
            id={`tc5-${clave}`}
            className="campo campo--area"
            rows={5}
            disabled={bloqueada}
            value={c[clave] ?? ''}
            onChange={(e) => f.cambiar(clave, e.target.value)}
          />
        </Campo>
      )}

      <Comentarios seccion="paradigma" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

/* ------------------------------------ E · lenguaje ------------------------------------ */

function BloqueLenguaje({ c, f, bloqueada, equipo, esDocente, autorId }) {
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-lenguaje">
      <h2 id="tc-lenguaje" className="tc-bloque__titulo">E · Elijan el lenguaje de programación</h2>
      <p className="tc-objetivo">
        Ya resolvieron la lógica; ahora escojan en qué lenguaje la van a escribir. No hay uno «mejor»: hay uno que le sirve más a su proyecto. Antes de decidir,
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
        ayuda="Den razones concretas: qué van a construir, dónde se usará, quién del equipo lo conoce o cómo lo van a aprender, y por qué encaja con el paradigma que eligieron."
        id="tc5-porque"
      >
        <textarea id="tc5-porque" className="campo campo--area" rows={4} disabled={bloqueada} value={c.lenguaje_porque ?? ''} onChange={(e) => f.cambiar('lenguaje_porque', e.target.value)} />
      </Campo>

      <Campo
        etiqueta="¿Qué es lo primero que van a programar?"
        ayuda="Escojan una parte pequeña de su pseudocódigo que puedan traducir primero. Ejemplo: «la entrada y el cálculo del total del proceso 1»."
        id="tc5-primero"
      >
        <input id="tc5-primero" className="campo" disabled={bloqueada} value={c.lenguaje_primero ?? ''} onChange={(e) => f.cambiar('lenguaje_primero', e.target.value)} />
      </Campo>

      <Campo
        etiqueta="Con sus palabras: ¿para qué les sirvió escribir el pseudocódigo y la prueba de escritorio antes de elegir el lenguaje?"
        ayuda="Dos o tres líneas, con algo concreto: un error que encontraron a tiempo, una decisión que se les facilitó, algo que entendieron mejor."
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
    <section className="tarjeta tc-bloque" aria-labelledby="tc-sustentacion">
      <h2 id="tc-sustentacion" className="tc-bloque__titulo">Para la sustentación de la próxima clase</h2>
      <p className="tc-objetivo">Esto es lo que van a explicar y lo que deben tener listo:</p>
      <ul className="tc-lista">
        {PARA_LA_SUSTENTACION.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}
