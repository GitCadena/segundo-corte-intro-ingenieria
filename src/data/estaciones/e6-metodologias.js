import { PROYECTOS_IA } from '../proyectos-ia.js'

/**
 * Estación 6 · Ingeniería del software y metodologías.
 *
 * Cubre los puntos 2.8 (la ingeniería del software) y 2.9 (tendencias
 * metodológicas) de la Unidad 2. Es corta de teoría a propósito: la clase de
 * explicación dura unos quince minutos. La práctica es un solo proyecto
 * individual: cada estudiante recibe uno de veinte, elige la metodología que
 * considera mejor y construye con ayuda de la inteligencia artificial. Se
 * entrega por Classroom; la aplicación guarda el borrador y la reflexión.
 */

const OPCIONES_METODOLOGIA = [
  'Cascada',
  'Prototipado',
  'Espiral',
  'Ágil (por incrementos pequeños)',
]

const COMO_TRABAJAR_CON_IA = {
  Cascada: [
    'Primero escribes por completo qué debe hacer tu proyecto y cómo se verá, antes de usar la IA.',
    'Con eso armas un solo prompt grande y completo, y le pides la versión final.',
    'Pruebas todo al final y corriges lo que falle.',
  ],
  Prototipado: [
    'Le pides a la IA un borrador rápido, aunque quede feo o incompleto.',
    'Se lo muestras a otra persona (tu «cliente») y anotas qué le gustó y qué no.',
    'Repites: cada vuelta mejora el borrador con lo que dijo esa persona.',
  ],
  Espiral: [
    'Empiezas por la parte que más te preocupa o que no sabes si va a funcionar.',
    'Le pides a la IA solo esa parte y compruebas si de verdad funciona.',
    'Cuando esa parte está segura, agregas la siguiente y repites.',
  ],
  'Ágil (por incrementos pequeños)': [
    'Divides el proyecto en funciones pequeñas y las ordenas de la más importante a la menos.',
    'Pides una función a la vez y, cada pocos minutos, tienes una versión que funciona.',
    'Si algo cambia en el camino, lo ajustas sin empezar de nuevo.',
  ],
}

export default {
  id: 'metodologias',
  orden: 6,
  numeracionContinua: true, // sin práctica con puntos ni reto: «Qué te llevas» es la sección 4
  sesion: 'Unidad 2 · puntos 2.8 y 2.9',
  titulo: 'Ingeniería del software y metodologías',
  gancho:
    'Dos equipos pueden construir lo mismo de formas muy distintas. Esta estación enseña las formas más conocidas de organizar el trabajo y te pide elegir la tuya para un proyecto propio.',

  aprenderas: {
    objetivo:
      'Al terminar podrás explicar qué es la ingeniería del software, distinguir las metodologías más conocidas y elegir con argumentos la que mejor se adapta a un proyecto concreto.',
    puntos: [
      'Explicar qué hace la ingeniería del software y por qué no es solo programar.',
      'Reconocer cuatro metodologías: cascada, prototipado, espiral y ágil.',
      'Relacionar cada metodología con el ciclo de vida que ya conoces.',
      'Elegir una metodología para un proyecto y defender por qué.',
      'Construir un proyecto pequeño usando la inteligencia artificial como herramienta, con un método.',
    ],
    duracion: '15 minutos de teoría y un proyecto individual en dos sesiones de una hora',
  },

  comprende: [
    {
      titulo: '¿Qué es la ingeniería del software?',
      cuerpo: [
        {
          t: 'p',
          texto:
            'La ingeniería del software es la disciplina que se ocupa de construir software de forma ordenada, para que cumpla lo que se necesita, se pueda probar y se pueda mantener. No es solo escribir código: incluye entender el problema, planear, construir, probar y mantener.',
        },
        {
          t: 'p',
          texto:
            'Es como la diferencia entre armar un mueble para uno mismo y fabricar muebles para una empresa. En el segundo caso hay que planear, repartir el trabajo, revisar la calidad y poder arreglar lo que falle después.',
        },
        {
          t: 'lista',
          items: [
            'Trabaja con personas: usuarios, clientes y compañeros de equipo.',
            'Sigue un proceso: el ciclo de vida que viste en la estación anterior.',
            'Busca calidad: que el software sirva, sea confiable y se pueda cambiar.',
          ],
        },
        {
          t: 'clave',
          titulo: 'La idea de fondo',
          texto: 'Programar es una parte del trabajo. La ingeniería es todo lo que hace que lo programado sirva y dure.',
        },
      ],
    },
    {
      titulo: 'Metodologías: formas de recorrer el ciclo de vida',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Una metodología es una forma de organizar el trabajo para recorrer las mismas fases del ciclo de vida. Las fases no cambian; cambia el orden, el tamaño de los pasos y cuánto se habla con el cliente. Estas son las cuatro más conocidas:',
        },
        {
          t: 'tabla',
          encabezados: ['Metodología', 'Cómo trabaja', 'Conviene cuando…'],
          filas: [
            ['Cascada', 'Recorre las fases una tras otra, en orden, y no pasa a la siguiente hasta terminar la anterior.', 'Lo que se necesita está claro y casi no va a cambiar.'],
            ['Prototipado', 'Construye rápido un borrador, lo muestra al usuario y lo mejora con lo que diga.', 'Nadie tiene claro cómo debe verse o comportarse.'],
            ['Espiral', 'Avanza en vueltas, y en cada una empieza por la parte más riesgosa.', 'Hay una parte difícil que podría hacer fracasar el proyecto.'],
            ['Ágil', 'Entrega funciones pequeñas con frecuencia y se ajusta según lo que va aprendiendo.', 'Las necesidades cambian o el cliente quiere ver avances pronto.'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Ninguna es la mejor',
          texto: 'Cada metodología gana en algunas situaciones y pierde en otras. Elegir bien es parte del trabajo del ingeniero.',
        },
      ],
    },
    {
      titulo: 'Cómo elegir una metodología',
      cuerpo: [
        {
          t: 'p',
          texto: 'Para escoger, hazte estas cuatro preguntas sobre tu proyecto:',
        },
        {
          t: 'lista',
          items: [
            '¿Tengo claro lo que necesito, o lo voy a descubrir sobre la marcha?',
            '¿Es probable que cambie lo que quiero a mitad del camino?',
            '¿Hay una parte que no sé si me va a funcionar?',
            '¿Puedo mostrarle avances a alguien y recibir su opinión pronto?',
          ],
        },
        {
          t: 'p',
          texto:
            'Si casi todo está claro y fijo, la cascada te sirve. Si no sabes cómo debe verse, el prototipado. Si hay una parte riesgosa, la espiral. Si lo esperable es que cambie, la ágil. Lo importante es que tu elección tenga una razón, no que coincida con la de los demás.',
        },
      ],
    },
    {
      titulo: 'Programar con inteligencia artificial sin perder el método',
      cuerpo: [
        {
          t: 'p',
          texto:
            'La inteligencia artificial puede escribir código, pero no decide por ti qué construir ni si lo que hizo sirve. Tú pones el método y tú compruebas el resultado.',
        },
        {
          t: 'lista',
          items: [
            'Dile con claridad qué necesitas, con ejemplos. Un prompt vago da un resultado vago.',
            'Prueba siempre lo que te entrega. Nunca lo des por bueno sin ejecutarlo.',
            'Si falla, cuéntale exactamente qué pasó y qué esperabas.',
            'Anota lo que le pediste y lo que corregiste: esa es tu bitácora.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Tu metodología se nota en cómo le hablas a la IA',
          texto:
            'Quien sigue cascada escribe un prompt grande y completo. Quien sigue ágil pide una función a la vez. Quien prototipa muestra un borrador y ajusta. Quien usa espiral empieza por lo más difícil.',
        },
      ],
    },
  ],

  profundiza: {},

  ejemplo: {
    titulo: 'Un mismo proyecto, cuatro formas de trabajarlo',
    contexto:
      'Imagina una app de turnos para una peluquería. Las fases son las mismas, pero según la metodología el trabajo se organiza distinto.',
    pasos: [
      {
        titulo: 'Con cascada',
        texto:
          'Se escribe todo lo que debe hacer la app y cómo se verá. Recién cuando está completo se construye, y al final se prueba todo junto.',
        nota: 'Funciona bien si no habrá sorpresas. Si la dueña cambia de opinión al final, cuesta rehacerlo.',
      },
      {
        titulo: 'Con prototipado',
        texto:
          'Se construye una pantalla rápida de reservas y se la muestran a la dueña. Ella dice «prefiero ver la semana completa», y se ajusta el borrador.',
        nota: 'Sirve cuando nadie sabe bien cómo debe verse.',
      },
      {
        titulo: 'Con espiral',
        texto:
          'La parte más difícil es impedir que dos personas tomen la misma hora. Se resuelve y se comprueba primero; después se agregan la agenda y el resto.',
        nota: 'Se enfrenta el mayor riesgo antes de gastar el esfuerzo en lo demás.',
      },
      {
        titulo: 'Con ágil',
        texto:
          'Se hace primero solo «reservar una hora» y se usa esa misma tarde. Luego «ver la agenda del día», luego «cancelar», y así sucesivamente.',
        nota: 'Siempre hay algo funcionando, y se ajusta con lo que se aprende.',
      },
    ],
    cierre:
      'No hay una mejor para todo. La elección depende de qué tan claro está el proyecto, qué tanto cambiará y dónde está el riesgo.',
  },

  actividades: [],

  taller: {
    id: 'e6-proyecto-ia',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Proyecto individual · Elige tu metodología y constrúyelo con IA',
    objetivo: 'Elegir con argumentos una metodología para un proyecto asignado y construirlo con ayuda de la inteligencia artificial, dejando evidencia del proceso.',
    instrucciones:
      'Trabajo individual en dos sesiones de una hora. En la primera eliges tu metodología y construyes el primer avance; en la segunda lo mejoras y lo entregas. A cada estudiante le toca un proyecto distinto, asignado automáticamente por la aplicación. Esta página guarda tu borrador y tus respuestas; el producto lo entregas por Classroom en el formato que domines (por ejemplo una página HTML, una aplicación publicada o una hoja de cálculo).',
    conceptoPrevio: 'Las metodologías de esta estación y las siete fases del ciclo de vida.',
    enunciado:
      'Lee tu proyecto asignado, elige la metodología que para ti es la mejor y trabaja con la IA siguiendo esa forma de hacerlo. No hay una única respuesta correcta: importa que tu elección tenga una razón y que se note en cómo trabajaste.',
    etiquetaCaso: 'Tu proyecto asignado (no lo cambies: cada estudiante tiene uno distinto)',
    avisoEntrega:
      'La aplicación no califica este proyecto: lo calificas con el docente a través de Classroom. Marca «entregado» cuando lo hayas enviado, para llevar tu propio control.',
    casos: PROYECTOS_IA,
    campos: [
      {
        id: 'metodologia',
        tipo: 'seleccion',
        etiqueta: 'La metodología que elegiste para tu proyecto',
        marcador: 'Elige una metodología…',
        tituloEjemplos: 'Así trabajarías con la IA si eliges esta',
        opciones: OPCIONES_METODOLOGIA,
        ejemplosPorOpcion: COMO_TRABAJAR_CON_IA,
      },
      {
        id: 'porque',
        etiqueta: '¿Por qué esa metodología es la mejor para TU proyecto? Usa lo que sabes de él (qué tan claro está, si puede cambiar, si hay una parte difícil).',
        filas: 3,
      },
      {
        id: 'plan',
        etiqueta: 'Tu plan en pasos: cómo vas a dividir el trabajo con la IA según tu metodología',
        filas: 4,
      },
      {
        id: 'herramienta',
        etiqueta: 'Con qué herramienta de inteligencia artificial trabajaste',
        filas: 1,
      },
      {
        id: 'producto',
        etiqueta: 'Qué construiste y cómo se usa (qué hace, en qué formato lo entregas y, si lo publicaste, el enlace)',
        filas: 4,
      },
      {
        id: 'bitacora',
        etiqueta:
          'Tu bitácora: escribe tres prompts importantes que usaste y, para cada uno, qué te respondió la IA y qué tuviste que corregir',
        filas: 8,
      },
      {
        id: 'reflexion',
        etiqueta: 'Al terminar: ¿tu metodología fue la adecuada? ¿Qué te funcionó, qué no, y qué harías distinto?',
        filas: 4,
      },
    ],
    listaChequeo: [
      'Elegí una metodología y expliqué por qué es la mejor para mi proyecto, no solo la nombré.',
      'Mi plan y mi forma de hablarle a la IA corresponden a la metodología que elegí.',
      'Probé lo que la IA me entregó y corregí lo que no funcionaba.',
      'Mi proyecto cumple las tres funciones mínimas del enunciado.',
      'Mi bitácora muestra mis prompts reales y lo que corregí.',
      'Envié mi producto por Classroom.',
    ],
    rubrica: [
      'La metodología elegida está justificada con razones del proyecto.',
      'El proceso (plan y bitácora) concuerda con la metodología elegida.',
      'El producto cumple las funciones mínimas del proyecto asignado.',
      'Se nota criterio propio: se probó, se corrigió y se explicó qué cambiaría.',
    ],
  },

  sintesis: {
    puntos: [
      'La ingeniería del software es construir software de forma ordenada para que cumpla lo que se necesita, se pueda probar y se pueda mantener.',
      'Una metodología es una forma de recorrer las mismas fases del ciclo de vida: cambian el orden, el tamaño de los pasos y cuánto se habla con el cliente.',
      'Las cuatro más conocidas: cascada (en orden), prototipado (borradores que se mejoran), espiral (empezar por lo riesgoso) y ágil (entregas pequeñas y frecuentes).',
      'Ninguna es la mejor: se elige según qué tan claro está el proyecto, cuánto puede cambiar y dónde está el riesgo.',
      'La inteligencia artificial es una herramienta: tú pones el método, la compruebas y dejas evidencia de lo que pediste y corregiste.',
    ],
    conexion:
      'Esta estación pone en práctica el ciclo de vida de la anterior: las fases son las mismas, pero ahora decides tú cómo recorrerlas. Y retoma la calidad de la Estación 2: lo que la IA entrega no vale hasta que se prueba.',
  },

  glosario: ['ingenieria-software', 'metodologia', 'cascada', 'prototipado', 'espiral', 'agil', 'cdvs'],
}
