import { useMemo, useState } from 'react'
import { mezclar, coincideNumero } from './marco.jsx'

/* ================================ ENTREGA ================================= */
/* Elegir el alcance de una entrega con capacidad limitada.                   */

export function Entrega({ actividad, ctrl }) {
  const [elegidas, setElegidas] = useState([])
  const bloqueado = ctrl.acertado
  const usado = actividad.opciones
    .filter((o) => elegidas.includes(o.id))
    .reduce((s, o) => s + o.costo, 0)
  const restante = actividad.capacidad - usado
  const revisado = ctrl.resultado !== null

  function alternar(id) {
    if (bloqueado) return
    setElegidas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    if (revisado) ctrl.reintentar()
  }

  async function verificar() {
    const { obligatorias, prohibidas, explicacionObligatorias, explicacionProhibidas } = actividad.criterio
    const faltan = obligatorias.filter((id) => !elegidas.includes(id))
    const sobran = prohibidas.filter((id) => elegidas.includes(id))
    const excede = usado > actividad.capacidad
    const correcto = faltan.length === 0 && sobran.length === 0 && !excede

    await ctrl.enviar(correcto, {
      datos: { elegidas, usado },
      mensaje: excede
        ? `Te pasaste de la capacidad: ${usado} de ${actividad.capacidad} ${actividad.unidad}.`
        : null,
      detalle: correcto ? null : (
        <ul className="resultado__lista">
          {faltan.length > 0 && (
            <li>
              <strong>Falta lo esencial:</strong> {faltan.map((id) => textoOpcion(actividad, id)).join('; ')}.{' '}
              {explicacionObligatorias}
            </li>
          )}
          {sobran.length > 0 && (
            <li>
              <strong>Sobra:</strong> {sobran.map((id) => textoOpcion(actividad, id)).join('; ')}.{' '}
              {explicacionProhibidas}
            </li>
          )}
        </ul>
      ),
    })
  }

  return (
    <div className="juego juego--entrega">
      <div className="capacidad" role="status">
        <span className="capacidad__cifra">
          {usado} / {actividad.capacidad}
        </span>
        <span className="capacidad__unidad">{actividad.unidad} usados</span>
        <span className={restante < 0 ? 'capacidad__resto capacidad__resto--mal' : 'capacidad__resto'}>
          {restante < 0 ? `Te pasaste por ${-restante}` : `Quedan ${restante}`}
        </span>
      </div>

      <ul className="entrega">
        {actividad.opciones.map((o) => {
          const activa = elegidas.includes(o.id)
          return (
            <li key={o.id} className={activa ? 'entrega__item entrega__item--activo' : 'entrega__item'}>
              <label className="entrega__label">
                <input type="checkbox" checked={activa} disabled={bloqueado} onChange={() => alternar(o.id)} />
                <span className="entrega__texto">{o.texto}</span>
                <span className="entrega__costo">{o.costo}</span>
              </label>
              {(activa || revisado) && <p className="entrega__necesidad">{o.necesidad}</p>}
            </li>
          )
        })}
      </ul>

      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={elegidas.length === 0 || ctrl.enviando}
        >
          Verificar la entrega
        </button>
      )}
    </div>
  )
}

function textoOpcion(actividad, id) {
  return actividad.opciones.find((o) => o.id === id)?.texto ?? id
}

/* ======================== FORMULARIO CON FRICCIÓN ========================= */
/*
 * Formulario deliberadamente problemático. Los defectos son reales: la
 * validación exige un formato que no anuncia, borra lo escrito al fallar,
 * no dice qué campo está mal y esconde que un campo es obligatorio.
 */

export function FormularioFriccion({ actividad, ctrl }) {
  const vacio = { sala: '', fecha: '', hasta: '', desde: '', motivo: '' }
  const [valores, setValores] = useState(vacio)
  const [error, setError] = useState(null)
  const [logrado, setLogrado] = useState(false)
  const [intentosForm, setIntentosForm] = useState(0)
  const [marcas, setMarcas] = useState([])
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null

  function enviarFormulario(e) {
    e.preventDefault()
    setIntentosForm((n) => n + 1)
    const t = actividad.tarea

    // DEFECTO: exige AAAA-MM-DD sin anunciarlo.
    const fechaOk = /^\d{4}-\d{2}-\d{2}$/.test(valores.fecha.trim())
    // DEFECTO: campo obligatorio no señalado.
    const motivoOk = valores.motivo.trim() !== ''
    const salaOk = valores.sala.trim() !== ''
    const horasOk = valores.desde.trim() !== '' && valores.hasta.trim() !== ''

    if (!fechaOk || !motivoOk || !salaOk || !horasOk) {
      // DEFECTO: mensaje genérico que no dice qué campo, y borra lo escrito.
      setError('Dato inválido. Revise el formulario.')
      setValores(vacio)
      return
    }

    const correcto =
      valores.sala.trim() === t.sala &&
      valores.fecha.trim() === t.fecha &&
      valores.desde.trim() === t.desde &&
      valores.hasta.trim() === t.hasta

    if (!correcto) {
      setError('Los datos no corresponden a la reserva solicitada.')
      return
    }
    setError(null)
    setLogrado(true)
  }

  function alternarMarca(id) {
    if (bloqueado) return
    setMarcas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    if (revisado) ctrl.reintentar()
  }

  async function verificar() {
    const reales = actividad.defectos.filter((d) => d.real).map((d) => d.id)
    const faltan = reales.filter((id) => !marcas.includes(id))
    const falsos = marcas.filter((id) => !reales.includes(id))
    const correcto = faltan.length === 0 && falsos.length === 0
    await ctrl.enviar(correcto, {
      datos: { marcas, intentosFormulario: intentosForm, logrado },
      mensaje: correcto
        ? null
        : `${reales.length - faltan.length} de ${reales.length} defectos reales encontrados${falsos.length > 0 ? `, y ${falsos.length} marcado${falsos.length > 1 ? 's' : ''} que no ocurre${falsos.length > 1 ? 'n' : ''}` : ''}.`,
    })
  }

  return (
    <div className="juego juego--friccion">
      <div className="tarea">
        <p className="tarea__titulo">Tu tarea</p>
        <p>
          Reserva la sala <strong>{actividad.tarea.sala}</strong> para el{' '}
          <strong>20 de octubre de 2026</strong>, de <strong>{actividad.tarea.desde}</strong> a{' '}
          <strong>{actividad.tarea.hasta}</strong>.
        </p>
      </div>

      <form className="formulario-malo" onSubmit={enviarFormulario} noValidate>
        <p className="formulario-malo__titulo">Reserva de salas · simulación</p>
        <label>
          <span>Código de sala</span>
          <input
            className="campo"
            value={valores.sala}
            onChange={(e) => setValores((v) => ({ ...v, sala: e.target.value }))}
          />
        </label>
        <label>
          <span>Fecha</span>
          <input
            className="campo"
            value={valores.fecha}
            placeholder="Fecha"
            onChange={(e) => setValores((v) => ({ ...v, fecha: e.target.value }))}
          />
        </label>
        {/* DEFECTO: hora de fin antes que hora de inicio */}
        <label>
          <span>Hora de fin</span>
          <input
            className="campo"
            value={valores.hasta}
            onChange={(e) => setValores((v) => ({ ...v, hasta: e.target.value }))}
          />
        </label>
        <label>
          <span>Hora de inicio</span>
          <input
            className="campo"
            value={valores.desde}
            onChange={(e) => setValores((v) => ({ ...v, desde: e.target.value }))}
          />
        </label>
        <label>
          {/* DEFECTO: obligatorio sin marcar */}
          <span>Motivo</span>
          <input
            className="campo"
            value={valores.motivo}
            onChange={(e) => setValores((v) => ({ ...v, motivo: e.target.value }))}
          />
        </label>
        {error && (
          <p className="formulario-malo__error" role="alert">
            {error}
          </p>
        )}
        {logrado && (
          <p className="formulario-malo__ok" role="status">
            Reserva creada. Te tomó {intentosForm} envío{intentosForm > 1 ? 's' : ''}.
          </p>
        )}
        <button type="submit" className="boton boton--secundario">
          Guardar reserva
        </button>
      </form>

      <p className="friccion__paso">
        {logrado
          ? 'Ahora marca los problemas que encontraste.'
          : `Llevas ${intentosForm} envío${intentosForm === 1 ? '' : 's'}. Puedes marcar los problemas cuando quieras, aunque no logres completar la reserva.`}
      </p>

      <ul className="checklist checklist--defectos">
        {actividad.defectos.map((d) => {
          const marcado = marcas.includes(d.id)
          const bien = revisado && marcado === d.real
          const mal = revisado && marcado !== d.real
          return (
            <li key={d.id} className={`${bien ? 'defecto--ok' : ''} ${mal ? 'defecto--mal' : ''}`}>
              <label>
                <input type="checkbox" checked={marcado} disabled={bloqueado} onChange={() => alternarMarca(d.id)} />
                <span>
                  {revisado && (
                    <span className="defecto__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>
                  )}
                  {d.etiqueta}
                </span>
              </label>
              {revisado && (
                <p className="defecto__porque">
                  <strong>{d.real ? `Real · ${d.subcaracteristica}.` : 'No ocurre.'}</strong> {d.porQue}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
          Verificar los problemas marcados
        </button>
      )}
    </div>
  )
}

/* ============================= MEJORA INTERFAZ ============================ */

export function MejoraInterfaz({ actividad, ctrl }) {
  const [elegidos, setElegidos] = useState([])
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null
  const tiene = (id) => elegidos.includes(id)

  function alternar(id) {
    if (bloqueado) return
    setElegidos((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    if (revisado) ctrl.reintentar()
  }

  async function verificar() {
    const correctos = actividad.cambios.filter((c) => c.correcto).map((c) => c.id)
    const faltan = correctos.filter((id) => !elegidos.includes(id))
    const sobran = elegidos.filter((id) => !correctos.includes(id))
    const correcto = faltan.length === 0 && sobran.length === 0
    await ctrl.enviar(correcto, {
      datos: { elegidos },
      mensaje: correcto
        ? null
        : `${correctos.length - faltan.length} de ${correctos.length} cambios útiles${sobran.length ? `, y ${sobran.length} que no corrigen ningún defecto` : ''}.`,
    })
  }

  return (
    <div className="juego juego--mejora">
      <div className="mejora__columnas">
        <ul className="mejora__opciones">
          {actividad.cambios.map((c) => {
            const marcado = tiene(c.id)
            const bien = revisado && marcado === c.correcto
            const mal = revisado && marcado !== c.correcto
            return (
              <li key={c.id} className={`${bien ? 'defecto--ok' : ''} ${mal ? 'defecto--mal' : ''}`}>
                <label>
                  <input type="checkbox" checked={marcado} disabled={bloqueado} onChange={() => alternar(c.id)} />
                  <span>{c.texto}</span>
                </label>
                {(marcado || revisado) && <p className="mejora__efecto">{c.efecto}</p>}
              </li>
            )
          })}
        </ul>

        <div className="mejora__vista" aria-live="polite">
          <p className="mejora__vista-titulo">Cómo queda el formulario</p>
          <form className="formulario-bueno" onSubmit={(e) => e.preventDefault()}>
            <label>
              <span>Código de sala {tiene('marcar-obligatorio') && <em className="obligatorio">obligatorio</em>}</span>
              <input className="campo" readOnly value="203" />
            </label>
            <label>
              <span>Fecha {tiene('marcar-obligatorio') && <em className="obligatorio">obligatorio</em>}</span>
              {tiene('selector-fecha') ? (
                <input className="campo" type="date" readOnly value="2026-10-20" />
              ) : (
                <input className="campo" readOnly value="20/10/2026" />
              )}
              {!tiene('selector-fecha') && tiene('error-campo') && (
                <span className="campo__error">Formato esperado: AAAA-MM-DD</span>
              )}
            </label>
            {tiene('reordenar') ? (
              <>
                <CampoHora etiqueta="Hora de inicio" valor="10:00" obligatorio={tiene('marcar-obligatorio')} />
                <CampoHora etiqueta="Hora de fin" valor="12:00" obligatorio={tiene('marcar-obligatorio')} />
              </>
            ) : (
              <>
                <CampoHora etiqueta="Hora de fin" valor="12:00" obligatorio={tiene('marcar-obligatorio')} />
                <CampoHora etiqueta="Hora de inicio" valor="10:00" obligatorio={tiene('marcar-obligatorio')} />
              </>
            )}
            {!tiene('quitar-motivo') && (
              <label>
                <span>Motivo {tiene('marcar-obligatorio') && <em className="obligatorio">obligatorio</em>}</span>
                <input className="campo" readOnly value="Trabajo en grupo" />
              </label>
            )}
            <p className={tiene('conservar') ? 'nota-vista nota-vista--ok' : 'nota-vista'}>
              {tiene('conservar')
                ? 'Al fallar la validación se conserva lo escrito.'
                : 'Al fallar la validación se borra lo escrito.'}
            </p>
            {tiene('colores') && <p className="nota-vista">Paleta cambiada.</p>}
            {tiene('animacion') && <p className="nota-vista">Animación al enviar.</p>}
          </form>
        </div>
      </div>

      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
          Verificar los cambios elegidos
        </button>
      )}
    </div>
  )
}

function CampoHora({ etiqueta, valor, obligatorio }) {
  return (
    <label>
      <span>
        {etiqueta} {obligatorio && <em className="obligatorio">obligatorio</em>}
      </span>
      <input className="campo" readOnly value={valor} />
    </label>
  )
}

/* =========================== ROMPE EL FORMULARIO ========================== */
/*
 * Aquí la validación se EJECUTA de verdad. El simulador tiene una
 * implementación con defectos y, al lado, las reglas declaradas. Un defecto se
 * considera descubierto cuando el estudiante envía una entrada para la que las
 * dos discrepan. No se pregunta "cuál respuesta es correcta": hay que provocar
 * la falla.
 */

const CAMPOS_ROMPER = [
  { id: 'cantidad', etiqueta: 'Cantidad de reservas', ejemplo: 'p. ej. 3' },
  { id: 'sala', etiqueta: 'Código de sala', ejemplo: 'p. ej. 203' },
  { id: 'correo', etiqueta: 'Correo de contacto', ejemplo: 'p. ej. ana@unimayor.edu.co' },
  { id: 'duracion', etiqueta: 'Duración en horas', ejemplo: 'p. ej. 1,5' },
]

/** Lo que las reglas declaradas EXIGEN. */
function validarSegunReglas(v) {
  const n = v.cantidad.trim()
  const cantidadOk = /^\d+$/.test(n) && Number(n) >= 1 && Number(n) <= 5
  const salaOk = /^\d{3}$/.test(v.sala.trim())
  const c = v.correo.trim()
  const arroba = c.indexOf('@')
  const correoOk = arroba > 0 && c.indexOf('.', arroba) > arroba + 1 && !c.endsWith('.')
  const d = v.duracion.trim().replace(',', '.')
  const duracionOk = /^\d+(\.\d+)?$/.test(d) && Number(d) >= 1 && Number(d) <= 2
  return { cantidad: cantidadOk, sala: salaOk, correo: correoOk, duracion: duracionOk }
}

/** Lo que la implementación con defectos hace REALMENTE. */
function validarImplementacion(v) {
  const n = parseInt(v.cantidad.trim(), 10) // DEFECTO: "3a" se convierte en 3
  const cantidadOk = !Number.isNaN(n) && n >= 1 && n <= 6 // DEFECTO: 6 en vez de 5
  const salaOk = /^\d{3,}$/.test(v.sala.trim()) // DEFECTO: 3 o más, no exactamente 3
  const correoOk = v.correo.trim().includes('@') // DEFECTO: no exige punto
  const d = v.duracion.trim().replace(',', '.')
  const duracionOk = /^\d+(\.\d+)?$/.test(d) && Number(d) >= 1 && Number(d) <= 2
  return { cantidad: cantidadOk, sala: salaOk, correo: correoOk, duracion: duracionOk }
}

/** Traduce una discrepancia en el identificador del defecto. */
function defectoDe(campo, valor) {
  if (campo === 'cantidad') {
    return /^\d+$/.test(valor.trim()) ? 'limite-superior' : 'texto-numerico'
  }
  if (campo === 'sala') return 'sala-larga'
  if (campo === 'correo') return 'correo-flojo'
  return null
}

export function RomperFormulario({ actividad, ctrl }) {
  const [valores, setValores] = useState({ cantidad: '', sala: '', correo: '', duracion: '' })
  const [historial, setHistorial] = useState([])
  const [encontrados, setEncontrados] = useState([])
  const bloqueado = ctrl.acertado

  function probar(e) {
    e.preventDefault()
    if (Object.values(valores).every((v) => v.trim() === '')) return
    const reglas = validarSegunReglas(valores)
    const impl = validarImplementacion(valores)

    const discrepancias = []
    for (const c of ['cantidad', 'sala', 'correo', 'duracion']) {
      if (valores[c].trim() === '') continue
      if (reglas[c] !== impl[c]) {
        const id = defectoDe(c, valores[c])
        if (id) discrepancias.push({ campo: c, id })
      }
    }

    const nuevos = discrepancias.map((d) => d.id).filter((id) => !encontrados.includes(id))
    if (nuevos.length > 0) setEncontrados((p) => [...p, ...nuevos])

    setHistorial((h) =>
      [
        {
          valores: { ...valores },
          aceptado: Object.values(impl).every(Boolean),
          esperado: Object.values(reglas).every(Boolean),
          discrepancias,
          campos: impl,
        },
        ...h,
      ].slice(0, 12),
    )
  }

  async function verificar() {
    const total = actividad.defectos.length
    const correcto = encontrados.length === total
    await ctrl.enviar(correcto, {
      datos: { encontrados, envios: historial.length },
      mensaje: correcto
        ? `Encontraste los ${total} defectos en ${historial.length} envíos.`
        : `Llevas ${encontrados.length} de ${total} defectos. Sigue probando entradas que ataquen las reglas.`,
    })
  }

  return (
    <div className="juego juego--romper">
      <div className="reglas">
        <p className="reglas__titulo">Reglas de validación declaradas</p>
        <ul>
          {actividad.reglas.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <form className="formulario-prueba" onSubmit={probar}>
        {CAMPOS_ROMPER.map((c) => (
          <label key={c.id}>
            <span>{c.etiqueta}</span>
            <input
              className="campo"
              value={valores[c.id]}
              placeholder={c.ejemplo}
              disabled={bloqueado}
              onChange={(e) => setValores((v) => ({ ...v, [c.id]: e.target.value }))}
            />
          </label>
        ))}
        <button type="submit" className="boton boton--secundario" disabled={bloqueado}>
          Enviar al validador
        </button>
      </form>

      <div className="marcador-defectos" role="status">
        <span className="marcador-defectos__cifra">
          {encontrados.length} / {actividad.defectos.length}
        </span>
        <span>defectos encontrados</span>
      </div>

      {historial.length > 0 && (
        <div className="tabla-envoltura">
          <table className="tabla tabla--historial">
            <caption className="visualmente-oculto">Historial de envíos al validador</caption>
            <thead>
              <tr>
                <th>Entradas</th>
                <th>Qué exigen las reglas</th>
                <th>Qué hizo el sistema</th>
                <th>Veredicto</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, i) => (
                <tr key={i} className={h.discrepancias.length > 0 ? 'fila--defecto' : ''}>
                  <td>
                    {CAMPOS_ROMPER.filter((c) => h.valores[c.id].trim() !== '')
                      .map((c) => `${c.etiqueta}: ${h.valores[c.id]}`)
                      .join(' · ') || '(todo vacío)'}
                  </td>
                  <td>{h.esperado ? 'Aceptar' : 'Rechazar'}</td>
                  <td>{h.aceptado ? 'Aceptó' : 'Rechazó'}</td>
                  <td>
                    {h.discrepancias.length > 0 ? (
                      <strong>
                        Defecto encontrado ({h.discrepancias.map((d) => d.campo).join(', ')})
                      </strong>
                    ) : (
                      'Coincide'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ul className="lista-defectos">
        {actividad.defectos.map((d) => {
          const hallado = encontrados.includes(d.id)
          return (
            <li key={d.id} className={hallado ? 'lista-defectos__item--hallado' : ''}>
              <span className="lista-defectos__marca" aria-hidden="true">{hallado ? '✓' : '○'}</span>
              {hallado ? d.descripcion : <em>Defecto sin descubrir</em>}
              {!hallado && ctrl.pistasAbiertas > 1 && <span className="lista-defectos__pista"> — {d.pistaBusqueda}</span>}
            </li>
          )
        })}
      </ul>

      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
          Registrar lo encontrado
        </button>
      )}
    </div>
  )
}

/* ================================ LÍMITES ================================= */

export function Limites({ actividad, ctrl }) {
  const [elegidos, setElegidos] = useState([])
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null

  function alternar(v) {
    if (bloqueado) return
    setElegidos((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
    if (revisado) ctrl.reintentar()
  }

  async function verificar() {
    const necesarios = actividad.valores.filter((v) => v.necesario).map((v) => v.valor)
    const faltan = necesarios.filter((v) => !elegidos.includes(v))
    const sobran = elegidos.filter((v) => !necesarios.includes(v))
    const correcto = faltan.length === 0 && sobran.length === 0
    await ctrl.enviar(correcto, {
      datos: { elegidos },
      mensaje: correcto
        ? null
        : `${necesarios.length - faltan.length} de ${necesarios.length} valores necesarios${sobran.length ? `, y ${sobran.length} redundante${sobran.length > 1 ? 's' : ''}` : ''}.`,
    })
  }

  const ETIQUETA_CLASE = { normal: 'Normal', frontera: 'Frontera', invalida: 'Inválida' }

  return (
    <div className="juego juego--limites">
      <p className="regla-destacada">{actividad.regla.descripcion}</p>
      <div className="recta">
        <span className="recta__marca">{actividad.regla.min}</span>
        <span className="recta__linea" aria-hidden="true" />
        <span className="recta__marca">{actividad.regla.max}</span>
      </div>
      <ul className="limites">
        {actividad.valores.map((v) => {
          const marcado = elegidos.includes(v.valor)
          const bien = revisado && marcado === v.necesario
          const mal = revisado && marcado !== v.necesario
          return (
            <li key={v.valor} className={`${bien ? 'defecto--ok' : ''} ${mal ? 'defecto--mal' : ''}`}>
              <label>
                <input type="checkbox" checked={marcado} disabled={bloqueado} onChange={() => alternar(v.valor)} />
                <code className="limites__valor">{v.valor}</code>
                {revisado && <span className="limites__clase">{ETIQUETA_CLASE[v.clase]}</span>}
              </label>
              {revisado && (
                <p className="limites__porque">
                  <strong>{v.necesario ? 'Necesario.' : 'Redundante.'}</strong> {v.porQue}
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
          disabled={elegidos.length === 0 || ctrl.enviando}
        >
          Verificar el conjunto de pruebas
        </button>
      )}
    </div>
  )
}

/* ============================= TABLA DE PRUEBAS =========================== */

export function TablaPruebas({ actividad, ctrl }) {
  const [celdas, setCeldas] = useState({})
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null
  const completo = actividad.filas.every((_, i) => celdas[`${i}-r`] && celdas[`${i}-m`])

  async function verificar() {
    const fallos = actividad.filas.filter(
      (f, i) => celdas[`${i}-r`] !== f.resultado || celdas[`${i}-m`] !== f.motivo,
    )
    const correcto = fallos.length === 0
    await ctrl.enviar(correcto, {
      datos: { celdas },
      mensaje: correcto
        ? null
        : `${actividad.filas.length - fallos.length} de ${actividad.filas.length} filas completas y coherentes.`,
    })
  }

  return (
    <div className="juego juego--tabla-pruebas">
      <p className="regla-destacada">{actividad.regla}</p>
      <div className="tabla-envoltura">
        <table className="tabla tabla--pruebas">
          <thead>
            <tr>
              <th>Entrada</th>
              <th>Resultado esperado</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {actividad.filas.map((f, i) => {
              const bienR = revisado && celdas[`${i}-r`] === f.resultado
              const bienM = revisado && celdas[`${i}-m`] === f.motivo
              return (
                <tr key={i} className={revisado && bienR && bienM ? 'fila--ok' : revisado ? 'fila--mal' : ''}>
                  <td>
                    <code>{f.entrada}</code>
                  </td>
                  <td>
                    <select
                      className={bienR ? 'select--ok' : revisado ? 'select--mal' : ''}
                      value={celdas[`${i}-r`] ?? ''}
                      disabled={bloqueado}
                      aria-label={`Resultado esperado para ${f.entrada}`}
                      onChange={(e) => {
                        setCeldas((p) => ({ ...p, [`${i}-r`]: e.target.value }))
                        if (revisado) ctrl.reintentar()
                      }}
                    >
                      <option value="">Elige…</option>
                      {actividad.resultados.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.texto}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className={bienM ? 'select--ok' : revisado ? 'select--mal' : ''}
                      value={celdas[`${i}-m`] ?? ''}
                      disabled={bloqueado}
                      aria-label={`Motivo para ${f.entrada}`}
                      onChange={(e) => {
                        setCeldas((p) => ({ ...p, [`${i}-m`]: e.target.value }))
                        if (revisado) ctrl.reintentar()
                      }}
                    >
                      <option value="">Elige…</option>
                      {actividad.motivos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.texto}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {revisado && (
        <ul className="tabla-pruebas__explicaciones">
          {actividad.filas.map((f, i) => (
            <li key={i}>
              <code>{f.entrada}</code> — {f.porQue}
            </li>
          ))}
        </ul>
      )}
      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Verificar la tabla' : 'Completa todas las filas'}
        </button>
      )}
    </div>
  )
}

/* ============================ SIMULADOR DE MOORE ========================== */

export function SimuladorMoore({ actividad, ctrl }) {
  const [p, setP] = useState(actividad.inicial)
  const [respuestas, setRespuestas] = useState({})
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null

  const serie = useMemo(() => {
    const filas = []
    const paso = Math.max(p.periodo, p.tiempo / 12)
    for (let t = 0; t <= p.tiempo + 1e-9; t += paso) {
      filas.push({
        t: Math.round(t * 100) / 100,
        exp: p.valorInicial * Math.pow(2, t / p.periodo),
        lin: p.valorInicial + (p.incrementoLineal * t) / p.periodo,
      })
    }
    return filas
  }, [p])

  const maximo = Math.max(...serie.map((f) => Math.max(f.exp, f.lin)), 1)
  const duplicaciones = p.tiempo / p.periodo
  const final = p.valorInicial * Math.pow(2, duplicaciones)

  async function verificar() {
    const fallos = actividad.preguntas.filter(
      (q) => !q.respuestas.some((r) => coincideNumero(respuestas[q.id] ?? '', r, 0.5)),
    )
    const correcto = fallos.length === 0
    await ctrl.enviar(correcto, {
      datos: { respuestas, parametros: p },
      mensaje: correcto ? null : `${actividad.preguntas.length - fallos.length} de ${actividad.preguntas.length} correctas.`,
    })
  }

  return (
    <div className="juego juego--moore">
      <div className="controles">
        <Deslizador etiqueta="Valor inicial" valor={p.valorInicial} min={1} max={1000} paso={1} alCambiar={(v) => setP((s) => ({ ...s, valorInicial: v }))} />
        <Deslizador etiqueta="Periodo de duplicación (años)" valor={p.periodo} min={1} max={6} paso={0.5} alCambiar={(v) => setP((s) => ({ ...s, periodo: v }))} />
        <Deslizador etiqueta="Tiempo total (años)" valor={p.tiempo} min={2} max={30} paso={1} alCambiar={(v) => setP((s) => ({ ...s, tiempo: v }))} />
        <Deslizador etiqueta="Incremento lineal por periodo" valor={p.incrementoLineal} min={0} max={500} paso={10} alCambiar={(v) => setP((s) => ({ ...s, incrementoLineal: v }))} />
      </div>

      <div className="resumen-simulador" role="status">
        <p>
          <strong>{Math.round(duplicaciones * 100) / 100}</strong> duplicaciones ·{' '}
          <strong>{formatear(final)}</strong> al final (exponencial) frente a{' '}
          <strong>{formatear(p.valorInicial + p.incrementoLineal * duplicaciones)}</strong> (lineal)
        </p>
      </div>

      <div className="grafico" role="img" aria-label={`Gráfico comparativo: al final el crecimiento exponencial llega a ${formatear(final)} y el lineal a ${formatear(p.valorInicial + p.incrementoLineal * duplicaciones)}`}>
        {serie.map((f, i) => (
          <div key={i} className="grafico__columna">
            <span className="grafico__barra grafico__barra--exp" style={{ height: `${(f.exp / maximo) * 100}%` }} />
            <span className="grafico__barra grafico__barra--lin" style={{ height: `${(f.lin / maximo) * 100}%` }} />
            <span className="grafico__etiqueta">{f.t}</span>
          </div>
        ))}
      </div>
      <p className="grafico__leyenda">
        <span className="llave llave--exp" /> Exponencial · <span className="llave llave--lin" /> Lineal · eje horizontal en años
      </p>

      <div className="tabla-envoltura">
        <table className="tabla">
          <thead>
            <tr>
              <th>Año</th>
              <th>Exponencial (×2 por periodo)</th>
              <th>Lineal (+{p.incrementoLineal} por periodo)</th>
              <th>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {serie.map((f, i) => (
              <tr key={i}>
                <td>{f.t}</td>
                <td>{formatear(f.exp)}</td>
                <td>{formatear(f.lin)}</td>
                <td>{formatear(f.exp - f.lin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="campos">
        {actividad.preguntas.map((q) => {
          const bien = revisado && q.respuestas.some((r) => coincideNumero(respuestas[q.id] ?? '', r, 0.5))
          const mal = revisado && !bien
          return (
            <div key={q.id} className={`campo-calculo ${bien ? 'campo-calculo--ok' : ''} ${mal ? 'campo-calculo--mal' : ''}`}>
              <label>
                <span className="campo-calculo__etiqueta">{q.texto}</span>
                <input
                  className="campo"
                  inputMode="decimal"
                  value={respuestas[q.id] ?? ''}
                  disabled={bloqueado}
                  onChange={(e) => {
                    setRespuestas((s) => ({ ...s, [q.id]: e.target.value }))
                    if (revisado) ctrl.reintentar()
                  }}
                />
              </label>
              {mal && <p className="campo-calculo__ayuda">{q.porQueNo}</p>}
            </div>
          )
        })}
      </div>

      {!bloqueado && (
        <button type="button" className="boton boton--principal" onClick={verificar} disabled={ctrl.enviando}>
          Verificar respuestas
        </button>
      )}
    </div>
  )
}

function Deslizador({ etiqueta, valor, min, max, paso, alCambiar }) {
  return (
    <label className="deslizador">
      <span className="deslizador__etiqueta">
        {etiqueta}: <strong>{valor}</strong>
      </span>
      <input type="range" min={min} max={max} step={paso} value={valor} onChange={(e) => alCambiar(Number(e.target.value))} />
      <input
        className="campo campo--mini"
        type="number"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => alCambiar(Number(e.target.value))}
        aria-label={`${etiqueta}, valor exacto`}
      />
    </label>
  )
}

function formatear(n) {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)} ×10⁹`
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)} ×10⁶`
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n)
}

/* ================================ PREDICE ================================= */

export function Predice({ actividad, ctrl }) {
  const [fase, setFase] = useState({}) // id → 'prediccion' | 'comprobado'
  const [predicciones, setPredicciones] = useState({})
  const [remate, setRemate] = useState(null)
  const bloqueado = ctrl.acertado
  const todosComprobados = actividad.escenarios.every((e) => fase[e.id] === 'comprobado')

  async function verificar() {
    const correcto = actividad.remate ? remate === actividad.remate.correcta : todosComprobados
    const aciertos = actividad.escenarios.filter((e) => predicciones[e.id] === e.correcta).length
    await ctrl.enviar(correcto, {
      datos: { predicciones, remate },
      mensaje: `Acertaste ${aciertos} de ${actividad.escenarios.length} predicciones. Equivocarse aquí es parte del ejercicio: lo que se puntúa es completar el ciclo y explicar el error.`,
      detalle:
        correcto || !actividad.remate ? null : (
          <p className="resultado__porque">{actividad.remate.porQueNo?.[remate]}</p>
        ),
    })
  }

  return (
    <div className="juego juego--predice">
      <ol className="predice">
        {actividad.escenarios.map((e) => {
          const estado = fase[e.id]
          const acerto = predicciones[e.id] === e.correcta
          return (
            <li key={e.id} className="predice__item">
              <p className="predice__enunciado">{e.enunciado}</p>

              {!estado && (
                <>
                  <p className="predice__aviso">Primero predice, sin calcular.</p>
                  <ul className="opciones opciones--compactas">
                    {e.opciones.map((op, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          className={predicciones[e.id] === i ? 'opcion opcion--elegida' : 'opcion'}
                          onClick={() => setPredicciones((p) => ({ ...p, [e.id]: i }))}
                        >
                          <span className="opcion__letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                          <span className="opcion__texto">{op}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="boton boton--secundario"
                    disabled={predicciones[e.id] === undefined}
                    onClick={() => setFase((f) => ({ ...f, [e.id]: 'comprobado' }))}
                  >
                    Ejecutar la simulación y comparar
                  </button>
                </>
              )}

              {estado === 'comprobado' && (
                <div className={acerto ? 'predice__resultado predice__resultado--ok' : 'predice__resultado'}>
                  <p>
                    <strong>Tu predicción:</strong> {e.opciones[predicciones[e.id]]}
                    <br />
                    <strong>Resultado real:</strong> {e.opciones[e.correcta]} ({formatear(e.resultado)} {e.unidad})
                    <br />
                    <strong>Cálculo:</strong> {e.valorInicial} × 2^({e.tiempo} ÷ {e.periodo}) ={' '}
                    {formatear(e.resultado)} {e.unidad}
                  </p>
                  <p className="predice__explicacion">{e.explicacion}</p>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {todosComprobados && actividad.remate && !bloqueado && (
        <div className="remate">
          <p className="remate__titulo">Para cerrar</p>
          <p className="enunciado">{actividad.remate.pregunta}</p>
          <ul className="opciones">
            {actividad.remate.opciones.map((op, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={remate === i ? 'opcion opcion--elegida' : 'opcion'}
                  onClick={() => {
                    setRemate(i)
                    if (ctrl.resultado) ctrl.reintentar()
                  }}
                >
                  <span className="opcion__letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                  <span className="opcion__texto">{op}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!bloqueado && todosComprobados && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={(actividad.remate && remate === null) || ctrl.enviando}
        >
          Registrar el ejercicio
        </button>
      )}
      {!todosComprobados && (
        <p className="ayuda-teclado">Completa la predicción y la comprobación de los tres escenarios.</p>
      )}
    </div>
  )
}

/* =========================== ¿NECESITAS ESE DATO? ========================= */

export function DatosNecesarios({ actividad, ctrl }) {
  const [decision, setDecision] = useState({})
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null
  const completo = actividad.datos.every((d) => decision[d.id] !== undefined)

  async function verificar() {
    const fallos = actividad.datos.filter((d) => decision[d.id] !== d.pedir)
    const correcto = fallos.length === 0
    await ctrl.enviar(correcto, {
      datos: { decision },
      mensaje: correcto
        ? null
        : `${actividad.datos.length - fallos.length} de ${actividad.datos.length} decisiones correctas.`,
    })
  }

  return (
    <div className="juego juego--datos">
      {actividad.contexto && <p className="contexto">{actividad.contexto}</p>}
      <ul className="datos-lista">
        {actividad.datos.map((d) => {
          const v = decision[d.id]
          const bien = revisado && v === d.pedir
          const mal = revisado && v !== undefined && v !== d.pedir
          return (
            <li key={d.id} className={`datos-lista__item ${bien ? 'defecto--ok' : ''} ${mal ? 'defecto--mal' : ''}`}>
              <p className="datos-lista__etiqueta">
                {revisado && <span className="defecto__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>}
                {d.etiqueta}
              </p>
              <div className="datos-lista__botones" role="group" aria-label={`Decisión sobre ${d.etiqueta}`}>
                {[
                  [true, 'Sí lo pido'],
                  [false, 'No lo pido'],
                ].map(([valor, texto]) => (
                  <button
                    key={texto}
                    type="button"
                    className={v === valor ? 'grupo grupo--activo' : 'grupo'}
                    aria-pressed={v === valor}
                    disabled={bloqueado}
                    onClick={() => {
                      setDecision((p) => ({ ...p, [d.id]: valor }))
                      if (revisado) ctrl.reintentar()
                    }}
                  >
                    {texto}
                  </button>
                ))}
              </div>
              {revisado && (
                <p className="datos-lista__porque">
                  {d.pedir ? (
                    <>
                      <strong>Sí. Finalidad:</strong> {d.finalidad}
                    </>
                  ) : (
                    <strong>No se pide. </strong>
                  )}
                  {d.porQue}
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
          {completo ? 'Verificar el formulario' : 'Decide sobre todos los datos'}
        </button>
      )}
    </div>
  )
}

/* ============================= CLASE Y OBJETO ============================= */

export function ClaseObjeto({ actividad, ctrl }) {
  const objetos = useMemo(() => mezclar(actividad.objetos, actividad.id + 'o'), [actividad])
  const miembros = useMemo(() => mezclar(actividad.miembros, actividad.id + 'm'), [actividad])
  const [asigObjetos, setAsigObjetos] = useState({})
  const [asigMiembros, setAsigMiembros] = useState({})
  const [asigDistractores, setAsigDistractores] = useState({})
  const bloqueado = ctrl.acertado
  const revisado = ctrl.resultado !== null

  const completo =
    objetos.every((_, i) => asigObjetos[i]) &&
    miembros.every((_, i) => asigMiembros[`${i}-c`] && asigMiembros[`${i}-t`]) &&
    (actividad.distractores ?? []).every((_, i) => asigDistractores[i])

  async function verificar() {
    const malObj = objetos.filter((o, i) => asigObjetos[i] !== o.clase)
    const malMiem = miembros.filter(
      (m, i) => asigMiembros[`${i}-c`] !== m.clase || asigMiembros[`${i}-t`] !== m.tipo,
    )
    const malDis = (actividad.distractores ?? []).filter((_, i) => asigDistractores[i] !== 'ninguna')
    const correcto = malObj.length === 0 && malMiem.length === 0 && malDis.length === 0
    await ctrl.enviar(correcto, {
      datos: { asigObjetos, asigMiembros, asigDistractores },
      mensaje: correcto
        ? null
        : `Objetos: ${objetos.length - malObj.length}/${objetos.length}. Miembros: ${miembros.length - malMiem.length}/${miembros.length}.${malDis.length ? ' Revisa los dos últimos: ninguno es clase, objeto ni miembro.' : ''}`,
    })
  }

  return (
    <div className="juego juego--clases">
      <section className="bloque-juego">
        <h4 className="bloque-juego__titulo">1. ¿De qué clase es cada objeto?</h4>
        <ul className="clasificar">
          {objetos.map((o, i) => {
            const bien = revisado && asigObjetos[i] === o.clase
            const mal = revisado && asigObjetos[i] && asigObjetos[i] !== o.clase
            return (
              <li key={o.texto} className={`clasificar__fila ${bien ? 'clasificar__fila--ok' : ''} ${mal ? 'clasificar__fila--mal' : ''}`}>
                <p className="clasificar__texto">
                  {revisado && <span className="clasificar__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>}
                  {o.texto}
                </p>
                <div className="clasificar__grupos" role="group" aria-label={`Clase de: ${o.texto}`}>
                  {actividad.clases.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={asigObjetos[i] === c.id ? 'grupo grupo--activo' : 'grupo'}
                      aria-pressed={asigObjetos[i] === c.id}
                      disabled={bloqueado}
                      onClick={() => {
                        setAsigObjetos((p) => ({ ...p, [i]: c.id }))
                        if (revisado) ctrl.reintentar()
                      }}
                    >
                      {c.nombre}
                    </button>
                  ))}
                </div>
                {revisado && <p className="clasificar__explicacion">{o.porQue}</p>}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="bloque-juego">
        <h4 className="bloque-juego__titulo">2. ¿Atributo o método, y de qué clase?</h4>
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th>Elemento</th>
                <th>Clase</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((m, i) => {
                const bien = revisado && asigMiembros[`${i}-c`] === m.clase && asigMiembros[`${i}-t`] === m.tipo
                return (
                  <tr key={m.texto} className={revisado ? (bien ? 'fila--ok' : 'fila--mal') : ''}>
                    <td>
                      <code>{m.texto}</code>
                      {revisado && <p className="celda__porque">{m.porQue}</p>}
                    </td>
                    <td>
                      <select
                        value={asigMiembros[`${i}-c`] ?? ''}
                        disabled={bloqueado}
                        aria-label={`Clase de ${m.texto}`}
                        onChange={(e) => {
                          setAsigMiembros((p) => ({ ...p, [`${i}-c`]: e.target.value }))
                          if (revisado) ctrl.reintentar()
                        }}
                      >
                        <option value="">Elige…</option>
                        {actividad.clases.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={asigMiembros[`${i}-t`] ?? ''}
                        disabled={bloqueado}
                        aria-label={`Tipo de ${m.texto}`}
                        onChange={(e) => {
                          setAsigMiembros((p) => ({ ...p, [`${i}-t`]: e.target.value }))
                          if (revisado) ctrl.reintentar()
                        }}
                      >
                        <option value="">Elige…</option>
                        <option value="atributo">Atributo</option>
                        <option value="metodo">Método</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {actividad.distractores && (
        <section className="bloque-juego">
          <h4 className="bloque-juego__titulo">3. Y estos dos, ¿qué son?</h4>
          <ul className="clasificar">
            {actividad.distractores.map((d, i) => {
              const bien = revisado && asigDistractores[i] === 'ninguna'
              const mal = revisado && asigDistractores[i] && asigDistractores[i] !== 'ninguna'
              return (
                <li key={d.texto} className={`clasificar__fila ${bien ? 'clasificar__fila--ok' : ''} ${mal ? 'clasificar__fila--mal' : ''}`}>
                  <p className="clasificar__texto">
                    {revisado && <span className="clasificar__veredicto" aria-hidden="true">{bien ? '✓' : '✗'}</span>}
                    <code>{d.texto}</code>
                  </p>
                  <div className="clasificar__grupos" role="group" aria-label={`Qué es ${d.texto}`}>
                    {[
                      ['clase', 'Es una clase'],
                      ['objeto', 'Es un objeto'],
                      ['ninguna', 'Ninguna de las dos'],
                    ].map(([id, texto]) => (
                      <button
                        key={id}
                        type="button"
                        className={asigDistractores[i] === id ? 'grupo grupo--activo' : 'grupo'}
                        aria-pressed={asigDistractores[i] === id}
                        disabled={bloqueado}
                        onClick={() => {
                          setAsigDistractores((p) => ({ ...p, [i]: id }))
                          if (revisado) ctrl.reintentar()
                        }}
                      >
                        {texto}
                      </button>
                    ))}
                  </div>
                  {revisado && <p className="clasificar__explicacion">{d.porQue}</p>}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {!bloqueado && (
        <button
          type="button"
          className="boton boton--principal"
          onClick={verificar}
          disabled={!completo || ctrl.enviando}
        >
          {completo ? 'Verificar' : 'Completa las tres partes'}
        </button>
      )}
    </div>
  )
}
