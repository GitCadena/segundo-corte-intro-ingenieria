import { useCallback, useMemo, useState } from 'react'
import { useProgreso } from '../../estado/ProgresoProvider.jsx'
import { puntajePosible, ETIQUETA_ESTADO } from '../../lib/puntaje.js'
import Termino from '../Termino.jsx'

/**
 * Estado compartido por todas las actividades: pistas progresivas, intentos
 * fallidos, si se vio la solución, y el envío de la evidencia.
 *
 * El componente de cada juego decide QUÉ es correcto; este hook decide qué se
 * guarda y cómo se muestra. El puntaje final lo recalcula el servidor.
 */
export function useActividad(actividad, { idCatalogo } = {}) {
  const { registrar, mejores, estadoGuardado, pendientes } = useProgreso()
  const id = idCatalogo ?? actividad.id

  const [pistasAbiertas, setPistasAbiertas] = useState(0)
  const [intentosFallidos, setIntentosFallidos] = useState(0)
  const [solucionVista, setSolucionVista] = useState(false)
  const [resultado, setResultado] = useState(null) // {correcto, mensaje, detalle}
  const [enviando, setEnviando] = useState(false)
  const [avisoGuardado, setAvisoGuardado] = useState(null)

  const mejor = mejores[id] ?? null
  const pistas = actividad.pistas ?? []

  const abrirPista = useCallback(() => {
    setPistasAbiertas((n) => Math.min(n + 1, pistas.length))
  }, [pistas.length])

  const verSolucion = useCallback(() => setSolucionVista(true), [])

  /**
   * Envía la evidencia de un intento.
   * @param {boolean} correcto
   * @param {object} extra  { mensaje, detalle, datos }
   */
  const enviar = useCallback(
    async (correcto, extra = {}) => {
      if (enviando) return
      setEnviando(true)
      const fallosPrevios = intentosFallidos
      if (!correcto) setIntentosFallidos((n) => n + 1)
      setResultado({ correcto, mensaje: extra.mensaje ?? null, detalle: extra.detalle ?? null })

      const r = await registrar({
        actividadId: id,
        correcto,
        pistas: pistasAbiertas,
        intentosFallidos: fallosPrevios,
        solucionVista,
        datos: extra.datos ?? {},
      })
      setAvisoGuardado(r.ok ? 'guardado' : r.pendiente ? 'pendiente' : r.error ?? null)
      setEnviando(false)
      return r
    },
    [enviando, intentosFallidos, registrar, id, pistasAbiertas, solucionVista],
  )

  const reintentar = useCallback(() => {
    setResultado(null)
    setAvisoGuardado(null)
  }, [])

  const valorSiguiente = useMemo(
    () => puntajePosible(actividad.puntos ?? 0, pistasAbiertas, intentosFallidos, solucionVista),
    [actividad.puntos, pistasAbiertas, intentosFallidos, solucionVista],
  )

  return {
    id,
    pistas,
    pistasAbiertas,
    abrirPista,
    hayMasPistas: pistasAbiertas < pistas.length,
    intentosFallidos,
    solucionVista,
    verSolucion,
    resultado,
    acertado: resultado?.correcto === true,
    enviar,
    enviando,
    reintentar,
    valorSiguiente,
    mejor,
    estadoGuardado,
    pendientes,
    avisoGuardado,
  }
}

/* --------------------------- marco de presentación ------------------------ */

const ETIQUETA_TIPO = {
  quiz: 'Pregunta',
  vf: 'Verdadero o falso',
  orden: 'Ordenar',
  emparejar: 'Emparejar',
  clasificar: 'Clasificar',
  calcular: 'Calcular',
  caso: 'Decidir sobre un caso',
  entrega: 'Elegir alcance',
  limites: 'Diseñar pruebas',
  'tabla-pruebas': 'Tabla de pruebas',
  'romper-formulario': 'Simulador',
  'formulario-friccion': 'Simulador',
  'mejora-interfaz': 'Simulador',
  'simulador-moore': 'Simulador',
  predice: 'Predecir y comprobar',
  'datos-necesarios': 'Decidir sobre datos',
  traza: 'Seguir variables',
  algoritmo: 'Armar algoritmo',
  completar: 'Completar pseudocódigo',
  pseudo: 'Escribir pseudocódigo',
  'clase-objeto': 'Clases y objetos',
  taller: 'Taller en clase',
  secuencia: 'Reto integrador',
}

export function MarcoActividad({ actividad, ctrl, glosario, children, numero }) {
  const estado = ctrl.mejor?.estado
  return (
    <article
      className={`actividad actividad--${estado ?? 'nueva'}`}
      id={ctrl.id}
      aria-labelledby={`${ctrl.id}-titulo`}
    >
      <header className="actividad__cabecera">
        <div className="actividad__etiquetas">
          {numero && <span className="actividad__numero">{numero}</span>}
          <span className="chip chip--tipo">{ETIQUETA_TIPO[actividad.tipo] ?? 'Actividad'}</span>
          {actividad.nivel === 'opcional' && (
            <span className="chip chip--opcional">Desafío opcional</span>
          )}
          {actividad.puntos > 0 && <span className="chip chip--puntos">{actividad.puntos} pts</span>}
          {estado && (
            <span className={`chip chip--estado chip--${estado}`}>{ETIQUETA_ESTADO[estado]}</span>
          )}
        </div>
        <h3 className="actividad__titulo" id={`${ctrl.id}-titulo`}>
          {actividad.titulo}
        </h3>
      </header>

      <dl className="ficha">
        {actividad.objetivo && (
          <div className="ficha__fila">
            <dt>Objetivo</dt>
            <dd>{actividad.objetivo}</dd>
          </div>
        )}
        {actividad.conceptoPrevio && (
          <div className="ficha__fila">
            <dt>Necesitas saber</dt>
            <dd>{actividad.conceptoPrevio}</dd>
          </div>
        )}
      </dl>

      {actividad.instrucciones && (
        <p className="actividad__instrucciones">
          <Termino texto={actividad.instrucciones} glosario={glosario} />
        </p>
      )}

      {actividad.aviso && <p className="aviso aviso--nota">{actividad.aviso}</p>}

      <div className="actividad__cuerpo">{children}</div>

      <Pistas ctrl={ctrl} />
      <Resultado ctrl={ctrl} actividad={actividad} />
    </article>
  )
}

/* --------------------------------- pistas --------------------------------- */

export function Pistas({ ctrl }) {
  if (ctrl.pistas.length === 0) return null
  return (
    <div className="pistas">
      {ctrl.pistasAbiertas > 0 && (
        <ol className="pistas__lista">
          {ctrl.pistas.slice(0, ctrl.pistasAbiertas).map((p, i) => (
            <li key={i} className="pistas__item">
              <span className="pistas__numero">Pista {i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      )}
      {ctrl.hayMasPistas && !ctrl.acertado && (
        <button type="button" className="boton boton--texto" onClick={ctrl.abrirPista}>
          {ctrl.pistasAbiertas === 0 ? 'Ver una pista' : 'Ver otra pista'}
          <span className="boton__nota"> · cada pista resta 20 % del puntaje</span>
        </button>
      )}
      {!ctrl.hayMasPistas && ctrl.pistasAbiertas > 0 && !ctrl.acertado && (
        <p className="pistas__fin">No quedan más pistas. La explicación completa aparece al resolverlo.</p>
      )}
    </div>
  )
}

/* -------------------------------- resultado ------------------------------- */

export function Resultado({ ctrl, actividad }) {
  if (!ctrl.resultado) {
    return (
      <p className="valor-siguiente">
        Si lo resuelves ahora vale <strong>{ctrl.valorSiguiente}</strong> de {actividad.puntos} puntos.
        {ctrl.pistasAbiertas > 0 && ` (${ctrl.pistasAbiertas} pista${ctrl.pistasAbiertas > 1 ? 's' : ''} abierta${ctrl.pistasAbiertas > 1 ? 's' : ''})`}
        {ctrl.intentosFallidos > 0 && ` (${ctrl.intentosFallidos} intento${ctrl.intentosFallidos > 1 ? 's' : ''} fallido${ctrl.intentosFallidos > 1 ? 's' : ''})`}
      </p>
    )
  }

  const { correcto, mensaje, detalle } = ctrl.resultado
  return (
    <div className={correcto ? 'resultado resultado--ok' : 'resultado resultado--mal'} role="status">
      <p className="resultado__titulo">
        <span aria-hidden="true">{correcto ? '✓' : '✗'}</span>
        {correcto ? 'Correcto' : 'Todavía no'}
      </p>
      {mensaje && <p className="resultado__mensaje">{mensaje}</p>}
      {detalle}
      {correcto && actividad.explicacion && (
        <div className="explicacion">
          <p className="explicacion__titulo">Por qué</p>
          <p>{actividad.explicacion}</p>
        </div>
      )}
      <EstadoGuardado ctrl={ctrl} />
      {!correcto && (
        <button type="button" className="boton boton--principal" onClick={ctrl.reintentar}>
          Volver a intentarlo
        </button>
      )}
    </div>
  )
}

/* --------------------------- estado de guardado --------------------------- */

export function EstadoGuardado({ ctrl }) {
  if (!ctrl.avisoGuardado) return null
  if (ctrl.avisoGuardado === 'guardado') {
    return <p className="guardado guardado--ok">Guardado</p>
  }
  if (ctrl.avisoGuardado === 'pendiente') {
    return (
      <p className="guardado guardado--pendiente">
        Pendiente de sincronización. Tu resultado quedó en cola y se reintenta solo; no se perderá,
        pero todavía no está en el servidor.
      </p>
    )
  }
  return <p className="guardado guardado--error">No se pudo guardar: {ctrl.avisoGuardado}</p>
}

/* ------------------------------- utilidades ------------------------------- */

/** Mezcla determinista: el mismo id siempre produce el mismo desorden. */
export function mezclar(lista, semilla) {
  let s = 0
  for (const c of String(semilla)) s = (s * 31 + c.charCodeAt(0)) % 100000
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648
    const j = s % (i + 1)
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function normalizarRespuesta(v) {
  return String(v)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/%$/, '')
    .replace(/\.$/, '')
    .trim()
}

/** Compara respuesta numérica con tolerancia, aceptando coma o punto decimal. */
export function coincideNumero(valor, esperado, tolerancia = 0) {
  const n = Number(String(valor).trim().replace(',', '.').replace(/\s/g, '').replace(/\.$/, ''))
  const e = Number(String(esperado).trim().replace(',', '.'))
  if (Number.isNaN(n) || Number.isNaN(e)) return false
  return Math.abs(n - e) <= tolerancia + 1e-9
}
