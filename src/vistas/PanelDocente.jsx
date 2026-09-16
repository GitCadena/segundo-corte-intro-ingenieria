import { useEffect, useMemo, useState } from 'react'
import { supabase, hayConfiguracion } from '../lib/supabase.js'
import { estaciones, catalogoActividades, puntosNota } from '../data/catalogo.js'
import glosario from '../data/glosario.js'

/**
 * Panel docente.
 *
 * Solo lee. Las políticas RLS de Supabase son las que limitan lo que ve: un
 * docente consulta únicamente los grupos donde está asignado en
 * `docente_grupos`. No hay ningún PIN ni bandera del frontend protegiendo esto:
 * si alguien abriera esta ruta sin permiso, el servidor devolvería cero filas.
 */
export default function PanelDocente() {
  const [filas, setFilas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [grupo, setGrupo] = useState('todos')
  const [estacion, setEstacion] = useState('todas')
  const [detalle, setDetalle] = useState(null)

  useEffect(() => {
    if (!hayConfiguracion) {
      setCargando(false)
      setError(
        'El panel docente necesita Supabase configurado: lee datos reales de estudiantes y no tiene versión de demostración.',
      )
      return
    }
    supabase
      .from('v_progreso_estudiante')
      .select('*')
      .then(({ data, error: e }) => {
        if (e) setError(e.message)
        else setFilas(data ?? [])
        setCargando(false)
      })
  }, [])

  const grupos = useMemo(
    () => Array.from(new Set(filas.map((f) => f.grupo).filter(Boolean))).sort(),
    [filas],
  )

  const filtradas = useMemo(
    () =>
      filas.filter(
        (f) =>
          (grupo === 'todos' || f.grupo === grupo) &&
          (estacion === 'todas' || f.estacion_id === estacion),
      ),
    [filas, grupo, estacion],
  )

  const estudiantes = useMemo(() => agruparPorEstudiante(filtradas), [filtradas])
  const dificultades = useMemo(() => calcularDificultades(filtradas), [filtradas])

  if (cargando) return <p className="cargando" role="status">Cargando datos del grupo…</p>

  if (error) {
    return (
      <section className="vacio">
        <h1>Panel docente</h1>
        <p className="aviso aviso--error">{error}</p>
      </section>
    )
  }

  return (
    <div className="docente">
      <header className="docente__cabecera">
        <h1>Panel docente</h1>
        <p>
          Datos reales de los grupos que tienes asignados. Si no ves un grupo que deberías ver, hay
          que agregarte en la tabla <code>docente_grupos</code>: la restricción la aplica el
          servidor, no esta pantalla.
        </p>
      </header>

      <section className="docente__filtros">
        <label>
          <span>Grupo</span>
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
            <option value="todos">Todos ({grupos.length})</option>
            {grupos.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Estación</span>
          <select value={estacion} onChange={(e) => setEstacion(e.target.value)}>
            <option value="todas">Todas</option>
            {estaciones.map((e) => (
              <option key={e.id} value={e.id}>{e.orden}. {e.titulo}</option>
            ))}
          </select>
        </label>
        <button type="button" className="boton boton--secundario" onClick={() => exportarCSV(filtradas)}>
          Exportar CSV ({filtradas.length} filas)
        </button>
      </section>

      {estudiantes.length === 0 ? (
        <p className="vacio-util">
          No hay estudiantes en este filtro. Si el curso acaba de empezar, aparecerán en cuanto se
          registren: la vista lista a todos los estudiantes de tus grupos, hayan enviado algo o no.
        </p>
      ) : (
        <>
          <section className="docente__seccion">
            <h2 className="titulo-seccion">Estudiantes ({estudiantes.length})</h2>
            <div className="tabla-envoltura">
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Estudiante</th>
                    <th scope="col">Grupo</th>
                    <th scope="col">Completadas</th>
                    <th scope="col">Con dominio</th>
                    <th scope="col">Pendientes</th>
                    <th scope="col">Puntos base</th>
                    <th scope="col">Nota orientativa</th>
                    <th scope="col">Intentos</th>
                    <th scope="col">Pistas</th>
                    <th scope="col">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((e) => (
                    <tr key={e.perfil_id}>
                      <th scope="row">
                        {e.apellidos}, {e.nombres}
                        {e.codigo_estudiantil && <span className="docente__codigo">{e.codigo_estudiantil}</span>}
                      </th>
                      <td>{e.grupo ?? '—'}</td>
                      <td>{e.completadas} de {e.totalPuntuables}</td>
                      <td>{e.dominadas}</td>
                      <td>{e.pendientes}</td>
                      <td>{e.puntosNota} de {e.puntosNotaMax}</td>
                      <td>{e.nota.toFixed(1)}</td>
                      <td>{e.intentos}</td>
                      <td>{e.pistas}</td>
                      <td>
                        <button type="button" className="boton boton--texto" onClick={() => setDetalle(e)}>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="docente__seccion">
            <h2 className="titulo-seccion">Actividades que más se atascan</h2>
            <p className="panel__nota">
              Ordenadas por porcentaje de estudiantes que la intentaron y no la completaron. Solo se
              listan las que alguien ha intentado.
            </p>
            <div className="tabla-envoltura">
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Actividad</th>
                    <th scope="col">Estación</th>
                    <th scope="col">La intentaron</th>
                    <th scope="col">La completaron</th>
                    <th scope="col">Sin resolver</th>
                    <th scope="col">Pistas por estudiante</th>
                  </tr>
                </thead>
                <tbody>
                  {dificultades.actividades.slice(0, 15).map((a) => (
                    <tr key={a.id}>
                      <th scope="row">{a.titulo}</th>
                      <td>{estaciones.find((e) => e.id === a.estacion_id)?.titulo}</td>
                      <td>{a.intentaron}</td>
                      <td>{a.completaron}</td>
                      <td>
                        {a.sinResolver} ({a.intentaron === 0 ? 0 : Math.round((a.sinResolver / a.intentaron) * 100)} %)
                      </td>
                      <td>{a.pistasPromedio.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="docente__seccion">
            <h2 className="titulo-seccion">Conceptos con más dificultad</h2>
            <p className="panel__nota">
              Esto es una <strong>inferencia</strong>, no una medición: se cuenta cuántas veces un
              concepto aparece etiquetado en actividades que quedaron sin completar o que se
              resolvieron con pistas. No mide directamente si el estudiante entiende el concepto.
            </p>
            <ul className="repaso">
              {dificultades.conceptos.slice(0, 8).map((c) => (
                <li key={c.concepto}>
                  <p className="repaso__concepto">
                    {glosario[c.concepto]?.termino ?? c.concepto}
                    <span className="repaso__cifra">{c.casos} casos</span>
                  </p>
                  <p className="repaso__definicion">{glosario[c.concepto]?.definicion}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {detalle && <DetalleEstudiante estudiante={detalle} cerrar={() => setDetalle(null)} />}

      <section className="docente__seccion explicacion">
        <p className="explicacion__titulo">Cómo se calculan estas métricas</p>
        <ul className="lista">
          <li><strong>Completadas:</strong> actividades con estado «completada» o «dominio demostrado».</li>
          <li><strong>Con dominio:</strong> resueltas al primer intento y sin abrir pistas.</li>
          <li><strong>Puntos base y nota orientativa:</strong> solo actividades de nivel base ({puntosNota} puntos posibles). Se excluyen los desafíos opcionales, los talleres y el laboratorio. Nota = puntos ÷ posibles × 5,0.</li>
          <li><strong>Intentos:</strong> suma de envíos registrados, incluidos los fallidos.</li>
          <li><strong>Pistas:</strong> suma del mínimo de pistas con que cada actividad quedó resuelta.</li>
          <li>El puntaje de cada intento lo calcula el servidor a partir del catálogo, no el navegador del estudiante.</li>
        </ul>
      </section>
    </div>
  )
}

/* ------------------------------ agregaciones ------------------------------ */

function agruparPorEstudiante(filas) {
  const mapa = new Map()
  for (const f of filas) {
    if (!mapa.has(f.perfil_id)) {
      mapa.set(f.perfil_id, {
        perfil_id: f.perfil_id,
        nombres: f.nombres,
        apellidos: f.apellidos,
        codigo_estudiantil: f.codigo_estudiantil,
        grupo: f.grupo,
        completadas: 0,
        dominadas: 0,
        pendientes: 0,
        totalPuntuables: 0,
        puntosNota: 0,
        puntosNotaMax: 0,
        intentos: 0,
        pistas: 0,
        filas: [],
      })
    }
    const e = mapa.get(f.perfil_id)
    e.filas.push(f)
    if (f.puntos_max > 0) {
      e.totalPuntuables += 1
      if (['completada', 'dominada'].includes(f.estado)) e.completadas += 1
      else e.pendientes += 1
    }
    if (f.estado === 'dominada') e.dominadas += 1
    if (f.cuenta_nota) {
      e.puntosNota += f.mejor_puntaje ?? 0
      e.puntosNotaMax += f.puntos_max
    }
    e.intentos += f.intentos_totales ?? 0
    if (['completada', 'dominada'].includes(f.estado)) e.pistas += f.pistas_minimas ?? 0
  }
  return Array.from(mapa.values())
    .map((e) => ({ ...e, nota: e.puntosNotaMax === 0 ? 0 : (e.puntosNota / e.puntosNotaMax) * 5 }))
    .sort((a, b) => (a.apellidos ?? '').localeCompare(b.apellidos ?? '', 'es'))
}

function calcularDificultades(filas) {
  const porActividad = new Map()
  for (const f of filas) {
    if (f.puntos_max === 0) continue
    if (!porActividad.has(f.actividad_id)) {
      porActividad.set(f.actividad_id, {
        id: f.actividad_id,
        titulo: f.actividad,
        estacion_id: f.estacion_id,
        intentaron: 0,
        completaron: 0,
        pistasTotal: 0,
      })
    }
    const a = porActividad.get(f.actividad_id)
    if (f.estado) {
      a.intentaron += 1
      if (['completada', 'dominada'].includes(f.estado)) a.completaron += 1
      a.pistasTotal += f.pistas_minimas ?? 0
    }
  }

  const actividades = Array.from(porActividad.values())
    .filter((a) => a.intentaron > 0)
    .map((a) => ({
      ...a,
      sinResolver: a.intentaron - a.completaron,
      pistasPromedio: a.pistasTotal / a.intentaron,
    }))
    .sort((a, b) => b.sinResolver / b.intentaron - a.sinResolver / a.intentaron || b.intentaron - a.intentaron)

  const conteo = {}
  for (const a of actividades) {
    const ficha = catalogoActividades.find((c) => c.id === a.id)
    const casos = a.sinResolver + Math.round(a.pistasTotal > 0 ? a.completaron * (a.pistasPromedio > 0 ? 1 : 0) : 0)
    if (casos === 0) continue
    for (const c of ficha?.conceptos ?? []) {
      conteo[c] = (conteo[c] ?? 0) + casos
    }
  }
  const conceptos = Object.entries(conteo)
    .map(([concepto, casos]) => ({ concepto, casos }))
    .sort((a, b) => b.casos - a.casos)

  return { actividades, conceptos }
}

/* --------------------------------- detalle -------------------------------- */

function DetalleEstudiante({ estudiante, cerrar }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="detalle-titulo">
      <div className="modal__caja">
        <header className="modal__cabecera">
          <h2 id="detalle-titulo">
            {estudiante.nombres} {estudiante.apellidos}
          </h2>
          <button type="button" className="boton boton--texto" onClick={cerrar}>
            Cerrar
          </button>
        </header>
        <p className="modal__meta">
          {estudiante.grupo ?? 'sin grupo'}
          {estudiante.codigo_estudiantil && ` · código ${estudiante.codigo_estudiantil}`} ·{' '}
          {estudiante.completadas} de {estudiante.totalPuntuables} actividades · nota orientativa{' '}
          {estudiante.nota.toFixed(1)}
        </p>
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">Actividad</th>
                <th scope="col">Estado</th>
                <th scope="col">Puntaje</th>
                <th scope="col">Intentos</th>
                <th scope="col">Pistas</th>
              </tr>
            </thead>
            <tbody>
              {estudiante.filas
                .filter((f) => f.puntos_max > 0)
                .map((f) => (
                  <tr key={f.actividad_id}>
                    <th scope="row">{f.actividad}</th>
                    <td>{f.estado ?? 'Sin empezar'}</td>
                    <td>{f.mejor_puntaje} de {f.puntos_max}</td>
                    <td>{f.intentos_totales}</td>
                    <td>{f.estado ? f.pistas_minimas : '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------- CSV ---------------------------------- */

function exportarCSV(filas) {
  const columnas = [
    'apellidos', 'nombres', 'codigo_estudiantil', 'grupo', 'estacion_id', 'actividad_id',
    'actividad', 'tipo', 'nivel', 'cuenta_nota', 'puntos_max', 'mejor_puntaje', 'estado',
    'intentos_totales', 'pistas_minimas', 'actualizado_en',
  ]
  const escapar = (v) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[";\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
  }
  // Separador ';' y BOM: así Excel en español abre el archivo con las columnas
  // separadas y con las tildes correctas, sin pasar por el asistente de importación.
  const cuerpo = [
    columnas.join(';'),
    ...filas.map((f) => columnas.map((c) => escapar(f[c])).join(';')),
  ].join('\r\n')

  const blob = new Blob(['﻿' + cuerpo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `progreso-segundo-corte-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
