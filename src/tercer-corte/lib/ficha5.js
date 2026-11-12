/**
 * Ficha 5 · Segundo proceso, paradigma y lenguaje (Grupo 3). Reutiliza la revisión
 * de la ficha 4 para el segundo proceso y agrega paradigma, justificación,
 * clases o funciones y la elección del lenguaje. Lógica pura.
 */
import { revisarFicha4 } from './ficha4.js'

export const PARADIGMAS = [
  {
    id: 'estructurado',
    titulo: 'Estructurado',
    texto: 'El programa se escribe como una secuencia de pasos agrupados en funciones. Los datos y lo que se hace con ellos van por separado.',
    cuando: 'Conviene cuando el problema es sobre todo una serie de cálculos o pasos, con pocos tipos de «cosas» distintas.',
  },
  {
    id: 'oo',
    titulo: 'Orientado a objetos',
    texto: 'El programa se organiza en clases: cada una representa una cosa del problema (pedido, producto, cliente) con sus datos y lo que sabe hacer.',
    cuando: 'Conviene cuando el problema tiene entidades claras, cada una con sus reglas, y se van a agregar cosas nuevas con el tiempo.',
  },
]

export const LENGUAJES = [
  { id: 'python', nombre: 'Python', texto: 'Se escribe casi como el pseudocódigo. Muy usado para empezar, para datos y para automatizar tareas.', ideal: 'Equipos que quieren ver resultados rápido y no tienen experiencia.' },
  { id: 'javascript', nombre: 'JavaScript', texto: 'Corre en cualquier navegador sin instalar nada. Sirve para páginas y aplicaciones web.', ideal: 'Proyectos que se usan desde el navegador o el celular.' },
  { id: 'java', nombre: 'Java', texto: 'Muy usado en empresas y en Android. Obliga a ser ordenado: todo va en clases y los tipos se declaran.', ideal: 'Proyectos orientados a objetos con reglas claras.' },
  { id: 'csharp', nombre: 'C#', texto: 'Parecido a Java, con muy buenas herramientas. Se usa en aplicaciones de escritorio, web y juegos (Unity).', ideal: 'Aplicaciones de escritorio, web o videojuegos.' },
  { id: 'cpp', nombre: 'C++', texto: 'Muy rápido y cercano al hardware, pero más difícil de aprender.', ideal: 'Equipos con quien ya lo conozca o proyectos que necesitan mucho rendimiento.' },
  { id: 'otro', nombre: 'Otro', texto: 'Si tienen razones de peso para usar otro lenguaje, escríbanlo y defiéndanlo.', ideal: 'Cuando el docente o el equipo ya lo trabajaron.' },
]

const lleno = (v) => String(v ?? '').trim() !== ''
const largo = (v) => String(v ?? '').trim().length
const lineasCon = (v) => String(v ?? '').split(/\r?\n/).filter((l) => l.trim() !== '')

export const nombreLenguaje = (c) => (c.lenguaje === 'otro' ? String(c.lenguaje_otro ?? '').trim() : LENGUAJES.find((l) => l.id === c.lenguaje)?.nombre ?? '')
export const nombreParadigma = (c) => PARADIGMAS.find((p) => p.id === c.paradigma)?.titulo ?? ''

/** Las clases (orientado a objetos) o las funciones (estructurado) se listan una por línea. */
export const claveDeEstructura = (c) => (c.paradigma === 'oo' ? 'clases' : 'funciones')

export function revisarFicha5(c) {
  const base = revisarFicha4(c)
  const estructura = lineasCon(c[claveDeEstructura(c)])
  const eligioOtro = c.lenguaje === 'otro'
  const extra = [
    {
      id: 'paradigma',
      texto: 'Eligieron el paradigma del proyecto',
      ok: c.paradigma === 'estructurado' || c.paradigma === 'oo',
      pista: null,
    },
    {
      id: 'justificacion',
      texto: 'Justificaron el paradigma hablando de su problema (unas tres líneas)',
      ok: largo(c.justificacion) >= 80,
      pista: lleno(c.justificacion) && largo(c.justificacion) < 80 ? 'Es muy corta: expliquen con ejemplos de su sistema por qué ese paradigma les sirve.' : null,
    },
    {
      id: 'estructura',
      texto: c.paradigma === 'oo' ? 'Listaron las clases y qué hace cada una' : 'Listaron las funciones principales y qué hace cada una',
      ok: estructura.length >= 2,
      pista: lleno(c[claveDeEstructura(c)]) && estructura.length < 2 ? 'Escriban al menos dos, una por línea.' : null,
    },
    {
      id: 'lenguaje',
      texto: 'Eligieron el lenguaje de programación',
      ok: lleno(c.lenguaje) && (!eligioOtro || lleno(c.lenguaje_otro)),
      pista: eligioOtro && !lleno(c.lenguaje_otro) ? 'Escriban cuál es el lenguaje.' : null,
    },
    {
      id: 'lenguaje_porque',
      texto: 'Explicaron por qué ese lenguaje es el adecuado para su proyecto',
      ok: largo(c.lenguaje_porque) >= 60,
      pista: lleno(c.lenguaje_porque) && largo(c.lenguaje_porque) < 60 ? 'Den razones de su proyecto: qué van a construir, dónde se usará, quién lo conoce.' : null,
    },
    {
      id: 'primero',
      texto: 'Dijeron qué van a programar primero',
      ok: largo(c.lenguaje_primero) >= 10,
      pista: null,
    },
    {
      id: 'importo',
      texto: 'Explicaron con sus palabras para qué les sirvió el pseudocódigo',
      ok: largo(c.pseudo_importa) >= 60,
      pista: lleno(c.pseudo_importa) && largo(c.pseudo_importa) < 60 ? 'Cuenten algo concreto: qué error encontraron o qué decisión se facilitó.' : null,
    },
  ]
  const puntos = [...base.puntos.filter((p) => p.id !== 'par'), ...extra]
  const lineasPseudo = lineasCon(c.pseudo).length
  return {
    ...base,
    puntos,
    // Para entregar basta lo esencial: el segundo proceso escrito, el paradigma justificado y el lenguaje.
    // El intérprete no entiende todas las formas de escribir y el docente revisa cada ficha a mano.
    puedeEntregar:
      lineasPseudo >= 2 &&
      (c.paradigma === 'estructurado' || c.paradigma === 'oo') &&
      largo(c.justificacion) >= 40 &&
      lleno(c.lenguaje) &&
      (!eligioOtro || lleno(c.lenguaje_otro)),
    completa: puntos.every((p) => p.ok),
  }
}
