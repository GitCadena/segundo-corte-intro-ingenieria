import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useProgreso } from '../../estado/ProgresoProvider.jsx'
import { COMPONENTES, ETAPAS_FLUJO, SECTORES } from '../../data/lab-cdvs.js'
import { FASES } from '../../data/cdvs-fases.js'
import {
  normalizarSesion,
  itemsRuta,
  itemsFlujo,
  itemsCalidad,
  itemsTransferencia,
  colocar,
  devolver,
  revisar,
  finalizar,
  componenteCompleto,
  componentesCompletos,
  colocadasDe,
  resumenSesion,
  formatearDuracion,
  validarRegistro,
  actualizarIntegrantes,
} from '../../lib/labCdvs.js'
import Registro from './lab/Registro.jsx'
import EjemploInicial from './lab/EjemploInicial.jsx'
import Clasificador from './lab/Clasificador.jsx'
import Matriz from './lab/Matriz.jsx'
import Dependencias from './lab/Dependencias.jsx'
import DiagramaFlujo from './lab/DiagramaFlujo.jsx'
import Resultados from './lab/Resultados.jsx'

const ZONAS_FASES = FASES.map((f) => ({ id: f.id, titulo: `${f.numero}. ${f.corto}`, ayuda: f.pregunta }))
const ZONAS_ETAPAS = ETAPAS_FLUJO.map((e) => ({ id: e.id, titulo: e.nombre, ayuda: e.ayuda }))

const AYUDAS = {
  ruta: 'Arrastren cada acción a la fase del ciclo de vida a la que pertenece. Algunas se parecen entre requerimientos, análisis y diseño: piensen en qué se está haciendo realmente.',
  flujo: 'Organicen los elementos del hospital según lo que le pasa a la información: se captura, se procesa, se almacena o se distribuye.',
  calidad: 'Relacionen cada decisión del sistema con la característica de la información que busca.',
  dependencias: '',
  transferencia: 'El mismo proceso, otro contexto. Ubiquen las acciones en las fases y los elementos en las funciones de la información.',
}

/* ------------------------- almacenamiento local de respaldo ------------------------- */

function leerLocal(clave) {
  try {
    const t = window.localStorage.getItem(clave)
    return t ? JSON.parse(t) : null
  } catch {
    return null
  }
}
function escribirLocal(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* sin almacenamiento local: el servidor sigue siendo la copia principal */
  }
}

/**
 * Laboratorio de ingeniería: del problema al sistema.
 *
 * Una sola actividad con cinco componentes sobre el mismo tablero. El progreso
 * se guarda como borrador de la cuenta de quien registra al equipo (servidor)
 * y, además, en este navegador, para que actualizar la página no lo pierda.
 */
export default function LaboratorioCdvs({ actividad, ctrl }) {
  const { borradores, guardarBorrador, perfil, cargando, modoDemo } = useProgreso()
  const claveLocal = `segundo-corte-lab-cdvs-v1:${perfil?.id ?? 'anonimo'}`

  const [sesion, setSesion] = useState(null)
  const [listo, setListo] = useState(false)
  const [vista, setVista] = useState(null)
  const [guardado, setGuardado] = useState('inactivo') // inactivo | guardando | guardado | local
  const [ahora, setAhora] = useState(() => Date.now())
  const [editando, setEditando] = useState(null)
  const modificada = useRef(false)
  const enviado = useRef(false)

  /* ----------------------------- carga inicial ----------------------------- */

  useEffect(() => {
    if (listo || cargando) return
    const remota = normalizarSesion(borradores[actividad.id]?.contenido)
    const local = normalizarSesion(leerLocal(claveLocal))
    const elegida = [remota, local]
      .filter(Boolean)
      .sort((a, b) => (b.actualizadoEn ?? '').localeCompare(a.actualizadoEn ?? ''))[0]
    setSesion(elegida ?? null)
    setListo(true)
  }, [listo, cargando, borradores, actividad.id, claveLocal])

  const aplicar = useCallback((fn) => {
    modificada.current = true
    setSesion((prev) => {
      if (!prev) return prev
      const nueva = fn(prev)
      return nueva === prev ? prev : { ...nueva, actualizadoEn: new Date().toISOString() }
    })
  }, [])

  /* ------------------------------- guardado -------------------------------- */

  useEffect(() => {
    if (!sesion || !listo || !modificada.current) return undefined
    escribirLocal(claveLocal, sesion)
    setGuardado('guardando')
    const temporizador = setTimeout(async () => {
      const r = await guardarBorrador(actividad.id, sesion)
      setGuardado(r?.ok ? 'guardado' : 'local')
    }, 700)
    return () => clearTimeout(temporizador)
  }, [sesion, listo, claveLocal, guardarBorrador, actividad.id])

  /* ------------------------------ cronómetro ------------------------------- */

  const enCurso = !!sesion && !sesion.fin
  useEffect(() => {
    if (!enCurso) return undefined
    const id = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [enCurso])

  /* ------------------------------ terminar --------------------------------- */

  useEffect(() => {
    if (!sesion || sesion.fin || componentesCompletos(sesion) !== COMPONENTES.length) return
    aplicar((s) => finalizar(s))
  }, [sesion, aplicar])

  useEffect(() => {
    if (!sesion?.fin) return
    setVista((v) => v ?? 'resultados')
    if (enviado.current || ctrl.mejor?.estado === 'completada' || ctrl.mejor?.estado === 'dominada') return
    enviado.current = true
    const r = resumenSesion(sesion)
    ctrl.enviar(true, {
      datos: { sesion: r.id, equipo: r.alias, academico: r.academico, competitivo: r.competitivo, segundos: r.segundos, intentos: r.intentos, modo: r.modo },
    })
  }, [sesion?.fin]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------- derivados -------------------------------- */

  const resumen = useMemo(() => (sesion ? resumenSesion(sesion, new Date(ahora)) : null), [sesion, ahora])
  const primerIncompleto = sesion ? COMPONENTES.find((c) => !componenteCompleto(sesion, c.id))?.id ?? 'resultados' : null
  const actual = vista ?? primerIncompleto

  // La vista se fija al entrar y ya no salta sola: al completar un componente
  // se queda ahí, con su aviso, hasta que el equipo decide pasar al siguiente.
  useEffect(() => {
    if (sesion?.ejemploHecho && vista === null && primerIncompleto) setVista(primerIncompleto)
  }, [sesion?.ejemploHecho, vista, primerIncompleto])

  /* --------------------------------- vistas --------------------------------- */

  if (!listo) return <p className="cargando" role="status">Cargando el laboratorio…</p>

  if (!sesion) {
    return (
      <div className="lab">
        <Registro
          onComenzar={(s) => {
            modificada.current = true
            setSesion({ ...s, actualizadoEn: new Date().toISOString() })
          }}
        />
      </div>
    )
  }

  if (!sesion.ejemploHecho) {
    return (
      <div className="lab">
        <EjemploInicial onListo={() => aplicar((s) => ({ ...s, ejemploHecho: true }))} />
      </div>
    )
  }

  const completos = componentesCompletos(sesion)
  const cuenta = perfil ? `${perfil.nombres ?? ''} ${perfil.apellidos ?? ''}`.trim() || 'Cuenta sin nombre' : 'Modo demostración'

  function irAlSiguiente() {
    const siguiente = COMPONENTES.find((c) => !componenteCompleto(sesion, c.id))
    setVista(siguiente ? siguiente.id : 'resultados')
  }

  function abrirEdicion() {
    setEditando({ alias: sesion.alias, nombres: [0, 1, 2, 3].map((i) => sesion.integrantes[i] ?? ''), errores: null })
  }

  function guardarEdicion() {
    const v = validarRegistro({ alias: editando.alias, integrantes: editando.nombres })
    if (!v.ok) {
      setEditando({ ...editando, errores: v.errores })
      return
    }
    aplicar((s) => actualizarIntegrantes(s, editando.alias, editando.nombres))
    setEditando(null)
  }

  const textoGuardado = {
    inactivo: '',
    guardando: 'Guardando…',
    guardado: modoDemo ? 'Modo demostración: el progreso se guarda solo en este navegador.' : 'Progreso guardado en el servidor.',
    local: modoDemo
      ? 'Modo demostración: el progreso se guarda solo en este navegador.'
      : 'El servidor no confirmó el guardado: tu progreso sigue en este navegador y se vuelve a intentar con cada cambio.',
  }[guardado]

  return (
    <div className="lab">
      <header className="lab-cabecera">
        <div>
          <p className="etiqueta-campo">Equipo</p>
          <h4 className="lab-cabecera__equipo">{sesion.alias}</h4>
          <p className="lab-ayuda">{sesion.integrantes.join(' · ')}</p>
        </div>
        <div className="lab-cabecera__datos">
          <p className="lab-reloj" role="timer" aria-label="Tiempo transcurrido">
            {formatearDuracion(resumen.segundos)}
          </p>
          <p className="lab-ayuda">{completos} de {COMPONENTES.length} componentes · {sesion.modo === '120' ? 'Modalidad ampliada' : 'Modalidad de 60 minutos'}</p>
          <button type="button" className="boton boton--texto" onClick={abrirEdicion}>
            Editar integrantes
          </button>
        </div>
      </header>

      {editando && (
        <div className="lab-edicion">
          <label className="lab-campo">
            <span className="etiqueta-campo">Nombre del equipo</span>
            <input className="campo" maxLength={24} value={editando.alias} onChange={(e) => setEditando({ ...editando, alias: e.target.value })} />
            {editando.errores?.alias && <span className="lab-error">{editando.errores.alias}</span>}
          </label>
          {editando.nombres.map((n, i) => (
            <label className="lab-campo" key={i}>
              <span className="etiqueta-campo">Integrante {i + 1} {i === 3 ? '(opcional)' : ''}</span>
              <input
                className="campo"
                value={n}
                onChange={(e) => setEditando({ ...editando, nombres: editando.nombres.map((x, j) => (j === i ? e.target.value : x)) })}
              />
              {editando.errores?.integrantes?.[i] && <span className="lab-error">{editando.errores.integrantes[i]}</span>}
            </label>
          ))}
          <div className="lab-acciones">
            <button type="button" className="boton boton--principal boton--pequeno" onClick={guardarEdicion}>Guardar cambios</button>
            <button type="button" className="boton boton--texto" onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <nav className="lab-pasos" aria-label="Componentes del laboratorio">
        {COMPONENTES.map((c) => {
          const hecho = componenteCompleto(sesion, c.id)
          return (
            <button
              key={c.id}
              type="button"
              className={'lab-paso' + (actual === c.id ? ' lab-paso--activo' : '') + (hecho ? ' lab-paso--hecho' : '')}
              aria-current={actual === c.id ? 'step' : undefined}
              onClick={() => setVista(c.id)}
            >
              <span className="lab-paso__numero">{hecho ? '✓' : c.numero}</span>
              <span>{c.corto}</span>
            </button>
          )
        })}
        <button
          type="button"
          className={'lab-paso' + (actual === 'resultados' ? ' lab-paso--activo' : '')}
          onClick={() => setVista('resultados')}
        >
          <span className="lab-paso__numero">★</span>
          <span>Resultados</span>
        </button>
      </nav>

      <div className="lab-barra" role="img" aria-label={`${completos} de ${COMPONENTES.length} componentes completos`}>
        <span style={{ width: `${(completos / COMPONENTES.length) * 100}%` }} />
      </div>

      {actual === 'resultados' ? (
        <Resultados
          sesion={sesion}
          resumen={resumen}
          cuenta={cuenta}
          estadoGuardado={guardado}
          modoDemo={modoDemo}
          onVolver={() => setVista(COMPONENTES[0].id)}
        />
      ) : (
        <ComponenteVista
          id={actual}
          sesion={sesion}
          aplicar={aplicar}
          onSiguiente={irAlSiguiente}
        />
      )}

      {textoGuardado && <p className={'guardado ' + (guardado === 'guardado' ? 'guardado--ok' : 'guardado--pendiente')}>{textoGuardado}</p>}
    </div>
  )
}

/* --------------------------------------------------------------------------- */

function ComponenteVista({ id, sesion, aplicar, onSiguiente }) {
  const def = COMPONENTES.find((c) => c.id === id)
  if (!def) return null
  const completo = componenteCompleto(sesion, id)

  return (
    <section className="lab-componente" aria-labelledby={`lab-${id}`}>
      <h4 id={`lab-${id}`} className="lab-componente__titulo">
        <span className="lab-componente__numero">{def.numero}</span> {def.titulo}
        <span className="chip chip--puntos">{def.puntos} pts</span>
      </h4>
      {AYUDAS[id] && <p className="lab-ayuda">{AYUDAS[id]}</p>}

      {id === 'ruta' && <Tablero id="ruta" sesion={sesion} aplicar={aplicar} items={itemsRuta(sesion.modo)} zonas={ZONAS_FASES} />}

      {id === 'flujo' && (
        <>
          <Tablero id="flujo" sesion={sesion} aplicar={aplicar} items={itemsFlujo(sesion.modo)} zonas={ZONAS_ETAPAS} />
          {completo && <DiagramaFlujo items={itemsFlujo(sesion.modo)} colocadas={sesion.flujo.colocadas} />}
        </>
      )}

      {id === 'calidad' && (
        <>
          <Matriz
            items={itemsCalidad(sesion.modo)}
            colocadas={sesion.calidad.colocadas}
            retro={sesion.calidad.retro}
            revisiones={sesion.calidad.revisiones}
            bloqueado={completo}
            onElegir={(itemId, car) => aplicar((s) => colocar(s, 'calidad', itemId, car))}
          />
          <BarraRevision id="calidad" sesion={sesion} aplicar={aplicar} total={itemsCalidad(sesion.modo).length} />
        </>
      )}

      {id === 'dependencias' && <Dependencias sesion={sesion} onCambio={(s) => aplicar(() => s)} />}

      {id === 'transferencia' && <Transferencia sesion={sesion} aplicar={aplicar} />}

      {completo && (
        <div className="lab-completo" role="status">
          <p>
            <strong>Componente completo.</strong> {def.id === 'transferencia' ? 'Ya tienes todos los componentes.' : 'Pasa al siguiente cuando quieras.'}
          </p>
          <button type="button" className="boton boton--principal" onClick={onSiguiente}>
            {componentesCompletos(sesion) === COMPONENTES.length ? 'Ver los resultados' : 'Ir al siguiente componente'}
          </button>
        </div>
      )}
    </section>
  )
}

function Tablero({ id, sesion, aplicar, items, zonas }) {
  const estado = sesion[id]
  const completo = componenteCompleto(sesion, id)
  return (
    <>
      <Clasificador
        items={items}
        zonas={zonas}
        colocadas={estado.colocadas}
        retro={estado.retro}
        revisiones={estado.revisiones}
        bloqueado={completo}
        onColocar={(itemId, zona) => aplicar((s) => colocar(s, id, itemId, zona))}
        onDevolver={(itemId) => aplicar((s) => devolver(s, id, itemId))}
      />
      <BarraRevision id={id} sesion={sesion} aplicar={aplicar} total={items.length} />
    </>
  )
}

function BarraRevision({ id, sesion, aplicar, total }) {
  const estado = sesion[id]
  const colocadas = colocadasDe(sesion, id)
  const completo = componenteCompleto(sesion, id)
  const todas = colocadas === total
  return (
    <div className="lab-revision">
      <p className="lab-progreso">
        {colocadas} de {total} {id === 'calidad' ? 'decisiones relacionadas' : 'piezas ubicadas'}
        {estado.revisado && !completo && ` · en tu última revisión acertaste ${estado.revisado.correctos} de ${estado.revisado.total}`}
      </p>
      {!completo && (
        <button type="button" className="boton boton--principal" disabled={!todas} onClick={() => aplicar((s) => revisar(s, id))}>
          Revisar
        </button>
      )}
      {!completo && !todas && <p className="ayuda-teclado">Completa todas para poder revisar.</p>}
      {!completo && estado.revisado && (
        <p className="lab-mensaje lab-mensaje--mal" role="status">
          Todavía hay piezas por corregir. Las marcadas con ✗ traen una pista; muévelas y vuelve a revisar. Corregir no resta de la nota académica.
        </p>
      )}
    </div>
  )
}

function Transferencia({ sesion, aplicar }) {
  const todos = itemsTransferencia(sesion.modo)
  const estado = sesion.transferencia
  const completo = componenteCompleto(sesion, 'transferencia')
  const sectores = SECTORES.filter((s) => sesion.modo === '120' || !s.ampliada)

  return (
    <>
      {sectores.map((s) => (
        <div key={s.id} className="lab-sector">
          <h5>{s.nombre}</h5>
          <p>{s.texto}</p>
          <p className="etiqueta-campo">Acciones del proyecto</p>
          <Clasificador
            items={todos.filter((it) => it.sector === s.id && it.grupo === 'acciones')}
            zonas={ZONAS_FASES}
            colocadas={estado.colocadas}
            retro={estado.retro}
            revisiones={estado.revisiones}
            bloqueado={completo}
            titulo="Acciones por ubicar"
            onColocar={(itemId, zona) => aplicar((x) => colocar(x, 'transferencia', itemId, zona))}
            onDevolver={(itemId) => aplicar((x) => devolver(x, 'transferencia', itemId))}
          />
          <p className="etiqueta-campo">Elementos de la información</p>
          <Clasificador
            items={todos.filter((it) => it.sector === s.id && it.grupo === 'elementos')}
            zonas={ZONAS_ETAPAS}
            colocadas={estado.colocadas}
            retro={estado.retro}
            revisiones={estado.revisiones}
            bloqueado={completo}
            titulo="Elementos por ubicar"
            onColocar={(itemId, zona) => aplicar((x) => colocar(x, 'transferencia', itemId, zona))}
            onDevolver={(itemId) => aplicar((x) => devolver(x, 'transferencia', itemId))}
          />
        </div>
      ))}
      <BarraRevision id="transferencia" sesion={sesion} aplicar={aplicar} total={todos.length} />
    </>
  )
}
