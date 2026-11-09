import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { almacenTc, fijarUsuarioDemo, modoDemostracionTc } from '../lib/almacenTc.js'
import { useSesion } from '../../estado/SesionProvider.jsx'
import { csvFicha3, descargarPdf, descargarTexto, pdfFicha3 } from '../lib/exportar.js'
import Ficha3 from './Ficha3.jsx'
import './tercer-corte.css'

const INTERVALO = 10000

const formatearHora = (iso) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

const textoEstado = (f) => (!f ? 'Sin empezar' : f.estado === 'entregada' ? 'Entregada' : 'En progreso')
const nombreArchivo = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()

/** Lista de equipos con el estado de cada ficha, actualizada cada pocos segundos. */
export default function DocenteTercerCorte() {
  const { perfil } = useSesion()
  const [equipos, setEquipos] = useState(null)
  const [error, setError] = useState(null)
  const [exportando, setExportando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      if (modoDemostracionTc) fijarUsuarioDemo(perfil)
      setEquipos(await almacenTc.listado())
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [perfil])

  useEffect(() => {
    cargar()
    const id = setInterval(cargar, INTERVALO)
    return () => clearInterval(id)
  }, [cargar])

  async function exportarCsv() {
    setExportando(true)
    try {
      const filas = []
      for (const e of equipos) {
        const f = await almacenTc.obtenerFicha(e.id, 3)
        filas.push({ equipo: e.nombre, miembros: e.miembros, estado: f.estado, entregada_en: f.entregada_en, contenido: f.contenido })
      }
      descargarTexto('tercer-corte-ficha-3.csv', csvFicha3(filas))
    } catch (e) {
      setError(e.message)
    } finally {
      setExportando(false)
    }
  }

  async function exportarPdf(e) {
    try {
      const f = await almacenTc.obtenerFicha(e.id, 3)
      descargarPdf(
        pdfFicha3({ equipo: e.nombre, miembros: e.miembros, estado: f.estado, contenido: f.contenido }),
        `ficha-3-${nombreArchivo(e.nombre)}.pdf`,
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const entregadas = (n) => (equipos ?? []).filter((e) => e.fichas.find((f) => f.ficha === n)?.estado === 'entregada').length

  return (
    <div className="tc">
      <header>
        <p className="panel__saludo">Tercer corte · docente</p>
        <h1>Equipos y fichas</h1>
        <p className="tc-objetivo">
          Se actualiza sola cada pocos segundos. Abra la ficha de un equipo para leerla, dejar comentarios por sección o reabrirla.
        </p>
      </header>

      {error && <p className="aviso aviso--error tc-aviso" role="alert">{error}</p>}
      {equipos === null && !error && <p className="cargando" role="status">Cargando equipos…</p>}

      {equipos && (
        <>
          <div className="cifras">
            <div className="cifra">
              <span className="cifra__valor">{equipos.length}</span>
              <span className="cifra__etiqueta">equipos</span>
            </div>
            <div className="cifra">
              <span className="cifra__valor">{entregadas(3)}<span className="cifra__de">/{equipos.length}</span></span>
              <span className="cifra__etiqueta">fichas 3 entregadas</span>
            </div>
            <div className="cifra">
              <span className="cifra__valor">{entregadas(4)}<span className="cifra__de">/{equipos.length}</span></span>
              <span className="cifra__etiqueta">fichas 4 entregadas</span>
            </div>
          </div>

          <div className="tc-acciones">
            <button type="button" className="boton boton--secundario" onClick={exportarCsv} disabled={exportando || equipos.length === 0}>
              {exportando ? 'Preparando…' : 'Exportar ficha 3 a CSV'}
            </button>
          </div>

          {equipos.length === 0 ? (
            <p className="vacio-util">Todavía no hay equipos. Aparecerán aquí cuando los estudiantes los creen.</p>
          ) : (
            <div className="tabla-envoltura">
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Proyecto</th>
                    <th scope="col">Integrantes</th>
                    <th scope="col">Ficha 3</th>
                    <th scope="col">Ficha 4</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map((e) => {
                    const f3 = e.fichas.find((f) => f.ficha === 3)
                    const f4 = e.fichas.find((f) => f.ficha === 4)
                    return (
                      <tr key={e.id}>
                        <th scope="row">{e.nombre}<br /><span className="tc-ultimo">Código {e.codigo}</span></th>
                        <td>
                          {e.miembros.map((m, i) => (
                            <div key={i}>{m.apellidos}, {m.nombres}{m.grupo ? <span className="tc-ultimo"> · {m.grupo}</span> : null}</div>
                          ))}
                        </td>
                        <td>
                          <span className={`chip ${f3?.estado === 'entregada' ? 'chip--tipo' : ''}`}>{textoEstado(f3)}</span>
                          <br /><span className="tc-ultimo">{formatearHora(f3?.actualizado_en)}</span>
                        </td>
                        <td>
                          <span className={`chip ${f4?.estado === 'entregada' ? 'chip--tipo' : ''}`}>{textoEstado(f4)}</span>
                        </td>
                        <td>
                          <div className="tc-acciones">
                            <Link className="boton boton--pequeno boton--principal" to={`/tercer-corte/docente/${e.id}/ficha/3`}>Abrir ficha 3</Link>
                            <button type="button" className="boton boton--pequeno boton--texto" onClick={() => exportarPdf(e)}>PDF</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/** Ruta /tercer-corte/docente/:equipoId/ficha/:n */
export function FichaParaDocente() {
  const { equipoId, n } = useParams()
  const [equipo, setEquipo] = useState(undefined)

  useEffect(() => {
    let vivo = true
    almacenTc.listado().then((lista) => {
      if (vivo) setEquipo(lista.find((e) => e.id === equipoId) ?? null)
    })
    return () => {
      vivo = false
    }
  }, [equipoId])

  if (equipo === undefined) return <p className="cargando" role="status">Cargando…</p>
  if (!equipo || n !== '3') {
    return (
      <p className="vacio-util">
        No se encontró esa ficha. <Link to="/tercer-corte/docente">Volver a la lista</Link>
      </p>
    )
  }
  return <Ficha3 equipo={{ id: equipo.id, nombre: equipo.nombre, miembros: equipo.miembros }} modo="docente" />
}
