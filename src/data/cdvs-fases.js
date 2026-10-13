/**
 * Las siete fases del ciclo de vida del desarrollo de sistemas, con los
 * nombres de la bibliografía del curso (Kendall y Kendall, Análisis y diseño
 * de sistemas). Es la única fuente: la teoría de la estación y el laboratorio
 * leen de aquí, para que ninguno invente su propia versión.
 */

export const FASES = [
  {
    id: 'f1',
    numero: 1,
    nombre: 'Identificar problemas, oportunidades y objetivos',
    corto: 'Identificar el problema',
    pregunta: '¿Qué problema hay y vale la pena resolverlo?',
    explicacion:
      'Se observa la organización tal como funciona hoy para descubrir qué falla, qué oportunidad hay y qué se quiere lograr. Todavía no se piensa en la solución.',
    queHacen: [
      'Observar cómo trabaja la organización y hablar con quienes la conocen.',
      'Definir el problema o la oportunidad con claridad.',
      'Fijar objetivos que se puedan comprobar.',
      'Estimar si el proyecto es viable en tiempo, dinero y personas.',
    ],
    resultado: 'El problema y los objetivos redactados, con una valoración de viabilidad.',
    ejemplo:
      'En «Turnos Patitas», la dueña pierde clientes porque dos personas reservan la misma hora por teléfono. Objetivo: que no haya turnos cruzados y que reservar tome menos de 2 minutos.',
  },
  {
    id: 'f2',
    numero: 2,
    nombre: 'Determinar los requerimientos de información',
    corto: 'Requerimientos',
    pregunta: '¿Qué necesita saber y hacer cada usuario?',
    explicacion:
      'Se averigua con las personas qué información necesitan para hacer su trabajo y cómo la usan. Se pregunta y se observa; todavía no se decide qué hará el sistema.',
    queHacen: [
      'Entrevistar a los usuarios y a quienes toman decisiones.',
      'Observar el trabajo real, en su lugar de trabajo.',
      'Revisar los formularios y documentos que ya existen.',
      'Aplicar cuestionarios cuando son muchas personas.',
    ],
    resultado: 'Una descripción de las necesidades de información de cada tipo de usuario.',
    ejemplo:
      'La dueña necesita ver su agenda del día sin cruces. El dueño de la mascota necesita reservar sin llamar y saber que su hora quedó confirmada.',
  },
  {
    id: 'f3',
    numero: 3,
    nombre: 'Analizar las necesidades del sistema',
    corto: 'Análisis',
    pregunta: '¿Qué debe hacer el sistema y cómo sabremos que lo hace bien?',
    explicacion:
      'Se estudia lo recogido en la fase anterior para convertirlo en lo que el sistema debe hacer: sus funciones, sus reglas y los criterios con que se comprobará. Es la diferencia entre saber lo que la gente necesita y definir lo que el sistema hará.',
    queHacen: [
      'Describir cómo circulan hoy los datos y los procesos.',
      'Escribir las funciones del sistema («el sistema debe…»).',
      'Definir las reglas de funcionamiento.',
      'Establecer requisitos medibles.',
    ],
    resultado: 'La propuesta de requisitos: funciones, reglas y criterios medibles.',
    ejemplo:
      'El sistema debe verificar que la hora esté libre (función) y nunca asignar dos turnos a la misma hora (regla). Reservar toma 2 minutos o menos para quien lo usa por primera vez (requisito medible).',
  },
  {
    id: 'f4',
    numero: 4,
    nombre: 'Diseñar el sistema recomendado',
    corto: 'Diseño',
    pregunta: '¿Cómo se organizará el sistema para cumplir esos requisitos?',
    explicacion:
      'Con los requisitos claros, se decide cómo será el sistema por dentro y por fuera: qué datos guarda, cómo se procesan y cómo se piden y se muestran. Diseñar no es programar: es decidir cómo se construirá.',
    queHacen: [
      'Diseñar la base de datos y la forma de almacenar la información.',
      'Definir los formatos de entrada y de salida.',
      'Decidir los controles y la seguridad.',
      'Elegir la arquitectura y las herramientas.',
    ],
    resultado: 'La especificación del diseño: datos, procesos y formatos.',
    ejemplo:
      'Se decide guardar clientes, mascotas, servicios y turnos en una base de datos, y que la confirmación muestre servicio, fecha y hora.',
  },
  {
    id: 'f5',
    numero: 5,
    nombre: 'Desarrollar y documentar el software',
    corto: 'Desarrollo',
    pregunta: '¿Cómo se construye y cómo se explica a quien lo use?',
    explicacion:
      'Los programadores escriben el software siguiendo el diseño, y se documenta para que otros puedan usarlo y mantenerlo. Es la fase donde se programa, y es solo una de siete.',
    queHacen: [
      'Programar los módulos y funciones del diseño.',
      'Redactar manuales de uso y ayudas para los usuarios.',
      'Documentar el código y las decisiones técnicas.',
    ],
    resultado: 'El software funcionando y su documentación.',
    ejemplo:
      'Se programa el registro de turnos y se redacta una guía de una página para que la dueña aprenda a usar la agenda.',
  },
  {
    id: 'f6',
    numero: 6,
    nombre: 'Probar y mantener el sistema',
    corto: 'Pruebas y mantenimiento',
    pregunta: '¿Funciona como se pidió, y cómo lo mantenemos funcionando?',
    explicacion:
      'Antes de entregarlo se prueba si el software cumple los requisitos. Después de entregarlo se corrige y se adapta a lo largo de su vida. Probar y mantener son dos momentos de la misma fase: uno antes y otro después de la entrega.',
    queHacen: [
      'Probar con datos de ejemplo y con casos difíciles.',
      'Comparar los resultados con los requisitos medibles.',
      'Corregir los errores encontrados.',
      'Planear cómo se actualizará y se corregirá cuando ya esté en uso.',
    ],
    resultado: 'Un informe de pruebas y un plan de mantenimiento.',
    ejemplo:
      'Se prueban 50 reservas y se comprueba que nunca se cruzan. Se acuerda cómo agregar un servicio nuevo cuando la peluquería lo ofrezca.',
  },
  {
    id: 'f7',
    numero: 7,
    nombre: 'Implementar y evaluar el sistema',
    corto: 'Implementación y evaluación',
    pregunta: '¿Cómo se pone en uso, y qué tal funcionó?',
    explicacion:
      'Se instala el sistema, se capacita a las personas y se pasa del método anterior al nuevo. Luego se evalúa si logró los objetivos de la primera fase. Implementar y evaluar no es lo mismo que probar: probar ocurre antes de la entrega; evaluar, con el sistema ya en uso.',
    queHacen: [
      'Instalar el sistema y trasladar la información que ya existía.',
      'Capacitar a quienes lo usarán.',
      'Medir si se cumplieron los objetivos.',
      'Recoger lo que piensan los usuarios.',
    ],
    resultado: 'El sistema en uso y una evaluación de sus resultados.',
    ejemplo:
      'La dueña empieza a usar el sistema y, un mes después, revisa si los turnos cruzados bajaron a cero y si reservar toma menos de 2 minutos.',
  },
]

export const faseDe = (id) => FASES.find((f) => f.id === id)
