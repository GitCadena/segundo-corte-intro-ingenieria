/**
 * Batería de verificación del contenido.
 *
 *   node pruebas/verificar.mjs
 *
 * Comprueba, sin abrir el navegador:
 *  1. El intérprete de pseudocódigo: casos normales, límite y errores.
 *  2. Que TODA solución guardada pase TODOS sus casos de prueba.
 *  3. Que soluciones incorrectas representativas efectivamente fallen.
 *  4. Que los algoritmos armables y los pseudocódigos completables funcionen.
 *  5. La coherencia del contenido: ids únicos, pistas, explicaciones,
 *     opciones correctas dentro de rango, claves de glosario existentes.
 *  6. Las reglas de puntaje.
 */

import { ejecutarSeguro, evaluarCasos } from '../src/lib/pseudo.js'
import { estaciones, catalogoActividades, datosActividad } from '../src/data/catalogo.js'
import glosario from '../src/data/glosario.js'
import logros from '../src/data/logros.js'
import { calcularPuntaje, calcularEstado } from '../src/lib/puntaje.js'
import { FASES } from '../src/data/cdvs-fases.js'
import {
  LAB_ID, ACCIONES_RUTA, ELEMENTOS_FLUJO, ETAPAS_FLUJO, SITUACIONES_CALIDAD, CARACTERISTICAS, RESULTADOS, ENLACES,
  REQUISITOS_DEPENDENCIAS, REVISION, PUNTOS, SECTORES,
} from '../src/data/lab-cdvs.js'
import * as Lab from '../src/lib/labCdvs.js'
import { crearPdf } from '../src/lib/pdfSimple.js'

let ok = 0
let fallos = []

function prueba(nombre, fn) {
  try {
    const r = fn()
    if (r === true || r === undefined) ok++
    else fallos.push(`${nombre}: ${r}`)
  } catch (e) {
    fallos.push(`${nombre}: excepción ${e.message}`)
  }
}

function igual(a, b, nombre) {
  const x = JSON.stringify(a)
  const y = JSON.stringify(b)
  return x === y ? true : `${nombre ?? ''} esperaba ${y}, obtuvo ${x}`
}

/* ======================= 1. Intérprete de pseudocódigo ==================== */

const CASOS_INTERPRETE = [
  {
    n: 'secuencia y salida',
    codigo: 'Algoritmo A\n\tEscribir "hola"\n\tEscribir 2 + 3\nFinAlgoritmo',
    entradas: [],
    salida: ['hola', '5'],
  },
  {
    n: 'lectura y concatenación',
    codigo: 'Algoritmo A\n\tDefinir x Como Cadena\n\tLeer x\n\tEscribir "Hola ", x\nFinAlgoritmo',
    entradas: ['Ana'],
    salida: ['Hola Ana'],
  },
  {
    n: 'condicional con Sino',
    codigo: 'Algoritmo A\n\tDefinir n Como Entero\n\tLeer n\n\tSi n > 5 Entonces\n\t\tEscribir "grande"\n\tSino\n\t\tEscribir "chico"\n\tFinSi\nFinAlgoritmo',
    entradas: [3],
    salida: ['chico'],
  },
  {
    n: 'frontera del Si (>= con el valor exacto)',
    codigo: 'Algoritmo A\n\tDefinir n Como Entero\n\tLeer n\n\tSi n >= 5 Entonces\n\t\tEscribir "si"\n\tSino\n\t\tEscribir "no"\n\tFinSi\nFinAlgoritmo',
    entradas: [5],
    salida: ['si'],
  },
  {
    n: 'Mientras que no entra ninguna vez',
    codigo: 'Algoritmo A\n\tDefinir i Como Entero\n\ti <- 10\n\tMientras i < 5 Hacer\n\t\tEscribir i\n\t\ti <- i + 1\n\tFinMientras\n\tEscribir "fin"\nFinAlgoritmo',
    entradas: [],
    salida: ['fin'],
  },
  {
    n: 'Repetir entra al menos una vez',
    codigo: 'Algoritmo A\n\tDefinir i Como Entero\n\ti <- 10\n\tRepetir\n\t\tEscribir i\n\t\ti <- i + 1\n\tHasta Que i > 5\nFinAlgoritmo',
    entradas: [],
    salida: ['10'],
  },
  {
    n: 'Para con paso negativo',
    codigo: 'Algoritmo A\n\tDefinir i Como Entero\n\tPara i <- 3 Hasta 1 Con Paso -1 Hacer\n\t\tEscribir i\n\tFinPara\nFinAlgoritmo',
    entradas: [],
    salida: ['3', '2', '1'],
  },
  {
    n: 'Para con n = 0 no ejecuta el cuerpo',
    codigo: 'Algoritmo A\n\tDefinir n, i Como Entero\n\tLeer n\n\tPara i <- 1 Hasta n Hacer\n\t\tEscribir i\n\tFinPara\n\tEscribir "fin"\nFinAlgoritmo',
    entradas: [0],
    salida: ['fin'],
  },
  {
    n: 'arreglo base 1',
    codigo: 'Algoritmo A\n\tDimension v[3]\n\tv[1] <- 7\n\tv[3] <- 9\n\tEscribir v[1] + v[3]\nFinAlgoritmo',
    entradas: [],
    salida: ['16'],
  },
  {
    n: 'operadores MOD y potencia',
    codigo: 'Algoritmo A\n\tEscribir 7 MOD 3\n\tEscribir 2 ^ 10\nFinAlgoritmo',
    entradas: [],
    salida: ['1', '1024'],
  },
  {
    n: 'operadores lógicos',
    codigo: 'Algoritmo A\n\tSi 3 > 1 Y NO (2 > 5) Entonces\n\t\tEscribir "ok"\n\tFinSi\nFinAlgoritmo',
    entradas: [],
    salida: ['ok'],
  },
  {
    n: 'funciones de número',
    codigo: 'Algoritmo A\n\tEscribir raiz(16)\n\tEscribir trunc(3.9)\n\tEscribir redondear(3.6)\n\tEscribir abs(-4)\nFinAlgoritmo',
    entradas: [],
    salida: ['4', '3', '4', '4'],
  },
  {
    n: 'funciones de cadena',
    codigo: 'Algoritmo A\n\tEscribir longitud("hola")\n\tEscribir mayusculas("ab")\n\tEscribir subcadena("Unimayor", 1, 3)\nFinAlgoritmo',
    entradas: [],
    salida: ['4', 'AB', 'Uni'],
  },
  {
    n: 'truncado a un decimal (patrón del curso)',
    codigo: 'Algoritmo A\n\tDefinir s Como Real\n\ts <- 14\n\tEscribir trunc(s / 4 * 10) / 10\nFinAlgoritmo',
    entradas: [],
    salida: ['3.5'],
  },
  {
    n: 'comentarios de línea y de bloque',
    codigo: 'Algoritmo A\n\t// comentario\n\t/* otro\n\tmás */\n\tEscribir 1\nFinAlgoritmo',
    entradas: [],
    salida: ['1'],
  },
]

for (const c of CASOS_INTERPRETE) {
  prueba(`intérprete · ${c.n}`, () => {
    const r = ejecutarSeguro(c.codigo, c.entradas)
    if (!r.ok) return `error inesperado: ${r.error}`
    return igual(r.salida, c.salida)
  })
}

const ERRORES_INTERPRETE = [
  { n: 'ciclo infinito se corta', codigo: 'Algoritmo A\n\tDefinir i Como Entero\n\ti <- 1\n\tMientras i > 0 Hacer\n\t\ti <- i + 1\n\tFinMientras\nFinAlgoritmo', contiene: 'nunca termina' },
  { n: 'variable sin valor', codigo: 'Algoritmo A\n\tEscribir x\nFinAlgoritmo', contiene: 'sin haber recibido un valor' },
  { n: 'división entre cero', codigo: 'Algoritmo A\n\tEscribir 1 / 0\nFinAlgoritmo', contiene: 'División entre cero' },
  { n: 'faltan datos de entrada', codigo: 'Algoritmo A\n\tDefinir x Como Entero\n\tLeer x\nFinAlgoritmo', contiene: 'más datos' },
  { n: 'índice fuera del arreglo', codigo: 'Algoritmo A\n\tDimension v[2]\n\tv[5] <- 1\nFinAlgoritmo', contiene: 'fuera de' },
  { n: 'FinSi ausente', codigo: 'Algoritmo A\n\tSi 1 > 0 Entonces\n\t\tEscribir 1\nFinAlgoritmo', contiene: 'FinSi' },
  { n: 'comilla sin cerrar', codigo: 'Algoritmo A\n\tEscribir "hola\nFinAlgoritmo', contiene: 'comilla' },
  { n: 'condición que no es lógica', codigo: 'Algoritmo A\n\tSi 3 Entonces\n\t\tEscribir 1\n\tFinSi\nFinAlgoritmo', contiene: 'verdadera o falsa' },
  { n: 'salida desbordada', codigo: 'Algoritmo A\n\tDefinir i Como Entero\n\tPara i <- 1 Hasta 5000 Hacer\n\t\tEscribir i\n\tFinPara\nFinAlgoritmo', contiene: 'demasiadas líneas' },
]

for (const c of ERRORES_INTERPRETE) {
  prueba(`intérprete · error · ${c.n}`, () => {
    const r = ejecutarSeguro(c.codigo, [])
    if (r.ok) return 'no falló y debía fallar'
    return r.error.toLowerCase().includes(c.contiene.toLowerCase())
      ? true
      : `mensaje inesperado: ${r.error}`
  })
}

prueba('intérprete · la traza registra los cambios de variable', () => {
  const r = ejecutarSeguro('Algoritmo A\n\tDefinir a Como Entero\n\ta <- 1\n\ta <- a + 4\nFinAlgoritmo', [], { traza: true })
  if (!r.ok) return r.error
  const ultimo = r.traza[r.traza.length - 1]
  return ultimo.variables.a === '5' ? true : `a valía ${ultimo.variables.a}`
})

/* ============== 2. Soluciones guardadas contra sus casos ================ */

function recorrerActividades(fn) {
  for (const e of estaciones) {
    for (const a of e.actividades ?? []) fn(a, e)
    if (e.reto) {
      if (e.reto.tipo === 'secuencia') for (const p of e.reto.pasos) fn({ ...p, titulo: `${e.reto.titulo} · ${p.id}` }, e, e.reto)
      else fn(e.reto, e)
    }
  }
}

recorrerActividades((a, e) => {
  if (a.tipo !== 'pseudo' || !a.solucion) return
  prueba(`solución pseudo · ${e.id} · ${a.id ?? a.titulo}`, () => {
    const res = evaluarCasos(a.solucion, a.casos)
    const malos = res.filter((r) => !r.ok)
    if (malos.length === 0) return true
    return malos.map((m) => `«${m.descripcion}» esperaba [${m.esperado}] y obtuvo ${m.error ?? `[${m.salida}]`}`).join(' | ')
  })
})

/* -------- 2b. Soluciones incorrectas representativas deben fallar -------- */

const SOLUCIONES_MALAS = [
  {
    n: 'centinela con "> 0" en vez de "<> -1" falla con negativos válidos',
    actividad: 'e5-a7-centinela',
    codigo: `Algoritmo Centinela
	Definir x, suma, cuantos Como Entero
	suma <- 0
	cuantos <- 0
	Leer x
	Mientras x > 0 Hacer
		suma <- suma + x
		cuantos <- cuantos + 1
		Leer x
	FinMientras
	Escribir "SUMA: ", suma
	Escribir "DATOS: ", cuantos
FinAlgoritmo`,
  },
  {
    n: 'informe con ">" en vez de ">=" falla en la frontera 3,0',
    actividad: 'e5-reto',
    codigo: `Algoritmo Informe
	Definir n, i, aprobados Como Entero
	Definir nota, suma, maxima Como Real
	Leer n
	suma <- 0
	aprobados <- 0
	maxima <- 0
	Para i <- 1 Hasta n Hacer
		Leer nota
		suma <- suma + nota
		Si nota > 3 Entonces
			aprobados <- aprobados + 1
		FinSi
		Si nota > maxima Entonces
			maxima <- nota
		FinSi
	FinPara
	Escribir "PROMEDIO: ", trunc(suma / n * 10) / 10
	Escribir "APROBADOS: ", aprobados
	Escribir "MAXIMA: ", maxima
FinAlgoritmo`,
  },
  {
    n: 'inicializar el acumulador dentro del ciclo falla',
    actividad: 'e5-a4-ciclo',
    codigo: `Algoritmo Contar
	Definir n, i, suma Como Entero
	Leer n
	i <- 1
	Mientras i <= n Hacer
		suma <- 0
		Escribir i
		suma <- suma + i
		i <- i + 1
	FinMientras
	Escribir "SUMA: ", suma
FinAlgoritmo`,
  },
]

for (const m of SOLUCIONES_MALAS) {
  prueba(`solución incorrecta debe fallar · ${m.n}`, () => {
    const d = datosActividad(m.actividad)
    if (!d) return `no encontré la actividad ${m.actividad}`
    const res = evaluarCasos(m.codigo, d.actividad.casos)
    return res.some((r) => !r.ok) ? true : 'pasó todos los casos y no debía'
  })
}

/* ============ 3. Armar algoritmo: el orden correcto sí ejecuta =========== */

recorrerActividades((a, e) => {
  if (a.tipo !== 'algoritmo') return
  prueba(`armar algoritmo · ${a.id}`, () => {
    const codigo = [a.cabecera, ...a.bloques.map((b) => '\t'.repeat(b.indent) + b.codigo), a.pie].join('\n')
    const res = evaluarCasos(codigo, a.casos)
    const malos = res.filter((r) => !r.ok)
    if (malos.length > 0) return malos.map((m) => `«${m.descripcion}»: ${m.error ?? m.salida}`).join(' | ')
    return true
  })

  prueba(`armar algoritmo · un orden equivocado falla · ${a.id}`, () => {
    const revuelto = [...a.bloques].reverse()
    const codigo = [a.cabecera, ...revuelto.map((b) => '\t'.repeat(b.indent) + b.codigo), a.pie].join('\n')
    const res = evaluarCasos(codigo, a.casos)
    return res.some((r) => !r.ok) ? true : 'el orden invertido pasó y no debía'
  })
})

/* ============ 4. Completar pseudocódigo: hay una combinación válida ====== */

recorrerActividades((a, e) => {
  if (a.tipo !== 'completar') return
  const claves = Object.keys(a.huecos)

  const combinaciones = (i = 0, actual = {}) => {
    if (i === claves.length) return [actual]
    const k = claves[i]
    return a.huecos[k].opciones.flatMap((op) => combinaciones(i + 1, { ...actual, [k]: op }))
  }

  const todas = combinaciones()
  const validas = todas.filter((c) => {
    let codigo = a.plantilla
    for (const k of claves) codigo = codigo.replaceAll(`{{${k}}}`, c[k])
    return evaluarCasos(codigo, a.casos).every((r) => r.ok)
  })

  prueba(`completar · ${a.id} · existe al menos una combinación que pasa`, () =>
    validas.length > 0 ? true : `ninguna de las ${todas.length} combinaciones pasa los casos`,
  )

  prueba(`completar · ${a.id} · no todas las combinaciones pasan`, () =>
    validas.length < todas.length ? true : 'todas las combinaciones pasan: la actividad no discrimina',
  )

  // Cada opción marcada con porQueNo debe producir al menos un fallo.
  for (const k of claves) {
    const razones = a.huecos[k].porQueNo ?? {}
    for (const mala of Object.keys(razones)) {
      prueba(`completar · ${a.id} · «${mala}» en ${k} debe fallar`, () => {
        // Se combina la opción mala con una combinación válida conocida.
        if (validas.length === 0) return 'no hay combinación válida de referencia'
        const c = { ...validas[0], [k]: mala }
        let codigo = a.plantilla
        for (const kk of claves) codigo = codigo.replaceAll(`{{${kk}}}`, c[kk])
        const res = evaluarCasos(codigo, a.casos)
        return res.some((r) => !r.ok)
          ? true
          : 'pasa todos los casos, así que su explicación de "por qué no" es falsa'
      })
    }
  }
})

/* ============ 5. Traza: el código de la actividad debe ejecutar ========== */

recorrerActividades((a, e) => {
  if (a.tipo !== 'traza') return
  prueba(`traza · ${a.id} ejecuta y expone sus variables`, () => {
    const r = ejecutarSeguro(a.codigo, a.entradas ?? [], { traza: true })
    if (!r.ok) return r.error
    if (r.traza.length === 0) return 'no produjo pasos'
    const faltan = a.variables.filter((v) => !(v in r.traza[r.traza.length - 1].variables))
    return faltan.length === 0 ? true : `faltan variables en la traza: ${faltan.join(', ')}`
  })
})

/* ==================== 6. Coherencia del contenido ======================= */

prueba('catálogo · identificadores únicos', () => {
  const ids = catalogoActividades.map((a) => a.id)
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i)
  return dup.length === 0 ? true : `duplicados: ${dup.join(', ')}`
})

prueba('catálogo · toda actividad puntuable tiene puntos positivos', () => {
  const malas = catalogoActividades.filter((a) => a.tipo !== 'taller' && a.tipo !== 'laboratorio' && a.tipo !== 'laboratorio-cdvs' && a.puntos <= 0)
  return malas.length === 0 ? true : malas.map((a) => a.id).join(', ')
})

recorrerActividades((a, e) => {
  const id = a.id ?? a.titulo

  if (a.tipo === 'quiz') {
    prueba(`quiz · ${id} · correcta dentro de rango`, () =>
      a.correcta >= 0 && a.correcta < a.opciones.length ? true : `correcta=${a.correcta}`,
    )
    prueba(`quiz · ${id} · toda opción incorrecta explica por qué`, () => {
      const faltan = a.opciones.map((_, i) => i).filter((i) => i !== a.correcta && !a.porQueNo?.[i])
      return faltan.length === 0 ? true : `sin explicación: ${faltan.join(', ')}`
    })
  }

  if (a.tipo === 'clasificar') {
    prueba(`clasificar · ${id} · todo item cae en un grupo declarado`, () => {
      const grupos = a.grupos.map((g) => g.id)
      const malos = a.items.filter((i) => !grupos.includes(i.grupo))
      return malos.length === 0 ? true : malos.map((m) => m.texto).join(' | ')
    })
    prueba(`clasificar · ${id} · todo item explica su grupo`, () =>
      a.items.every((i) => i.porQue) ? true : 'hay items sin porQue',
    )
    if (a.remate) {
      prueba(`clasificar · ${id} · remate con correcta válida`, () =>
        a.remate.correcta >= 0 && a.remate.correcta < a.remate.opciones.length ? true : 'fuera de rango',
      )
    }
  }

  if (a.tipo === 'emparejar') {
    prueba(`emparejar · ${id} · cada izquierda tiene pareja válida`, () => {
      const der = a.derecha.map((d) => d.id)
      const malos = a.izquierda.filter((i) => !der.includes(a.pares[i.id]))
      return malos.length === 0 ? true : malos.map((m) => m.id).join(', ')
    })
  }

  if (a.tipo === 'vf') {
    prueba(`vf · ${id} · toda afirmación explica su veredicto`, () =>
      a.afirmaciones.every((f) => f.explicacion && typeof f.verdadero === 'boolean') ? true : 'faltan datos',
    )
  }

  if (a.tipo === 'orden') {
    prueba(`orden · ${id} · las dependencias usan ids existentes`, () => {
      const ids = a.items.map((i) => i.id)
      const malas = a.dependencias.filter(([x, y]) => !ids.includes(x) || !ids.includes(y))
      return malas.length === 0 ? true : JSON.stringify(malas)
    })
    prueba(`orden · ${id} · existe al menos un orden que las respeta`, () => {
      // Orden topológico: si hay ciclo, la actividad es irresoluble.
      const ids = a.items.map((i) => i.id)
      const entrantes = Object.fromEntries(ids.map((i) => [i, 0]))
      for (const [, y] of a.dependencias) entrantes[y]++
      const cola = ids.filter((i) => entrantes[i] === 0)
      let visitados = 0
      while (cola.length) {
        const n = cola.shift()
        visitados++
        for (const [x, y] of a.dependencias) {
          if (x === n && --entrantes[y] === 0) cola.push(y)
        }
      }
      return visitados === ids.length ? true : 'las dependencias forman un ciclo'
    })
  }

  if (a.tipo === 'entrega') {
    prueba(`entrega · ${id} · las obligatorias caben en la capacidad`, () => {
      const costo = a.criterio.obligatorias
        .map((oid) => a.opciones.find((o) => o.id === oid)?.costo ?? 0)
        .reduce((s, c) => s + c, 0)
      return costo <= a.capacidad ? true : `las obligatorias cuestan ${costo} y la capacidad es ${a.capacidad}`
    })
    prueba(`entrega · ${id} · criterios usan ids existentes`, () => {
      const ids = a.opciones.map((o) => o.id)
      const malos = [...a.criterio.obligatorias, ...a.criterio.prohibidas].filter((x) => !ids.includes(x))
      return malos.length === 0 ? true : malos.join(', ')
    })
  }

  if (a.tipo === 'caso') {
    prueba(`caso · ${id} · exactamente una decisión acertada`, () => {
      const n = a.decisiones.filter((d) => d.acertada).length
      return n === 1 ? true : `hay ${n} acertadas`
    })
    prueba(`caso · ${id} · toda decisión tiene consecuencia y porqué`, () =>
      a.decisiones.every((d) => d.consecuencia && d.porQue) ? true : 'faltan textos',
    )
  }

  if (a.tipo === 'limites') {
    prueba(`límites · ${id} · hay valores necesarios y redundantes`, () => {
      const nec = a.valores.filter((v) => v.necesario).length
      return nec > 0 && nec < a.valores.length ? true : `necesarios=${nec} de ${a.valores.length}`
    })
    prueba(`límites · ${id} · cubre los dos bordes por dentro y por fuera`, () => {
      // Se exige el invariante, no valores literales: el último válido y el
      // primero inválido de cada extremo. Cuál es "el primero inválido"
      // depende de la regla (con múltiplos de 30, 210 informa más que 181).
      const nums = a.valores
        .filter((v) => v.necesario && !Number.isNaN(Number(v.valor)))
        .map((v) => Number(v.valor))
      const faltan = []
      if (!nums.includes(a.regla.min)) faltan.push(`el mínimo (${a.regla.min})`)
      if (!nums.includes(a.regla.max)) faltan.push(`el máximo (${a.regla.max})`)
      if (!nums.some((n) => n < a.regla.min)) faltan.push('un valor por debajo del mínimo')
      if (!nums.some((n) => n > a.regla.max)) faltan.push('un valor por encima del máximo')
      return faltan.length === 0 ? true : `faltan: ${faltan.join(', ')}`
    })
  }

  if (a.tipo === 'calcular') {
    prueba(`calcular · ${id} · todo campo trae respuesta y fórmulas visibles`, () =>
      a.campos.every((c) => c.respuestas?.length > 0) && a.formulas?.length > 0
        ? true
        : 'faltan respuestas o fórmulas',
    )
  }

  if (a.tipo === 'tabla-pruebas') {
    prueba(`tabla-pruebas · ${id} · resultados y motivos existen`, () => {
      const res = a.resultados.map((r) => r.id)
      const mot = a.motivos.map((m) => m.id)
      const malas = a.filas.filter((f) => !res.includes(f.resultado) || !mot.includes(f.motivo))
      return malas.length === 0 ? true : malas.map((f) => f.entrada).join(', ')
    })
  }

  if (a.tipo === 'datos-necesarios') {
    prueba(`datos · ${id} · todo dato que se pide declara finalidad`, () => {
      const malos = a.datos.filter((d) => d.pedir && !d.finalidad)
      return malos.length === 0 ? true : malos.map((d) => d.id).join(', ')
    })
    prueba(`datos · ${id} · hay datos que sí y datos que no`, () => {
      const si = a.datos.filter((d) => d.pedir).length
      return si > 0 && si < a.datos.length ? true : 'todos iguales'
    })
  }

  if (a.tipo === 'clase-objeto') {
    prueba(`clases · ${id} · objetos y miembros apuntan a clases declaradas`, () => {
      const cl = a.clases.map((c) => c.id)
      const malos = [...a.objetos, ...a.miembros].filter((x) => !cl.includes(x.clase))
      return malos.length === 0 ? true : malos.map((m) => m.texto).join(', ')
    })
  }

  if (a.tipo === 'predice') {
    prueba(`predice · ${id} · el resultado coincide con la opción correcta`, () =>
      a.escenarios.every((e2) => e2.correcta >= 0 && e2.correcta < e2.opciones.length)
        ? true
        : 'opción correcta fuera de rango',
    )
  }
})

/* --------------------------- fichas obligatorias -------------------------- */

for (const e of estaciones) {
  for (const a of e.actividades ?? []) {
    prueba(`ficha · ${a.id} · objetivo, instrucciones y concepto previo`, () =>
      a.objetivo && a.instrucciones && a.conceptoPrevio ? true : 'faltan campos de la ficha',
    )
    prueba(`ficha · ${a.id} · pistas progresivas y explicación`, () =>
      (a.tipo === 'laboratorio-cdvs' || (a.pistas?.length ?? 0) >= 2) && a.explicacion ? true : `pistas=${a.pistas?.length ?? 0}`,
    )
    prueba(`ficha · ${a.id} · conceptos declarados existen en el glosario`, () => {
      const malos = (a.conceptos ?? []).filter((c) => !glosario[c])
      return malos.length === 0 ? true : malos.join(', ')
    })
  }

  prueba(`estación ${e.id} · tiene las seis secciones`, () => {
    const faltan = []
    if (!e.aprenderas?.objetivo) faltan.push('aprenderas')
    if (!e.comprende?.length) faltan.push('comprende')
    if (!e.ejemplo?.pasos?.length) faltan.push('ejemplo')
    if (!(e.actividades?.length || e.reto)) faltan.push('practica')
    // La Estación 2 retiró su reto: la práctica final la hace el taller
    // individual "Tu propio caso" (con el código propio del estudiante).
    // La Estación 5 (ciclo de vida) tiene una sola actividad principal de clase: el laboratorio.
    if (!e.reto && e.id !== 'calidad' && e.id !== 'cdvs') faltan.push('reto')
    if (!e.sintesis?.puntos?.length) faltan.push('sintesis')
    return faltan.length === 0 ? true : `faltan: ${faltan.join(', ')}`
  })

  prueba(`estación ${e.id} · claves de glosario válidas`, () => {
    const malos = (e.glosario ?? []).filter((c) => !glosario[c])
    return malos.length === 0 ? true : malos.join(', ')
  })

  if (e.profundiza) {
    prueba(`estación ${e.id} · «quiero entender mejor» apunta a tarjetas reales`, () => {
      const titulos = e.comprende.map((l) => l.titulo)
      const malos = Object.keys(e.profundiza).filter((t) => !titulos.includes(t))
      return malos.length === 0 ? true : malos.join(' | ')
    })
  }
}

prueba('mecánicas · están los diez formatos exigidos', () => {
  const tipos = new Set(catalogoActividades.map((a) => a.tipo))
  const exigidos = {
    Ordenar: ['orden'],
    Emparejar: ['emparejar'],
    Clasificar: ['clasificar'],
    'Verdadero/falso': ['vf'],
    Calcular: ['calcular'],
    'Decidir sobre un caso': ['caso', 'entrega', 'datos-necesarios'],
    'Armar algoritmos': ['algoritmo'],
    'Completar pseudocódigo': ['completar', 'pseudo'],
    Simuladores: ['explora-moore', 'romper-formulario', 'formulario-friccion', 'mejora-interfaz', 'predice'],
    Talleres: ['taller'],
  }
  const faltan = Object.entries(exigidos)
    .filter(([, lista]) => !lista.some((t) => tipos.has(t)))
    .map(([nombre]) => nombre)
  return faltan.length === 0 ? true : `faltan mecánicas: ${faltan.join(', ')}`
})

prueba('logros · todas las condiciones se evalúan sin error', () => {
  const resumenVacio = {
    dominadas: 0,
    completadasOpcionales: 0,
    completadasPorTipo: () => 0,
    estacionBaseCompleta: () => false,
    porcentajeEstacion: () => 0,
  }
  const malos = logros.filter((l) => {
    try {
      l.condicion(resumenVacio)
      return false
    } catch {
      return true
    }
  })
  return malos.length === 0 ? true : malos.map((l) => l.id).join(', ')
})

prueba('logros · ninguno se otorga con progreso vacío', () => {
  const vacio = {
    dominadas: 0,
    completadasOpcionales: 0,
    completadasPorTipo: () => 0,
    estacionBaseCompleta: () => false,
    porcentajeEstacion: () => 0,
  }
  const otorgados = logros.filter((l) => l.condicion(vacio))
  return otorgados.length === 0 ? true : `se otorgan sin evidencia: ${otorgados.map((l) => l.id).join(', ')}`
})

/* ======================= 7. Reglas de puntaje =========================== */

const CASOS_PUNTAJE = [
  { n: 'primer intento sin pistas', e: { puntosMax: 100, correcto: true }, esperado: 100 },
  { n: 'una pista', e: { puntosMax: 100, correcto: true, pistas: 1 }, esperado: 80 },
  { n: 'dos pistas', e: { puntosMax: 100, correcto: true, pistas: 2 }, esperado: 60 },
  { n: 'tres pistas llega al piso', e: { puntosMax: 100, correcto: true, pistas: 3 }, esperado: 40 },
  { n: 'cuatro pistas no baja del piso', e: { puntosMax: 100, correcto: true, pistas: 4 }, esperado: 40 },
  { n: 'un intento fallido', e: { puntosMax: 100, correcto: true, intentosFallidos: 1 }, esperado: 90 },
  { n: 'pista más fallo', e: { puntosMax: 100, correcto: true, pistas: 1, intentosFallidos: 1 }, esperado: 70 },
  { n: 'incorrecto vale 0', e: { puntosMax: 100, correcto: false }, esperado: 0 },
  { n: 'ver la solución vale 0', e: { puntosMax: 100, correcto: true, solucionVista: true }, esperado: 0 },
]

for (const c of CASOS_PUNTAJE) {
  prueba(`puntaje · ${c.n}`, () => {
    const v = calcularPuntaje(c.e)
    return v === c.esperado ? true : `esperaba ${c.esperado}, obtuvo ${v}`
  })
}

prueba('estado · dominio solo sin pistas y sin fallos', () => {
  const a = calcularEstado({ correcto: true })
  const b = calcularEstado({ correcto: true, pistas: 1 })
  const c = calcularEstado({ correcto: true, intentosFallidos: 1 })
  const d = calcularEstado({ correcto: false })
  const e = calcularEstado({ correcto: true, solucionVista: true })
  return a === 'dominada' && b === 'completada' && c === 'completada' && d === 'intentada' && e === 'completada'
    ? true
    : `${a}/${b}/${c}/${d}/${e}`
})


/* ============ 8. Laboratorio del ciclo de vida (Estación 5) ============== */

const NOMBRES_KENDALL = [
  'Identificar problemas, oportunidades y objetivos',
  'Determinar los requerimientos de información',
  'Analizar las necesidades del sistema',
  'Diseñar el sistema recomendado',
  'Desarrollar y documentar el software',
  'Probar y mantener el sistema',
  'Implementar y evaluar el sistema',
]

prueba('ciclo de vida · las siete fases usan los nombres de Kendall y Kendall, en orden', () => {
  const nombres = FASES.map((f) => f.nombre)
  return JSON.stringify(nombres) === JSON.stringify(NOMBRES_KENDALL) && FASES.every((f, i) => f.id === `f${i + 1}` && f.numero === i + 1)
    ? true
    : nombres.join(' | ')
})

prueba('ciclo de vida · cada fase trae pregunta, explicación, actividades, resultado y ejemplo', () => {
  const malas = FASES.filter((f) => !f.pregunta || !f.explicacion || !(f.queHacen?.length >= 3) || !f.resultado || !f.ejemplo)
  return malas.length === 0 ? true : malas.map((f) => f.id).join(', ')
})

prueba('estaciones · el orden es 1..N sin repetir y la nueva va quinta', () => {
  const ordenes = estaciones.map((e) => e.orden)
  const ok1 = ordenes.every((o, i) => o === i + 1)
  const cdvs = estaciones.find((e) => e.id === 'cdvs')
  return ok1 && cdvs?.orden === 5 && estaciones.find((e) => e.id === 'paradigmas')?.orden === 6 ? true : ordenes.join(',')
})

prueba('laboratorio · está en el catálogo con su tipo y no suma a la nota', () => {
  const a = catalogoActividades.find((x) => x.id === LAB_ID)
  return a && a.tipo === 'laboratorio-cdvs' && a.puntos === 0 && a.cuentaNota === false ? true : JSON.stringify(a)
})

prueba('laboratorio · los puntos de los componentes suman 100', () => {
  const t = Object.values(PUNTOS).reduce((x, y) => x + y, 0)
  return t === 100 ? true : `suman ${t}`
})

prueba('laboratorio · ruta: ids únicos, fases válidas y al menos dos acciones por fase en cada modalidad', () => {
  const ids = ACCIONES_RUTA.map((a) => a.id)
  if (new Set(ids).size !== ids.length) return 'ids repetidos'
  const validas = FASES.map((f) => f.id)
  if (ACCIONES_RUTA.some((a) => !validas.includes(a.fase) || !a.pista || !a.porque || !a.texto)) return 'acción incompleta o con fase inválida'
  for (const modo of ['60', '120']) {
    for (const f of FASES) {
      const n = Lab.itemsRuta(modo).filter((a) => a.fase === f.id).length
      if (n < 2) return `${modo}: la fase ${f.id} tiene ${n}`
    }
  }
  return true
})

prueba('laboratorio · flujo: etapas válidas y al menos dos elementos por etapa', () => {
  const etapas = ETAPAS_FLUJO.map((e) => e.id)
  if (ELEMENTOS_FLUJO.some((e) => !etapas.includes(e.etapa) || !e.pista || !e.porque)) return 'elemento inválido'
  for (const modo of ['60', '120']) {
    for (const e of etapas) if (Lab.itemsFlujo(modo).filter((x) => x.etapa === e).length < 2) return `${modo}: poca cobertura de ${e}`
  }
  return true
})

prueba('laboratorio · calidad: cada característica tiene al menos dos situaciones', () => {
  const car = CARACTERISTICAS.map((c) => c.id)
  if (SITUACIONES_CALIDAD.some((q) => !car.includes(q.caracteristica) || !q.pista || !q.porque)) return 'situación inválida'
  for (const modo of ['60', '120']) {
    for (const c of car) if (Lab.itemsCalidad(modo).filter((q) => q.caracteristica === c).length < 2) return `${modo}: poca cobertura de ${c}`
  }
  return true
})

prueba('laboratorio · dependencias: enlaces coherentes, con tres opciones y una correcta', () => {
  const nodos = RESULTADOS.map((r) => r.id)
  const pos = (id) => nodos.indexOf(id)
  for (const e of ENLACES) {
    if (pos(e.desde) < 0 || pos(e.hacia) < 0) return `${e.id}: nodo inexistente`
    if (e.opciones.length !== 3 || !(e.correcta >= 0 && e.correcta < 3)) return `${e.id}: opciones`
    if (e.tipo === 'revision' && !(pos(e.hacia) < pos(e.desde))) return `${e.id}: una revisión debe volver atrás`
    if (e.tipo === 'avance' && !(pos(e.hacia) > pos(e.desde))) return `${e.id}: un avance debe ir adelante`
  }
  for (const modo of ['60', '120']) {
    const req = REQUISITOS_DEPENDENCIAS[modo]
    if (req.avance.some((id) => ENLACES.find((e) => e.id === id)?.tipo !== 'avance')) return `${modo}: un requerido no es de avance`
    const disponibles = ENLACES.filter((e) => e.tipo === 'revision').length
    if (req.revisiones > disponibles) return `${modo}: pide más revisiones de las que existen`
  }
  const cadena = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'].map((id) => ENLACES.find((e) => e.id === id))
  return cadena.every((e, i) => e.desde === nodos[i] && e.hacia === nodos[i + 1]) ? true : 'la cadena n1→n7 no está completa'
})

prueba('laboratorio · la revisión de decisiones apunta a fases que existen', () =>
  REVISION.correctas.every((id) => FASES.some((f) => f.id === id)) && REVISION.correctas.length >= 2 ? true : 'revisión inválida',
)

prueba('laboratorio · transferencia: cada sector tiene siete acciones (una por fase como mínimo) y cuatro elementos', () => {
  for (const s of SECTORES) {
    const fases = new Set(s.acciones.map((a) => a.fase))
    if (fases.size !== 7) return `${s.id}: cubre ${fases.size} fases`
    const etapas = new Set(s.elementos.map((e) => e.etapa))
    if (etapas.size !== 4) return `${s.id}: cubre ${etapas.size} etapas`
  }
  return true
})

function sesionNueva(modo) {
  return Lab.crearSesion({ alias: 'Equipo prueba', integrantes: ['Ana Pérez', 'Luis Gómez', 'Rosa Díaz'], modo, id: 'sesion-prueba', ahora: new Date('2026-10-13T10:00:00') })
}

function jugarPerfecto(modo) {
  let ses = sesionNueva(modo)
  for (const c of ['ruta', 'flujo', 'calidad', 'transferencia']) {
    for (const it of Lab.itemsDe(c, modo)) ses = Lab.colocar(ses, c, it.id, it.zona)
    ses = Lab.revisar(ses, c)
  }
  for (const e of ENLACES) {
    if (modo === '60' && e.id === 'l8') continue
    ses = Lab.intentarEnlace(ses, e.desde, e.hacia, e.correcta).sesion
  }
  if (modo === '120') ses = Lab.revisarDecision(ses, REVISION.correctas).sesion
  return ses
}

for (const modo of ['60', '120']) {
  prueba(`laboratorio · ${modo} min · una partida perfecta da 100 académicos y 100 competitivos`, () => {
    const r = Lab.resumenSesion(jugarPerfecto(modo), new Date('2026-10-13T10:40:00'))
    return r.academico === 100 && r.competitivo === 100 && r.terminada && r.completos === 5
      ? true
      : `acad=${r.academico} comp=${r.competitivo} completos=${r.completos}`
  })
}

prueba('laboratorio · equivocarse y corregir permite la nota máxima, pero baja la competitiva', () => {
  let ses = sesionNueva('60')
  const items = Lab.itemsRuta('60')
  items.forEach((it, i) => {
    ses = Lab.colocar(ses, 'ruta', it.id, i % 2 === 0 ? 'f1' : it.zona)
  })
  ses = Lab.revisar(ses, 'ruta')
  const primera = Lab.resultadosPorComponente(ses).find((c) => c.id === 'ruta')
  if (primera.completo || primera.puntos >= 30) return 'no debería estar completo tras el primer intento'
  for (const it of items) ses = Lab.colocar(ses, 'ruta', it.id, it.zona)
  ses = Lab.revisar(ses, 'ruta')
  const final = Lab.resultadosPorComponente(ses).find((c) => c.id === 'ruta')
  return final.completo && final.puntos === 30 && final.competitivo < 30 && final.competitivo >= 15
    ? true
    : `puntos=${final.puntos} competitivo=${final.competitivo}`
})

prueba('laboratorio · no se revisa un componente a medias ni se reabre uno completo', () => {
  let ses = sesionNueva('60')
  const items = Lab.itemsRuta('60')
  ses = Lab.colocar(ses, 'ruta', items[0].id, items[0].zona)
  if (Lab.revisar(ses, 'ruta').ruta.revisiones !== 0) return 'revisó con piezas sin ubicar'
  for (const it of items) ses = Lab.colocar(ses, 'ruta', it.id, it.zona)
  ses = Lab.revisar(ses, 'ruta')
  const cerrada = Lab.colocar(ses, 'ruta', items[0].id, 'f7')
  return cerrada.ruta.colocadas[items[0].id] === items[0].zona ? true : 'un componente completo se pudo modificar'
})

prueba('laboratorio · las conexiones inválidas o con razón equivocada no se aceptan y cuentan como intento', () => {
  let ses = sesionNueva('60')
  let r = Lab.intentarEnlace(ses, 'n1', 'n5', 0)
  if (r.resultado.tipo !== 'sin-relacion' || r.sesion.dependencias.rechazos !== 1) return 'no rechazó una conexión sin relación'
  ses = r.sesion
  const l1 = ENLACES.find((e) => e.id === 'l1')
  r = Lab.intentarEnlace(ses, l1.desde, l1.hacia, (l1.correcta + 1) % 3)
  if (r.resultado.tipo !== 'razon-incorrecta' || r.sesion.dependencias.rechazos !== 2 || r.sesion.dependencias.enlaces.length !== 0) return 'aceptó una razón equivocada'
  r = Lab.intentarEnlace(r.sesion, l1.desde, l1.hacia, l1.correcta)
  if (r.resultado.tipo !== 'aceptada') return 'no aceptó la conexión correcta'
  const repetida = Lab.intentarEnlace(r.sesion, l1.desde, l1.hacia, l1.correcta)
  return repetida.resultado.tipo === 'repetida' && repetida.sesion.dependencias.enlaces.length === 1 ? true : 'duplicó una conexión'
})

prueba('laboratorio · la clasificación del docente ordena por precisión y el tiempo solo desempata', () => {
  const base = { alias: 'A', completos: 5, terminada: true }
  const lista = [
    { ...base, alias: 'Lento', competitivo: 90, segundos: 3000 },
    { ...base, alias: 'Rápido', competitivo: 90, segundos: 1500 },
    { ...base, alias: 'Preciso', competitivo: 99, segundos: 3500 },
  ].sort(Lab.compararCompetitivo)
  return lista.map((l) => l.alias).join(',') === 'Preciso,Rápido,Lento' ? true : lista.map((l) => l.alias).join(',')
})

prueba('laboratorio · el registro exige nombres completos y no repetidos', () => {
  const bien = Lab.validarRegistro({ alias: 'Los Ingenieros', integrantes: ['Ana Pérez', 'Luis Gómez', 'Rosa Díaz', ''] })
  const sinApellido = Lab.validarRegistro({ alias: 'Equipo', integrantes: ['Ana', 'Luis Gómez', 'Rosa Díaz', ''] })
  const repetido = Lab.validarRegistro({ alias: 'Equipo', integrantes: ['Ana Pérez', 'ana pérez', 'Rosa Díaz', ''] })
  const sinAlias = Lab.validarRegistro({ alias: ' ', integrantes: ['Ana Pérez', 'Luis Gómez', 'Rosa Díaz', ''] })
  const faltaTercero = Lab.validarRegistro({ alias: 'Equipo', integrantes: ['Ana Pérez', 'Luis Gómez', '', ''] })
  return bien.ok && !sinApellido.ok && !repetido.ok && !sinAlias.ok && !faltaTercero.ok
    ? true
    : JSON.stringify([bien.ok, sinApellido.ok, repetido.ok, sinAlias.ok, faltaTercero.ok])
})

prueba('laboratorio · una sesión guardada se recupera igual', () => {
  const ses = jugarPerfecto('60')
  const vuelta = Lab.normalizarSesion(JSON.parse(JSON.stringify(ses)))
  const a = Lab.resumenSesion(ses, new Date('2026-10-13T11:00:00'))
  const b = Lab.resumenSesion(vuelta, new Date('2026-10-13T11:00:00'))
  return JSON.stringify(a) === JSON.stringify(b) && Lab.normalizarSesion({ version: 99 }) === null ? true : 'la sesión cambió al guardarla'
})

prueba('pdf · el comprobante es un PDF válido: cabecera, tabla de referencias y fin de archivo', () => {
  const bytes = crearPdf([
    { t: 'titulo', texto: 'Laboratorio de ingeniería: del problema al sistema' },
    { t: 'p', texto: 'Integrantes: Ana Pérez, Luis Gómez (acentos y ñ: niño, año). ' + 'Texto largo para forzar el ajuste de línea. '.repeat(12) },
    { t: 'fila', celdas: ['Ruta', '30', '30'], xs: [0, 215, 285] },
  ])
  const txt = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  if (!txt.startsWith('%PDF-1.4') || !txt.trimEnd().endsWith('%%EOF')) return 'cabecera o final incorrectos'
  const inicio = Number(txt.match(/startxref\n(\d+)\n/)[1])
  if (txt.slice(inicio, inicio + 4) !== 'xref') return 'startxref no apunta a xref'
  const tamano = Number(txt.match(/\/Size (\d+)/)[1])
  const entradas = [...txt.slice(inicio).matchAll(/(\d{10}) 00000 n /g)].map((m) => Number(m[1]))
  if (entradas.length !== tamano - 1) return `esperaba ${tamano - 1} objetos y hay ${entradas.length}`
  for (let n = 1; n <= entradas.length; n++) {
    if (!txt.slice(entradas[n - 1]).startsWith(`${n} 0 obj`)) return `el objeto ${n} no está en su desplazamiento`
  }
  return true
})

/* ================================ informe =============================== */

console.log(`\n${ok} comprobaciones pasaron.`)
if (fallos.length > 0) {
  console.log(`\n${fallos.length} FALLARON:\n`)
  for (const f of fallos) console.log(`  ✗ ${f}`)
  process.exit(1)
}
console.log('Sin fallos.\n')
