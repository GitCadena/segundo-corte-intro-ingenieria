import { useMemo, useState } from 'react'
import { useProgreso } from '../../estado/ProgresoProvider.jsx'
import { mezclar } from './marco.jsx'

/**
 * Modo «criterio propio»: solo se activa para el Grupo 1, que va con poco
 * tiempo. Cualquier ubicación es válida mientras tenga algo de coherencia
 * (al menos la mitad de las fichas en su pieza habitual o en una cercana). No
 * marca errores: da un comentario por ficha y deja avanzar. Los demás grupos
 * siguen con la verificación de siempre.
 */
const GRUPOS_CRITERIO = /^grupo\s*1$/i

// Piezas que se parecen y que se pueden defender en lugar de la habitual.
const CERCANAS = {
  entrada: ['proceso'],
  proceso: ['entrada', 'control'],
  salida: ['retro'],
  control: ['proceso', 'retro'],
  retro: ['control', 'salida'],
}

/**
 * Diseca un sistema real.
 *
 * El estudiante elige uno de varios sistemas y arrastra (o selecciona y toca
 * «Colocar aquí») cada ficha a la pieza del modelo a la que pertenece:
 * entrada, proceso, salida, control o retroalimentación. Basta con terminar
 * bien UN sistema para completar la actividad; cambiar de sistema no cuenta
 * como intento fallido.
 */

const PALETA = ['#2563eb', '#dc2626', '#ea580c', '#16a34a', '#9333ea', '#0d9488', '#c2410c', '#0891b2', '#a21caf', '#4f46e5']

export default function DisecaSistema({ actividad, ctrl }) {
  const [casoIndex, setCasoIndex] = useState(0)
  const [ubicaciones, setUbicaciones] = useState({})
  const [seleccion, setSeleccion] = useState(null)
  const [avisoCriterio, setAvisoCriterio] = useState(null)
  const { perfil } = useProgreso()
  const criterio = GRUPOS_CRITERIO.test((perfil?.grupo ?? '').trim())

  const caso = actividad.casos[casoIndex]
  const orden = useMemo(
    () => mezclar(caso.fichas.map((_, i) => i), actividad.id + ':' + casoIndex),
    [actividad.id, casoIndex, caso],
  )

  const revisado = ctrl.resultado !== null
  const bloqueado = ctrl.acertado
  const colocadas = Object.keys(ubicaciones).length
  const completo = colocadas === caso.fichas.length

  function reiniciarSeleccionSiRevisado() {
    if (revisado) ctrl.reintentar()
  }

  function cambiarCaso(i) {
    setCasoIndex(i)
    setUbicaciones({})
    setSeleccion(null)
    reiniciarSeleccionSiRevisado()
  }

  function mover(i, pieza) {
    if (bloqueado) return
    setUbicaciones((p) => ({ ...p, [i]: pieza }))
    setSeleccion(null)
    setAvisoCriterio(null)
    reiniciarSeleccionSiRevisado()
  }

  function devolver(i) {
    if (bloqueado) return
    setUbicaciones((p) => {
      const n = { ...p }
      delete n[i]
      return n
    })
    reiniciarSeleccionSiRevisado()
  }

  const nivelDe = (i) => {
    const habitual = caso.fichas[i][0]
    if (ubicaciones[i] === habitual) return 'ok'
    return (CERCANAS[habitual] ?? []).includes(ubicaciones[i]) ? 'alt' : 'otra'
  }
  const nombrePieza = (id) => actividad.piezas.find((p) => p.id === id)?.nombre ?? id

  async function verificar() {
    if (criterio) {
      const niveles = caso.fichas.map((_, i) => nivelDe(i))
      const exactas = niveles.filter((n) => n === 'ok').length
      const defendibles = niveles.filter((n) => n === 'alt').length
      if ((exactas + defendibles) * 2 < caso.fichas.length) {
        setAvisoCriterio(
          'Varias fichas quedaron lejos de lo que hace esa pieza. Relee la ayuda de cada pieza y mueve las que dudes; cuando te convenza, vuelve a terminar.',
        )
        return
      }
      setAvisoCriterio(null)
      await ctrl.enviar(true, {
        datos: { caso: caso.titulo, ubicaciones, criterio: true, exactas, defendibles, otras: caso.fichas.length - exactas - defendibles },
      })
      return
    }
    const fallos = caso.fichas.filter((f, i) => ubicaciones[i] !== f[0])
    if (fallos.length > 0) {
      await ctrl.enviar(false, {
        datos: { caso: caso.titulo, ubicaciones },
        mensaje: `${caso.fichas.length - fallos.length} de ${caso.fichas.length} fichas bien ubicadas en «${caso.titulo}». Revisa las que quedaron marcadas abajo.`,
      })
      return
    }
    await ctrl.enviar(true, { datos: { caso: caso.titulo, ubicaciones } })
  }

  function onDragStartFicha(e, i) {
    if (bloqueado) return
    e.dataTransfer.setData('text/plain', String(i))
    e.dataTransfer.effectAllowed = 'move'
  }

  function permitirSoltar(e) {
    e.preventDefault()
  }

  function soltarEnZona(e, piezaId) {
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if (/^\d+$/.test(raw)) mover(Number(raw), piezaId)
  }

  function soltarEnBanco(e) {
    e.preventDefault()
    const raw = e.dataTransfer.getData('text/plain')
    if (/^\d+$/.test(raw)) devolver(Number(raw))
  }

  return (
    <div className="diseca">
      {criterio && (
        <p className="lab-ayuda">
          Aquí decides tú: ubica cada ficha en la pieza donde creas que va. Hay fichas que se pueden defender en más de una pieza.
          Al terminar verás comentarios, no errores, y podrás seguir.
        </p>
      )}
      <label className="diseca__selector">
        <span className="etiqueta-campo">Sistema a analizar</span>
        <select
          className="campo"
          value={casoIndex}
          onChange={(e) => cambiarCaso(Number(e.target.value))}
          disabled={bloqueado}
        >
          {actividad.casos.map((c, i) => (
            <option key={c.titulo} value={i}>
              {c.titulo}
            </option>
          ))}
        </select>
      </label>
      <p className="diseca__contexto">{caso.contexto}</p>

      <div className="diseca__banco" onDragOver={permitirSoltar} onDrop={soltarEnBanco}>
        <p className="etiqueta-campo">Fichas por ubicar ({caso.fichas.length - colocadas})</p>
        <div className="diseca__fichas">
          {orden
            .filter((i) => ubicaciones[i] === undefined)
            .map((i) => (
              <button
                key={i}
                type="button"
                className={'diseca__ficha' + (seleccion === i ? ' diseca__ficha--elegida' : '')}
                style={{ background: PALETA[i % PALETA.length] }}
                draggable={!bloqueado}
                disabled={bloqueado}
                aria-pressed={seleccion === i}
                onDragStart={(e) => onDragStartFicha(e, i)}
                onClick={() => setSeleccion((s) => (s === i ? null : i))}
              >
                {caso.fichas[i][1]}
              </button>
            ))}
          {completo && <p className="diseca__vacio">Todas las fichas están en el diagrama. ¡Revisa tu análisis!</p>}
        </div>
      </div>

      <div className="diseca__zonas">
        {actividad.piezas.map((pieza) => {
          const ids = orden.filter((i) => ubicaciones[i] === pieza.id)
          return (
            <div key={pieza.id} className={'diseca__zona diseca__zona--' + pieza.id}>
              <div className="diseca__zona-cabecera">
                <h4>{pieza.nombre}</h4>
                <span className="diseca__zona-conteo">{ids.length}</span>
              </div>
              <p className="diseca__zona-ayuda">{pieza.ayuda}</p>
              <div className="diseca__zona-lista" onDragOver={permitirSoltar} onDrop={(e) => soltarEnZona(e, pieza.id)}>
                {ids.map((i) => {
                  const bien = !criterio && revisado && ubicaciones[i] === caso.fichas[i][0]
                  const mal = !criterio && revisado && !bien
                  const nivel = criterio && bloqueado ? nivelDe(i) : null
                  return (
                    <div key={i} className={'diseca__colocada' + (bien ? ' diseca__colocada--ok' : '') + (mal ? ' diseca__colocada--mal' : '')}>
                      <p>
                        {!criterio && revisado && <span aria-hidden="true">{bien ? '✓ ' : '✗ '}</span>}
                        {caso.fichas[i][1]}
                      </p>
                      {mal && <p className="diseca__porque">{caso.fichas[i][2]}</p>}
                      {nivel && (
                        <p className="diseca__porque">
                          {nivel === 'ok' && `Coincide con lo más habitual. ${caso.fichas[i][2]}`}
                          {nivel === 'alt' && `También se puede defender aquí. Lo más habitual es «${nombrePieza(caso.fichas[i][0])}». ${caso.fichas[i][2]}`}
                          {nivel === 'otra' && `Es otra lectura posible. Lo más habitual es «${nombrePieza(caso.fichas[i][0])}». ${caso.fichas[i][2]}`}
                        </p>
                      )}
                      {!bloqueado && (
                        <button type="button" className="boton boton--texto" onClick={() => devolver(i)}>
                          Quitar
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <button
                type="button"
                className="boton boton--secundario boton--pequeno diseca__colocar"
                disabled={seleccion === null || bloqueado}
                onClick={() => mover(seleccion, pieza.id)}
              >
                Colocar aquí
              </button>
            </div>
          )
        })}
      </div>

      <p className="diseca__progreso">{colocadas} de {caso.fichas.length} fichas ubicadas</p>

      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={!completo || ctrl.enviando}>
          {completo ? (criterio ? 'Terminar mi análisis' : 'Revisar mi análisis') : 'Completa el diagrama para continuar'}
        </button>
      )}
      {criterio && avisoCriterio && (
        <p className="lab-mensaje lab-mensaje--mal" role="status">
          {avisoCriterio}
        </p>
      )}
      {criterio && bloqueado && (
        <p className="lab-mensaje lab-mensaje--ok" role="status">
          Tu análisis quedó registrado. Los comentarios no son errores: muestran otras formas de ver el sistema y lo más habitual.
        </p>
      )}
    </div>
  )
}
