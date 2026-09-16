import base from '../m1-proceso.js'

/**
 * Estación 1 · Cómo se construye el software (sesión 7).
 *
 * La teoría de `comprende` viene de m1-proceso.js, que ya estaba escrito y
 * alineado con el microcurrículo. Aquí se le agregan el ejemplo desarrollado,
 * las actividades en su formato completo, el reto y la síntesis.
 */

export default {
  id: 'proceso',
  orden: 1,
  sesion: 'Sesión 7',
  titulo: 'Cómo se construye el software',
  gancho: 'Programar es una parte pequeña de construir software. Esta estación es sobre todo lo demás.',

  aprenderas: {
    objetivo:
      'Al terminar podrás describir cómo se convierte una necesidad en un sistema, distinguir un requisito comprobable de un deseo, y justificar por qué un proyecto conviene hacerlo de una sola vez o por entregas.',
    puntos: [
      'Separar problema, necesidad y solución en un caso real del campus.',
      'Escribir un requisito que otra persona pueda comprobar sin preguntarte nada.',
      'Reconocer qué aporta cada actividad del proceso y qué rol la ejerce.',
      'Decidir el alcance de una primera entrega cuando la capacidad es limitada.',
    ],
    duracion: '35 a 45 minutos',
  },

  comprende: base.lecciones,

  profundiza: {
    'Producto, proceso y por qué se separan': {
      titulo: '¿Por qué insistir en la evidencia?',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Porque sin evidencia no hay forma de distinguir un sistema que funciona de uno que todavía no ha fallado. Un módulo sin pruebas puede llevar seis meses en producción sin incidentes y romperse el día que llega un dato que nadie previó. La evidencia —requisitos escritos, casos de prueba, trazabilidad entre unos y otros— es lo que permite afirmar algo sobre el sistema antes de que el usuario lo descubra.',
        },
        {
          t: 'p',
          texto:
            'Esto tiene una consecuencia práctica para ustedes desde el primer semestre: cuando entreguen un trabajo, entreguen también cómo comprobaron que sirve. Esa costumbre vale más que cualquier lenguaje que aprendan este año.',
        },
      ],
    },
    'Las cinco actividades marco': {
      titulo: 'Secuencial e iterativo no son dos mundos separados',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Las mismas cinco actividades aparecen en los dos casos. La diferencia es el tamaño del lote y cuántas veces se recorre el ciclo. En un proceso secuencial se recorren una vez sobre todo el alcance: se comunica todo, se planea todo, se modela todo. En uno iterativo se recorren muchas veces sobre porciones pequeñas del alcance.',
        },
        {
          t: 'p',
          texto:
            'Por eso el diagrama de fases que verán en los libros es un modelo didáctico, no una fotografía. En un proyecto real las etapas se solapan (alguien prueba mientras otro sigue construyendo) y se repiten (un defecto encontrado en pruebas devuelve trabajo a diseño). Si alguien les dice que en su empresa "hacen cascada pura", casi siempre quiere decir que documentan las fases, no que nunca vuelven atrás.',
        },
      ],
    },
    'Scrum en concreto': {
      titulo: 'El mito de "en Scrum no hay documentación"',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Error frecuente en los parciales: decir que en Scrum "no hay documentación" o "no hay planeación". El manifiesto ágil valora el software funcionando por encima de la documentación exhaustiva; no la prohíbe. Se planea más veces, en lotes más pequeños, y se documenta lo que realmente se va a usar.',
        },
        {
          t: 'clave',
          titulo: 'Por qué importa la Definición de Terminado',
          texto:
            'Sin una Definición de Terminado explícita, "terminado" significa cosas distintas para cada integrante: para uno es "compila", para otro es "tiene pruebas", para otro es "el usuario ya lo vio".',
        },
      ],
    },
    'Requisitos que se pueden verificar': {
      titulo: 'Cómo convertir un deseo en algo comprobable',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Un deseo se vuelve comprobable cuando responde tres preguntas: qué se mide, en qué condiciones y cuál es el umbral aceptable. Falta cualquiera de las tres y el requisito se vuelve una opinión.',
        },
        {
          t: 'tabla',
          encabezados: ['Deseo', 'Qué se mide', 'Condición', 'Umbral'],
          filas: [
            ['"Que sea rápido"', 'Tiempo de respuesta de la consulta de horario', 'Red 4G, 200 usuarios simultáneos', 'Menos de 2 s en el 95 % de los casos'],
            ['"Que sea fácil"', 'Tasa de éxito en reservar una sala', 'Estudiantes que nunca han usado el sistema, sin ayuda', 'Al menos 8 de cada 10'],
            ['"Que no se caiga"', 'Disponibilidad mensual', 'Horario de atención de la biblioteca', '99,5 % o más'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Prueba de fuego',
          texto:
            'Si no puedes imaginar un experimento cuyo resultado haría que el requisito se declare incumplido, todavía no es un requisito.',
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'De una queja en el pasillo a una primera entrega',
    contexto:
      'La coordinación recibe esta queja: «Nunca sabemos qué salas están libres; llego a la 203 vacía y a los veinte minutos aparece un grupo que dice tenerla apartada en una hoja». Vamos a recorrer el proceso completo sobre este caso.',
    pasos: [
      {
        titulo: '1. Separar el problema de la solución',
        texto:
          'La hoja de papel es una solución implícita, no el problema. El problema real: «Los estudiantes no pueden saber, cuando lo necesitan, si una sala está disponible».',
      },
      {
        titulo: '2. Identificar a los usuarios y su necesidad',
        texto:
          'Tres usuarios con necesidades distintas: el estudiante quiere reservar rápido, la coordinación quiere trazabilidad. Reconocerlo temprano evita discusiones a mitad de camino.',
      },
      {
        titulo: '3. Escribir requisitos comprobables',
        texto:
          'RF-1. El sistema muestra qué salas están libres en un día y franja.\nRF-2. Un estudiante puede reservar una sala libre por máximo 2 horas.\nRF-3. Puede cancelar hasta 30 minutos antes.\nRestricción: debe correr en los equipos de la sala 2 (Windows 10, 4 GB RAM).',
        nota: 'El número en RF-2 —"máximo 2 horas"— es lo que hace el requisito comprobable.',
      },
      {
        titulo: '4. Diseñar antes de escribir código',
        texto:
          'Se definen las entidades (Sala, Reserva, Usuario) y dónde vive cada regla, como que una Reserva no se solape con otra. Esta decisión es la más cara de revertir después.',
      },
      {
        titulo: '5. Construir y probar la primera entrega',
        texto:
          'Con 8 puntos de capacidad se eligen RF-1 y RF-2: el estudiante ya puede ver y reservar, aunque todavía no cancele. Los reportes de coordinación esperan.',
        nota: 'El criterio es el conjunto más pequeño con el que alguien resuelve su necesidad completa, no lo más fácil de programar.',
      },
      {
        titulo: '6. Llega un cambio, como siempre',
        texto:
          'A la tercera semana cambia el reglamento: máximo 3 reservas activas por semana. No es un defecto, es una regla nueva: se estima su impacto y se documenta la decisión.',
        nota: 'Ningún modelo de proceso impide que cambie el reglamento; lo que absorbe el cambio es tratarlo como riesgo.',
      },
    ],
    cierre:
      'En seis pasos se recorrió el proceso completo sin escribir una línea de código, y ya se tomaron todas las decisiones importantes del proyecto.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e1-a1-orden',
      tipo: 'orden',
      nivel: 'base',
      puntos: 100,
      titulo: 'Ordena el desarrollo',
      objetivo: 'Reconocer qué depende de qué dentro del proceso de desarrollo.',
      instrucciones:
        'Organiza las acciones necesarias para construir el sistema de reserva de salas. No hay un único orden correcto: se acepta cualquier orden que respete las dependencias reales entre las acciones.',
      conceptoPrevio: 'Las cinco actividades marco y el orden en que se habilitan unas a otras.',
      conceptos: ['proceso', 'requisito', 'iteracion'],
      items: [
        { id: 'entrevistar', texto: 'Entrevistar a estudiantes y al monitor para entender cómo apartan salas hoy' },
        { id: 'requisitos', texto: 'Escribir los requisitos con criterios de aceptación' },
        { id: 'alcance', texto: 'Decidir qué entra en la primera entrega según la capacidad del equipo' },
        { id: 'modelo', texto: 'Definir las entidades Sala, Reserva y Usuario y la regla de no solapamiento' },
        { id: 'pantallas', texto: 'Diseñar las pantallas de consulta y de reserva' },
        { id: 'codigo', texto: 'Implementar la consulta de disponibilidad' },
        { id: 'pruebas', texto: 'Ejecutar los casos de prueba de la consulta, incluidos los límites' },
        { id: 'entregar', texto: 'Publicar la versión en la sala 2 y capacitar al monitor' },
        { id: 'retro', texto: 'Recoger la retroalimentación de la primera semana de uso' },
      ],
      // a debe ocurrir antes que b. Cualquier orden que respete esto es válido.
      dependencias: [
        ['entrevistar', 'requisitos', 'No se pueden escribir requisitos de un proceso que todavía no se conoce.'],
        ['requisitos', 'alcance', 'Para decidir qué entra primero hay que saber qué hay en total y qué cuesta.'],
        ['requisitos', 'modelo', 'El modelo de datos se deriva de lo que el sistema debe hacer.'],
        ['modelo', 'codigo', 'Codificar sin haber decidido dónde vive la regla de negocio la termina dispersando.'],
        ['pantallas', 'codigo', 'La pantalla define qué debe exponer el código de consulta.'],
        ['alcance', 'codigo', 'Se implementa lo que se decidió entregar, no todo lo que existe.'],
        ['codigo', 'pruebas', 'No se puede ejecutar el caso de prueba de algo que aún no existe.'],
        ['pruebas', 'entregar', 'Entregar sin haber probado traslada el costo del defecto al usuario.'],
        ['entregar', 'retro', 'La retroalimentación de uso exige que alguien lo haya usado.'],
      ],
      pistas: [
        'Empieza por lo único que no depende de nada más: conocer el problema.',
        'Hay dos caminos que pueden ir en cualquier orden entre sí: el modelo de datos y el diseño de pantallas. Los dos deben estar antes de implementar.',
        'Lo último es siempre lo que necesita usuarios reales: entregar y recoger retroalimentación.',
      ],
      explicacion:
        'El proceso no es una fila india: es una red de dependencias. Modelar y diseñar pantallas pueden ocurrir en paralelo, pero ninguno de los dos puede ir después de implementar, porque implementar es justamente ejecutar esas decisiones. Y la retroalimentación no es un adorno final: en un proceso iterativo alimenta la siguiente vuelta de requisitos.',
      retroDependencia: (a, b) =>
        `"${a}" tiene que ocurrir antes que "${b}".`,
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e1-a2-roles',
      tipo: 'emparejar',
      nivel: 'base',
      puntos: 100,
      titulo: '¿Quién se encarga?',
      objetivo: 'Asociar responsabilidades concretas con el rol que las ejerce.',
      instrucciones:
        'Empareja cada responsabilidad con el rol que la ejerce. Recuerda que un rol no equivale a una persona distinta: en un equipo de tres, una misma persona puede ejercer varios.',
      conceptoPrevio: 'Los roles del proceso de desarrollo y la diferencia entre rol y cargo.',
      conceptos: ['rol', 'proceso'],
      izquierda: [
        { id: 'r1', texto: 'Decide qué NO entra en la primera entrega' },
        { id: 'r2', texto: 'Traduce «que sea rápido» a un umbral que se puede medir' },
        { id: 'r3', texto: 'Decide si la regla de solapamiento vive en la base de datos o en el servidor' },
        { id: 'r4', texto: 'Diseña el caso de prueba que usa 0 y 6 cuando el rango válido es 1 a 5' },
        { id: 'r5', texto: 'Automatiza que cada cambio se compile y se despliegue solo' },
        { id: 'r6', texto: 'Observa a cinco estudiantes intentando reservar sin ayuda y mide cuántos lo logran' },
      ],
      derecha: [
        { id: 'po', texto: 'Product Owner o líder funcional' },
        { id: 'analista', texto: 'Analista de requisitos' },
        { id: 'arquitecto', texto: 'Arquitecto de software' },
        { id: 'qa', texto: 'Ingeniero de pruebas (QA)' },
        { id: 'devops', texto: 'DevOps / ingeniero de plataforma' },
        { id: 'ux', texto: 'Diseñador UX' },
      ],
      pares: { r1: 'po', r2: 'analista', r3: 'arquitecto', r4: 'qa', r5: 'devops', r6: 'ux' },
      porQueNo: {
        r1: 'Priorizar no es una decisión técnica: es decidir qué valor se entrega primero y qué se posterga. Por eso la toma quien responde por el valor del producto.',
        r2: 'Convertir un deseo en un umbral medible es el trabajo característico del análisis de requisitos, no del diseño ni de las pruebas.',
        r3: 'Dónde vive una regla es una decisión de estructura, y las decisiones de estructura son las más caras de revertir: son del arquitecto.',
        r4: 'Diseñar entradas que puedan hacer fallar el sistema —incluidas las de frontera— es el oficio de QA, que diseña experimentos, no "busca errores".',
        r5: 'Convertir «funciona en mi máquina» en «funciona en producción» de forma repetible es el trabajo de plataforma.',
        r6: 'Medir con usuarios reales si la interfaz permite lograr la tarea es evidencia de usabilidad, y esa evidencia la produce UX.',
      },
      pistas: [
        'Dos de las seis responsabilidades hablan de medir con personas o con números: una es de análisis (convertir en umbral) y la otra de UX (observar usuarios).',
        'La que menciona una decisión estructural que sería cara de revertir corresponde al arquitecto.',
        'La que decide qué se posterga no es técnica: es de priorización.',
      ],
      explicacion:
        'Los roles se distinguen por el tipo de decisión que toman, no por el cargo en el contrato. En su proyecto de curso, de tres integrantes, los seis roles siguen existiendo: alguien tendrá que priorizar, alguien tendrá que escribir los criterios de aceptación y alguien tendrá que diseñar las pruebas. Si nadie lo hace explícitamente, esas decisiones igual se toman, pero por omisión.',
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'e1-a3-requisitos',
      tipo: 'clasificar',
      nivel: 'base',
      puntos: 120,
      titulo: 'Requisito o frase vaga',
      objetivo: 'Distinguir un enunciado comprobable de uno que no se puede poner a prueba, y arreglar el segundo.',
      instrucciones:
        'Clasifica cada expresión. Después vas a convertir una de las vagas en un requisito comprobable.',
      conceptoPrevio: 'Un requisito verificable indica qué se mide, en qué condiciones y cuál es el umbral.',
      conceptos: ['requisito', 'verificable', 'restriccion'],
      grupos: [
        { id: 'verificable', nombre: 'Requisito comprobable' },
        { id: 'vago', nombre: 'Frase vaga' },
        { id: 'restriccion', nombre: 'Restricción' },
      ],
      items: [
        {
          texto: 'El sistema debe permitir cancelar una reserva hasta 30 minutos antes de su hora de inicio.',
          grupo: 'verificable',
          porQue: 'Dice qué acción, sobre qué objeto y con qué umbral temporal. Se puede diseñar una prueba que lo haga fallar.',
        },
        {
          texto: 'La interfaz debe ser intuitiva y agradable.',
          grupo: 'vago',
          porQue: '"Intuitiva" no define ninguna medición. Dos evaluadores llegarían a conclusiones opuestas sin poder demostrar quién tiene razón.',
        },
        {
          texto: 'El 95 % de las consultas de disponibilidad debe responder en menos de 2 segundos con 200 usuarios concurrentes.',
          grupo: 'verificable',
          porQue: 'Trae magnitud (2 s), condición (200 concurrentes) y umbral (95 %). Es el modelo de un requisito no funcional bien escrito.',
        },
        {
          texto: 'El sistema debe ejecutarse en los equipos de la sala 2, que tienen Windows 10 y 4 GB de RAM.',
          grupo: 'restriccion',
          porQue: 'No describe nada que el sistema haga: limita la solución. Las restricciones se cumplen o no, pero no son funciones.',
        },
        {
          texto: 'El sistema debe usar las mejores prácticas de la industria.',
          grupo: 'vago',
          porQue: 'No nombra ninguna práctica concreta. Es una frase que suena a compromiso y no obliga a nada.',
        },
        {
          texto: 'Los datos personales deben tratarse conforme a la Ley 1581 de 2012.',
          grupo: 'restriccion',
          porQue: 'Es una obligación legal impuesta a la solución. Se deriva en requisitos concretos (autorización, finalidad, supresión), pero por sí misma limita, no funciona.',
        },
        {
          texto: 'El sistema debe mostrar un mensaje cuando el estudiante intente su cuarta reserva activa de la semana.',
          grupo: 'verificable',
          porQue: 'Se puede montar el escenario exacto —tres reservas activas, intentar una cuarta— y observar si el mensaje aparece.',
        },
        {
          texto: 'El sistema debe ser seguro.',
          grupo: 'vago',
          porQue: '"Seguro" frente a qué amenaza, medido cómo. Sin eso no se puede incumplir de forma demostrable, así que tampoco se puede cumplir.',
        },
      ],
      remate: {
        pregunta:
          'Toma la frase «La interfaz debe ser intuitiva y agradable». ¿Cuál de estas versiones la convierte en un requisito comprobable?',
        opciones: [
          'La interfaz debe ser intuitiva, agradable y moderna.',
          'Al menos 8 de cada 10 estudiantes que nunca han usado el sistema deben completar una reserva sin ayuda en menos de 3 minutos.',
          'La interfaz debe seguir las recomendaciones de diseño de la industria.',
          'El equipo de desarrollo debe validar la interfaz con el docente antes de entregar.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Agregar adjetivos no agrega verificabilidad: ahora hay tres palabras imposibles de medir en vez de dos.',
          2: 'Sigue sin nombrar qué recomendación ni cómo se comprueba. Es la misma frase vaga con otro vocabulario.',
          3: 'Define un procedimiento de aprobación, no una propiedad del producto. Que alguien apruebe no dice si el usuario logra la tarea.',
        },
        explicacion:
          'La versión correcta convierte una impresión en una medición de usabilidad: población (estudiantes nuevos), tarea (completar una reserva), condición (sin ayuda) y umbral (8 de 10, menos de 3 minutos). Con eso, el requisito se puede incumplir de forma demostrable, que es la prueba de fuego.',
      },
      pistas: [
        'Pregúntate de cada frase: ¿podría diseñar un experimento cuyo resultado obligue a decir «esto no se cumplió»?',
        'Las restricciones no describen algo que el sistema hace: describen un límite que la solución debe respetar (equipo, norma, presupuesto, plazo).',
        'Hay tres comprobables, tres vagas y dos restricciones.',
      ],
      explicacion:
        'Las tres categorías se confunden con frecuencia en los parciales. Un requisito comprobable describe comportamiento con un umbral; una restricción limita la solución sin describir comportamiento; una frase vaga suena a requisito pero no permite diseñar ninguna prueba. Ojo con la trampa habitual: "debe ser seguro" y "debe cumplir la Ley 1581" se parecen, pero la segunda sí impone una obligación concreta y rastreable.',
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'e1-a4-entrega',
      tipo: 'entrega',
      nivel: 'base',
      puntos: 120,
      titulo: 'Construye una entrega',
      objetivo: 'Decidir el alcance de una primera versión cuando la capacidad no alcanza para todo.',
      instrucciones:
        'El equipo tiene capacidad para 8 puntos en las dos primeras semanas. Elige qué entra en la primera entrega. El criterio no es llenar los 8 puntos: es que alguien pueda resolver su necesidad completa con lo que entregues.',
      conceptoPrevio: 'Alcance mínimo: el conjunto más pequeño con el que un usuario resuelve su necesidad de punta a punta.',
      conceptos: ['alcance-minimo', 'incremento', 'requisito'],
      capacidad: 8,
      unidad: 'puntos',
      opciones: [
        {
          id: 'ver',
          texto: 'RF-1 · Ver qué salas están libres en un día y una franja',
          costo: 3,
          necesidad: 'El estudiante puede saber si hay sala antes de caminar hasta el edificio.',
          esencial: true,
        },
        {
          id: 'reservar',
          texto: 'RF-2 · Reservar una sala libre por máximo 2 horas',
          costo: 5,
          necesidad: 'El estudiante pasa de informarse a resolver: la sala queda apartada y el conflicto desaparece.',
          esencial: true,
        },
        {
          id: 'cancelar',
          texto: 'RF-3 · Cancelar una reserva hasta 30 minutos antes',
          costo: 2,
          necesidad: 'Libera salas que quedarían bloqueadas sin uso. Importante, pero el sistema sirve sin esto: la reserva simplemente vence.',
          esencial: false,
        },
        {
          id: 'reportes',
          texto: 'Reportes de ocupación para la coordinación',
          costo: 8,
          necesidad: 'Resuelve la necesidad de la coordinación, no la del estudiante. Además necesita meses de datos para decir algo.',
          esencial: false,
        },
        {
          id: 'notificaciones',
          texto: 'Recordatorio por correo 1 hora antes de la reserva',
          costo: 3,
          necesidad: 'Reduce el olvido, pero nadie deja de reservar por no tener recordatorio.',
          esencial: false,
        },
        {
          id: 'perfil',
          texto: 'Pantalla de perfil con foto y preferencias',
          costo: 2,
          necesidad: 'No cubre ninguna necesidad del problema planteado. Es alcance que se cuela.',
          esencial: false,
        },
      ],
      // Se exige incluir los esenciales, no pasarse de capacidad y no traer accesorios caros.
      criterio: {
        obligatorias: ['ver', 'reservar'],
        prohibidas: ['reportes', 'perfil'],
        explicacionObligatorias:
          'Sin ver disponibilidad y sin reservar, el estudiante no puede resolver su necesidad: el sistema no sirve para nada todavía.',
        explicacionProhibidas:
          'Los reportes atienden a otro usuario y necesitan datos que aún no existen; el perfil no resuelve ninguna necesidad del problema.',
      },
      pistas: [
        'Vuelve al enunciado del problema: «no se puede saber si una sala está disponible». ¿Qué es lo mínimo para que eso deje de pasar?',
        'Una entrega que solo permite consultar deja al estudiante informado pero con el mismo conflicto: sigue sin poder apartar la sala.',
        'Los 8 puntos de capacidad se agotan exactamente con las dos funcionalidades que resuelven la necesidad del estudiante.',
      ],
      explicacion:
        'Ver (3) + Reservar (5) usan la capacidad completa y entregan un sistema que ya resuelve el problema de punta a punta. Cancelar es valioso y barato, pero no cabe y su ausencia no rompe el flujo: la reserva vence sola. Los reportes son la trampa clásica: son lo que pide quien tiene más autoridad, no quien tiene el problema, y además necesitan datos que la primera entrega apenas empezará a generar. El perfil es alcance que se cuela sin que nadie lo haya pedido.',
    },

    /* ------------------------------------------------------------------ 5 */
    {
      id: 'e1-a5-cambio',
      tipo: 'caso',
      nivel: 'base',
      puntos: 100,
      titulo: 'Llegó un cambio',
      objetivo: 'Decidir cómo responder a una necesidad nueva a mitad de un proyecto y anticipar sus consecuencias.',
      instrucciones:
        'Lee la situación y elige una respuesta. Vas a ver la consecuencia de tu decisión antes de saber si era la más sólida.',
      conceptoPrevio: 'La diferencia entre un defecto, un cambio de alcance y un riesgo que se materializó.',
      conceptos: ['proceso', 'iteracion', 'actividad-sombrilla'],
      escenario:
        'Semana 3 de 6. El sistema de reservas ya permite consultar y reservar; el equipo trabaja en la cancelación. La coordinación informa que el reglamento cambió: desde el próximo semestre ningún estudiante podrá tener más de 3 reservas activas en la misma semana. El contrato con la Facultad fijó el alcance por escrito al inicio.',
      decisiones: [
        {
          id: 'rechazar',
          texto: 'Rechazarlo: el alcance estaba firmado y el cambio llegó tarde.',
          acertada: false,
          consecuencia:
            'El sistema se entrega a tiempo y cumple el contrato. Tres semanas después de la entrega, la coordinación descubre que el sistema permite lo que el reglamento prohíbe y deja de usarlo. El proyecto cumplió el contrato y falló en su propósito.',
          porQue:
            'Un contrato firmado no congela la realidad. Rechazar todo cambio protege al proveedor y deja al cliente con un sistema que no puede usar; en la práctica, es la forma más cara de tener razón.',
        },
        {
          id: 'meter-ya',
          texto: 'Meterlo de inmediato en el incremento actual, sin tocar el plan.',
          acertada: false,
          consecuencia:
            'La cancelación, que estaba a medias, queda sin terminar y sin pruebas. En la entrega aparecen dos funcionalidades incompletas en vez de una terminada, y nadie recuerda por qué se movió el plan.',
          porQue:
            'Aceptar un cambio no es gratis: consume la misma capacidad que ya estaba comprometida. Meterlo "sin tocar el plan" significa en realidad sacar algo del plan, pero sin decidirlo ni decirlo.',
        },
        {
          id: 'estimar',
          texto: 'Estimar su impacto, negociar qué se posterga para hacerle espacio y dejar la decisión registrada.',
          acertada: true,
          consecuencia:
            'El equipo estima 2 puntos —la regla vive en un solo lugar porque se previó que el reglamento podía cambiar— y propone postergar el recordatorio por correo. La coordinación acepta. La entrega sale con consulta, reserva y el límite de 3, y todos saben qué quedó pendiente y por qué.',
          porQue:
            'Esta es la respuesta de ingeniería: el cambio se evalúa, se le hace espacio explícitamente sacrificando algo concreto, y la decisión queda registrada para que dentro de dos meses nadie discuta qué se acordó.',
        },
        {
          id: 'defecto',
          texto: 'Tratarlo como un defecto del sistema y corregirlo sin costo.',
          acertada: false,
          consecuencia:
            'El equipo lo corrige gratis. La coordinación aprende que cualquier necesidad nueva puede presentarse como "defecto", y en las semanas siguientes llegan cuatro más con la misma etiqueta. El proyecto se atrasa dos semanas.',
          porQue:
            'Un defecto es una diferencia entre lo que el sistema hace y lo acordado. Aquí el sistema hace exactamente lo acordado: lo que cambió fue el acuerdo. Confundir las dos cosas destruye la capacidad de planear.',
        },
      ],
      pistas: [
        'Pregúntate primero: ¿el sistema está haciendo algo distinto de lo que se acordó? Si no, no es un defecto.',
        'Aceptar un cambio consume capacidad que ya estaba comprometida en otra cosa. ¿Qué pasa con esa otra cosa?',
        'La respuesta sólida no es aceptar ni rechazar: es hacer visible el costo y decidirlo con el cliente.',
      ],
      explicacion:
        'Ningún modelo de proceso impide que cambie un reglamento. Lo que determina cuánto duele es haber tratado la volatilidad normativa como riesgo —una actividad sombrilla— y haber aislado en el diseño lo que se sabía que podía cambiar. Culpar al modelo ("nos pasó por usar cascada") es la respuesta fácil y la equivocada: en Scrum el reglamento habría cambiado igual.',
    },

    /* ------------------------------------------------------------------ 6 */
    {
      id: 'e1-a6-modelos',
      tipo: 'vf',
      nivel: 'opcional',
      puntos: 90,
      titulo: 'Mitos sobre los modelos de proceso',
      objetivo: 'Desarmar las afirmaciones que se repiten de oído sobre cascada y ágil.',
      instrucciones:
        'Marca cada afirmación como verdadera o falsa. Todas aparecen en discusiones reales y en parciales.',
      conceptoPrevio: 'La comparación de modelos de proceso y los compromisos de Scrum.',
      conceptos: ['proceso', 'iteracion'],
      afirmaciones: [
        {
          texto: 'En Scrum no se documenta.',
          verdadero: false,
          explicacion:
            'El manifiesto ágil valora el software funcionando POR ENCIMA de la documentación exhaustiva; no la prohíbe. Se documenta lo que se va a leer, y se documenta a lo largo del proyecto en vez de en un bloque inicial.',
        },
        {
          texto: 'En un proceso iterativo se planea menos que en uno secuencial.',
          verdadero: false,
          explicacion:
            'Se planea más veces, en lotes más pequeños. La suma de tiempo dedicado a planear suele ser mayor; lo que baja es el costo de equivocarse en cada plan.',
        },
        {
          texto: 'El modelo en cascada sigue siendo razonable cuando los requisitos son estables y están contratados por licitación.',
          verdadero: true,
          explicacion:
            'Es exactamente su nicho: alcance fijo, entorno regulado, poca incertidumbre. El problema de cascada no es que exista, es aplicarlo cuando el cliente todavía no sabe lo que quiere.',
        },
        {
          texto: 'Un prototipo desechable es trabajo perdido, porque después hay que construir el sistema de nuevo.',
          verdadero: false,
          explicacion:
            'Su producto no es código: es conocimiento sobre qué quiere el usuario. Se vuelve trabajo perdido solo cuando el cliente exige que el prototipo se convierta en el producto final, que es el modo típico en que este modelo se rompe.',
        },
        {
          texto: 'A mayor incertidumbre sobre los requisitos, más corto conviene que sea el ciclo de retroalimentación.',
          verdadero: true,
          explicacion:
            'Es el criterio central de elección de modelo. Cuanto menos se sabe, antes hay que poner algo frente al usuario para dejar de suponer.',
        },
        {
          texto: 'Adoptar los eventos de Scrum (planeación, diario, revisión, retrospectiva) garantiza que el equipo sea ágil.',
          verdadero: false,
          explicacion:
            'Los eventos sin las prácticas técnicas ni el cliente disponible producen las reuniones sin los beneficios. Es el modo más común en que Scrum se rompe en la práctica.',
        },
      ],
      pistas: [
        'Dos de las seis son verdaderas. Las cuatro falsas son frases que circulan como si fueran obvias.',
        'Desconfía de las afirmaciones que dicen qué NO se hace en ágil: casi todas exageran una preferencia hasta convertirla en prohibición.',
        'Las dos verdaderas hablan de criterios de elección, no de prohibiciones.',
      ],
      explicacion:
        'El patrón detrás de los cuatro mitos es el mismo: convertir una preferencia del manifiesto ágil ("por encima de") en una prohibición ("no se hace"). Si en el parcial aparece una opción que prohíbe algo en ágil, sospecha de ella.',
    },

    /* ------------------------------------------------------------------ 7 */
    {
      id: 'e1-a7-velocidad',
      tipo: 'calcular',
      nivel: 'opcional',
      puntos: 90,
      titulo: 'Proyectar con velocidad',
      objetivo: 'Estimar cuántas iteraciones faltan y reconocer el supuesto que esconde el promedio.',
      instrucciones:
        'Usa los datos de la tabla. Las fórmulas están a la vista: no hay que adivinarlas.',
      conceptoPrevio: 'Velocidad de un equipo: puntos de trabajo completados por iteración.',
      conceptos: ['iteracion', 'incremento'],
      datos: {
        encabezados: ['Sprint', 'Puntos completados'],
        filas: [
          ['Sprint 1', '22'],
          ['Sprint 2', '26'],
          ['Sprint 3', '24'],
        ],
        nota: 'Quedan 168 puntos pendientes en el backlog del producto.',
      },
      formulas: [
        'Velocidad promedio = suma de puntos ÷ número de sprints',
        'Sprints restantes = ⌈ puntos pendientes ÷ velocidad promedio ⌉   (se redondea hacia arriba: un sprint no se parte)',
        'Proyección pesimista = ⌈ puntos pendientes ÷ velocidad mínima observada ⌉',
      ],
      campos: [
        {
          id: 'promedio',
          etiqueta: 'Velocidad promedio (puntos por sprint)',
          respuestas: ['24'],
          tolerancia: 0,
          porQueNo: 'Suma 22 + 26 + 24 = 72 y divide entre 3 sprints.',
        },
        {
          id: 'sprints',
          etiqueta: 'Sprints necesarios usando el promedio',
          respuestas: ['7'],
          tolerancia: 0,
          porQueNo: '168 ÷ 24 = 7 exacto. Si hubiera dado 7,1 la respuesta sería 8.',
        },
        {
          id: 'pesimista',
          etiqueta: 'Sprints necesarios en la proyección pesimista',
          respuestas: ['8'],
          tolerancia: 0,
          porQueNo: 'La velocidad mínima observada es 22. 168 ÷ 22 = 7,63, que redondeado hacia arriba da 8.',
        },
      ],
      pistas: [
        'Para la velocidad promedio suma las tres y divide entre 3.',
        'Para los sprints, divide los 168 puntos entre la velocidad y redondea SIEMPRE hacia arriba: medio sprint no existe.',
        'Para la pesimista no uses el promedio: usa la velocidad más baja de las tres observadas.',
      ],
      explicacion:
        'Proyectar con el promedio da 7 sprints, pero esconde un supuesto fuerte: que la variabilidad no importa. Por eso en la práctica se reporta un rango —entre 7 y 8 sprints— usando la velocidad máxima y la mínima observadas. Un número solo, sin rango, transmite una certeza que los datos no respaldan.',
    },
  ],

  reto: {
    id: 'e1-reto',
    tipo: 'secuencia',
    nivel: 'base',
    puntos: 150,
    titulo: 'Del problema al primer incremento',
    objetivo:
      'Recorrer en cuatro decisiones el camino completo: entender el problema, escribir un requisito comprobable, elegir alcance y responder a un cambio.',
    instrucciones:
      'Un caso nuevo, distinto al de las actividades. Cada paso depende del anterior, así que léelos en orden.',
    conceptoPrevio: 'Todo lo trabajado en esta estación.',
    conceptos: ['requisito', 'verificable', 'alcance-minimo', 'proceso'],
    contexto:
      'Bienestar Universitario quiere resolver esto: «Los estudiantes que necesitan tutoría no saben qué monitores hay disponibles ni cómo agendar con ellos; hoy se hace por WhatsApp y se pierden las citas». Tienes 6 puntos de capacidad para el primer incremento.',
    pasos: [
      {
        id: 'p1',
        tipo: 'quiz',
        conceptos: ['proceso'],
        seccion: { estacion: 'proceso', titulo: 'Producto, proceso y por qué se separan' },
        pregunta: 'Paso 1. ¿Cuál de estos es el enunciado del problema, y no una solución disfrazada?',
        opciones: [
          'Falta una aplicación móvil de agendamiento de tutorías.',
          'Los estudiantes no pueden saber qué monitores están disponibles ni dejar constancia de una cita acordada.',
          'WhatsApp no sirve para agendar tutorías.',
          'Bienestar necesita un calendario compartido con los monitores.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Nombra una solución ("aplicación móvil") antes de entender el problema. Así se llega a construir algo que nadie usa.',
          2: 'Culpa a la herramienta actual. Aunque tenga razón, no dice qué necesita el usuario ni permite verificar si se resolvió.',
          3: 'Otra solución disfrazada, y además elige una tecnología concreta antes de saber si hace falta.',
        },
        explicacion:
          'El problema se enuncia en términos de lo que la persona no puede hacer, sin mencionar herramientas. Si el enunciado nombra una tecnología, todavía es una solución.',
      },
      {
        id: 'p2',
        tipo: 'quiz',
        conceptos: ['verificable', 'requisito'],
        seccion: { estacion: 'proceso', titulo: 'Requisitos que se pueden verificar' },
        pregunta: 'Paso 2. ¿Cuál de estos requisitos es comprobable tal como está escrito?',
        opciones: [
          'El sistema debe facilitar el agendamiento de tutorías.',
          'El sistema debe mostrar los horarios disponibles de cada monitor para los próximos 7 días.',
          'El sistema debe ser rápido al cargar los horarios.',
          'El sistema debe mejorar la asistencia a las tutorías.',
        ],
        correcta: 1,
        porQueNo: {
          0: '"Facilitar" no se puede medir ni incumplir de forma demostrable.',
          2: '"Rápido" sin umbral ni condición no define ninguna prueba. Con "en menos de 2 s con red 4G" sí lo sería.',
          3: 'Es un resultado esperado del proyecto, no una función del sistema. Depende de factores que el software no controla.',
        },
        explicacion:
          'La opción correcta dice qué muestra, de quién y en qué ventana de tiempo. Se puede montar el escenario y comprobar si aparece. Ojo con la última: los beneficios esperados son legítimos como objetivo del proyecto, pero no sirven como requisito porque el sistema no puede garantizarlos solo.',
      },
      {
        id: 'p3',
        tipo: 'entrega',
        conceptos: ['alcance-minimo', 'incremento'],
        seccion: { estacion: 'proceso', titulo: 'Las cinco actividades marco' },
        instrucciones: 'Paso 3. Elige el alcance del primer incremento. Capacidad: 6 puntos.',
        capacidad: 6,
        unidad: 'puntos',
        opciones: [
          { id: 'ver-monitores', texto: 'Ver monitores y sus horarios disponibles', costo: 3, necesidad: 'El estudiante deja de preguntar por WhatsApp quién está libre.', esencial: true },
          { id: 'agendar', texto: 'Agendar una cita con un monitor en un horario libre', costo: 3, necesidad: 'La cita queda registrada: desaparece el "se perdió la cita".', esencial: true },
          { id: 'chat', texto: 'Chat interno entre estudiante y monitor', costo: 5, necesidad: 'Reemplaza WhatsApp, pero no es lo que impide agendar hoy.', esencial: false },
          { id: 'valoracion', texto: 'Calificar al monitor después de la tutoría', costo: 2, necesidad: 'Útil para Bienestar más adelante; no resuelve nada en el primer incremento.', esencial: false },
          { id: 'reporte', texto: 'Reporte de tutorías por programa académico', costo: 5, necesidad: 'Atiende a Bienestar, no al estudiante, y necesita meses de datos.', esencial: false },
        ],
        criterio: {
          obligatorias: ['ver-monitores', 'agendar'],
          prohibidas: ['chat', 'reporte'],
          explicacionObligatorias: 'Sin ver disponibilidad y sin agendar, el estudiante sigue exactamente igual que con WhatsApp.',
          explicacionProhibidas: 'El chat reemplaza una herramienta que ya existe y funciona; el reporte atiende a otro usuario y aún no hay datos.',
        },
        explicacion:
          'Ver (3) + agendar (3) agotan la capacidad y resuelven la necesidad completa. Calificar es barato pero prescindible; el chat es la trampa de "reemplacemos WhatsApp", que consume media capacidad sin resolver el problema enunciado.',
      },
      {
        id: 'p4',
        tipo: 'caso',
        conceptos: ['actividad-sombrilla', 'finalidad'],
        seccion: { estacion: 'proceso', titulo: 'Modelos de proceso: cuál, cuándo y por qué' },
        escenario:
          'Paso 4. Última semana. Bienestar avisa que la Vicerrectoría exige que el sistema registre el programa académico del estudiante para sus informes semestrales. No estaba en los requisitos.',
        decisiones: [
          {
            id: 'a',
            texto: 'Agregarlo de una vez: es solo un campo más en el formulario.',
            acertada: false,
            consecuencia:
              'Se agrega el campo. En la entrega nadie sabe para qué se pide ese dato ni cuánto tiempo se conserva, y el formulario ahora recoge un dato personal sin finalidad declarada.',
            porQue:
              '"Es solo un campo" es la frase con la que entra la mayor parte del alcance no planeado. Además, pedir un dato personal exige declarar su finalidad: no es una decisión solo técnica.',
          },
          {
            id: 'b',
            texto: 'Estimarlo, declarar para qué se usará el dato y negociar si entra ahora o en el siguiente incremento.',
            acertada: true,
            consecuencia:
              'El equipo estima 1 punto, documenta la finalidad ("informes semestrales de cobertura de tutoría") y propone entrarlo en el siguiente incremento porque la capacidad de este ya está comprometida. Bienestar acepta.',
            porQue:
              'Se trata como lo que es: un requisito nuevo con implicaciones de datos personales. Se estima, se declara su finalidad y se decide su lugar en el plan con el cliente.',
          },
          {
            id: 'c',
            texto: 'Rechazarlo porque no estaba en el alcance acordado.',
            acertada: false,
            consecuencia:
              'El sistema se entrega sin el dato. La Vicerrectoría no puede producir su informe y condiciona la continuidad del proyecto al siguiente semestre.',
            porQue:
              'Rechazar de plano ignora que quien pide tiene autoridad sobre la continuidad del proyecto. La alternativa no era aceptarlo gratis: era hacer visible el costo.',
          },
        ],
        explicacion:
          'El paso 4 mezcla dos cosas que en la vida real llegan juntas: un cambio de alcance y una obligación sobre datos personales. La respuesta de ingeniería atiende las dos: estima el costo y declara la finalidad del dato antes de pedirlo.',
      },
    ],
    explicacion:
      'Este recorrido es el esqueleto de cualquier proyecto: entender el problema sin saltar a la solución, escribir al menos un requisito que otro pueda comprobar, elegir el alcance más pequeño que resuelve la necesidad completa, y responder a los cambios haciendo visible su costo. Son las cuatro decisiones que más veces se toman mal en un proyecto de primer semestre.',
  },

  sintesis: {
    puntos: [
      'El producto es lo que se entrega; el proceso es cómo se produce. La diferencia explica el costo de cambiarlo después.',
      'Un requisito sirve cuando se puede diseñar una prueba capaz de hacerlo fallar: qué se mide, en qué condiciones, con qué umbral.',
      'Las cinco actividades marco aparecen en todos los modelos. Cambia el tamaño del lote y cuántas veces se repiten.',
      'Los roles son tipos de decisión, no cargos. En un equipo de tres siguen existiendo los seis.',
      'El alcance de una primera entrega se elige por necesidad resuelta de punta a punta, no por facilidad ni por quién grita más fuerte.',
      'Los cambios no se evitan con un modelo: se absorben con gestión de riesgos y con diseño que aísle lo que se sabe volátil.',
    ],
    conexion:
      'Todo lo que sigue en el corte cuelga de aquí. En la estación 2 verás cómo se decide si lo construido es bueno, y la respuesta va a ser la misma que aquí: con evidencia, no con impresiones. En la estación 5 escribirás los algoritmos que implementan estos requisitos, y comprobarás que un algoritmo sin casos de prueba tiene el mismo problema que un requisito sin umbral: nadie puede decir si está bien.',
  },

  glosario: ['proceso', 'requisito', 'requisito-funcional', 'restriccion', 'verificable', 'iteracion', 'incremento', 'actividad-sombrilla', 'rol', 'alcance-minimo'],

  taller: {
    id: 'e1-taller',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Taller en clase · Un problema del campus',
    objetivo: 'Practicar sobre un problema real que ustedes mismos identifiquen, no sobre un caso de libro.',
    instrucciones:
      'En grupos de tres. El entregable es físico o por la plataforma del curso: esta aplicación no lo califica, solo guarda tus notas de trabajo para que no las pierdas.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Elijan un problema real del campus —no del sistema de reservas— y documéntenlo como lo haría un equipo de desarrollo en su primera semana.',
    temas: [
      'La fila del casino a la hora del almuerzo.',
      'Los préstamos de equipos del laboratorio.',
      'La cartelera de eventos y convocatorias.',
      'El proceso de solicitud de certificados académicos.',
      'La asignación de monitorías.',
      'El control de asistencia a las tutorías de Bienestar.',
    ],
    campos: [
      { id: 'problema', etiqueta: 'Enunciado del problema (sin mencionar ninguna solución ni tecnología)', filas: 3 },
      { id: 'usuarios', etiqueta: 'Usuarios afectados y qué necesita cada uno', filas: 4 },
      { id: 'req1', etiqueta: 'Requisito comprobable 1 (qué se mide, en qué condiciones, con qué umbral)', filas: 2 },
      { id: 'req2', etiqueta: 'Requisito comprobable 2', filas: 2 },
      { id: 'req3', etiqueta: 'Requisito comprobable 3', filas: 2 },
      { id: 'alcance', etiqueta: 'Qué entraría en la primera entrega y por qué', filas: 3 },
    ],
    listaChequeo: [
      'El enunciado del problema no nombra ninguna tecnología ni solución.',
      'Hay al menos dos tipos de usuario con necesidades distintas.',
      'Los tres requisitos indican magnitud, condición y umbral.',
      'Al menos uno de los tres es no funcional (tiempo, disponibilidad, accesibilidad).',
      'La primera entrega permite a un usuario resolver su necesidad de punta a punta.',
    ],
    rubrica: [
      'El problema está enunciado como una incapacidad del usuario, no como la ausencia de una herramienta. (30 %)',
      'Los requisitos se pueden convertir en una prueba que otro grupo podría ejecutar sin preguntarles nada. (40 %)',
      'La justificación del alcance se apoya en la necesidad resuelta, no en la facilidad de implementación. (30 %)',
    ],
  },
}
