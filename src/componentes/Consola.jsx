import { useState } from 'react'
import { ejecutarSeguro } from '../lib/pseudo.js'
import Editor from './Editor.jsx'

/**
 * Consola de pseudocódigo: editar, dar entradas, ejecutar, ver la salida, el
 * error señalado por línea y la evolución de las variables.
 *
 * El código del estudiante nunca se evalúa con eval ni con new Function: lo
 * interpreta lib/pseudo.js, que además corta la ejecución si un ciclo no
 * termina, para que un error no congele la pestaña.
 */
export default function Consola({ codigoInicial, entradasIniciales = '', compacta = false, alCambiarCodigo }) {
  const [codigo, setCodigo] = useState(codigoInicial)
  const [entradas, setEntradas] = useState(entradasIniciales)
  const [resultado, setResultado] = useState(null)
  const [verTraza, setVerTraza] = useState(false)

  function cambiar(v) {
    setCodigo(v)
    alCambiarCodigo?.(v)
  }

  function correr() {
    const datos = entradas
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '')
    setResultado(ejecutarSeguro(codigo, datos, { traza: true }))
  }

  function reiniciar() {
    cambiar(codigoInicial)
    setEntradas(entradasIniciales)
    setResultado(null)
  }

  const lineas = codigo.split('\n')

  return (
    <div className={compacta ? 'consola consola--compacta' : 'consola'}>
      <div className="consola__editor">
        <label className="etiqueta-campo" htmlFor="consola-codigo">
          Pseudocódigo
        </label>
        <Editor id="consola-codigo" valor={codigo} alCambiar={cambiar} etiqueta="Editor de pseudocódigo" filas={compacta ? 10 : 18} />
      </div>

      <div className="consola__lateral">
        <label className="etiqueta-campo" htmlFor="consola-entradas">
          Datos de entrada, uno por línea
        </label>
        <textarea
          id="consola-entradas"
          className="editor editor--entradas"
          spellCheck="false"
          value={entradas}
          onChange={(e) => setEntradas(e.target.value)}
          rows={compacta ? 4 : 6}
          placeholder={'Mateo\n5'}
        />
        <div className="acciones">
          <button className="boton boton--principal" onClick={correr} type="button">
            Ejecutar
          </button>
          <button className="boton boton--texto" onClick={reiniciar} type="button">
            Reiniciar
          </button>
        </div>

        <div className="salida" aria-live="polite">
          <p className="etiqueta-campo">Salida</p>
          {resultado === null && <p className="salida__vacia">La salida del algoritmo aparece aquí.</p>}
          {resultado?.ok && resultado.salida.length === 0 && (
            <p className="salida__vacia">El algoritmo corrió sin escribir nada.</p>
          )}
          {resultado?.ok &&
            resultado.salida.map((linea, i) => (
              <p key={i} className="salida__linea">
                {linea}
              </p>
            ))}
          {resultado && !resultado.ok && (
            <div className="salida__error" role="alert">
              <p>{resultado.error}</p>
              {resultado.linea && lineas[resultado.linea - 1] !== undefined && (
                <figure className="salida__contexto">
                  <figcaption>Línea {resultado.linea}</figcaption>
                  <pre>
                    {resultado.linea > 1 && (
                      <span className="salida__contexto-linea">
                        {resultado.linea - 1} {lineas[resultado.linea - 2]}
                      </span>
                    )}
                    <span className="salida__contexto-linea salida__contexto-linea--mala">
                      {resultado.linea} {lineas[resultado.linea - 1]}
                    </span>
                    {lineas[resultado.linea] !== undefined && (
                      <span className="salida__contexto-linea">
                        {resultado.linea + 1} {lineas[resultado.linea]}
                      </span>
                    )}
                  </pre>
                </figure>
              )}
            </div>
          )}
        </div>

        {resultado?.ok && resultado.traza.length > 0 && (
          <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => setVerTraza((v) => !v)}>
            {verTraza ? 'Ocultar las variables' : `Ver las variables paso a paso (${resultado.traza.length})`}
          </button>
        )}
      </div>

      {verTraza && resultado?.ok && <Traza traza={resultado.traza} llena={resultado.trazaLlena} />}
    </div>
  )
}

function Traza({ traza, llena }) {
  const vars = Object.keys(traza[traza.length - 1]?.variables ?? {})
  return (
    <div className="consola__traza">
      <p className="etiqueta-campo">Evolución de las variables</p>
      <div className="tabla-envoltura">
        <table className="tabla tabla--traza">
          <thead>
            <tr>
              <th scope="col">Paso</th>
              <th scope="col">Línea</th>
              <th scope="col">Instrucción</th>
              {vars.map((v) => (
                <th key={v} scope="col">
                  <code>{v}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {traza.map((p, i) => {
              const previo = traza[i - 1]?.variables ?? {}
              return (
                <tr key={i}>
                  <td>{p.paso}</td>
                  <td>{p.linea}</td>
                  <td>
                    <code>{p.instruccion}</code>
                  </td>
                  {vars.map((v) => {
                    const valor = p.variables[v] ?? '—'
                    const cambio = (previo[v] ?? '—') !== valor
                    return (
                      <td key={v} className={cambio ? 'celda--cambio' : ''}>
                        {valor}
                        {cambio && <span className="visualmente-oculto"> (cambió en este paso)</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {llena && (
        <p className="aviso aviso--nota">
          La traza se cortó al llegar al límite de pasos registrados. El algoritmo sí terminó de
          ejecutarse; solo se muestran los primeros pasos.
        </p>
      )}
    </div>
  )
}
