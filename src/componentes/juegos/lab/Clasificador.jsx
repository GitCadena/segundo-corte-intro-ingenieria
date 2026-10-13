import { useState } from 'react'

/**
 * Tablero de arrastre reutilizable: piezas sueltas arriba, zonas abajo.
 * Se puede arrastrar, o elegir la pieza y tocar «Colocar aquí» (alternativa
 * accesible al arrastre). No decide qué es correcto: solo muestra el estado
 * que le dan, así la lógica queda en src/lib/labCdvs.js.
 */
export default function Clasificador({
  items,
  zonas,
  colocadas,
  retro = {},
  revisiones = 0,
  bloqueado = false,
  onColocar,
  onDevolver,
  titulo = 'Piezas por ubicar',
}) {
  const [seleccion, setSeleccion] = useState(null)
  const sinColocar = items.filter((it) => colocadas[it.id] === undefined)

  function soltar(e, zonaId) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (items.some((it) => it.id === id)) {
      onColocar(id, zonaId)
      setSeleccion(null)
    }
  }

  function soltarEnBanco(e) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (items.some((it) => it.id === id)) onDevolver(id)
  }

  return (
    <div className="lab-clas">
      <div className="lab-clas__banco" onDragOver={(e) => e.preventDefault()} onDrop={soltarEnBanco}>
        <p className="etiqueta-campo">
          {titulo} ({sinColocar.length})
        </p>
        <div className="lab-clas__piezas">
          {sinColocar.map((it) => (
            <button
              key={it.id}
              type="button"
              className={'lab-pieza' + (seleccion === it.id ? ' lab-pieza--elegida' : '')}
              draggable={!bloqueado}
              disabled={bloqueado}
              aria-pressed={seleccion === it.id}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', it.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onClick={() => setSeleccion((s) => (s === it.id ? null : it.id))}
            >
              {it.texto}
            </button>
          ))}
          {sinColocar.length === 0 && <p className="lab-clas__vacio">Todas las piezas están ubicadas.</p>}
        </div>
      </div>

      <div className="lab-clas__zonas">
        {zonas.map((z) => {
          const dentro = items.filter((it) => colocadas[it.id] === z.id)
          return (
            <section key={z.id} className="lab-zona" aria-label={z.titulo}>
              <header className="lab-zona__cabecera">
                <h4>{z.titulo}</h4>
                <span className="lab-zona__conteo">{dentro.length}</span>
              </header>
              {z.ayuda && <p className="lab-zona__ayuda">{z.ayuda}</p>}
              <div className="lab-zona__lista" onDragOver={(e) => e.preventDefault()} onDrop={(e) => soltar(e, z.id)}>
                {dentro.map((it) => {
                  const estado = retro[it.id]
                  const habitual = zonas.find((x) => x.id === it.zona)?.titulo
                  return (
                    <div key={it.id} className="lab-colocada">
                      <p>{it.texto}</p>
                      {bloqueado && it.porque && (
                        <p className="lab-colocada__nota">
                          {estado === 'ok' && `Coincide con lo más habitual. ${it.porque}`}
                          {estado === 'alt' && `También se puede defender aquí. Lo más habitual es «${habitual}». ${it.porque}`}
                          {estado === 'otra' && `Es otra lectura posible. Lo más habitual es «${habitual}». ${it.porque}`}
                          {!estado && it.porque}
                        </p>
                      )}
                      {!bloqueado && (
                        <button type="button" className="boton boton--texto" onClick={() => onDevolver(it.id)}>
                          Quitar
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <button
                type="button"
                className="boton boton--secundario boton--pequeno lab-zona__colocar"
                disabled={seleccion === null || bloqueado}
                onClick={() => {
                  onColocar(seleccion, z.id)
                  setSeleccion(null)
                }}
              >
                Colocar aquí
              </button>
            </section>
          )
        })}
      </div>
    </div>
  )
}
