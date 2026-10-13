import { COMPONENTES, ENLACES, RESULTADOS, MODALIDADES, SECTORES } from '../../../data/lab-cdvs.js'
import { crearPdf } from '../../../lib/pdfSimple.js'
import { itemsRuta, itemsFlujo, itemsCalidad, formatearDuracion } from '../../../lib/labCdvs.js'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function fechaLarga(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function horaCorta(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const etiquetaModo = (id) => MODALIDADES.find((m) => m.id === id)?.etiqueta ?? id
const titulo = (id) => RESULTADOS.find((r) => r.id === id)?.corto ?? id
const num = (n) => String(n).replace('.', ',')

/** Líneas de resumen de lo que construyó el equipo (solo de lo que quedó completo). */
export function resumenDeLoConstruido(sesion, resumen) {
  const completo = (id) => resumen.componentes.find((c) => c.id === id)?.completo
  const lineas = []
  lineas.push({
    titulo: 'Fases comprendidas',
    texto: completo('ruta')
      ? `Ubicó correctamente las ${itemsRuta(sesion.modo).length} acciones del proyecto en las siete fases del ciclo de vida.`
      : 'Componente pendiente.',
  })
  lineas.push({
    titulo: 'Flujo de información construido',
    texto: completo('flujo')
      ? `Organizó ${itemsFlujo(sesion.modo).length} elementos del hospital en captura, procesamiento, almacenamiento y distribución.`
      : 'Componente pendiente.',
  })
  lineas.push({
    titulo: 'Criterios de calidad aplicados',
    texto: completo('calidad')
      ? `Relacionó ${itemsCalidad(sesion.modo).length} decisiones del sistema con información oportuna, relevante, completa o confiable.`
      : 'Componente pendiente.',
  })
  const enlaces = sesion.dependencias.enlaces
  lineas.push({
    titulo: 'Dependencias establecidas',
    texto: enlaces.length
      ? enlaces.map((e) => `${titulo(e.desde)} -> ${titulo(e.hacia)}${e.tipo === 'revision' ? ' (vuelve atrás)' : ''}`).join('; ') + '.'
      : 'Ninguna construida todavía.',
  })
  lineas.push({
    titulo: 'Transferencia a otro sector',
    texto: completo('transferencia')
      ? `Aplicó el proceso a ${SECTORES.filter((s) => sesion.modo === '120' || !s.ampliada).map((s) => s.nombre.toLowerCase()).join(' y ')}.`
      : 'Componente pendiente.',
  })
  return lineas
}

/** Comprobante en PDF: una o dos páginas, sobrio. */
export function construirPdf(sesion, resumen, cuenta) {
  const filas = resumen.componentes.map((r) => {
    const def = COMPONENTES.find((c) => c.id === r.id)
    return [`${def.numero}. ${def.corto}`, num(r.puntos), String(r.max), String(r.intentos), r.completo ? 'Completo' : 'Incompleto']
  })
  const xs = [0, 215, 285, 355, 440]

  const bloques = [
    { t: 'titulo', texto: 'Laboratorio de ingeniería: del problema al sistema' },
    { t: 'sub', texto: 'Comprobante de resultados · Introducción a la Ingeniería Informática · Institución Universitaria Colegio Mayor del Cauca' },
    { t: 'linea' },
    { t: 'h', texto: 'Equipo' },
    { t: 'p', texto: `Nombre del equipo: ${resumen.alias}` },
    { t: 'p', texto: 'Integrantes:' },
    ...resumen.integrantes.map((n, i) => ({ t: 'p', texto: `${i + 1}. ${n}`, sangria: 14 })),
    { t: 'p', texto: `Cuenta que registró el trabajo: ${cuenta}` },
    { t: 'h', texto: 'Sesión' },
    { t: 'p', texto: `Fecha: ${fechaLarga(resumen.inicio)} · Inicio: ${horaCorta(resumen.inicio)} · Fin: ${resumen.fin ? horaCorta(resumen.fin) : 'sin terminar'}` },
    { t: 'p', texto: `Duración: ${formatearDuracion(resumen.segundos)} (minutos:segundos) · Modalidad: ${etiquetaModo(resumen.modo)}` },
    { t: 'p', texto: `Identificador de la sesión: ${resumen.id}` },
    { t: 'h', texto: 'Resultados por componente' },
    { t: 'fila', celdas: ['Componente', 'Puntos', 'Máximo', 'Intentos', 'Estado'], xs, negrita: true },
    { t: 'linea' },
    ...filas.map((celdas) => ({ t: 'fila', celdas, xs })),
    { t: 'linea' },
    { t: 'p', texto: `Puntuación académica: ${num(resumen.academico)} de 100` },
    { t: 'p', texto: `Puntuación competitiva: ${num(resumen.competitivo)} de 100` },
    { t: 'p', texto: `Componentes completados: ${resumen.completos} de ${resumen.totalComponentes} · Intentos totales: ${resumen.intentos}` },
    { t: 'h', texto: 'Resumen de lo construido' },
    ...resumenDeLoConstruido(sesion, resumen).flatMap((l) => [
      { t: 'p', texto: l.titulo, negrita: true },
      { t: 'p', texto: l.texto, sangria: 14 },
    ]),
    { t: 'espacio', n: 8 },
    { t: 'sub', texto: 'Las puntuaciones se calculan con reglas fijas y explicables, sin inteligencia artificial. Este comprobante se generó en la aplicación del curso.' },
  ]
  return crearPdf(bloques)
}

export function nombreArchivoPdf(resumen) {
  const limpio = resumen.alias.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `laboratorio-cdvs-${limpio || 'equipo'}.pdf`
}

/** Para la vista del docente. */
export const COLUMNAS_CSV = [
  'equipo', 'integrantes', 'cuenta', 'grupo', 'modalidad', 'sesion', 'inicio', 'fin', 'duracion', 'componentes_completos',
  'puntos_academicos', 'puntos_competitivos', 'intentos', 'estado',
]

export function filaCsv(resumen, cuenta) {
  return {
    equipo: resumen.alias,
    integrantes: resumen.integrantes.join(' | '),
    cuenta: cuenta.nombre,
    grupo: cuenta.grupo ?? '',
    modalidad: resumen.modo,
    sesion: resumen.id,
    inicio: resumen.inicio,
    fin: resumen.fin ?? '',
    duracion: formatearDuracion(resumen.segundos),
    componentes_completos: `${resumen.completos}/${resumen.totalComponentes}`,
    puntos_academicos: String(resumen.academico).replace('.', ','),
    puntos_competitivos: String(resumen.competitivo).replace('.', ','),
    intentos: resumen.intentos,
    estado: resumen.terminada ? 'terminada' : 'en curso',
  }
}

export { ENLACES }
