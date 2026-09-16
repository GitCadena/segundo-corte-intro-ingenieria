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
          t: 'lista',
          items: [
            'Calidad interna: propiedades del código que ve el equipo (legibilidad, cobertura de pruebas).',
            'Calidad externa: comportamiento del sistema ejecutándose. Responde bien, no se cae.',
            'Calidad en uso: resultado para quien lo usa. ¿Logra su tarea, en cuánto tiempo, con qué satisfacción?',
          ],
        },
        {
          t: 'clave',
          titulo: 'El caso que más se olvida',
          texto: 'Un sistema puede funcionar hoy (calidad externa) y ser imposible de modificar mañana (mala calidad interna).',
        },
      ],
    },
    {
      titulo: 'La familia ISO/IEC 25000 (SQuaRE)',
      cuerpo: [
        {
          t: 'p',
          texto: 'SQuaRE es la familia de normas que organiza todo lo relacionado con calidad de producto de software.',
        },
        {
          t: 'tabla',
          encabezados: ['División', 'Serie', 'Qué aporta'],
          filas: [
            ['Gestión de calidad', '2500n', 'Vocabulario común'],
            ['Modelo de calidad', '2501n', 'Características de calidad (25010)'],
            ['Medición', '2502n', 'Cómo aplicar medidas'],
            ['Evaluación', '2504n', 'El proceso de evaluación'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Nota de precisión',
          texto: 'Si preguntan "cuál es la norma del modelo de calidad del producto", la respuesta es ISO/IEC 25010, no 25000 ni 25001.',
        },
      ],
    },
    {
      titulo: 'El modelo de calidad del producto',
      cuerpo: [
        {
          t: 'p',
          texto: 'ISO/IEC 25010:2011 define ocho características de calidad del producto. En el curso trabajamos ese modelo.',
        },
        {
          t: 'tabla',
          encabezados: ['Característica', 'Pregunta que responde'],
          filas: [
            ['Adecuación funcional', '¿Hace lo que debe hacer?'],
            ['Eficiencia de desempeño', '¿A qué costo de recursos?'],
            ['Compatibilidad', '¿Convive con otros sistemas?'],
            ['Usabilidad', '¿La persona logra su tarea?'],
            ['Fiabilidad', '¿Sigue funcionando en el tiempo?'],
            ['Seguridad', '¿Protege datos y accesos?'],
            ['Mantenibilidad', '¿Se puede cambiar sin romperlo?'],
            ['Portabilidad', '¿Se lleva a otro entorno?'],
          ],
        },
      ],
    },
    {
      titulo: 'Adecuación funcional y corrección funcional',
      cuerpo: [
        {
          t: 'lista',
          items: [
            'Completitud: están todas las funciones acordadas.',
            'Corrección: los resultados son correctos.',
            'Pertinencia: las funciones facilitan la tarea real.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Cómo se mide la corrección',
          texto: 'Casos de prueba aprobados ÷ casos ejecutados. Necesita un oráculo: una fuente que diga cuál era el resultado esperado.',
        },
      ],
    },
    {
      titulo: 'Usabilidad: de la opinión a la evidencia',
      cuerpo: [
        {
          t: 'p',
          texto: 'La usabilidad no es que la interfaz sea bonita: se mide con personas haciendo una tarea concreta.',
        },
        {
          t: 'tabla',
          encabezados: ['Medida', 'Cómo se obtiene'],
          filas: [
            ['Tasa de éxito', 'Usuarios que completan la tarea ÷ usuarios que la intentan'],
            ['Tiempo en tarea', 'Mediana de los tiempos de quienes completaron'],
            ['Errores por tarea', 'Acciones incorrectas observadas'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Regla práctica',
          texto: 'Cinco usuarios detectan cerca del 80 % de los problemas graves de usabilidad.',
        },
      ],
    },
    {
      titulo: 'Escribir una métrica que sirva',
      cuerpo: [
        {
          t: 'p',
          texto: 'GQM (Objetivo–Pregunta–Métrica) evita medir lo fácil de contar en vez de lo que importa.',
        },
        {
          t: 'codigo',
          etiqueta: 'Ejemplo GQM',
          texto: `Objetivo:  reducir el abandono en el registro de usuarios nuevos.
Pregunta:  ¿en qué paso se detiene la gente?
Métrica:   usuarios que completan el paso ÷ usuarios que lo inician.
Umbral:    ningún paso por debajo del 85%.`,
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
