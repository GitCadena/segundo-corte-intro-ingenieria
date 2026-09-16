export default {
  id: 'proceso',
  sesion: 'Sesión 7',
  titulo: 'El proceso de desarrollo de software',
  gancho: 'Programar es una parte pequeña de construir software. Esta sesión es sobre todo lo demás.',
  objetivo:
    'Distinguir producto y proceso, reconocer las actividades y roles del desarrollo de software, y elegir un modelo de proceso con argumentos.',
  lecciones: [
    {
      titulo: 'Producto, proceso y por qué se separan',
      cuerpo: [
        {
          t: 'p',
          texto:
            'El producto es lo que se entrega: un ejecutable, una API, una app, su documentación y sus datos. El proceso es la secuencia de actividades que lo produce. Dos equipos pueden entregar el mismo producto con procesos muy distintos, y esa diferencia explica casi todo lo que pasa después: cuánto cuesta cambiarlo, cuántos defectos llegan al usuario y si el equipo puede mantenerlo cuando quien lo escribió ya no está.',
        },
        {
          t: 'clave',
          titulo: 'Definición de trabajo',
          texto:
            'Un proceso de software es un conjunto de actividades, restricciones y recursos que, aplicados de forma repetible, transforman una necesidad en un sistema que la resuelve y en la evidencia de que la resuelve.',
        },
        {
          t: 'p',
          texto:
            'Esa última parte —la evidencia— es lo que separa a un ingeniero de alguien que programa bien. Una funcionalidad sin pruebas, sin requisitos escritos y sin trazabilidad no es un entregable de ingeniería: es una promesa.',
        },
      ],
    },
    {
      titulo: 'Las cinco actividades marco',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Independientemente del modelo que use el equipo, casi todo proceso contiene las mismas cinco actividades marco. Cambia el orden, el tamaño del lote y cuántas veces se repiten.',
        },
        {
          t: 'tabla',
          encabezados: ['Actividad', 'Pregunta que responde', 'Salida típica'],
          filas: [
            ['Comunicación', '¿Qué necesita quién y para qué?', 'Requisitos, historias de usuario, glosario'],
            ['Planeación', '¿Cómo, con quién, cuándo y con qué riesgos?', 'Cronograma, estimaciones, plan de riesgos'],
            ['Modelado', '¿Cómo se estructura la solución antes de codificarla?', 'Diagramas, modelo de datos, arquitectura'],
            ['Construcción', '¿El código hace lo que se acordó?', 'Código fuente, pruebas, build'],
            ['Despliegue', '¿El usuario lo tiene, lo usa y qué opina?', 'Versión liberada, manual, retroalimentación'],
          ],
        },
        {
          t: 'p',
          texto:
            'Encima de ellas corren las actividades sombrilla, que nunca se "terminan": gestión de riesgos, aseguramiento de calidad, gestión de la configuración (control de versiones), medición, revisiones técnicas y gestión de la reutilización. Cuando un proyecto se cae, casi siempre falló una sombrilla, no la codificación.',
        },
      ],
    },
    {
      titulo: 'Quién hace qué: roles del proceso',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Los roles no son cargos. Una persona puede cubrir varios en un equipo pequeño, y en una empresa grande cada rol puede ser un área completa. Reconocerlos sirve para dos cosas: entender con quién se negocia cada decisión y ubicar hacia dónde se quiere uno mover profesionalmente.',
        },
        {
          t: 'lista',
          items: [
            'Analista o ingeniero de requisitos: traduce el problema del cliente a algo verificable. Su producto es una frase que se puede probar, no un deseo.',
            'Arquitecto de software: decide la estructura, los límites entre componentes y las tecnologías. Sus decisiones son las más caras de revertir.',
            'Desarrollador: implementa y prueba. Responde por el código y por los casos de prueba de su unidad.',
            'Ingeniero de pruebas (QA): diseña la evidencia de que el sistema cumple. No "busca errores", diseña experimentos que puedan fallar.',
            'DevOps / ingeniero de plataforma: automatiza construcción, despliegue y monitoreo. Convierte "funciona en mi máquina" en "funciona en producción".',
            'Product Owner o líder funcional: prioriza. Es quien decide qué NO se hace en esta versión.',
            'Diseñador UX: define la interacción y valida con usuarios reales. Su evidencia son pruebas de usabilidad, no gustos.',
            'Administrador de base de datos, especialista en seguridad, científico de datos: roles especializados que aparecen según el dominio.',
          ],
        },
      ],
    },
    {
      titulo: 'Modelos de proceso: cuál, cuándo y por qué',
      cuerpo: [
        {
          t: 'p',
          texto:
            'No existe un modelo superior. Existe un modelo adecuado a un nivel de incertidumbre, un costo de error y un tipo de contrato. Esta es la comparación que deben poder defender en el parcial.',
        },
        {
          t: 'tabla',
          encabezados: ['Modelo', 'Idea central', 'Funciona cuando', 'Se rompe cuando'],
          filas: [
            [
              'Cascada',
              'Fases secuenciales; cada una se aprueba antes de la siguiente',
              'Los requisitos son estables, regulados o contratados por licitación',
              'El cliente descubre lo que quería al ver el producto (casi siempre)',
            ],
            [
              'Incremental',
              'Se entrega por partes funcionales, cada una utilizable',
              'Se necesita valor temprano y el alcance se puede partir',
              'Las partes tienen dependencias fuertes entre sí',
            ],
            [
              'Prototipos',
              'Se construye una versión desechable para descubrir requisitos',
              'La interfaz o la interacción son el riesgo principal',
              'El cliente exige que el prototipo se convierta en el producto',
            ],
            [
              'Espiral',
              'Ciclos guiados por análisis de riesgo, con prototipos en cada vuelta',
              'El proyecto es grande, largo y de alto riesgo técnico',
              'No hay capacidad real de analizar riesgos ni presupuesto para iterar',
            ],
            [
              'Ágil (Scrum, XP, Kanban)',
              'Iteraciones cortas, cliente presente, software funcionando como medida',
              'Los requisitos cambian y hay acceso continuo al usuario',
              'Se adopta la ceremonia sin las prácticas técnicas ni el cliente disponible',
            ],
          ],
        },
        {
          t: 'clave',
          titulo: 'Criterio de elección',
          texto:
            'Mientras mayor sea la incertidumbre sobre los requisitos, más corto debe ser el ciclo de retroalimentación. Mientras mayor sea el costo de una falla (salud, aviación, banca), más formal debe ser la verificación. Los dos criterios son independientes: existen proyectos ágiles con verificación muy estricta.',
        },
      ],
    },
    {
      titulo: 'Scrum en concreto',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Scrum es el marco ágil más usado en la industria colombiana, así que conviene conocerlo con precisión y no de oído.',
        },
        {
          t: 'lista',
          items: [
            'Responsabilidades: Product Owner (maximiza el valor y ordena el backlog), Scrum Master (hace funcionar el marco y remueve impedimentos), Equipo de desarrollo (autogestionado, entrega el incremento).',
            'Eventos: el Sprint (contenedor, de 1 a 4 semanas), planeación del sprint, scrum diario (15 minutos, sincronización del equipo), revisión del sprint (con interesados) y retrospectiva (mejora del proceso).',
            'Artefactos: Product Backlog (todo lo pendiente, ordenado), Sprint Backlog (lo comprometido y el plan) e Incremento (lo terminado y utilizable).',
            'Compromisos: meta del producto, meta del sprint y Definición de Terminado. Sin una Definición de Terminado explícita, "terminado" significa cosas distintas para cada integrante.',
          ],
        },
        {
          t: 'p',
          texto:
            'Error frecuente en los parciales: decir que en Scrum "no hay documentación" o "no hay planeación". El manifiesto ágil valora el software funcionando por encima de la documentación exhaustiva; no la prohíbe. Se planea más veces, en lotes más pequeños.',
        },
      ],
    },
    {
      titulo: 'Requisitos que se pueden verificar',
      cuerpo: [
        {
          t: 'p',
          texto:
            'La historia de usuario es el formato más común para capturar una necesidad, pero solo sirve si trae criterios de aceptación. El formato es: Como <rol>, quiero <acción>, para <beneficio>.',
        },
        {
          t: 'codigo',
          etiqueta: 'Historia con criterios de aceptación',
          texto: `Como estudiante de primer semestre,
quiero consultar mi horario desde el celular,
para no depender de la cartelera de la facultad.

Criterios de aceptación
1. Dado que inicié sesión, cuando abro "Mi horario",
   entonces veo las materias de la semana en curso.
2. Dado que no hay conexión, cuando abro "Mi horario",
   entonces veo la última versión descargada y su fecha.
3. El horario carga en menos de 2 segundos con red 4G.`,
        },
        {
          t: 'p',
          texto:
            'Los criterios 1 y 2 describen comportamiento (adecuación funcional). El criterio 3 describe una cualidad medible (eficiencia de desempeño). Los dos tipos deben poder probarse; si una frase no se puede convertir en prueba, todavía no es un requisito.',
        },
      ],
    },
  ],
  retos: [
    {
      tipo: 'orden',
      id: 'p-orden-marco',
      nivel: 'base',
      puntos: 15,
      enunciado:
        'Ordena las cinco actividades marco tal como se recorren dentro de una iteración de desarrollo.',
      items: ['Comunicación', 'Planeación', 'Modelado', 'Construcción', 'Despliegue'],
      explicacion:
        'El orden se repite en cada iteración. En cascada se recorre una sola vez y de forma completa; en modelos iterativos se recorre muchas veces sobre lotes pequeños de alcance.',
    },
    {
      tipo: 'clasificar',
      id: 'p-clas-modelo',
      nivel: 'base',
      puntos: 25,
      enunciado:
        'Cada escenario tiene un modelo de proceso más adecuado. Asigna cada uno al modelo que defenderías ante el cliente.',
      grupos: [
        { id: 'cascada', nombre: 'Cascada' },
        { id: 'agil', nombre: 'Ágil / iterativo' },
        { id: 'prototipo', nombre: 'Prototipos' },
      ],
      items: [
        { texto: 'Sistema de nómina que debe cumplir una norma legal publicada y fija', grupo: 'cascada' },
        { texto: 'Contrato estatal con alcance, entregables y precio cerrados desde el inicio', grupo: 'cascada' },
        { texto: 'App de una startup que aún no sabe qué funcionalidad usará la gente', grupo: 'agil' },
        { texto: 'Plataforma interna que recibe cambios de prioridad cada mes', grupo: 'agil' },
        { texto: 'Rediseño de una interfaz donde el cliente no logra explicar qué quiere ver', grupo: 'prototipo' },
        { texto: 'Prueba de una interacción por voz que nadie en el equipo ha construido antes', grupo: 'prototipo' },
      ],
      explicacion:
        'La variable decisiva es dónde está la incertidumbre. Si está en el negocio o en las prioridades, se itera. Si está en la interacción, se prototipa. Si no hay incertidumbre pero sí formalidad contractual, la cascada es defendible.',
    },
    {
      tipo: 'quiz',
      id: 'p-q1',
      nivel: 'base',
      puntos: 10,
      pregunta: '¿Cuál de estas afirmaciones describe correctamente la diferencia entre producto y proceso?',
      opciones: [
        'El producto es el código y el proceso es la documentación que lo acompaña.',
        'El producto es lo que se entrega; el proceso es el conjunto de actividades que lo produce.',
        'El proceso solo existe en metodologías ágiles; en cascada se habla únicamente de producto.',
        'Son sinónimos: el proceso es el producto visto desde la gerencia.',
      ],
      correcta: 1,
      explicacion:
        'La documentación hace parte del producto entregado. El proceso es cómo se llega a él, y existe en cualquier metodología, incluso cuando nadie lo escribió.',
    },
    {
      tipo: 'quiz',
      id: 'p-q2',
      nivel: 'base',
      puntos: 10,
      pregunta: 'Un equipo trabaja en sprints de dos semanas y entrega software funcionando en cada uno, pero nunca hace retrospectiva. ¿Qué se pierde?',
      opciones: [
        'Nada relevante: el incremento se sigue entregando.',
        'El mecanismo de mejora del propio proceso.',
        'La posibilidad de estimar el siguiente sprint.',
        'La Definición de Terminado.',
      ],
      correcta: 1,
      explicacion:
        'La retrospectiva es el único evento cuyo objeto es el proceso y no el producto. Sin ella el equipo repite los mismos errores con puntualidad quincenal.',
    },
    {
      tipo: 'quiz',
      id: 'p-q3',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Una entidad pública contrata por licitación un sistema de recaudo con alcance cerrado. A mitad del proyecto cambia un decreto y con él la fórmula de liquidación. ¿Cuál es la lectura de ingeniería más precisa?',
      opciones: [
        'Fue un error usar cascada: con Scrum el decreto no habría afectado el proyecto.',
        'El modelo no evita el cambio; lo que falló fue no tratar la volatilidad normativa como riesgo y no diseñar la fórmula como componente configurable.',
        'El cambio debe rechazarse porque el alcance estaba firmado.',
        'Es un defecto de calidad del proveedor y debe corregirse sin costo.',
      ],
      correcta: 1,
      explicacion:
        'Ningún modelo de proceso impide que cambie la ley. La gestión de riesgos (actividad sombrilla) y una decisión de arquitectura —aislar lo que se sabe volátil— son lo que absorbe el cambio. Culpar al modelo es la respuesta fácil y la equivocada.',
    },
    {
      tipo: 'quiz',
      id: 'p-q4',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        '¿Cuál de los siguientes enunciados es un requisito verificable tal como está escrito?',
      opciones: [
        'El sistema debe ser rápido e intuitivo.',
        'El sistema debe usar las mejores prácticas de la industria.',
        'El 95% de las consultas de saldo deben responder en menos de 800 ms con 200 usuarios concurrentes.',
        'El sistema debe ser moderno y escalable.',
      ],
      correcta: 2,
      explicacion:
        'Un requisito verificable indica magnitud, condición y umbral. "Rápido", "intuitivo" y "moderno" no definen un experimento que pueda fallar, así que no se pueden probar ni incumplir de forma demostrable.',
    },
    {
      tipo: 'respuesta',
      id: 'p-resp-sprints',
      nivel: 'reto',
      puntos: 20,
      enunciado:
        'El backlog de un producto suma 168 puntos de historia. El equipo lleva tres sprints con velocidades de 22, 26 y 24 puntos. Usando la velocidad promedio, ¿cuántos sprints completos se necesitan como mínimo para terminar el backlog? Responde solo con el número.',
      pista: 'Promedia las tres velocidades y divide. Un sprint no se puede partir por la mitad: redondea hacia arriba.',
      respuestas: ['7'],
      explicacion:
        'Velocidad promedio = (22+26+24)/3 = 24 puntos por sprint. 168/24 = 7 sprints exactos. Si el resultado hubiera dado 7,1 la respuesta sería 8: la capacidad no se fracciona. Ojo con el supuesto oculto: proyectar con el promedio ignora la variabilidad, por eso en la práctica se proyecta un rango (por ejemplo, con la velocidad mínima y la máxima).',
    },
    {
      tipo: 'taller',
      id: 'p-taller-historias',
      nivel: 'reto',
      puntos: 30,
      enunciado:
        'Tomen el proyecto final del curso y escriban tres historias de usuario para su primer incremento, cada una con criterios de aceptación en formato Dado/Cuando/Entonces.',
      entregables: [
        'Tres historias en formato "Como <rol>, quiero <acción>, para <beneficio>".',
        'Mínimo dos criterios de aceptación por historia, uno de ellos medible (tiempo, cantidad o porcentaje).',
        'Una Definición de Terminado del equipo, con máximo cinco puntos.',
        'La justificación, en tres renglones, del modelo de proceso que van a usar.',
      ],
      rubrica: [
        'Cada historia expresa un beneficio real, no una tarea técnica disfrazada.',
        'Los criterios se pueden convertir en una prueba que alguien más podría ejecutar.',
        'La Definición de Terminado incluye al menos un criterio de calidad además de "compila".',
      ],
    },
  ],
}
