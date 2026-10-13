import { LAB_ID } from '../lab-cdvs.js'

/**
 * Estación 5 · El ciclo de vida del desarrollo de sistemas.
 *
 * Cubre los puntos 2.3 a 2.7 de la Unidad 2 del microcurrículo: funciones y
 * características de un sistema de información, sus aplicaciones, el ciclo de
 * vida y sus fases. Las fases son las de Kendall y Kendall (bibliografía del
 * curso) y viven en src/data/cdvs-fases.js.
 *
 * La práctica es UNA sola actividad de clase, el laboratorio interactivo, a
 * propósito: no es una colección de minijuegos.
 */

export default {
  id: 'cdvs',
  orden: 5,
  numeracionContinua: true, // sin «Ponlo a prueba»: «Qué te llevas» es la sección 5
  sesion: 'Unidad 2 · puntos 2.3 a 2.7',
  titulo: 'El ciclo de vida del desarrollo de sistemas',
  gancho:
    'Ningún sistema se construye de una sola vez: se investiga, se analiza, se diseña, se programa, se prueba y se pone en uso. Esta estación enseña ese recorrido.',

  aprenderas: {
    objetivo:
      'Al terminar podrás nombrar y distinguir las siete fases del ciclo de vida de un sistema, explicar qué resultado deja cada una y por qué dependen unas de otras, y relacionar las funciones y las características de la información con las fases donde se definen y se comprueban.',
    puntos: [
      'Nombrar las siete fases del ciclo de vida y el resultado que deja cada una.',
      'Distinguir las fases que más se confunden: requerimientos y análisis, diseño y desarrollo, probar y evaluar.',
      'Explicar por qué cada fase necesita el resultado de la anterior y cuándo conviene volver atrás.',
      'Relacionar las funciones de un sistema de información y las características de su información con las fases del ciclo.',
      'Aplicar el mismo recorrido a un hospital y a otro sector.',
    ],
    duracion: '10 a 12 minutos de teoría y un laboratorio de 35 minutos (60 en la modalidad ampliada)',
  },

  comprende: [
    {
      titulo: '¿Qué es el ciclo de vida del desarrollo de sistemas?',
      cuerpo: [
        {
          t: 'p',
          texto:
            'El ciclo de vida del desarrollo de sistemas (CDVS) es la secuencia de fases por las que pasa un sistema de información, desde que alguien nota un problema hasta que el sistema se usa, se evalúa y se mantiene. Sirve para decidir qué se hace primero y qué queda escrito antes de pasar al siguiente paso.',
        },
        {
          t: 'p',
          texto:
            'Existe para no construir lo equivocado. Casi siempre los errores más caros nacen en las primeras fases, cuando no se entendió qué hacía falta, y se descubren en las últimas, cuando corregirlos cuesta más.',
        },
        {
          t: 'lista',
          items: [
            'Programar es una sola de las siete fases, la quinta.',
            'Antes hay que entender el problema, a las personas y las reglas. Después hay que probar, poner en uso y evaluar.',
            'Un sistema muy bien programado que resuelve el problema equivocado no sirve.',
          ],
        },
        {
          t: 'p',
          texto:
            'La ingeniería informática no se limita a escribir código: construye sistemas que resuelven necesidades reales con un proceso que se puede repetir, medir y mejorar. El ciclo de vida es la columna de ese trabajo, y por eso seguir un proceso ayuda a que todo el equipo sepa qué se está haciendo y por qué, a detectar los errores antes y a dejar evidencia de lo que se decidió.',
        },
        {
          t: 'clave',
          titulo: 'La idea que atraviesa toda la estación',
          texto: 'Cada fase deja un resultado que la siguiente necesita. Lo que no queda escrito, se pierde.',
        },
      ],
    },
    {
      titulo: 'Las siete fases',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Usamos las siete fases de Kendall y Kendall, el libro de la bibliografía del curso. Toca cada fase para ver qué es, qué hacen los profesionales y qué resultado deja.',
        },
        { t: 'fases' },
        {
          t: 'clave',
          titulo: 'Requerimientos y análisis no son lo mismo',
          texto:
            'Determinar los requerimientos (fase 2) es averiguar qué necesitan las personas. Analizar las necesidades (fase 3) es decidir, a partir de eso, qué hará el sistema y con qué criterios se comprobará.',
        },
        {
          t: 'clave',
          titulo: 'Diseñar no es desarrollar',
          texto:
            'Diseñar el sistema (fase 4) decide cómo será. Desarrollar y documentar el software (fase 5) lo construye. Se puede tener un buen diseño sin una línea de código.',
        },
        {
          t: 'clave',
          titulo: 'Probar, mantener, implementar y evaluar',
          texto:
            'Probar ocurre antes de entregar; mantener, después. Implementar es poner el sistema en uso, y evaluar es comprobar si logró los objetivos de la primera fase.',
        },
      ],
    },
    {
      titulo: 'Cómo se relacionan las fases',
      cuerpo: [
        {
          t: 'p',
          texto: 'Cada fase usa el resultado de la anterior. Por eso el orden importa:',
        },
        {
          t: 'lista',
          items: [
            'Los objetivos orientan qué averiguar con los usuarios.',
            'Lo que necesitan los usuarios se convierte en requisitos del sistema.',
            'Los requisitos fundamentan el diseño.',
            'El diseño guía lo que se desarrolla.',
            'Lo desarrollado se prueba contra los requisitos.',
            'Las pruebas dan la evidencia para poner el sistema en uso.',
          ],
        },
        {
          t: 'p',
          texto:
            'En la práctica las fases se solapan y a veces se vuelve atrás. Si al probar aparece un error, se corrige el software. Si al evaluar se ve que una necesidad cambió, se revisan los requisitos. Por eso se llama ciclo de vida: mientras el sistema se use, el trabajo no termina del todo.',
        },
        {
          t: 'clave',
          titulo: 'Volver atrás no es fracasar',
          texto:
            'Volver a una fase anterior con evidencia nueva es parte normal del proceso. Lo que sí es un problema es no dejar escrito qué se decidió y por qué.',
        },
      ],
    },
    {
      titulo: 'Funciones, características y aplicaciones de los sistemas de información',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Un sistema de información existe para manejar información. Para lograrlo cumple cuatro funciones, y la información que entrega debe tener ciertas características. Ambas cosas se definen y se comprueban dentro del ciclo de vida.',
        },
        {
          t: 'tabla',
          encabezados: ['Función', 'Qué hace', 'Ejemplo: Turnos Patitas'],
          filas: [
            ['Capturar', 'Recoge los datos en su origen', 'El cliente indica su mascota, el servicio y la hora'],
            ['Procesar', 'Verifica, calcula o transforma', 'Comprueba que la hora esté libre'],
            ['Almacenar', 'Guarda la información para usarla después', 'Guarda el turno en la base de datos'],
            ['Distribuir', 'Entrega el resultado a quien lo necesita', 'Muestra la agenda del día a la dueña'],
          ],
        },
        {
          t: 'tabla',
          encabezados: ['Característica', 'Significa', 'Ejemplo'],
          filas: [
            ['Oportuna', 'Llega a tiempo para que sirva', 'El turno aparece ocupado en cuanto alguien lo toma'],
            ['Relevante', 'Responde lo que se necesita saber', 'La dueña ve la agenda de hoy, no la de todo el año'],
            ['Completa', 'No le falta una parte que cambiaría la decisión', 'La confirmación incluye servicio, fecha y hora'],
            ['Confiable', 'Se puede rastrear de dónde salió', 'Cada turno guarda quién lo registró y cuándo'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Dónde aparece cada cosa en el ciclo',
          texto:
            'Las funciones se escriben como «el sistema debe…» en el análisis (fase 3). Las características se fijan como criterios en el análisis y se comprueban en las pruebas (fase 6). No son temas aparte: son parte del trabajo de cada fase.',
        },
        {
          t: 'tabla',
          encabezados: ['Sector', 'Ejemplo de sistema', 'Qué información maneja'],
          filas: [
            ['Salud', 'Asignación de turnos', 'Pacientes, médicos y horarios'],
            ['Educación', 'Inscripción a asignaturas', 'Estudiantes, asignaturas y cupos'],
            ['Comercio', 'Pedidos en línea', 'Productos, existencias y pedidos'],
            ['Transporte', 'Rutas y horarios de buses', 'Recorridos, tiempos y cupos'],
            ['Banca', 'Cajeros y banca móvil', 'Cuentas, saldos y transacciones'],
            ['Gobierno', 'Trámites en línea', 'Solicitudes, documentos y estados'],
          ],
        },
        {
          t: 'p',
          texto:
            'El sector cambia y el ciclo de vida no: se investiga, se analiza, se diseña, se construye, se prueba y se pone en uso, sea un hospital, una universidad o una tienda.',
        },
      ],
    },
  ],

  profundiza: {
    'Las siete fases': {
      titulo: 'Tres parejas que se confunden, lado a lado',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Pareja', 'Primera', 'Segunda'],
          filas: [
            ['Fases 2 y 3', 'Requerimientos: averiguar qué necesitan las personas', 'Análisis: decidir qué hará el sistema y cómo se comprobará'],
            ['Fases 4 y 5', 'Diseño: decidir cómo será el sistema', 'Desarrollo: construirlo y documentarlo'],
            ['Fases 6 y 7', 'Probar y mantener: comprobar que cumple y mantenerlo funcionando', 'Implementar y evaluar: ponerlo en uso y medir si logró los objetivos'],
          ],
        },
        {
          t: 'p',
          texto:
            'Una pregunta que ayuda: ¿ya se sabe qué hará el sistema? Si todavía se está averiguando qué necesita la gente, es la fase 2. Si ya se decide qué hará, es la 3. Si ya se decide cómo se organizará, es la 4. Si se está escribiendo código o documentación, es la 5.',
        },
      ],
    },
    'Cómo se relacionan las fases': {
      titulo: 'Un ejemplo de volver atrás',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Imagina una pizzería cuyo sistema está casi listo cuando, al probarlo, se ve que dos cajeros pueden tomar el mismo pedido a la vez. Corregirlo exige volver a la fase de requisitos para escribir una regla («un pedido lo toma un solo cajero») y a la de diseño para decidir cómo hacerla cumplir, antes de volver a programar. Lo que quedó escrito en cada fase permite saber exactamente qué revisar.',
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'De la fila al sistema: «Turnos Patitas» en siete fases',
    contexto:
      'Una peluquería de mascotas del barrio quiere dejar de recibir las reservas por teléfono. Vamos a recorrer las siete fases con ese caso. Fíjate en lo que cada una deja escrito.',
    pasos: [
      {
        titulo: 'Fase 1 · Identificar problemas, oportunidades y objetivos',
        texto:
          'La dueña recibe las reservas por teléfono y a veces asigna dos turnos a la misma hora. Pierde tiempo y clientes. Objetivo: que no haya cruces y que reservar tome 2 minutos o menos. ¿Vale la pena? Sí: es un sistema pequeño y el problema es frecuente.',
        nota: 'Todavía nadie habla de pantallas ni de programar.',
      },
      {
        titulo: 'Fase 2 · Determinar los requerimientos de información',
        texto:
          'Se conversa con la dueña y con tres clientes, y se observa cómo anota hoy las reservas en su cuaderno. Resultado: la dueña necesita ver su agenda del día; el cliente necesita reservar sin llamar y recibir una confirmación.',
      },
      {
        titulo: 'Fase 3 · Analizar las necesidades del sistema',
        texto:
          'Se escribe lo que el sistema debe hacer: capturar la mascota, el servicio y la hora; procesar para verificar que la hora esté libre; distribuir la agenda del día a la dueña. Regla: nunca dos turnos a la misma hora. Requisito medible: reservar toma 2 minutos o menos la primera vez.',
        nota: 'Aquí aparecen las funciones del sistema de información.',
      },
      {
        titulo: 'Fase 4 · Diseñar el sistema recomendado',
        texto:
          'Se decide guardar clientes, mascotas, servicios y turnos en una base de datos, y que el cliente elija servicio y hora, deje sus datos y reciba una confirmación con servicio, fecha y hora.',
      },
      {
        titulo: 'Fase 5 · Desarrollar y documentar el software',
        texto: 'Se programa el registro de turnos y la agenda, y se redacta una guía de una página para que la dueña aprenda a usarla.',
        nota: 'Es la única fase donde se programa.',
      },
      {
        titulo: 'Fase 6 · Probar y mantener el sistema',
        texto:
          'Se prueban 50 reservas, incluidas dos personas pidiendo la misma hora, y se comprueba que nunca se cruzan. Se corrige un error en la confirmación. Se acuerda cómo se agregará un servicio nuevo cuando la peluquería lo ofrezca.',
      },
      {
        titulo: 'Fase 7 · Implementar y evaluar el sistema',
        texto:
          'La dueña capacita a su ayudante y empieza a usar el sistema. Un mes después se revisa: 0 cruces y reservar toma un minuto y medio. Si no se hubiera logrado, se volvería a los requisitos.',
      },
    ],
    cierre:
      'Cada fase dejó algo escrito que la siguiente necesitó. Si en la fase 2 nadie le hubiera preguntado a la dueña, el sistema habría salido bien programado, pero para el problema equivocado.',
  },

  actividades: [
    {
      id: LAB_ID,
      tipo: 'laboratorio-cdvs',
      nivel: 'base',
      puntos: 0,
      ocultarValor: true,
      titulo: 'Laboratorio de ingeniería: del problema al sistema',
      objetivo:
        'Construir el proceso de desarrollo de un sistema real: ubicar las acciones en sus fases, armar el flujo de la información, aplicar criterios de calidad y establecer las dependencias entre fases.',
      instrucciones:
        'Trabajan en equipo de tres o cuatro personas. Una sola persona registra al equipo y lo maneja desde su cuenta; los demás participan desde el mismo computador. Esta actividad tiene su propia puntuación (no suma a la nota orientativa) y genera un comprobante en PDF para el docente.',
      conceptoPrevio: 'Las siete fases del ciclo de vida y las cuatro funciones de un sistema de información.',
      conceptos: ['cdvs', 'funciones-si', 'caracteristicas-informacion'],
      explicacion:
        'Construiste el desarrollo de un sistema de principio a fin: qué se hace en cada fase, cómo circula la información, qué hace buena a esa información y por qué cada resultado alimenta al siguiente. Aplicarlo a un segundo sector muestra que el recorrido no depende del caso.',
    },
  ],

  sintesis: {
    puntos: [
      'El ciclo de vida del desarrollo de sistemas es la secuencia de siete fases por las que pasa un sistema de información: de identificar el problema a evaluarlo en uso.',
      'Programar es solo una de las siete fases. Antes hay que entender y definir, y después probar, poner en uso y evaluar.',
      'Cada fase deja un resultado que la siguiente necesita. Lo que no queda escrito, se pierde.',
      'Requerimientos (qué necesitan las personas) no es lo mismo que análisis (qué hará el sistema); diseñar (cómo será) no es lo mismo que desarrollar (construirlo).',
      'Las fases se solapan y se vuelve atrás con evidencia: un error en las pruebas lleva al software; una evaluación negativa puede llevar a los requisitos.',
      'Las funciones del sistema (capturar, procesar, almacenar, distribuir) se definen en el análisis. Las características de la información (oportuna, relevante, completa, confiable) se fijan como criterios y se comprueban en las pruebas.',
    ],
    conexion:
      'Esta estación junta lo que ya viste. El proceso de desarrollo de la Estación 1 es el ciclo de vida aplicado al software, la calidad de la Estación 2 es lo que se comprueba al probar, y los sistemas de información de la Estación 3 son lo que se construye. La estación que sigue, pensar como programador, profundiza en la fase 5.',
  },

  glosario: ['cdvs', 'requerimientos-informacion', 'funciones-si', 'caracteristicas-informacion', 'requisito', 'verificable'],
}
