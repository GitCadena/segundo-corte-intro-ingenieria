export default {
  id: 'calidad',
  sesion: 'Sesión 8',
  titulo: 'Calidad del software: SQuaRE, corrección funcional y usabilidad',
  gancho: '"Funciona" es una opinión hasta que alguien define contra qué se compara.',
  objetivo:
    'Ubicar la familia ISO/IEC 25000, describir el modelo de calidad del producto y evaluar adecuación funcional y usabilidad con métricas, no con impresiones.',
  lecciones: [
    {
      titulo: 'Tres calidades distintas',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Cuando alguien dice que un software "es de buena calidad" suele estar hablando de una de tres cosas, y conviene no mezclarlas.',
        },
        {
          t: 'lista',
          items: [
            'Calidad interna: propiedades del código y del diseño que ve el equipo. Modularidad, legibilidad, acoplamiento, cobertura de pruebas.',
            'Calidad externa: comportamiento del sistema ejecutándose. Responde bien, no se cae, hace lo que dice.',
            'Calidad en uso: resultado para la persona que lo usa en su contexto real. ¿Logra su tarea, en cuánto tiempo, con cuántos errores y con qué nivel de satisfacción?',
          ],
        },
        {
          t: 'p',
          texto:
            'Un sistema puede tener excelente calidad interna y pésima calidad en uso. El caso contrario también existe y es peor a mediano plazo: funciona hoy y nadie puede modificarlo mañana.',
        },
      ],
    },
    {
      titulo: 'La familia ISO/IEC 25000 (SQuaRE)',
      cuerpo: [
        {
          t: 'p',
          texto:
            'SQuaRE significa Software Product Quality Requirements and Evaluation. Es la familia de normas que reemplazó a ISO/IEC 9126 y organiza en divisiones todo lo relacionado con calidad de producto de software.',
        },
        {
          t: 'tabla',
          encabezados: ['División', 'Serie', 'Qué aporta'],
          filas: [
            ['Gestión de calidad', '2500n', 'Modelos y vocabulario comunes a toda la familia (ISO/IEC 25000, 25001)'],
            ['Modelo de calidad', '2501n', 'Las características de calidad: producto, calidad en uso y datos (ISO/IEC 25010, 25012)'],
            ['Medición de calidad', '2502n', 'Cómo construir y aplicar medidas (ISO/IEC 25020, 25023)'],
            ['Requisitos de calidad', '2503n', 'Cómo especificar requisitos de calidad (ISO/IEC 25030)'],
            ['Evaluación de calidad', '2504n', 'El proceso de evaluación y quién lo ejecuta (ISO/IEC 25040)'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Nota de precisión',
          texto:
            'ISO/IEC 25001 trata de planeación y gestión de la evaluación de calidad; el modelo de características es ISO/IEC 25010. Si en el parcial preguntan "cuál es la norma del modelo de calidad del producto", la respuesta es 25010.',
        },
      ],
    },
    {
      titulo: 'El modelo de calidad del producto',
      cuerpo: [
        {
          t: 'p',
          texto:
            'ISO/IEC 25010:2011 define ocho características de calidad del producto, cada una con subcaracterísticas. La revisión de 2023 reorganiza el modelo en nueve: renombra usabilidad como capacidad de interacción, separa flexibilidad (antes dentro de portabilidad y mantenibilidad) e incorpora seguridad física (safety). En el curso trabajaremos sobre el modelo de ocho características, señalando el cambio cuando corresponda.',
        },
        {
          t: 'tabla',
          encabezados: ['Característica', 'Pregunta que responde', 'Subcaracterísticas clave'],
          filas: [
            ['Adecuación funcional', '¿Hace lo que debe hacer?', 'Completitud, corrección, pertinencia'],
            ['Eficiencia de desempeño', '¿A qué costo de recursos?', 'Tiempo de respuesta, uso de recursos, capacidad'],
            ['Compatibilidad', '¿Convive e intercambia con otros sistemas?', 'Coexistencia, interoperabilidad'],
            ['Usabilidad', '¿La persona logra su tarea?', 'Aprendizaje, operabilidad, protección ante errores, accesibilidad'],
            ['Fiabilidad', '¿Sigue funcionando en el tiempo?', 'Madurez, disponibilidad, tolerancia a fallos, recuperación'],
            ['Seguridad', '¿Protege datos y accesos?', 'Confidencialidad, integridad, no repudio, autenticidad'],
            ['Mantenibilidad', '¿Se puede cambiar sin romperlo?', 'Modularidad, reusabilidad, analizabilidad, capacidad de prueba'],
            ['Portabilidad', '¿Se lleva a otro entorno?', 'Adaptabilidad, instalabilidad, reemplazabilidad'],
          ],
        },
      ],
    },
    {
      titulo: 'Adecuación funcional y corrección funcional',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Es la característica que el microcurrículo llama corrección funcional, y vale la pena separarla de sus hermanas porque en el parcial se confunden.',
        },
        {
          t: 'lista',
          items: [
            'Completitud funcional: están todas las funciones que se acordaron. Falla cuando el sistema no tiene el reporte que pidió el cliente.',
            'Corrección funcional: los resultados son correctos con la precisión requerida. Falla cuando el reporte existe pero suma mal.',
            'Pertinencia funcional: las funciones facilitan la tarea real. Falla cuando el reporte existe, suma bien y nadie lo necesita porque no responde la pregunta del negocio.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Cómo se mide',
          texto:
            'Corrección funcional = casos de prueba aprobados / casos de prueba ejecutados. Requiere un oráculo: una fuente independiente que diga cuál era el resultado esperado. Sin oráculo no hay medición, solo la sensación de que la pantalla se ve bien.',
        },
        {
          t: 'p',
          texto:
            'De ahí la importancia de los criterios de aceptación de la sesión anterior: son el oráculo escrito antes de programar, cuando todavía nadie está defendiendo su propio código.',
        },
      ],
    },
    {
      titulo: 'Usabilidad: de la opinión a la evidencia',
      cuerpo: [
        {
          t: 'p',
          texto:
            'La usabilidad no es que la interfaz sea bonita. ISO/IEC 25010 la descompone en reconocibilidad de la adecuación (¿el usuario entiende si esto le sirve?), aprendizaje, operabilidad, protección contra errores de usuario, estética y accesibilidad.',
        },
        {
          t: 'p',
          texto:
            'Para evaluarla se usan dos herramientas complementarias. La evaluación heurística la hace un experto contra una lista de principios; las 10 heurísticas de Nielsen son la lista clásica: visibilidad del estado del sistema, correspondencia con el mundo real, control y libertad del usuario, consistencia y estándares, prevención de errores, reconocer antes que recordar, flexibilidad y eficiencia, diseño estético y minimalista, ayuda para reconocer y recuperarse de errores, y ayuda y documentación. La prueba con usuarios mide lo que ocurre cuando alguien intenta hacer la tarea de verdad.',
        },
        {
          t: 'tabla',
          encabezados: ['Medida', 'Cómo se obtiene', 'Qué indica'],
          filas: [
            ['Tasa de éxito', 'Usuarios que completan la tarea / usuarios que la intentan', 'Efectividad'],
            ['Tiempo en tarea', 'Promedio de segundos hasta completarla', 'Eficiencia'],
            ['Errores por tarea', 'Acciones incorrectas contadas por observación', 'Protección contra errores'],
            ['SUS', 'Cuestionario de 10 ítems, escala 0 a 100', 'Satisfacción percibida'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Regla práctica',
          texto:
            'Un SUS por debajo de 68 se considera bajo el promedio de la industria. Cinco usuarios detectan alrededor del 80% de los problemas graves de usabilidad, así que la falta de presupuesto no es excusa para no medir.',
        },
      ],
    },
    {
      titulo: 'Escribir una métrica que sirva',
      cuerpo: [
        {
          t: 'p',
          texto:
            'El método GQM (Goal–Question–Metric) evita el error más común: medir lo que es fácil de contar en vez de lo que importa. Se define primero el objetivo, luego las preguntas que lo evidenciarían y solo al final las métricas.',
        },
        {
          t: 'codigo',
          etiqueta: 'Ejemplo GQM',
          texto: `Objetivo:  reducir el abandono en el registro de usuarios nuevos.
Pregunta:  ¿en qué paso se detiene la gente?
Métrica:   usuarios que completan el paso / usuarios que lo inician,
           por cada paso, medido durante 2 semanas.
Umbral:    ningún paso por debajo del 85%.
Acción:    si un paso queda por debajo, se rediseña ese paso.`,
        },
        {
          t: 'p',
          texto:
            'Una métrica sin umbral y sin acción asociada es un número decorativo. Si nadie va a hacer nada distinto según el resultado, no vale la pena recolectarlo.',
        },
      ],
    },
  ],
  retos: [
    {
      tipo: 'clasificar',
      id: 'c-clas-subcar',
      nivel: 'base',
      puntos: 25,
      enunciado: 'Ubica cada subcaracterística bajo la característica de ISO/IEC 25010 a la que pertenece.',
      grupos: [
        { id: 'func', nombre: 'Adecuación funcional' },
        { id: 'usab', nombre: 'Usabilidad' },
        { id: 'mant', nombre: 'Mantenibilidad' },
      ],
      items: [
        { texto: 'Completitud funcional', grupo: 'func' },
        { texto: 'Corrección funcional', grupo: 'func' },
        { texto: 'Pertinencia funcional', grupo: 'func' },
        { texto: 'Capacidad de aprendizaje', grupo: 'usab' },
        { texto: 'Protección contra errores de usuario', grupo: 'usab' },
        { texto: 'Accesibilidad', grupo: 'usab' },
        { texto: 'Modularidad', grupo: 'mant' },
        { texto: 'Capacidad de ser probado', grupo: 'mant' },
      ],
      explicacion:
        'La accesibilidad vive dentro de usabilidad en el modelo de 2011. La capacidad de ser probado es mantenibilidad porque describe cuán fácil es verificar el sistema tras un cambio, no si el sistema es correcto.',
    },
    {
      tipo: 'clasificar',
      id: 'c-clas-reportes',
      nivel: 'reto',
      puntos: 25,
      enunciado:
        'Estos reportes llegaron al equipo en una misma semana. Clasifica cada uno según la subcaracterística de adecuación funcional o usabilidad que está fallando.',
      grupos: [
        { id: 'completitud', nombre: 'Completitud funcional' },
        { id: 'correccion', nombre: 'Corrección funcional' },
        { id: 'usabilidad', nombre: 'Usabilidad' },
      ],
      items: [
        { texto: 'El recibo calcula el IVA sobre el valor con descuento en vez de sobre el valor base', grupo: 'correccion' },
        { texto: 'No existe manera de exportar el listado, aunque quedó en los requisitos', grupo: 'completitud' },
        { texto: 'El botón "Guardar" queda oculto bajo el teclado en celulares', grupo: 'usabilidad' },
        { texto: 'El promedio ponderado ignora las materias de 1 crédito', grupo: 'correccion' },
        { texto: 'El sistema permite borrar un curso sin pedir confirmación', grupo: 'usabilidad' },
        { texto: 'El módulo de reportes solo tiene 2 de los 5 informes acordados', grupo: 'completitud' },
      ],
      explicacion:
        'Regla rápida: si la función no está, es completitud. Si está y entrega un valor equivocado, es corrección. Si está, entrega el valor correcto y aun así la persona se equivoca o no la encuentra, es usabilidad.',
    },
    {
      tipo: 'quiz',
      id: 'c-q1',
      nivel: 'base',
      puntos: 10,
      pregunta: '¿Qué norma de la familia SQuaRE define el modelo de calidad del producto de software?',
      opciones: ['ISO/IEC 25000', 'ISO/IEC 25010', 'ISO/IEC 25040', 'ISO/IEC 9001'],
      correcta: 1,
      explicacion:
        '25000 da el vocabulario general, 25040 define el proceso de evaluación y 9001 es gestión de la calidad organizacional, no de producto de software.',
    },
    {
      tipo: 'quiz',
      id: 'c-q2',
      nivel: 'base',
      puntos: 10,
      pregunta:
        'Una aplicación de matrícula cumple todos sus requisitos funcionales, pero el 60% de los estudiantes no logra terminar la inscripción sin ayuda. ¿Qué característica está fallando?',
      opciones: ['Adecuación funcional', 'Usabilidad', 'Fiabilidad', 'Portabilidad'],
      correcta: 1,
      explicacion:
        'El sistema hace lo que debe, pero las personas no logran su objetivo. Eso es usabilidad, y se evidencia con la tasa de éxito de la tarea.',
    },
    {
      tipo: 'quiz',
      id: 'c-q3',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Un equipo reporta "100% de corrección funcional" porque sus 40 pruebas automatizadas pasan. ¿Cuál es la objeción técnicamente correcta?',
      opciones: [
        'La corrección funcional no se mide con pruebas automatizadas.',
        'La medida depende del conjunto de casos: 40 pruebas que no cubren los casos límite no permiten afirmar corrección del sistema.',
        'Debieron medir usabilidad en su lugar.',
        'Ninguna: si todas las pruebas pasan, el software es correcto.',
      ],
      correcta: 1,
      explicacion:
        'Como formuló Dijkstra, las pruebas muestran la presencia de defectos, no su ausencia. El indicador es válido, pero su alcance es el conjunto de casos ejecutados; por eso se reporta junto con la cobertura y con los criterios de selección de casos.',
    },
    {
      tipo: 'quiz',
      id: 'c-q4',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        '¿Cuál de estas evaluaciones aporta evidencia sobre calidad en uso y no solo sobre calidad externa?',
      opciones: [
        'Revisar que el código siga la guía de estilo del equipo.',
        'Ejecutar la suite de pruebas unitarias en cada commit.',
        'Observar a cinco estudiantes reales inscribiendo materias y medir cuántos lo logran sin ayuda.',
        'Medir el tiempo de respuesta del servidor bajo carga sintética.',
      ],
      correcta: 2,
      explicacion:
        'La calidad en uso se mide con usuarios reales, tareas reales y contexto real. Las otras tres son válidas, pero hablan de calidad interna o externa.',
    },
    {
      tipo: 'respuesta',
      id: 'c-resp-correccion',
      nivel: 'base',
      puntos: 15,
      enunciado:
        'Se ejecutaron 250 casos de prueba funcionales y 218 pasaron. Calcula el indicador de corrección funcional en porcentaje, con un decimal. Responde solo el número (por ejemplo: 85.4).',
      pista: 'Aprobados sobre ejecutados, por cien.',
      respuestas: ['87.2', '87,2'],
      explicacion:
        '218/250 = 0,872 → 87,2%. Si el umbral acordado con el cliente era 95%, este resultado bloquea la liberación aunque "casi todo funcione".',
    },
    {
      tipo: 'respuesta',
      id: 'c-resp-usab',
      nivel: 'reto',
      puntos: 20,
      enunciado:
        'En una prueba de usabilidad, 9 de 12 participantes completaron la tarea de inscripción. El tiempo promedio fue 4,5 minutos frente a una meta de 3. ¿Cuál es la tasa de éxito en porcentaje, sin decimales? Responde solo el número.',
      pista: 'Efectividad = participantes que completan / participantes que lo intentan.',
      respuestas: ['75'],
      explicacion:
        '9/12 = 75%. Ojo con el matiz: la tasa de éxito mide efectividad y el tiempo mide eficiencia. Son dos indicadores distintos y un sistema puede ser efectivo y lento a la vez, así que se reportan por separado.',
    },
    {
      tipo: 'taller',
      id: 'c-taller-heuristicas',
      nivel: 'reto',
      puntos: 35,
      enunciado:
        'Evaluación heurística en parejas: elijan una aplicación que usen a diario (banco, transporte, campus virtual) y evalúenla contra cinco heurísticas de Nielsen.',
      entregables: [
        'Tabla con cinco heurísticas, un hallazgo por heurística y una captura o descripción del paso donde ocurre.',
        'Severidad de cada hallazgo en escala 0 a 4, con la justificación de la escala elegida.',
        'Una métrica propuesta en formato GQM para el hallazgo más severo, con umbral.',
        'Una recomendación de rediseño por hallazgo, en una frase cada una.',
      ],
      rubrica: [
        'Los hallazgos describen comportamiento observable, no gustos personales.',
        'La severidad considera frecuencia, impacto y persistencia del problema.',
        'La métrica propuesta se puede recolectar sin acceso al código de la aplicación.',
      ],
    },
  ],
}
