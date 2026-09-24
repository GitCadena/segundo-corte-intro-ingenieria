import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import { SesionProvider, useSesion } from './estado/SesionProvider.jsx'
import { ProgresoProvider, useProgreso } from './estado/ProgresoProvider.jsx'

import Inicio from './vistas/Inicio.jsx'
import Acceso from './vistas/Acceso.jsx'
import Panel from './vistas/Panel.jsx'
import Estacion from './vistas/Estacion.jsx'
import Laboratorio from './vistas/Laboratorio.jsx'
import MiProgreso from './vistas/MiProgreso.jsx'
import PanelDocente from './vistas/PanelDocente.jsx'
import Glosario from './vistas/Glosario.jsx'
import LimiteDeError from './componentes/LimiteDeError.jsx'
import { catalogoEstaciones } from './data/catalogo.js'

export default function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <ProgresoProvider>
          <Armazon />
        </ProgresoProvider>
      </SesionProvider>
    </BrowserRouter>
  )
}

function Armazon() {
  const { cargando, usuario, esDocente, modoDemo } = useSesion()
  const [proyeccion, setProyeccion] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('proyeccion', proyeccion)
  }, [proyeccion])

  if (cargando) {
    return (
      <div className="cargando-pantalla" role="status">
        <p>Cargando…</p>
      </div>
    )
  }

  return (
    <div className="marco">
      <a className="salto-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <BarraSuperior proyeccion={proyeccion} setProyeccion={setProyeccion} />
      {modoDemo && <AvisoDemo />}
      <main className="contenido" id="contenido" tabIndex={-1}>
        <LimiteDeError>
          <Rutas usuario={usuario} esDocente={esDocente} />
        </LimiteDeError>
      </main>
      <PieDePagina />
    </div>
  )
}

function Rutas({ usuario, esDocente }) {
  const ubicacion = useLocation()

  useEffect(() => {
    document.getElementById('contenido')?.scrollTo?.(0, 0)
    window.scrollTo(0, 0)
  }, [ubicacion.pathname])

  return (
    <Routes>
      <Route path="/" element={usuario ? <Navigate to="/panel" replace /> : <Inicio />} />
      <Route path="/acceso" element={usuario ? <Navigate to="/panel" replace /> : <Acceso />} />
      <Route path="/panel" element={<Protegida usuario={usuario}><Panel /></Protegida>} />
      <Route path="/estacion/:id" element={<Protegida usuario={usuario}><Estacion /></Protegida>} />
      <Route path="/laboratorio" element={<Protegida usuario={usuario}><Laboratorio /></Protegida>} />
      <Route path="/progreso" element={<Protegida usuario={usuario}><MiProgreso /></Protegida>} />
      <Route path="/glosario" element={<Glosario />} />
      <Route
        path="/docente"
        element={
          <Protegida usuario={usuario}>
            {esDocente ? <PanelDocente /> : <SinPermiso />}
          </Protegida>
        }
      />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}

function Protegida({ usuario, children }) {
  if (!usuario) return <Navigate to="/acceso" replace />
  return children
}

/* ------------------------------ barra superior ---------------------------- */

function BarraSuperior({ proyeccion, setProyeccion }) {
  const { usuario, perfil, esDocente, cerrarSesion } = useSesion()
  const { resumen, estadoGuardado, pendientes } = useProgreso()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="barra">
      <NavLink className="barra__marca" to={usuario ? '/panel' : '/'}>
        <span className="barra__corte">Segundo corte</span>
        <span className="barra__curso">Introducción a la Ingeniería Informática</span>
      </NavLink>

      {usuario && (
        <>
          <button
            type="button"
            className="barra__hamburguesa"
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            onClick={() => setMenuAbierto((m) => !m)}
          >
            <span className="visualmente-oculto">Menú</span>
            <span aria-hidden="true">☰</span>
          </button>

          <nav
            className={menuAbierto ? 'barra__nav barra__nav--abierto' : 'barra__nav'}
            id="menu-principal"
            aria-label="Secciones"
            onClick={() => setMenuAbierto(false)}
          >
            <NavLink to="/panel">Panel</NavLink>
            <NavLink to="/laboratorio">Laboratorio</NavLink>
            <NavLink to="/progreso">Mi progreso</NavLink>
            <NavLink to="/glosario">Glosario</NavLink>
            {esDocente && <NavLink to="/docente">Panel docente</NavLink>}
          </nav>
        </>
      )}

      <div className="barra__acciones">
        {usuario && <IndicadorGuardado estado={estadoGuardado} pendientes={pendientes} />}
        <button type="button" className="boton boton--texto" onClick={() => setProyeccion((p) => !p)}>
          {proyeccion ? 'Salir de proyección' : 'Modo proyección'}
        </button>
        {usuario ? (
          <div className="barra__usuario">
            <span className="barra__nombre">
              {perfil?.nombres ?? 'Estudiante'}
              {resumen && <span className="barra__puntos">{resumen.puntosObtenidos} pts</span>}
            </span>
            <button type="button" className="boton boton--texto" onClick={cerrarSesion}>
              Salir
            </button>
          </div>
        ) : (
          <NavLink className="boton boton--principal boton--pequeno" to="/acceso">
            Entrar
          </NavLink>
        )}
      </div>
    </header>
  )
}

function IndicadorGuardado({ estado, pendientes }) {
  if (pendientes > 0) {
    return (
      <span className="indicador indicador--pendiente" role="status">
        Pendiente de sincronización ({pendientes})
      </span>
    )
  }
  if (estado === 'guardando') {
    return (
      <span className="indicador indicador--proceso" role="status">
        Guardando…
      </span>
    )
  }
  if (estado === 'guardado') {
    return (
      <span className="indicador indicador--ok" role="status">
        Guardado
      </span>
    )
  }
  return null
}

/* --------------------------------- avisos -------------------------------- */

function AvisoDemo() {
  const { motivoSinConfiguracion } = useSesion()
  return (
    <p className="banda-demo" role="status">
      <strong>Modo demostración.</strong> {motivoSinConfiguracion}
    </p>
  )
}

function SinPermiso() {
  return (
    <section className="vacio">
      <h1>Esta sección es del equipo docente</h1>
      <p>
        Tu cuenta es de estudiante, así que no puede consultar los datos de otras personas. Si eres
        docente y deberías tener acceso, pídele a la administración del curso que asigne el rol a tu
        cuenta: no se puede activar desde aquí, a propósito.
      </p>
      <NavLink className="boton boton--principal" to="/panel">
        Volver a mi panel
      </NavLink>
    </section>
  )
}

function NoEncontrada() {
  return (
    <section className="vacio">
      <h1>Esa página no existe</h1>
      <p>Puede que el enlace esté mal escrito o que la sección haya cambiado de nombre.</p>
      <NavLink className="boton boton--principal" to="/">
        Ir al inicio
      </NavLink>
    </section>
  )
}

function PieDePagina() {
  return (
    <footer className="pie">
      <p>
        Introducción a la Ingeniería Informática · Segundo corte · Institución Universitaria Colegio
        Mayor del Cauca
      </p>
      <p className="pie__estaciones">
        {catalogoEstaciones.map((e) => (
          <NavLink key={e.id} to={`/estacion/${e.id}`}>
            {e.orden}. {e.titulo}
          </NavLink>
        ))}
      </p>
    </footer>
  )
}
