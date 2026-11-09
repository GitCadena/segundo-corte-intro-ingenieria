import { useMemo, useState } from 'react'
import { ETIQUETA_DE_TIPO, LIMITE_FILAS, claveDeCelda, claveDeCondicion, construirTabla, respuestasCorrectas, revisarTabla } from '../lib/pruebaGuiada.js'

const leerGuardadas = (c, firma) => {
  if (c.tabla_firma !== firma) return {}
  try {
    return JSON.parse(c.tabla_resp || '{}')
  } catch {
    return {}
  }
}

/**
 * Prueba de escritorio guiada, hecha con SU algoritmo y SU caso: una fila por
 * línea que se ejecuta y una casilla donde la línea cambia una variable. El
 * equipo anota lo que cree que vale cada variable y la página lo comprueba.
 * Se usa con `key={firma}` para que se reinicie si cambian el pseudocódigo o el caso.
 */
export default function TablaGuiada({ c, f, bloqueada, pasos, firma, marcarTerminada }) {
  const tabla = useMemo(() => construirTabla(pasos), [pasos])
  const [resp, setResp] = useState(() => leerGuardadas(c, firma))
  const terminada = c.prueba_terminada === firma
  const [resultado, setResultado] = useState(() => (terminada ? revisarTabla(tabla, leerGuardadas(c, firma)) : null))
  const [comprobaciones, setComprobaciones] = useState(0)
  const conAyuda = terminada && c.prueba_ayuda === 'si'

  const llenas = Object.keys(resp).filter((k) => String(resp[k]).trim() !== '').length
  const cambiar = (clave, valor) => {
    if (bloqueada) return
    const nuevas = { ...resp, [clave]: valor }
    setResp(nuevas)
    setResultado(null)
    f.cambiar('tabla_resp', JSON.stringify(nuevas))
    f.cambiar('tabla_firma', firma)
    if (terminada) f.cambiar('prueba_terminada', '')
  }

  function comprobar() {
    const r = revisarTabla(tabla, resp)
    setResultado(r)
    setComprobaciones((n) => n + 1)
    if (r.todas) {
      f.cambiar('prueba_ayuda', '')
      marcarTerminada()
    }
  }
  function mostrarCorrecta() {
    const todas = respuestasCorrectas(tabla)
    setResp(todas)
    setResultado(revisarTabla(tabla, todas))
    f.cambiar('tabla_resp', JSON.stringify(todas))
    f.cambiar('tabla_firma', firma)
    f.cambiar('prueba_ayuda', 'si')
    marcarTerminada()
  }
  function reiniciar() {
    setResp({})
    setResultado(null)
    setComprobaciones(0)
    f.cambiar('tabla_resp', '{}')
    f.cambiar('tabla_firma', firma)
    f.cambiar('prueba_terminada', '')
    f.cambiar('prueba_ayuda', '')
  }

  if (tabla.filas.length === 0) return null
  const infoFila = (fila) => (fila.contexto ? <span className="tc-fila__contexto">{fila.contexto}</span> : null)

  return (
    <div className="tc-guiada">
      <ol className="tc-como" aria-label="Cómo se hace">
        <li>Lee la línea de cada fila: es la que se ejecuta en ese paso.</li>
        <li>
          Anota <strong>cuánto vale la variable después de ejecutarla</strong>. Solo hay casilla donde la línea cambia algo; lo demás se conserva y ya está escrito.
        </li>
        <li>En las filas con una condición (SI, MIENTRAS), di si se cumple o no con los valores que ya tienes.</li>
        <li>Cuando termines, pulsa «Comprobar mi tabla».</li>
      </ol>

      {tabla.truncado && (
        <p className="aviso aviso--nota" role="status">
          Con este caso el algoritmo hace {tabla.total} pasos. Para la tabla se usan los primeros {LIMITE_FILAS}; si prefieren una prueba más corta, bajen los valores
          del caso (por ejemplo, menos productos o un número más pequeño).
        </p>
      )}

      <div className="tabla-envoltura">
        <table className="tabla tc-tabla-guiada">
          <thead>
            <tr>
              <th scope="col">Paso</th>
              <th scope="col">Línea que se ejecuta</th>
              <th scope="col">¿Se cumple la condición?</th>
              {tabla.columnas.map((col) => (
                <th key={col} scope="col" className="tc-guiada__variable">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.filas.map((fila) => {
              const kc = claveDeCondicion(fila.indice)
              const veredictoCond = resultado ? resultado.ok[kc] : null
              return (
                <tr key={fila.indice}>
                  <th scope="row">{fila.paso}</th>
                  <td>
                    <code className="tc-linea-codigo"><span className="tc-linea-codigo__n">{fila.linea}</span>{fila.texto}</code>
                    <span className="tc-fila__tipo">{ETIQUETA_DE_TIPO[fila.tipo]}</span>
                    {infoFila(fila)}
                  </td>
                  <td>
                    {fila.cond ? (
                      <select
                        className={`campo campo--celda${veredictoCond === true ? ' campo--ok' : veredictoCond === false ? ' campo--mal' : ''}`}
                        aria-label={`¿Se cumple la condición del paso ${fila.paso}?`}
                        disabled={bloqueada}
                        value={resp[kc] ?? ''}
                        onChange={(e) => cambiar(kc, e.target.value)}
                      >
                        <option value="">—</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      <span className="tc-celda-gris">—</span>
                    )}
                  </td>
                  {tabla.columnas.map((col) => {
                    const celda = fila.celdas[col]
                    if (celda.modo === 'sin') return <td key={col}><span className="tc-celda-gris">—</span></td>
                    if (celda.modo !== 'pedir') {
                      return (
                        <td key={col}>
                          <span className="tc-celda-gris" title={celda.modo === 'dado' ? 'Viene del caso de prueba' : 'No cambia en esta línea'}>{celda.valor}</span>
                        </td>
                      )
                    }
                    const k = claveDeCelda(fila.indice, col)
                    const v = resultado ? resultado.ok[k] : null
                    return (
                      <td key={col}>
                        <input
                          className={`campo campo--celda${v === true ? ' campo--ok' : v === false ? ' campo--mal' : ''}`}
                          aria-label={`${col} después de la línea ${fila.linea} (paso ${fila.paso})`}
                          inputMode="decimal"
                          disabled={bloqueada}
                          value={resp[k] ?? ''}
                          onChange={(e) => cambiar(k, e.target.value)}
                        />
                        {v === false && (
                          <span className="tc-celda__pista">
                            {celda.antes !== undefined ? `Antes valía ${celda.antes}. ` : ''}Piensa qué hace «{fila.texto}».
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="tc-nota" aria-live="polite">
        {resultado
          ? `${resultado.buenas} de ${resultado.total} casillas correctas.`
          : `${Math.min(llenas, tabla.pedidas)} de ${tabla.pedidas} casillas llenas.`}
      </p>

      {!bloqueada && (
        <div className="tc-acciones">
          <button type="button" className="boton boton--principal" onClick={comprobar} disabled={llenas < tabla.pedidas}>
            {llenas < tabla.pedidas ? 'Llena todas las casillas para comprobar' : 'Comprobar mi tabla'}
          </button>
          {comprobaciones >= 2 && !terminada && (
            <button type="button" className="boton boton--texto" onClick={mostrarCorrecta}>Mostrar la tabla correcta</button>
          )}
          {llenas > 0 && <button type="button" className="boton boton--texto" onClick={reiniciar}>Borrar mi tabla</button>}
        </div>
      )}

      {resultado && !resultado.todas && (
        <p className="aviso aviso--nota" role="status">
          Las casillas en rojo no coinciden. Vuelve a seguir esa línea con lápiz: ¿qué valor tenía la variable antes y qué le hace la línea? Corrige y pulsa «Comprobar» otra vez.
        </p>
      )}
      {terminada && !conAyuda && (
        <p className="aviso aviso--ok" role="status">
          ✓ Tabla completa y correcta. Ahora comparen el resultado con el que calcularon a mano y pídanle a un compañero que la confirme.
        </p>
      )}
      {conAyuda && (
        <p className="aviso aviso--nota" role="status">Se completó con la ayuda de «mostrar la tabla correcta». El docente lo verá.</p>
      )}
    </div>
  )
}
