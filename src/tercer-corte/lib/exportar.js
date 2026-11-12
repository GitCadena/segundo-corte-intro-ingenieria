import { crearPdf, descargarPdf } from '../../lib/pdfSimple.js'
import { nombreAtributo } from '../data/iso.js'
import { camposAtributo } from './validadores.js'

const celda = (v) => {
  const t = String(v ?? '').replace(/\r?\n/g, ' ')
  return /[",;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t
}

const COLUMNAS_FICHA3 = [
  'equipo', 'integrantes', 'estado', 'entregada_en',
  ...[1, 2, 3].flatMap((i) => [`a${i}_atributo`, `a${i}_significa`, `a${i}_criterio`, `a${i}_prueba`]),
  'mas_importante', 'por_que',
]

/** CSV de la ficha 3 de varios equipos. `filas`: [{ equipo, miembros, estado, entregada_en, contenido }] */
export function csvFicha3(filas) {
  const lineas = [COLUMNAS_FICHA3.join(',')]
  for (const f of filas) {
    const c = f.contenido ?? {}
    const valores = COLUMNAS_FICHA3.map((col) => {
      if (col === 'equipo') return f.equipo
      if (col === 'integrantes') return (f.miembros ?? []).map((m) => `${m.apellidos}, ${m.nombres}`).join(' / ')
      if (col === 'estado') return f.estado === 'entregada' ? 'entregada' : 'en progreso'
      if (col === 'entregada_en') return f.entregada_en ?? ''
      if (/^a\d_atributo$/.test(col)) return nombreAtributo(c[col]) || ''
      if (col === 'mas_importante') return c.mas_importante ? `Atributo ${String(c.mas_importante).replace('a', '')}` : ''
      return c[col] ?? ''
    })
    lineas.push(valores.map(celda).join(','))
  }
  return '﻿' + lineas.join('\r\n')
}

export function descargarTexto(nombre, texto, tipo = 'text/csv;charset=utf-8') {
  const blob = new Blob([texto], { type: tipo })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** PDF de la ficha 3 de un equipo. */
export function pdfFicha3({ equipo, miembros, estado, contenido }) {
  const c = contenido ?? {}
  const bloques = [
    { t: 'titulo', texto: 'Ficha 3 · Calidad (ISO/IEC 25010)' },
    { t: 'sub', texto: `Proyecto: ${equipo} · ${estado === 'entregada' ? 'Entregada' : 'En progreso'}` },
    { t: 'p', texto: `Integrantes: ${(miembros ?? []).map((m) => `${m.nombres} ${m.apellidos}`).join(', ')}` },
    { t: 'linea' },
  ]
  for (let i = 1; i <= 3; i += 1) {
    const k = camposAtributo(i)
    bloques.push({ t: 'h', texto: `Atributo ${i}: ${nombreAtributo(c[k.atributo]) || '(sin elegir)'}` })
    bloques.push({ t: 'p', texto: `Qué significa en su sistema: ${c[k.significa] || '-'}` })
    bloques.push({ t: 'p', texto: `Criterio medible: ${c[k.criterio] || '-'}` })
    bloques.push({ t: 'p', texto: `Cómo se prueba: ${c[k.prueba] || '-'}` })
  }
  bloques.push({ t: 'h', texto: 'El atributo más importante' })
  bloques.push({ t: 'p', texto: `Atributo ${String(c.mas_importante ?? '').replace('a', '') || '-'}. ${c.por_que || ''}` })
  return crearPdf(bloques)
}

/* --------------------------------- Ficha 4 --------------------------------- */

const COLUMNAS_FICHA4 = ['equipo', 'integrantes', 'estado', 'entregada_en', 'proceso', 'entradas', 'salida', 'pseudocodigo', 'casos_de_prueba', 'esperado', 'obtenido', 'confirmo_companero']

const casosDe = (c) =>
  Object.keys(c)
    .filter((k) => k.startsWith('caso__'))
    .sort()
    .map((k) => `${k.replace('caso__', '')} = ${String(c[k]).replace(/\r?\n/g, ' | ')}`)
    .join(' ; ')

/** CSV de la ficha 4 de varios equipos. */
export function csvFicha4(filas) {
  const lineas = [COLUMNAS_FICHA4.join(',')]
  for (const f of filas) {
    const c = f.contenido ?? {}
    const valores = [
      f.equipo,
      (f.miembros ?? []).map((m) => `${m.apellidos}, ${m.nombres}`).join(' / '),
      f.estado === 'entregada' ? 'entregada' : 'en progreso',
      f.entregada_en ?? '',
      c.proceso ?? '',
      c.entradas ?? '',
      c.salida ?? '',
      c.pseudo ?? '',
      casosDe(c),
      c.esperado ?? '',
      c.resultado_obtenido || c.resultado_auto || '',
      c.par_nombre ?? '',
    ]
    lineas.push(valores.map(celda).join(','))
  }
  return '﻿' + lineas.join('\r\n')
}

/** PDF de la ficha 4 de un equipo. */
export function pdfFicha4({ equipo, miembros, estado, contenido }) {
  const c = contenido ?? {}
  const bloques = [
    { t: 'titulo', texto: 'Ficha 4 · Pseudocódigo del proceso principal' },
    { t: 'sub', texto: `Proyecto: ${equipo} · ${estado === 'entregada' ? 'Entregada' : 'En progreso'}` },
    { t: 'p', texto: `Integrantes: ${(miembros ?? []).map((m) => `${m.nombres} ${m.apellidos}`).join(', ')}` },
    { t: 'linea' },
    { t: 'h', texto: 'Proceso' },
    { t: 'p', texto: c.proceso || '-' },
    { t: 'h', texto: 'Entradas y salida' },
    { t: 'p', texto: `Entradas: ${String(c.entradas || '-').replace(/\r?\n/g, '; ')}` },
    { t: 'p', texto: `Salida: ${c.salida || '-'}` },
    { t: 'h', texto: 'Pseudocódigo' },
  ]
  for (const linea of String(c.pseudo || '-').split(/\r?\n/)) bloques.push({ t: 'p', texto: linea || ' ', sangria: 8 })
  bloques.push({ t: 'h', texto: 'Prueba de escritorio' })
  bloques.push({ t: 'p', texto: `Caso: ${casosDe(c) || '-'}` })
  bloques.push({ t: 'p', texto: `Resultado esperado: ${c.esperado || '-'}` })
  bloques.push({ t: 'p', texto: `Resultado obtenido: ${c.resultado_obtenido || c.resultado_auto || '-'}` })
  bloques.push({ t: 'p', texto: `Confirmación del compañero: ${c.par_nombre || '-'}` })
  return crearPdf(bloques)
}

/* --------------------------------- Ficha 5 --------------------------------- */

const COLUMNAS_FICHA5 = ['equipo', 'integrantes', 'estado', 'entregada_en', 'herramienta', 'lenguaje_1', 'codigo_1', 'nota_1', 'lenguaje_2', 'codigo_2', 'nota_2', 'resultado_con_el_caso', 'detalle_resultado', 'paradigma', 'justificacion', 'clases_o_funciones', 'lenguaje_elegido', 'por_que_el_lenguaje', 'primero_que_programan', 'para_que_sirvio_el_pseudocodigo']

const NOMBRES_LENGUAJE = { python: 'Python', javascript: 'JavaScript', java: 'Java', csharp: 'C#', cpp: 'C++' }
const lenguajeDe = (id, otro) => (id === 'otro' ? otro || 'Otro' : NOMBRES_LENGUAJE[id] ?? '')
const paradigmaDe = (c) => ({ estructurado: 'Estructurado', oo: 'Orientado a objetos' }[c.paradigma] ?? '')
const estructuraDe = (c) => (c.paradigma === 'oo' ? c.clases : c.funciones) ?? ''
const resultadoDe = (c) => ({ si: 'Dio el mismo resultado', no: 'Dio un resultado distinto', noejecuto: 'No pudieron ejecutarlo' }[c.prueba_igual] ?? '')

/** CSV de la ficha 5 de varios equipos. */
export function csvFicha5(filas) {
  const lineas = [COLUMNAS_FICHA5.join(',')]
  for (const f of filas) {
    const c = f.contenido ?? {}
    const valores = [
      f.equipo,
      (f.miembros ?? []).map((m) => `${m.apellidos}, ${m.nombres}`).join(' / '),
      f.estado === 'entregada' ? 'entregada' : 'en progreso',
      f.entregada_en ?? '',
      c.como_programan ?? '',
      lenguajeDe(c.op1_lenguaje, c.op1_lenguaje_otro),
      c.op1_codigo ?? '',
      c.op1_nota ?? '',
      lenguajeDe(c.op2_lenguaje, c.op2_lenguaje_otro),
      c.op2_codigo ?? '',
      c.op2_nota ?? '',
      resultadoDe(c),
      c.prueba_resultado ?? '',
      paradigmaDe(c),
      c.justificacion ?? '',
      estructuraDe(c),
      lenguajeDe(c.lenguaje, c.lenguaje_otro),
      c.lenguaje_porque ?? '',
      c.lenguaje_primero ?? '',
      c.pseudo_importa ?? '',
    ]
    lineas.push(valores.map(celda).join(','))
  }
  return '﻿' + lineas.join('\r\n')
}

/** PDF de la ficha 5 de un equipo. */
export function pdfFicha5({ equipo, miembros, estado, contenido }) {
  const c = contenido ?? {}
  const bloques = [
    { t: 'titulo', texto: 'Ficha 5 · Del pseudocódigo al código' },
    { t: 'sub', texto: `Proyecto: ${equipo} · ${estado === 'entregada' ? 'Entregada' : 'En progreso'}` },
    { t: 'p', texto: `Integrantes: ${(miembros ?? []).map((m) => `${m.nombres} ${m.apellidos}`).join(', ')}` },
    { t: 'linea' },
    { t: 'h', texto: 'Cómo programan' },
    { t: 'p', texto: `Herramienta: ${c.como_programan || '-'}` },
  ]
  for (const [n, p] of [[1, 'op1'], [2, 'op2']]) {
    if (!c[`${p}_lenguaje`]) continue
    bloques.push({ t: 'h', texto: `Opción ${n}: ${lenguajeDe(c[`${p}_lenguaje`], c[`${p}_lenguaje_otro`])}` })
    for (const linea of String(c[`${p}_codigo`] || '-').split(/\r?\n/)) bloques.push({ t: 'p', texto: linea || ' ', sangria: 8 })
    bloques.push({ t: 'p', texto: `Cómo les fue: ${c[`${p}_nota`] || '-'}` })
  }
  bloques.push({ t: 'p', texto: `Resultado con el caso de la ficha 4: ${resultadoDe(c) || '-'}. ${c.prueba_resultado || ''}` })
  bloques.push({ t: 'h', texto: 'Paradigma' })
  bloques.push({ t: 'p', texto: paradigmaDe(c) || '-' })
  bloques.push({ t: 'p', texto: `Justificación: ${c.justificacion || '-'}` })
  bloques.push({ t: 'h', texto: c.paradigma === 'oo' ? 'Clases' : 'Funciones' })
  for (const linea of String(estructuraDe(c) || '-').split(/\r?\n/)) bloques.push({ t: 'p', texto: linea || ' ', sangria: 8 })
  bloques.push({ t: 'h', texto: 'Lenguaje elegido' })
  bloques.push({ t: 'p', texto: lenguajeDe(c.lenguaje, c.lenguaje_otro) || '-' })
  bloques.push({ t: 'p', texto: `Por qué: ${c.lenguaje_porque || '-'}` })
  bloques.push({ t: 'p', texto: `Lo primero que programan: ${c.lenguaje_primero || '-'}` })
  bloques.push({ t: 'p', texto: `Para qué les sirvió el pseudocódigo: ${c.pseudo_importa || '-'}` })
  return crearPdf(bloques)
}

export { descargarPdf }
