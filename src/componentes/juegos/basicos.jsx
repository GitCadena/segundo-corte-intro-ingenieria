import { useMemo, useState } from 'react'
import { mezclar, coincideNumero, normalizarRespuesta } from './marco.jsx'

/* ================================== QUIZ ================================== */

export function Quiz({ actividad, ctrl }) {
  const [elegida, setElegida] = useState(null)

  async function verificar() {
    if (elegida === null) return
    const correcto = elegida === actividad.correcta
    await ctrl.enviar(correcto, {
      datos: { elegida },
      detalle: correcto ? null : (
        <p className="resultado__porque">
          {actividad.porQueNo?.[elegida] ?? 'Esa opción no corresponde. Vuelve a leer el enunciado.'}
        </p>
      ),
    })
  }

  const bloqueado = ctrl.acertado

  return (
    <div className="juego juego--quiz">
      <p className="enunciado">{actividad.pregunta}</p>
      <ul className="opciones" role="radiogroup" aria-label="Opciones de respuesta">
        {actividad.opciones.map((op, i) => {
          const seleccionada = elegida === i
          const esCorrecta = ctrl.acertado && i === actividad.correcta
          const esFallida = ctrl.resultado && !ctrl.resultado.correcto && seleccionada
          return (
            <li key={i}>
              <button
                type="button"
                role="radio"
                aria-checked={seleccionada}
                className={[
                  'opcion',
                  seleccionada && 'opcion--elegida',
                  esCorrecta && 'opcion--correcta',
                  esFallida && 'opcion--incorrecta',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => !bloqueado && setElegida(i)}
                disabled={bloqueado}
              >
                <span className="opcion__letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                <span className="opcion__texto">{op}</span>
                {esCorrecta && <span className="opcion__marca">Correcta</span>}
                {esFallida && <span className="opcion__marca">Tu respuesta</span>}
              </button>
            </li>
          )
        })}
      </ul>
      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={elegida === null || ctrl.enviando}
        >
          {elegida === null ? 'Elige una opción' : 'Verificar respuesta'}
        </button>
      )}
    </div>
  )
}

/* ============================ VERDADERO / FALSO =========================== */

export function VerdaderoFalso({ actividad, ctrl }) {
  const [marcas, setMarcas] = useState({})
  const afirmaciones = actividad.afirmaciones
  const completo = afirmaciones.every((_, i) => marcas[i] !== undefined)
  const bloqueado = ctrl.acertado

  async function verificar() {
    const aciertos = afirmaciones.filter((a, i) => marcas[i] === a.verdadero).length
    const correcto = aciertos === afirmaciones.length
    await ctrl.enviar(correcto, {
      datos: { marcas },
      mensaje: correcto
        ? null
        : `${aciertos} de ${afirmaciones.length} bien. Abajo se señalan las que fallaron.`,
    })
  }

  const revisado = ctrl.resultado !== null

  return (
    <div className="juego juego--vf">
      <ul className="vf">
        {afirmaciones.map((a, i) => {
          const marca = marcas[i]
          const bien = revisado && marca === a.verdadero
          const mal = revisado && marca !== undefined && marca !== a.verdadero
          return (
            <li key={i} className={`vf__fila ${bien ? 'vf__fila--ok' : ''} ${mal ? 'vf__fila--mal' : ''}`}>
              <p className="vf__texto">
                {revisado && (
                  <span className="vf__veredicto" aria-hidden="true">
                    {bien ? '✓' : '✗'}
                  </span>
                )}
                {a.texto}
              </p>
              <div className="vf__botones" role="group" aria-label={`Respuesta para: ${a.texto}`}>
                {[
                  [true, 'Verdadero'],
                  [false, 'Falso'],
                ].map(([v, etiqueta]) => (
                  <button
                    key={etiqueta}
                    type="button"
                    className={marca === v ? 'grupo grupo--activo' : 'grupo'}
                    aria-pressed={marca === v}
                    disabled={bloqueado}
                    onClick={() => {
                      setMarcas((p) => ({ ...p, [i]: v }))
                      if (revisado) ctrl.reintentar()
                    }}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
              {(mal || (revisado && ctrl.acertado)) && (
                <p className="vf__explicacion">
                  <strong>{a.verdadero ? 'Verdadera.' : 'Falsa.'}</strong> {a.explicacion}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Verificar' : `Faltan ${afirmaciones.filter((_, i) => marcas[i] === undefined).length}`}
        </button>
      )}
    </div>
  )
}

/* ================================ ORDENAR ================================= */

/**
 * Ordenar por dependencias, no por una secuencia guardada.
 * Cualquier orden que respete todas las precedencias es correcto, así que las
 * soluciones alternativas legítimas no se penalizan.
 */
export function Ordenar({ actividad, ctrl }) {
  const inicial = useMemo(() => mezclar(actividad.items, actividad.id), [actividad])
  const [orden, setOrden] = useState(inicial)
  const bloqueado = ctrl.acertado

  function mover(i, delta) {
    if (bloqueado) return
    const j = i + delta
    if (j < 0 || j >= orden.length) return
    const copia = [...orden]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    setOrden(copia)
    if (ctrl.resultado) ctrl.reintentar()
  }

  function moverA(i, destino) {
    if (bloqueado || destino < 0 || destino >= orden.length || destino === i) return
    const copia = [...orden]
    const [item] = copia.splice(i, 1)
    copia.splice(destino, 0, item)
    setOrden(copia)
    if (ctrl.resultado) ctrl.reintentar()
  }

  async function verificar() {
    const posicion = Object.fromEntries(orden.map((it, i) => [it.id, i]))
    const violadas = actividad.dependencias.filter(([a, b]) => posicion[a] > posicion[b])
    const correcto = violadas.length === 0
    await ctrl.enviar(correcto, {
      datos: { orden: orden.map((o) => o.id) },
      mensaje: correcto
        ? 'Tu orden respeta todas las dependencias.'
        : `${violadas.length} dependencia${violadas.length > 1 ? 's' : ''} sin respetar.`,
      detalle: correcto ? null : (
        <ul className="resultado__lista">
          {violadas.slice(0, 3).map(([a, b, motivo], i) => (
            <li key={i}>
              <strong>«{textoDe(actividad.items, a)}» debe ir antes que «{textoDe(actividad.items, b)}».</strong>{' '}
              {motivo}
            </li>
          ))}
          {violadas.length > 3 && <li>…y {violadas.length - 3} más.</li>}
        </ul>
      ),
    })
  }

  return (
    <div className="juego juego--orden">
      <p className="ayuda-teclado">
        Usa los botones de subir y bajar, o el selector de posición. No hace falta arrastrar nada.
      </p>
      <ol className="orden">
        {orden.map((item, i) => (
          <li key={item.id} className="orden__item">
            <span className="orden__pos" aria-hidden="true">{i + 1}</span>
            <span className="orden__texto">{item.texto}</span>
            <span className="orden__controles">
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0 || bloqueado} aria-label={`Subir: ${item.texto}`}>
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === orden.length - 1 || bloqueado}
                aria-label={`Bajar: ${item.texto}`}
              >
                ↓
              </button>
              <label className="orden__salto">
                <span className="visualmente-oculto">Mover «{item.texto}» a la posición</span>
                <select
                  value={i}
                  disabled={bloqueado}
                  onChange={(e) => moverA(i, Number(e.target.value))}
                >
                  {orden.map((_, k) => (
                    <option key={k} value={k}>
                      {k + 1}
                    </option>
                  ))}
                </select>
              </label>
            </span>
          </li>
        ))}
      </ol>
      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
          Verificar orden
        </button>
      )}
    </div>
  )
}

function textoDe(items, id) {
  return items.find((i) => i.id === id)?.texto ?? id
}

/* =============================== EMPAREJAR ================================ */

export function Emparejar({ actividad, ctrl }) {
  const izquierda = useMemo(() => mezclar(actividad.izquierda, actividad.id + 'i'), [actividad])
  const derecha = useMemo(() => mezclar(actividad.derecha, actividad.id + 'd'), [actividad])
  const [asignado, setAsignado] = useState({})
  const bloqueado = ctrl.acertado
  const completo = izquierda.every((it) => asignado[it.id])
  const revisado = ctrl.resultado !== null

  async function verificar() {
    const fallos = izquierda.filter((it) => asignado[it.id] !== actividad.pares[it.id])
    const correcto = fallos.length === 0
    await ctrl.enviar(correcto, {
      datos: { asignado },
      mensaje: correcto
        ? null
        : `${izquierda.length - fallos.length} de ${izquierda.length} bien emparejados.`,
      detalle: correcto ? null : (
        <ul className="resultado__lista">
          {fallos.slice(0, 3).map((it) => (
            <li key={it.id}>
              <strong>«{it.texto}»</strong> {actividad.porQueNo?.[it.id] ?? 'no corresponde a esa opción.'}
            </li>
          ))}
        </ul>
      ),
    })
  }

  return (
    <div className="juego juego--emparejar">
      <ul className="emparejar">
        {izquierda.map((it) => {
          const bien = revisado && asignado[it.id] === actividad.pares[it.id]
          const mal = revisado && asignado[it.id] && asignado[it.id] !== actividad.pares[it.id]
          return (
            <li
              key={it.id}
              className={`emparejar__fila ${bien ? 'emparejar__fila--ok' : ''} ${mal ? 'emparejar__fila--mal' : ''}`}
            >
              <p className="emparejar__texto">
                {revisado && (
                  <span className="emparejar__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>
                )}
                {it.texto}
              </p>
              <label className="emparejar__select">
                <span className="visualmente-oculto">Pareja para: {it.texto}</span>
                <select
                  value={asignado[it.id] ?? ''}
                  disabled={bloqueado}
                  onChange={(e) => {
                    setAsignado((p) => ({ ...p, [it.id]: e.target.value }))
                    if (revisado) ctrl.reintentar()
                  }}
                >
                  <option value="">Elige…</option>
                  {derecha.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.texto}
                    </option>
                  ))}
                </select>
              </label>
              {(mal || (revisado && ctrl.acertado)) && actividad.porQueNo?.[it.id] && (
                <p className="emparejar__explicacion">{actividad.porQueNo[it.id]}</p>
              )}
            </li>
          )
        })}
      </ul>
      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Verificar parejas' : 'Empareja todas las filas'}
        </button>
      )}
    </div>
  )
}

/* =============================== CLASIFICAR =============================== */

export function Clasificar({ actividad, ctrl }) {
  const items = useMemo(() => mezclar(actividad.items, actividad.id), [actividad])
  const [asignado, setAsignado] = useState({})
  const [faseRemate, setFaseRemate] = useState(false)
  const [remateElegido, setRemateElegido] = useState(null)

  const completo = items.every((_, i) => asignado[i])
  const revisado = ctrl.resultado !== null
  const bloqueado = ctrl.acertado

  async function verificar() {
    const fallos = items.filter((it, i) => asignado[i] !== it.grupo)
    if (fallos.length > 0) {
      await ctrl.enviar(false, {
        datos: { asignado },
        mensaje: `${items.length - fallos.length} de ${items.length} bien ubicados. Los marcados abajo están en el grupo equivocado.`,
      })
      return
    }
    if (actividad.remate && !faseRemate) {
      setFaseRemate(true)
      return
    }
    await ctrl.enviar(true, { datos: { asignado } })
  }

  async function verificarRemate() {
    const correcto = remateElegido === actividad.remate.correcta
    await ctrl.enviar(correcto, {
      datos: { asignado, remate: remateElegido },
      detalle: correcto ? null : (
        <p className="resultado__porque">
          {actividad.remate.porQueNo?.[remateElegido] ?? 'Revisa el enunciado.'}
        </p>
      ),
    })
  }

  return (
    <div className="juego juego--clasificar">
      <ul className="clasificar">
        {items.map((item, i) => {
          const bien = revisado && asignado[i] === item.grupo
          const mal = revisado && asignado[i] && asignado[i] !== item.grupo
          return (
            <li
              key={item.texto}
              className={`clasificar__fila ${bien ? 'clasificar__fila--ok' : ''} ${mal ? 'clasificar__fila--mal' : ''}`}
            >
              <p className="clasificar__texto">
                {revisado && (
                  <span className="clasificar__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>
                )}
                {item.texto}
              </p>
              <div className="clasificar__grupos" role="group" aria-label={`Grupo para: ${item.texto}`}>
                {actividad.grupos.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={asignado[i] === g.id ? 'grupo grupo--activo' : 'grupo'}
                    aria-pressed={asignado[i] === g.id}
                    disabled={bloqueado || faseRemate}
                    onClick={() => {
                      setAsignado((p) => ({ ...p, [i]: g.id }))
                      if (revisado) ctrl.reintentar()
                    }}
                  >
                    {g.nombre}
                  </button>
                ))}
              </div>
              {(mal || bloqueado || faseRemate) && item.porQue && (
                <p className="clasificar__explicacion">
                  <strong>{actividad.grupos.find((g) => g.id === item.grupo)?.nombre}.</strong> {item.porQue}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {faseRemate && !bloqueado && (
        <div className="remate">
          <p className="remate__titulo">Segunda parte</p>
          <p className="enunciado">{actividad.remate.pregunta}</p>
          <ul className="opciones">
            {actividad.remate.opciones.map((op, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={remateElegido === i ? 'opcion opcion--elegida' : 'opcion'}
                  onClick={() => {
                    setRemateElegido(i)
                    if (revisado) ctrl.reintentar()
                  }}
                >
                  <span className="opcion__letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                  <span className="opcion__texto">{op}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="boton boton--principal"
            onClick={verificarRemate}
            disabled={remateElegido === null || ctrl.enviando}
          >
            Verificar
          </button>
        </div>
      )}

      {bloqueado && actividad.remate && (
        <div className="explicacion">
          <p className="explicacion__titulo">Sobre la segunda parte</p>
          <p>{actividad.remate.explicacion}</p>
        </div>
      )}

      {!bloqueado && !faseRemate && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Verificar clasificación' : 'Asigna todos los casos'}
        </button>
      )}
    </div>
  )
}

/* ================================ CALCULAR ================================ */

export function Calcular({ actividad, ctrl }) {
  const [valores, setValores] = useState({})
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null
  const completo = actividad.campos.every((c) => (valores[c.id] ?? '').trim() !== '')

  function evaluarCampo(campo) {
    const v = valores[campo.id] ?? ''
    if (campo.texto) {
      return campo.respuestas.some((r) => normalizarRespuesta(r) === normalizarRespuesta(v))
    }
    return campo.respuestas.some((r) => coincideNumero(v, r, campo.tolerancia ?? 0))
  }

  async function verificar() {
    const fallos = actividad.campos.filter((c) => !evaluarCampo(c))
    const correcto = fallos.length === 0
    await ctrl.enviar(correcto, {
      datos: { valores },
      mensaje: correcto
        ? null
        : `${actividad.campos.length - fallos.length} de ${actividad.campos.length} correctos.`,
    })
  }

  return (
    <div className="juego juego--calcular">
      {actividad.datos && (
        <div className="datos">
          <div className="tabla-envoltura">
            <table className="tabla">
              <thead>
                <tr>
                  {actividad.datos.encabezados.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {actividad.datos.filas.map((f, i) => (
                  <tr key={i}>
                    {f.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {actividad.datos.nota && <p className="datos__nota">{actividad.datos.nota}</p>}
        </div>
      )}

      {actividad.formulas && (
        <div className="formulas">
          <p className="formulas__titulo">Fórmulas</p>
          <ul>
            {actividad.formulas.map((f, i) => (
              <li key={i}>
                <code>{f}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="campos">
        {actividad.campos.map((c) => {
          const bien = revisado && evaluarCampo(c)
          const mal = revisado && !evaluarCampo(c) && (valores[c.id] ?? '') !== ''
          return (
            <div key={c.id} className={`campo-calculo ${bien ? 'campo-calculo--ok' : ''} ${mal ? 'campo-calculo--mal' : ''}`}>
              <label>
                <span className="campo-calculo__etiqueta">
                  {revisado && (
                    <span className="campo-calculo__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>
                  )}
                  {c.etiqueta}
                </span>
                <input
                  className="campo"
                  inputMode={c.texto ? 'text' : 'decimal'}
                  value={valores[c.id] ?? ''}
                  disabled={bloqueado}
                  onChange={(e) => {
                    setValores((p) => ({ ...p, [c.id]: e.target.value }))
                    if (revisado) ctrl.reintentar()
                  }}
                />
              </label>
              {mal && c.porQueNo && <p className="campo-calculo__ayuda">{c.porQueNo}</p>}
            </div>
          )
        })}
      </div>

      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Verificar cálculos' : 'Completa todos los campos'}
        </button>
      )}
    </div>
  )
}

/* ================================== CASO ================================== */

export function Caso({ actividad, ctrl }) {
  const [elegida, setElegida] = useState(null)
  const [verConsecuencia, setVerConsecuencia] = useState(false)
  const bloqueado = ctrl.acertado

  const decision = actividad.decisiones.find((d) => d.id === elegida)

  async function confirmar() {
    await ctrl.enviar(decision.acertada, {
      datos: { elegida },
      detalle: (
        <div className="consecuencia">
          <p className="consecuencia__titulo">Qué pasó</p>
          <p>{decision.consecuencia}</p>
          <p className="consecuencia__porque">
            <strong>{decision.acertada ? 'Por qué funciona:' : 'Por qué no funciona:'}</strong> {decision.porQue}
          </p>
        </div>
      ),
    })
  }

  return (
    <div className="juego juego--caso">
      <blockquote className="escenario">{actividad.escenario}</blockquote>
      <ul className="opciones">
        {actividad.decisiones.map((d, i) => (
          <li key={d.id}>
            <button
              type="button"
              className={[
                'opcion',
                elegida === d.id && 'opcion--elegida',
                bloqueado && d.acertada && 'opcion--correcta',
                ctrl.resultado && !ctrl.resultado.correcto && elegida === d.id && 'opcion--incorrecta',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={bloqueado}
              onClick={() => {
                setElegida(d.id)
                setVerConsecuencia(false)
                if (ctrl.resultado) ctrl.reintentar()
              }}
            >
              <span className="opcion__letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              <span className="opcion__texto">{d.texto}</span>
            </button>
          </li>
        ))}
      </ul>

      {decision && !bloqueado && !ctrl.resultado && (
        <div className="acciones">
          {!verConsecuencia ? (
            <button type="button" className="boton boton--secundario" onClick={() => setVerConsecuencia(true)}>
              Ver la consecuencia de esta decisión
            </button>
          ) : (
            <>
              <div className="consecuencia">
                <p className="consecuencia__titulo">Qué pasó</p>
                <p>{decision.consecuencia}</p>
              </div>
              <button type="button" className="boton boton--principal" onClick={confirmar} disabled={ctrl.enviando}>
                Confirmar esta decisión
              </button>
            </>
          )}
        </div>
      )}

      {bloqueado && (
        <ul className="consecuencias-todas">
          {actividad.decisiones
            .filter((d) => !d.acertada)
            .map((d) => (
              <li key={d.id}>
                <p className="consecuencias-todas__opcion">{d.texto}</p>
                <p className="consecuencias-todas__porque">{d.porQue}</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
