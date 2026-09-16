import { useRef } from 'react'

/**
 * Editor de pseudocódigo. Es un textarea deliberadamente simple:
 * funciona con teclado, con lector de pantalla y en un celular.
 * Tab inserta una tabulación en vez de saltar de campo, y Escape devuelve el
 * comportamiento normal de Tab para que nadie quede atrapado en el editor.
 */
export default function Editor({ valor, alCambiar, etiqueta, filas = 14, deshabilitado = false, id }) {
  const escapado = useRef(false)

  function alTeclear(e) {
    if (e.key === 'Escape') {
      escapado.current = true
      return
    }
    if (e.key !== 'Tab' || escapado.current) {
      escapado.current = false
      return
    }
    e.preventDefault()
    const el = e.target
    const inicio = el.selectionStart
    const fin = el.selectionEnd
    alCambiar(valor.slice(0, inicio) + '\t' + valor.slice(fin))
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = inicio + 1
    })
  }

  return (
    <div className="editor-envoltura">
      <textarea
        id={id}
        className="editor"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        rows={filas}
        value={valor}
        disabled={deshabilitado}
        aria-label={etiqueta}
        onKeyDown={alTeclear}
        onChange={(e) => alCambiar(e.target.value)}
      />
      <p className="editor__ayuda">
        Tab inserta una tabulación. Si necesitas salir del editor con el teclado, pulsa Escape y
        después Tab.
      </p>
    </div>
  )
}
