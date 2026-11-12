import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useSesion } from '../../estado/SesionProvider.jsx'
import { almacenTc, fijarUsuarioDemo, modoDemostracionTc } from '../lib/almacenTc.js'
import Ficha3 from './Ficha3.jsx'
import Ficha4 from './Ficha4.jsx'
import Ficha5 from './Ficha5.jsx'
import { esGrupoSencillo } from '../lib/asistente.js'
import './tercer-corte.css'

const formatearHora = (iso) => {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return null
  }
}

/** Hook: el equipo del estudiante (o null si todavía no tiene). */
function useMiEquipo() {
  const { perfil } = useSesion()
  const [equipo, setEquipo] = useState(undefined) // undefined = cargando
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    try {
      if (modoDemostracionTc) fijarUsuarioDemo(perfil)
      setEquipo(await almacenTc.miEquipo())
      setError(null)
    } catch (e) {
      setError(e.message)
      setEquipo(null)
    }
  }, [perfil])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { equipo, error, recargar: cargar }
}

/** Página de inicio del tercer corte: crear o unirse a un equipo y ver sus fichas. */
export default function TercerCorte() {
  const { esDocente } = useSesion()
  const { equipo, error, recargar } = useMiEquipo()

  if (esDocente) return <Navigate to="/tercer-corte/docente" replace />
  if (equipo === undefined) return <p className="cargando" role="status">Cargando tu equipo…</p>

  return (
    <div className="tc">
      <header>
        <p className="panel__saludo">Tercer corte</p>
        <h1>Pensar, medir y documentar</h1>
        <p className="tc-objetivo">
          En este corte trabajan en equipo en un mismo sistema. Cada ficha se completa entre todos y se entrega una sola vez por equipo.
        </p>
      </header>

      {modoDemostracionTc && (
        <p className="aviso aviso--nota tc-aviso">Modo demostración: todo se guarda solo en este navegador.</p>
      )}
      {error && <p className="aviso aviso--error tc-aviso" role="alert">{error}</p>}

      {equipo ? <MiEquipo equipo={equipo} /> : <SinEquipo onListo={recargar} />}
    </div>
  )
}

function SinEquipo({ onListo }) {
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState(null)
  const [ocupado, setOcupado] = useState(false)

  async function accion(fn) {
    setOcupado(true)
    setError(null)
    try {
      await fn()
      await onListo()
    } catch (e) {
      setError(e.message)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <>
      <p>Para empezar, un integrante crea el equipo y los demás se unen con el código que se genera.</p>
      {error && <p className="aviso aviso--error tc-aviso" role="alert">{error}</p>}
      <div className="tc-rejilla">
        <section className="tarjeta" aria-labelledby="tc-crear">
          <h2 id="tc-crear" className="tc-bloque__titulo">Crear un equipo</h2>
          <form
            className="tc-formulario"
            onSubmit={(e) => {
              e.preventDefault()
              accion(() => almacenTc.crearEquipo(nombre))
            }}
          >
            <div className="campo-envoltura" style={{ width: '100%' }}>
              <label className="campo-envoltura__etiqueta" htmlFor="tc-nombre">Nombre del proyecto</label>
              <input id="tc-nombre" className="campo" value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} />
              <span className="campo-envoltura__ayuda">Es el nombre del sistema que van a trabajar, por ejemplo «Pedidos La Esquina».</span>
            </div>
            <button type="submit" className="boton boton--principal" disabled={ocupado || nombre.trim().length < 3}>
              Crear equipo
            </button>
          </form>
        </section>

        <section className="tarjeta" aria-labelledby="tc-unirse">
          <h2 id="tc-unirse" className="tc-bloque__titulo">Unirme a un equipo</h2>
          <form
            className="tc-formulario"
            onSubmit={(e) => {
              e.preventDefault()
              accion(() => almacenTc.unirse(codigo))
            }}
          >
            <div className="campo-envoltura" style={{ width: '100%' }}>
              <label className="campo-envoltura__etiqueta" htmlFor="tc-codigo">Código del equipo</label>
              <input
                id="tc-codigo"
                className="campo"
                value={codigo}
                maxLength={8}
                autoCapitalize="characters"
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              />
              <span className="campo-envoltura__ayuda">Te lo da el compañero que creó el equipo (6 caracteres).</span>
            </div>
            <button type="submit" className="boton boton--secundario" disabled={ocupado || codigo.trim().length < 4}>
              Unirme
            </button>
          </form>
        </section>
      </div>
    </>
  )
}

function MiEquipo({ equipo }) {
  const estadoDe = (n) => equipo.fichas.find((f) => f.ficha === n)
  const f3 = estadoDe(3)
  const f4 = estadoDe(4)
  const f5 = estadoDe(5)
  // El Grupo 3 ya hizo la ficha 3 en una hoja aparte: no la ve y trabaja las fichas 4 y 5.
  const { perfil } = useSesion()
  const grupo3 = esGrupoSencillo(perfil?.grupo)
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(equipo.codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sin portapapeles: el código se ve en pantalla */
    }
  }

  return (
    <>
      <section className="tarjeta" aria-labelledby="tc-equipo">
        <p className="etiqueta-campo">Tu equipo</p>
        <h2 id="tc-equipo" className="tc-bloque__titulo">{equipo.nombre}</h2>
        <p className="etiqueta-campo">Código para que se unan tus compañeros</p>
        <p>
          <span className="tc-codigo">{equipo.codigo}</span>{' '}
          <button type="button" className="boton boton--texto boton--pequeno" onClick={copiar}>
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </p>
        <p className="etiqueta-campo">Integrantes ({equipo.miembros.length} de 4)</p>
        <ul className="tc-integrantes">
          {equipo.miembros.map((m) => (
            <li key={m.perfil_id}>{m.nombres} {m.apellidos}</li>
          ))}
        </ul>
      </section>

      <section className="tarjeta" aria-labelledby="tc-fichas">
        <h2 id="tc-fichas" className="tc-bloque__titulo">Fichas del corte</h2>
        {!grupo3 && (
          <div className="tc-ficha-fila">
            <div>
              <h3>Ficha 3 · Calidad con números (ISO/IEC 25010)</h3>
              <p>
                {f3?.estado === 'entregada'
                  ? `Entregada${f3.actualizado_en ? ` · ${formatearHora(f3.actualizado_en)}` : ''}`
                  : f3
                    ? `En progreso · último cambio ${formatearHora(f3.actualizado_en)}`
                    : 'Todavía sin empezar'}
              </p>
            </div>
            <Link className="boton boton--principal" to="/tercer-corte/ficha/3">
              {f3?.estado === 'entregada' ? 'Ver la ficha' : f3 ? 'Continuar' : 'Empezar'}
            </Link>
          </div>
        )}
        <div className="tc-ficha-fila">
          <div>
            <h3>Ficha 4 · Pseudocódigo del proceso principal</h3>
            <p>
              {f4?.estado === 'entregada'
                ? `Entregada${f4.actualizado_en ? ` · ${formatearHora(f4.actualizado_en)}` : ''}`
                : f4
                  ? `En progreso · último cambio ${formatearHora(f4.actualizado_en)}`
                  : 'Todavía sin empezar'}
            </p>
          </div>
          <Link className="boton boton--principal" to="/tercer-corte/ficha/4">
            {f4?.estado === 'entregada' ? 'Ver la ficha' : f4 ? 'Continuar' : 'Empezar'}
          </Link>
        </div>
        {grupo3 && (
          <div className="tc-ficha-fila">
            <div>
              <h3>Ficha 5 · Segundo proceso, paradigma y lenguaje</h3>
              <p>
                {f5?.estado === 'entregada'
                  ? `Entregada${f5.actualizado_en ? ` · ${formatearHora(f5.actualizado_en)}` : ''}`
                  : f5
                    ? `En progreso · último cambio ${formatearHora(f5.actualizado_en)}`
                    : 'Todavía sin empezar'}
              </p>
            </div>
            <Link className="boton boton--principal" to="/tercer-corte/ficha/5">
              {f5?.estado === 'entregada' ? 'Ver la ficha' : f5 ? 'Continuar' : 'Empezar'}
            </Link>
          </div>
        )}
      </section>
    </>
  )
}

/** Ruta /tercer-corte/ficha/:n para el equipo. */
export function FichaDelEquipo() {
  const { n } = useParams()
  const { equipo, error } = useMiEquipo()
  const { esDocente, perfil } = useSesion()

  if (esDocente) return <Navigate to="/tercer-corte/docente" replace />
  if (equipo === undefined) return <p className="cargando" role="status">Cargando…</p>
  if (!equipo) return <Navigate to="/tercer-corte" replace />
  const grupo3 = esGrupoSencillo(perfil?.grupo)
  // La ficha 5 es solo del Grupo 3, y el Grupo 3 ya hizo la 3 en una hoja aparte.
  if (n !== '3' && n !== '4' && n !== '5') return <Navigate to="/tercer-corte" replace />
  if ((n === '5' && !grupo3) || (n === '3' && grupo3)) return <Navigate to="/tercer-corte" replace />
  const Ficha = n === '5' ? Ficha5 : n === '4' ? Ficha4 : Ficha3
  return (
    <>
      {error && <p className="aviso aviso--error" role="alert">{error}</p>}
      <Ficha equipo={{ id: equipo.id, nombre: equipo.nombre, miembros: equipo.miembros }} />
    </>
  )
}
