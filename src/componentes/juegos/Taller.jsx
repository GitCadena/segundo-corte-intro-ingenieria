import { useEffect, useRef, useState } from 'react'
import { useProgreso } from '../../estado/ProgresoProvider.jsx'

/**
 * Taller en clase.
 *
 * No lo califica la aplicación: es un entregable físico o de la plataforma del
 * curso. Lo que sí hace es guardar el trabajo como borrador para que no se
 * pierda, con estado de guardado visible, y mostrar la rúbrica desde el
 * principio para que el estudiante sepa con qué se le va a evaluar.
 */
export default function Taller({ actividad, ctrl }) {
  const { borradores, guardarBorrador } = useProgreso()
  const guardado = borradores[actividad.id]?.contenido ?? {}
  const [valores, setValores] = useState(guardado.campos ?? {})
  const [marcas, setMarcas] = useState(guardado.marcas ?? {})
  const [estado, setEstado] = useState('inactivo')
  const temporizador = useRef(null)
  const primeraCarga = useRef(true)

  // Autoguardado con retardo: no se escribe en cada tecla.
  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false
      return undefined
    }
    setEstado('guardando')
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(async () => {
      const r = await guardarBorrador(actividad.id, { campos: valores, marcas })
      setEstado(r.ok ? 'guardado' : 'pendiente')
    }, 900)
    return () => clearTimeout(temporizador.current)
  }, [valores, marcas, actividad.id, guardarBorrador])

  const entregado = ctrl.mejor?.estado === 'completada' || ctrl.mejor?.estado === 'dominada'
  const listaCompleta = actividad.listaChequeo.every((_, i) => marcas[i])
  const camposLlenos = actividad.campos.every((c) => c.opcional || (valores[c.id] ?? '').trim() !== '')

  async function marcarEntregado() {
    await guardarBorrador(actividad.id, { campos: valores, marcas })
    await ctrl.enviar(true, { datos: { entregado: true } })
  }

  return (
    <div className="juego juego--taller">
      <p className="enunciado">{actividad.enunciado}</p>

      {actividad.ideas && (
        <details className="ideas-inspiracion">
          <summary>¿No se te ocurre nada? Ideas de arranque (no es obligatorio usarlas)</summary>
          <ul>
            {actividad.ideas.map((idea, i) => (
              <li key={i}>
                <strong>{idea.titulo}.</strong> {idea.contexto}
              </li>
            ))}
          </ul>
        </details>
      )}

      {actividad.temas && (
        <div className="temas">
          <p className="etiqueta-campo">Temas para repartir entre los grupos</p>
          <ol>
            {actividad.temas.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="taller__campos">
        {actividad.campos.map((c) => (
          <label key={c.id} className="taller__campo">
            <span className="etiqueta-campo">{c.etiqueta}</span>
            <textarea
              className={c.mono ? 'editor' : 'campo campo--area'}
              rows={c.filas ?? 3}
              spellCheck={!c.mono}
              value={valores[c.id] ?? ''}
              onChange={(e) => setValores((p) => ({ ...p, [c.id]: e.target.value }))}
            />
          </label>
        ))}
      </div>

      <p className={`guardado guardado--${estado === 'guardado' ? 'ok' : estado === 'pendiente' ? 'pendiente' : 'proceso'}`}>
        {estado === 'guardando' && 'Guardando borrador…'}
        {estado === 'guardado' && 'Borrador guardado. Puedes cerrar y continuar después.'}
        {estado === 'pendiente' && 'Pendiente de sincronización: el borrador quedó en este navegador y se reintentará.'}
        {estado === 'inactivo' && (borradores[actividad.id] ? 'Borrador recuperado de tu última sesión.' : 'El borrador se guarda solo mientras escribes.')}
      </p>

      <div className="taller__lista">
        <p className="etiqueta-campo">Lista de chequeo antes de entregar</p>
        <ul className="checklist">
          {actividad.listaChequeo.map((t, i) => (
            <li key={i}>
              <label>
                <input
                  type="checkbox"
                  checked={!!marcas[i]}
                  onChange={() => setMarcas((p) => ({ ...p, [i]: !p[i] }))}
                />
                <span>{t}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {actividad.rubrica && (
        <div className="taller__rubrica">
          <p className="etiqueta-campo">Con qué se les va a evaluar</p>
          <ul className="lista lista--rubrica">
            {actividad.rubrica.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="aviso aviso--nota">
        Este taller no lo califica la aplicación: el puntaje que ves en las demás actividades no lo
        incluye. Marca «entregado» para llevar tu propio control.
      </p>

      {!entregado ? (
        <button
          type="button"
          className="boton boton--principal"
          onClick={marcarEntregado}
          disabled={!listaCompleta || !camposLlenos || ctrl.enviando}
        >
          {!camposLlenos
            ? 'Completa todos los campos'
            : !listaCompleta
              ? 'Repasa la lista de chequeo'
              : 'Marcar como entregado'}
        </button>
      ) : (
        <p className="aviso aviso--ok">
          Marcado como entregado. Recuerda subirlo a la plataforma del curso: esta aplicación no lo
          envía.
        </p>
      )}
    </div>
  )
}
