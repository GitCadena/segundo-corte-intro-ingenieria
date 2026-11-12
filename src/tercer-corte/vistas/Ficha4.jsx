import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../estado/SesionProvider.jsx'
import { almacenTc } from '../lib/almacenTc.js'
import { useFicha } from '../lib/useFicha.js'
import { revisarFicha4, firmaEjecucion, firmaPrueba, procesar } from '../lib/ficha4.js'
import { camposUsados, lineasDe, mostrarValor, resultadosCoinciden } from '../lib/interprete.js'
import { limpiarPseudocodigo, normalizarLineas } from '../lib/normalizar.js'
import { IDEAS_DE_PROCESO, PLANTILLAS } from '../data/pseudocodigo.js'
import { Campo, Comentarios as ComentariosFicha, EstadoFicha } from './componentes.jsx'
import Aprende from './Aprende.jsx'
import AprendeSencillo from './AprendeSencillo.jsx'
import AsistenteSencillo from './AsistenteSencillo.jsx'
import { esGrupoSencillo } from '../lib/asistente.js'
import TablaGuiada from './TablaGuiada.jsx'
import { sugerirCaso } from '../lib/pruebaGuiada.js'
import './tercer-corte.css'
import './ficha4.css'

const Comentarios = (props) => <ComentariosFicha ficha={4} {...props} />

/**
 * Ficha 4 · Pseudocódigo del proceso principal. La edita el equipo; el docente
 * la ve en modo lectura (modo = 'docente'), comenta por sección y puede reabrirla.
 */
export default function Ficha4({ equipo, modo = 'equipo' }) {
  return <FichaCuatro key={`${equipo.id}-4`} equipo={equipo} modo={modo} />
}

function FichaCuatro({ equipo, modo }) {
  const { perfil } = useSesion()
  const f = useFicha(equipo.id, 4)
  const [confirmando, setConfirmando] = useState(false)
  const [avisoEntrega, setAvisoEntrega] = useState(null)
  const esDocente = modo === 'docente'
  const entregada = f.estado === 'entregada'
  const bloqueada = entregada || esDocente
  const c = f.contenido
  // Grupo 3 (primíparos): versión más sencilla, con otros juegos y un asistente. Lo que se entrega es lo mismo.
  const sencillo = !esDocente && esGrupoSencillo(perfil?.grupo)

  const revision = useMemo(() => revisarFicha4(c), [c])
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
        <span>Ficha 4</span>
      </nav>

      <header className="tc-cabecera">
        <div>
          <p className="etiqueta-campo">Proyecto: {equipo.nombre}</p>
          <h1>Ficha 4 · Pseudocódigo del proceso principal</h1>
          <p className="tc-objetivo">
            Escriban en español, paso a paso, cómo funciona el proceso más importante de su sistema, y compruébenlo a mano con un caso real:
            si el algoritmo da el resultado que esperaban, está bien pensado.
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

      {!esDocente && (sencillo ? <AprendeSencillo /> : <Aprende />)}

      <BloqueDefinir {...ctx} />
      {sencillo && <AsistenteSencillo c={c} f={f} bloqueada={bloqueada} />}
      <BloquePseudocodigo {...ctx} />
      <BloquePrueba {...ctx} />

      <section className="tarjeta tc-revision" aria-labelledby="tc-revision4">
        <h2 id="tc-revision4" className="tc-bloque__titulo">Revisión de la ficha</h2>
        <ul className="tc-lista">
          {revision.puntos.map((p) => (
            <li key={p.id} className={p.ok ? 'tc-lista__ok' : 'tc-lista__pendiente'}>
              <span aria-hidden="true">{p.ok ? '✓' : '○'}</span> <span>{p.texto}</span>
              <span className="visualmente-oculto">{p.ok ? ': listo' : ': pendiente'}</span>
            </li>
          ))}
        </ul>
        <p className="tc-nota">
          Lo ideal es tener todos los puntos en verde. Aunque alguno quede pendiente (por ejemplo si la página no entiende alguna forma de escribir su código, o si trabajan solos), pueden entregar en cuanto escriban el pseudocódigo: el docente revisa cada ficha.
        </p>

        {!esDocente && !entregada && (
          <div className="tc-entrega">
            {!confirmando ? (
              <button type="button" className="boton boton--principal" disabled={!revision.puedeEntregar} onClick={() => setConfirmando(true)}>
                {revision.puedeEntregar ? 'Entregar la ficha' : 'Escriban el pseudocódigo para poder entregar'}
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
                await almacenTc.reabrir(equipo.id, 4)
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

/* --------------------------------- B · Definir --------------------------------- */

function BloqueDefinir({ c, f, bloqueada, equipo, esDocente, autorId }) {
  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-definir">
      <h2 id="tc-definir" className="tc-bloque__titulo">B · Escribe el tuyo</h2>
      <h3 className="tc-subtitulo">1. El proceso, las entradas y la salida</h3>

      <Campo etiqueta="¿Cuál es el proceso más importante de su sistema?" ayuda="Es lo que el sistema hace y que más importa que salga bien. Ejemplos en la lista de abajo." id="tc4-proceso">
        <input id="tc4-proceso" className="campo" list="tc4-ideas" value={c.proceso ?? ''} disabled={bloqueada} onChange={(e) => f.cambiar('proceso', e.target.value)} />
        <datalist id="tc4-ideas">
          {IDEAS_DE_PROCESO.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
      </Campo>

      <Campo
        etiqueta="Entradas (con su tipo)"
        ayuda="Una por línea, con el tipo después de dos puntos. Ejemplo: «precio: número», «productos: lista»."
        id="tc4-entradas"
      >
        <textarea id="tc4-entradas" className="campo campo--area" rows={3} disabled={bloqueada} value={c.entradas ?? ''} onChange={(e) => f.cambiar('entradas', e.target.value)} />
      </Campo>

      <Campo etiqueta="Salida (qué entrega el proceso)" ayuda="Ejemplo: «el total a pagar, un número»." id="tc4-salida">
        <input id="tc4-salida" className="campo" value={c.salida ?? ''} disabled={bloqueada} onChange={(e) => f.cambiar('salida', e.target.value)} />
      </Campo>

      <Comentarios seccion="definir" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

/* ------------------------------ B · Pseudocódigo ------------------------------ */

function BloquePseudocodigo({ c, f, bloqueada, equipo, esDocente, autorId, revision }) {
  const analisis = revision.analisis
  const mostrados = revision.puntos.filter((p) => ['bloques', 'si', 'repetir', 'variables', 'espanol'].includes(p.id))

  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-pseudo">
      <h3 id="tc-pseudo" className="tc-subtitulo">2. El pseudocódigo</h3>
      <p className="tc-objetivo">
        Escríbanlo en español, una instrucción por línea. Deben usar al menos un <strong>SI … ENTONCES … SI NO</strong> y un{' '}
        <strong>MIENTRAS</strong> o <strong>PARA CADA</strong>. Para guardar un valor usen la flecha «←» (o «&lt;-»).
      </p>

      <EditorPseudo valor={c.pseudo ?? ''} deshabilitado={bloqueada} errores={analisis.errores} onCambio={(t) => f.cambiar('pseudo', t)} />

      {analisis.errores.length > 0 && c.pseudo?.trim() && (
        <ul className="tc-errores" aria-label="Cosas por corregir en el pseudocódigo">
          {analisis.errores.slice(0, 4).map((e, i) => (
            <li key={i}>
              {!String(e.mensaje).includes(`línea ${e.linea}`) && <strong>Línea {e.linea}: </strong>}
              {e.mensaje} {e.pista && <span>{e.pista}</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="tc-revision-en-vivo" aria-live="polite">
        <p className="etiqueta-campo">Revisión en vivo</p>
        <ul className="tc-lista">
          {mostrados.map((p) => (
            <li key={p.id} className={p.ok ? 'tc-lista__ok' : 'tc-lista__pendiente'}>
              <span aria-hidden="true">{p.ok ? '✓' : '○'}</span> <span>{p.texto}</span>
              {!p.ok && p.pista && <span className="tc-pista tc-pista--alerta">{p.pista}</span>}
            </li>
          ))}
        </ul>
      </div>

      <Comentarios seccion="pseudocodigo" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

function resaltar(linea) {
  const comentario = linea.search(/(^|\s)\/\/|^\s*#/)
  const codigo = comentario >= 0 ? linea.slice(0, comentario) : linea
  const resto = comentario >= 0 ? linea.slice(comentario) : ''
  const partes = []
  let ultimo = 0
  const re = /\b(PROCESO|ENTRADAS?|SALIDA|SI\s*NO|SI|ENTONCES|FIN\s*SI|MIENTRAS|FIN\s*MIENTRAS|PARA\s+CADA|EN|FIN\s*PARA|HACER|Y|O|NO|VERDADERO|FALSO)\b|←|<-|\d+(?:[.,]\d+)?|"[^"]*"/gi
  for (const m of codigo.matchAll(re)) {
    if (m.index > ultimo) partes.push(codigo.slice(ultimo, m.index))
    const t = m[0]
    const clase = /^[A-ZÁÉÍÓÚa-záéíóú]/.test(t) ? 'tc-ed__clave' : t === '←' || t === '<-' ? 'tc-ed__flecha' : t.startsWith('"') ? 'tc-ed__texto' : 'tc-ed__numero'
    partes.push(
      <span key={`${m.index}`} className={clase}>
        {t}
      </span>,
    )
    ultimo = m.index + t.length
  }
  partes.push(codigo.slice(ultimo))
  if (resto) partes.push(<span key="c" className="tc-ed__comentario">{resto}</span>)
  return partes
}

function reindentar(texto) {
  let nivel = 0
  return texto
    .split('\n')
    .map((l) => {
      const t = l.trim()
      if (t === '') return ''
      const M = t.toUpperCase().replace(/\s+/g, ' ')
      const esSiNo = /^SI ?NO:?$/.test(M) || /^SINO ?SI\b/.test(M)
      if (/^FIN ?(SI|MIENTRAS|PARA)$/.test(M) || /^HASTA QUE\b/.test(M)) nivel = Math.max(0, nivel - 1)
      // SI NO y SINO SI se escriben a la altura del SI, y lo de adentro sigue una sangría más
      const dibujo = '  '.repeat(esSiNo ? Math.max(0, nivel - 1) : nivel) + t
      if (!esSiNo && (/ENTONCES$/.test(M) || /^MIENTRAS\b/.test(M) || /^PARA\b/.test(M) || /^REPETIR$/.test(M))) nivel += 1
      return dibujo
    })
    .join('\n')
}

/** Editor por líneas: números de línea, colores de palabras clave, sangría automática y plantillas. */
function EditorPseudo({ valor, onCambio, deshabilitado, errores }) {
  const area = useRef(null)
  const capa = useRef(null)
  const gutter = useRef(null)
  const lineasConError = new Set((errores ?? []).map((e) => e.linea))
  const lineas = valor.split('\n')

  const sincronizar = () => {
    if (capa.current && area.current) {
      capa.current.scrollTop = area.current.scrollTop
      capa.current.scrollLeft = area.current.scrollLeft
    }
    if (gutter.current && area.current) gutter.current.scrollTop = area.current.scrollTop
  }

  function insertar(plantilla) {
    const ta = area.current
    const ini = ta.selectionStart
    const antes = valor.slice(0, ini)
    const despues = valor.slice(ta.selectionEnd)
    const inicioLinea = antes.lastIndexOf('\n') + 1
    const sangria = (antes.slice(inicioLinea).match(/^\s*/) ?? [''])[0]
    const enLineaVacia = antes.slice(inicioLinea).trim() === ''
    const cuerpo = plantilla.texto
      .split('\n')
      .map((l, i) => (i === 0 && enLineaVacia ? l : i === 0 ? l : sangria + l))
      .join('\n')
    const prefijo = enLineaVacia ? '' : '\n' + sangria
    const nuevo = antes + prefijo + cuerpo + (despues.startsWith('\n') || despues === '' ? '' : '\n') + despues
    onCambio(nuevo)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = (antes + prefijo + cuerpo).length
      ta.setSelectionRange(pos, pos)
    })
  }

  function alTeclear(e) {
    if (e.key !== 'Enter') return
    const ta = e.target
    const ini = ta.selectionStart
    const antes = valor.slice(0, ini)
    const linea = antes.slice(antes.lastIndexOf('\n') + 1)
    const sangria = (linea.match(/^\s*/) ?? [''])[0]
    const M = linea.trim().toUpperCase().replace(/\s+/g, ' ')
    const abre = /ENTONCES$/.test(M) || /^SI ?NO:?$/.test(M) || /^MIENTRAS\b/.test(M) || /^PARA\b/.test(M) || /^REPETIR$/.test(M)
    e.preventDefault()
    const inserto = '\n' + sangria + (abre ? '  ' : '')
    onCambio(antes + inserto + valor.slice(ta.selectionEnd))
    requestAnimationFrame(() => ta.setSelectionRange(ini + inserto.length, ini + inserto.length))
  }

  return (
    <div className="tc-editor">
      {!deshabilitado && (
        <div className="tc-editor__barra" role="toolbar" aria-label="Plantillas para insertar">
          {PLANTILLAS.map((p) => (
            <button key={p.id} type="button" className="boton boton--secundario boton--pequeno" onClick={() => insertar(p)}>
              {p.etiqueta}
            </button>
          ))}
          <button type="button" className="boton boton--texto boton--pequeno" onClick={() => onCambio(reindentar(valor))}>
            Ordenar sangría
          </button>
          <button
            type="button"
            className="boton boton--secundario boton--pequeno"
            title="Para algoritmos pegados de una IA o de otra fuente: quita viñetas y formato, pasa el inglés a español y ordena los cierres"
            disabled={!normalizarLineas(valor).cambios}
            onClick={() => onCambio(reindentar(limpiarPseudocodigo(valor)))}
          >
            Limpiar y traducir lo pegado
          </button>
        </div>
      )}
      <div className="tc-editor__marco">
        <pre className="tc-editor__gutter" ref={gutter} aria-hidden="true">
          {lineas.map((_, i) => (
            <span key={i} className={lineasConError.has(i + 1) ? 'tc-editor__num--error' : ''}>{i + 1}{'\n'}</span>
          ))}
        </pre>
        <div className="tc-editor__cuerpo">
          <pre className="tc-editor__capa" ref={capa} aria-hidden="true">
            {lineas.map((l, i) => (
              <span key={i} className={lineasConError.has(i + 1) ? 'tc-ed__linea--error' : ''}>{resaltar(l)}{'\n'}</span>
            ))}
            {' '}
          </pre>
          <label className="visualmente-oculto" htmlFor="tc4-pseudo">Pseudocódigo</label>
          <textarea
            id="tc4-pseudo"
            ref={area}
            className="tc-editor__area"
            spellCheck={false}
            wrap="off"
            rows={Math.max(10, lineas.length + 1)}
            value={valor}
            readOnly={deshabilitado}
            placeholder={'PROCESO nombre\nENTRADA: dato (tipo)\n…\nSALIDA: resultado'}
            onChange={(e) => onCambio(e.target.value)}
            onKeyDown={alTeclear}
            onScroll={sincronizar}
          />
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- C · Prueba de escritorio ----------------------------- */

function BloquePrueba({ c, f, bloqueada, equipo, esDocente, autorId, perfil, revision }) {
  const analisis = revision.analisis
  const manual = c.modo_prueba === 'manual'
  const listo = analisis.ok && analisis.programa
  const entradas = listo ? analisis.programa.entradas : []
  const { ejecucion, erroresCaso } = useMemo(() => procesar(c), [c])
  const [paso, setPaso] = useState(0)
  const nombre = `${perfil?.nombres ?? ''} ${perfil?.apellidos ?? ''}`.trim()

  const ejec = ejecucion
  const pasos = ejec?.pasos ?? []
  // Mientras falte escribir el caso, no se muestra como error: solo se invita a escribirlo.
  const faltaCaso = Boolean(ejec && !ejec.ok && /Falta el valor de la entrada/.test(ejec.error?.mensaje ?? ''))
  const huboError = ejec && !ejec.ok && !faltaCaso
  const actual = !manual && paso > 0 ? pasos[Math.min(paso, pasos.length) - 1] : null

  function marcarTerminada() {
    f.cambiar('prueba_terminada', firmaEjecucion(c))
    f.cambiar('prueba_por_id', perfil?.id ?? '')
    f.cambiar('prueba_por_nombre', nombre)
    if (ejec?.ok) f.cambiar('resultado_auto', mostrarValor(ejec.resultado))
  }

  const irAlFinal = () => setPaso(pasos.length)
  const siguiente = () => setPaso(Math.min(paso + 1, pasos.length))

  const salidaVar = (c.pseudo ?? '').match(/SALIDA\s*:\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][\wÁÉÍÓÚÜÑáéíóúüñ_]*)\s*$/im)?.[1]
  const lineaSospechosa = (() => {
    if (!salidaVar || !ejec?.ok) return null
    for (let i = pasos.length - 1; i >= 0; i -= 1) if (pasos[i].nota.startsWith(`${salidaVar} vale`)) return pasos[i].linea
    return null
  })()

  const esperadoEscrito = (c.esperado ?? '').trim() !== ''
  const obtenido = revision.obtenido
  const coincide = obtenido !== null && esperadoEscrito && resultadosCoinciden(obtenido, c.esperado)

  // Verificación entre pares
  const pruebaOk = !!revision.puntos.find((p) => p.id === 'prueba')?.ok
  const puedeConfirmar = !bloqueada && !!c.prueba_por_id && c.prueba_por_id !== perfil?.id && pruebaOk
  const firma = revision.firma
  const parVigente = (c.par_id ?? '') !== '' && c.par_firma === firma && c.par_id !== c.prueba_por_id

  function confirmarPar() {
    f.cambiar('par_id', perfil?.id ?? '')
    f.cambiar('par_nombre', nombre)
    f.cambiar('par_firma', firmaPrueba({ ...c }))
  }

  return (
    <section className="tarjeta tc-bloque" aria-labelledby="tc-prueba">
      <h2 id="tc-prueba" className="tc-bloque__titulo">C · Prueba de escritorio</h2>
      <p className="tc-objetivo">
        Escojan un caso real, calculen a mano cuál debería ser el resultado y luego sigan el pseudocódigo paso a paso. Si no coincide, hay algo por corregir.
      </p>

      {!listo ? (
        <p className="vacio-util">Primero escriban el pseudocódigo arriba y corrijan lo que aparezca marcado: la prueba se habilita cuando el algoritmo se entiende.</p>
      ) : entradas.length === 0 ? (
        <p className="vacio-util">Falta la línea <code>ENTRADA: nombre (tipo)</code> en el pseudocódigo para saber qué valores pedir en el caso de prueba.</p>
      ) : (
        <>
          <h3 className="tc-subtitulo">1. El caso de prueba</h3>
          {entradas.map((e) => {
            const esLista = /lista/i.test(e.tipo)
            const campos = camposUsados(c.pseudo)
            const id = `tc4-caso-${e.nombre}`
            return (
              <Campo
                key={e.nombre}
                id={id}
                etiqueta={`Valor de «${e.nombre}»${e.tipo ? ` (${e.tipo})` : ''}`}
                ayuda={esLista ? `Un registro por línea. Ejemplo: ${campos.length > 0 ? campos.map((k) => `${k}=10`).join(', ') : 'cantidad=10, precio=500'}` : 'Escribe el valor con el que van a probar.'}
              >
                {esLista ? (
                  <textarea id={id} className="campo campo--area tc-mono" rows={3} disabled={bloqueada} value={c[`caso__${e.nombre}`] ?? ''} onChange={(ev) => f.cambiar(`caso__${e.nombre}`, ev.target.value)} />
                ) : (
                  <input id={id} className="campo" disabled={bloqueada} value={c[`caso__${e.nombre}`] ?? ''} onChange={(ev) => f.cambiar(`caso__${e.nombre}`, ev.target.value)} />
                )}
              </Campo>
            )
          })}
          {!bloqueada && (
            <div className="tc-acciones">
              <button
                type="button"
                className="boton boton--secundario boton--pequeno"
                onClick={() => Object.entries(sugerirCaso(analisis.programa, c.pseudo)).forEach(([k, v]) => f.cambiar(k, v))}
              >
                Sugerir un caso para empezar
              </button>
              <span className="tc-nota">Usa los nombres de su algoritmo con valores pequeños. Cámbienlos por los de su proyecto si quieren.</span>
            </div>
          )}
          {erroresCaso.map((m) => (
            <p key={m} className="tc-pista tc-pista--alerta" role="status">{m}</p>
          ))}

          <Campo etiqueta="Resultado esperado (calculado a mano, antes de ejecutar)" ayuda="Es lo que debería dar el proceso con ese caso." id="tc4-esperado">
            <input id="tc4-esperado" className="campo" disabled={bloqueada} value={c.esperado ?? ''} onChange={(e) => f.cambiar('esperado', e.target.value)} />
          </Campo>

          <h3 className="tc-subtitulo">2. Completen la tabla de su prueba de escritorio</h3>

          {!manual && (
            <>
              {faltaCaso && (
                <p className="aviso aviso--nota" role="status">
                  Escriban primero el caso de prueba (paso 1) o pulsen «Sugerir un caso para empezar». Con eso aparece aquí la tabla de su propio algoritmo.
                </p>
              )}
              {huboError && (
                <div className="aviso aviso--error" role="alert">
                  <p>
                    <strong>No se pudo seguir el algoritmo{ejec.error.linea ? ` (línea ${ejec.error.linea})` : ''}:</strong> {ejec.error.mensaje} {ejec.error.pista}
                  </p>
                  {!bloqueada && (
                    <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => f.cambiar('modo_prueba', 'manual')}>
                      Hacer la prueba a mano (tabla editable)
                    </button>
                  )}
                </div>
              )}
              {ejec?.ok && (
                <>
                  <TablaGuiada key={firmaEjecucion(c)} c={c} f={f} bloqueada={bloqueada} pasos={pasos} firma={firmaEjecucion(c)} marcarTerminada={marcarTerminada} />
                  {c.prueba_ayuda === 'si' && esDocente && <p className="aviso aviso--nota">El equipo usó «mostrar la tabla correcta» para completar la prueba.</p>}
                  <details className="tc-ver-paso">
                    <summary>Ver cómo lo hace la página, paso a paso (para aprender; no reemplaza tu tabla)</summary>
                    <div className="tc-acciones" role="group" aria-label="Controles del recorrido">
                      <button type="button" className="boton boton--secundario boton--pequeno" disabled={paso <= 0} onClick={() => setPaso(Math.max(0, paso - 1))}>← Paso anterior</button>
                      <button type="button" className="boton boton--principal boton--pequeno" disabled={paso >= pasos.length} onClick={siguiente}>{paso === 0 ? 'Empezar' : 'Paso siguiente →'}</button>
                      <button type="button" className="boton boton--secundario boton--pequeno" disabled={paso >= pasos.length} onClick={irAlFinal}>Ver todo</button>
                      <button type="button" className="boton boton--texto boton--pequeno" disabled={paso === 0} onClick={() => setPaso(0)}>Reiniciar</button>
                    </div>
                    <p className="tc-nota" aria-live="polite">{paso === 0 ? 'Aún no empiezan.' : `Paso ${Math.min(paso, pasos.length)} de ${pasos.length}`}{ejec.truncado ? ' (se cortó por límite de pasos)' : ''}</p>
                    <div className="tc-prueba">
                      <ol className="tc-codigo-lineas" aria-label="Pseudocódigo">
                        {lineasDe(c.pseudo).map((l) => (
                          <li key={l.n} className={actual?.linea === l.n ? 'tc-codigo-lineas__actual' : ''} aria-current={actual?.linea === l.n ? 'step' : undefined}>
                            <span className="tc-codigo-lineas__n">{l.n}</span>
                            <code>{l.crudo}</code>
                          </li>
                        ))}
                      </ol>
                      <div className="tabla-envoltura tc-prueba__tabla">
                        <table className="tabla">
                          <thead>
                            <tr>
                              <th scope="col">Paso</th>
                              <th scope="col">Línea</th>
                              <th scope="col">Qué pasa</th>
                              <th scope="col">Valores de las variables</th>
                              <th scope="col">Resultado parcial</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pasos.slice(0, paso).map((p) => (
                              <tr key={p.paso} className={p.paso === paso ? 'tc-fila-actual' : ''}>
                                <th scope="row">{p.paso}</th>
                                <td>{p.linea}</td>
                                <td>{p.nota}</td>
                                <td>{Object.entries(p.vars).map(([k, v]) => `${k} = ${v}`).join(' · ')}</td>
                                <td>{p.resultado ?? '—'}</td>
                              </tr>
                            ))}
                            {paso === 0 && (
                              <tr>
                                <td colSpan={5}>Pulsen «Empezar» para ver el primer paso.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                </>
              )}
              {ejec?.ok && pruebaOk && (
                <Comparacion obtenido={obtenido} esperado={c.esperado} coincide={coincide} esperadoEscrito={esperadoEscrito} lineaSospechosa={lineaSospechosa} />
              )}
            </>
          )}

          {manual && (
            <PruebaManual c={c} f={f} bloqueada={bloqueada} perfil={perfil} nombre={nombre} esperadoEscrito={esperadoEscrito} coincide={coincide} obtenido={obtenido} lineaSospechosa={lineaSospechosa} />
          )}

          <h3 className="tc-subtitulo">3. Confirmación de un compañero</h3>
          <p className="tc-nota">
            Otro integrante del equipo debe seguir el pseudocódigo por su cuenta y confirmar que obtuvo el mismo resultado. Es un requisito para entregar.
            {c.prueba_por_nombre && <> La prueba la hizo <strong>{c.prueba_por_nombre}</strong>.</>}
          </p>
          {parVigente ? (
            <p className="aviso aviso--ok" role="status">✓ {c.par_nombre} confirmó que siguió el pseudocódigo y obtuvo el mismo resultado.</p>
          ) : (
            <>
              {c.par_id && !parVigente && <p className="tc-pista tc-pista--alerta" role="status">Cambiaron algo después de la confirmación de {c.par_nombre}: debe confirmar de nuevo.</p>}
              {!bloqueada && (
                <button type="button" className="boton boton--secundario" onClick={confirmarPar} disabled={!puedeConfirmar}>
                  Seguí el pseudocódigo y obtuve el mismo resultado
                </button>
              )}
              {!bloqueada && !puedeConfirmar && (
                <p className="tc-nota">
                  {!c.prueba_por_id
                    ? 'Se habilita cuando alguien termine la prueba de escritorio.'
                    : c.prueba_por_id === perfil?.id
                      ? 'Tiene que confirmarlo otro integrante del equipo, no quien hizo la prueba.'
                      : 'Se habilita cuando la prueba de escritorio esté completa.'}
                </p>
              )}
            </>
          )}
        </>
      )}

      <Comentarios seccion="prueba" f={f} equipo={equipo} esDocente={esDocente} autorId={autorId} />
    </section>
  )
}

function Comparacion({ obtenido, esperado, coincide, esperadoEscrito, lineaSospechosa }) {
  return (
    <div className={`aviso ${coincide ? 'aviso--ok' : 'aviso--error'}`} role="status">
      <p>
        <strong>Resultado obtenido:</strong> {mostrarValor(obtenido)} · <strong>esperado:</strong> {esperadoEscrito ? esperado : '(escriban el esperado arriba)'}
      </p>
      {esperadoEscrito && (coincide ? (
        <p>✓ Coinciden: el algoritmo hace lo que esperaban.</p>
      ) : (
        <p>
          No coinciden. Revisen {lineaSospechosa ? `la línea ${lineaSospechosa} (la última vez que cambió el valor que entrega la salida) y las anteriores` : 'las líneas donde cambian los valores'}; también puede estar mal el cálculo a mano.
        </p>
      ))}
    </div>
  )
}

/* ------------------------------ prueba manual ------------------------------ */

function PruebaManual({ c, f, bloqueada, perfil, nombre, esperadoEscrito, coincide, obtenido, lineaSospechosa }) {
  let filas = []
  try {
    filas = JSON.parse(c.prueba_manual || '[]')
  } catch {
    filas = []
  }
  if (filas.length === 0) filas = [{ linea: '', variables: '', parcial: '' }]
  const guardar = (nuevas) => f.cambiar('prueba_manual', JSON.stringify(nuevas))
  const cambiarFila = (i, campo, valor) => guardar(filas.map((x, j) => (j === i ? { ...x, [campo]: valor } : x)))

  return (
    <div className="tc-manual">
      <p className="tc-nota">
        Modo manual: sigan el pseudocódigo con lápiz y anoten, línea por línea, cuánto vale cada variable.
        {!bloqueada && (
          <>
            {' '}
            <button type="button" className="boton boton--texto boton--pequeno" onClick={() => f.cambiar('modo_prueba', '')}>Volver a la prueba automática</button>
          </>
        )}
      </p>
      <div className="tabla-envoltura">
        <table className="tabla">
          <thead>
            <tr>
              <th scope="col">Paso</th>
              <th scope="col">Línea ejecutada</th>
              <th scope="col">Valores de las variables</th>
              <th scope="col">Resultado parcial</th>
              {!bloqueada && <th scope="col"><span className="visualmente-oculto">Quitar</span></th>}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td><input className="campo campo--celda" aria-label={`Línea del paso ${i + 1}`} disabled={bloqueada} value={fila.linea} onChange={(e) => cambiarFila(i, 'linea', e.target.value)} /></td>
                <td><input className="campo campo--celda" aria-label={`Variables del paso ${i + 1}`} disabled={bloqueada} value={fila.variables} placeholder="total = 0, unidades = 0" onChange={(e) => cambiarFila(i, 'variables', e.target.value)} /></td>
                <td><input className="campo campo--celda" aria-label={`Resultado parcial del paso ${i + 1}`} disabled={bloqueada} value={fila.parcial} onChange={(e) => cambiarFila(i, 'parcial', e.target.value)} /></td>
                {!bloqueada && (
                  <td>
                    <button type="button" className="boton boton--texto boton--pequeno" aria-label={`Quitar el paso ${i + 1}`} disabled={filas.length === 1} onClick={() => guardar(filas.filter((_, j) => j !== i))}>✕</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!bloqueada && (
        <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => guardar([...filas, { linea: '', variables: '', parcial: '' }])}>
          Agregar un paso
        </button>
      )}
      <Campo etiqueta="Resultado que obtuvieron al terminar" id="tc4-obtenido">
        <input id="tc4-obtenido" className="campo" disabled={bloqueada} value={c.resultado_obtenido ?? ''} onChange={(e) => f.cambiar('resultado_obtenido', e.target.value)} />
      </Campo>
      {!bloqueada && (
        <button
          type="button"
          className="boton boton--principal boton--pequeno"
          onClick={() => {
            f.cambiar('prueba_por_id', perfil?.id ?? '')
            f.cambiar('prueba_por_nombre', nombre)
          }}
        >
          Terminé la prueba de escritorio
        </button>
      )}
      {c.prueba_por_id && obtenido !== null && (
        <Comparacion obtenido={obtenido} esperado={c.esperado} coincide={coincide} esperadoEscrito={esperadoEscrito} lineaSospechosa={lineaSospechosa} />
      )}
    </div>
  )
}
