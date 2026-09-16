import { useState, useId } from 'react'
import glosario from '../data/glosario.js'

/**
 * Glosario contextual.
 *
 * Recibe un texto y una lista de claves del glosario. Subraya en el texto la
 * primera aparición del término de cada clave y la convierte en un botón que
 * despliega la definición sin sacar al estudiante de donde está.
 *
 * Se subraya solo la primera aparición: marcar todas convierte el párrafo en
 * un campo de minas y estorba más de lo que ayuda.
 */
export default function Termino({ texto, glosario: claves }) {
  if (!texto || !claves || claves.length === 0) return <>{texto}</>

  // Índice de alias → clave. Los alias permiten que "requisitos" active
  // la entrada "requisito" sin duplicar el diccionario.
  const alias = []
  for (const clave of claves) {
    const entrada = glosario[clave]
    if (!entrada) continue
    const base = entrada.termino.replace(/\s*\(.*\)\s*/g, '').trim()
    alias.push({ clave, texto: base })
    if (!base.endsWith('s')) alias.push({ clave, texto: `${base}s` })
  }
  alias.sort((a, b) => b.texto.length - a.texto.length)

  const usados = new Set()
  const piezas = []
  let resto = texto

  let seguridad = 0
  while (resto.length > 0 && seguridad++ < 60) {
    let mejor = null
    for (const a of alias) {
      if (usados.has(a.clave)) continue
      const i = indiceDePalabra(resto, a.texto)
      if (i >= 0 && (mejor === null || i < mejor.i)) mejor = { ...a, i }
    }
    if (!mejor) break
    usados.add(mejor.clave)
    piezas.push(resto.slice(0, mejor.i))
    piezas.push(
      <Definicion key={`${mejor.clave}-${mejor.i}`} clave={mejor.clave} visible={resto.substr(mejor.i, mejor.texto.length)} />,
    )
    resto = resto.slice(mejor.i + mejor.texto.length)
  }
  piezas.push(resto)

  return <>{piezas}</>
}

/** Busca el término respetando los límites de palabra, sin distinguir tildes ni mayúsculas. */
function indiceDePalabra(texto, termino) {
  const limpio = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const t = limpio(texto)
  const b = limpio(termino)
  let desde = 0
  for (;;) {
    const i = t.indexOf(b, desde)
    if (i < 0) return -1
    const antes = i === 0 ? ' ' : t[i - 1]
    const despues = t[i + b.length] ?? ' '
    if (!/[a-z0-9]/.test(antes) && !/[a-z0-9]/.test(despues)) return i
    desde = i + 1
  }
}

function Definicion({ clave, visible }) {
  const [abierto, setAbierto] = useState(false)
  const id = useId()
  const entrada = glosario[clave]
  if (!entrada) return <>{visible}</>

  return (
    <span className="termino">
      <button
        type="button"
        className="termino__disparador"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((a) => !a)}
      >
        {visible}
        <span className="termino__marca" aria-hidden="true">
          ?
        </span>
      </button>
      {abierto && (
        <span className="termino__panel" id={id} role="note">
          <span className="termino__nombre">{entrada.termino}</span>
          <span className="termino__definicion">{entrada.definicion}</span>
          {entrada.ejemplo && <span className="termino__ejemplo">Ejemplo: {entrada.ejemplo}</span>}
        </span>
      )}
    </span>
  )
}
