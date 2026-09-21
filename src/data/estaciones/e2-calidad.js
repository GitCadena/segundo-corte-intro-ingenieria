import base from '../m2-calidad.js'

/**
 * Estación 2 · ¿Cuándo un software es bueno? (sesión 8)
 *
 * Nota sobre la edición del modelo: se trabaja ISO/IEC 25010:2011 (ocho
 * características) porque es la que usan los textos del curso, y se señala
 * explícitamente qué cambió en la revisión de 2023. No se mezclan las listas.
 */

export default {
  id: 'calidad',
  orden: 2,
  sesion: 'Sesión 8',
  titulo: '¿Cuándo un software es bueno?',
  gancho: '«Funciona» es una opinión hasta que alguien define contra qué se compara.',

  aprenderas: {
    objetivo:
      'Al terminar podrás decir por qué un software es bueno o malo nombrando la característica de calidad afectada, y respaldar la afirmación con una medida en vez de una impresión.',
    puntos: [
      'Ubicar ISO/IEC 25010 dentro de la familia SQuaRE y nombrar sus ocho características.',
      'Distinguir una función que falta, una que está mal y una que es difícil de usar.',
      'Calcular tasa de éxito y tiempo en tarea a partir de datos de una prueba con usuarios.',
      'Convertir un requisito en una comprobación que alguien más podría ejecutar.',
    ],
    duracion: '40 a 50 minutos',
  },

  comprende: base.lecciones,

  profundiza: {
    'El modelo de calidad del producto': {
      titulo: 'Qué cambió en la revisión de 2023 (y por qué aquí usamos la de 2011)',
      cuerpo: [
        {
          t: 'p',
          texto:
            'ISO/IEC 25010:2011 define ocho características de calidad del producto. La revisión de 2023 reorganiza el modelo en nueve: renombra usabilidad como capacidad de interacción, extrae flexibilidad (que antes estaba repartida entre portabilidad y mantenibilidad) como característica propia e incorpora seguridad física (safety).',
        },
        {
          t: 'tabla',
          encabezados: ['ISO/IEC 25010:2011', 'ISO/IEC 25010:2023'],
          filas: [
            ['Adecuación funcional', 'Adecuación funcional'],
            ['Eficiencia de desempeño', 'Eficiencia de desempeño'],
            ['Compatibilidad', 'Compatibilidad'],
            ['Usabilidad', 'Capacidad de interacción (renombrada)'],
            ['Fiabilidad', 'Fiabilidad'],
            ['Seguridad (security)', 'Seguridad (security)'],
            ['Mantenibilidad', 'Mantenibilidad'],
            ['Portabilidad', 'Flexibilidad y Portabilidad (se separan)'],
            ['—', 'Seguridad física (safety) (nueva)'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Regla del curso',
          texto:
            'En el parcial se pregunta por el modelo de ocho características de la edición 2011. El error que sí se penaliza es mezclar: responder con una lista que junte "capacidad de interacción" y "usabilidad" como si fueran dos características distintas del mismo modelo.',
        },
      ],
    },
    'Usabilidad: de la opinión a la evidencia': {
      titulo: 'Las tres medidas que siempre se reportan',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Medida', 'Cómo se calcula', 'Qué revela'],
          filas: [
            ['Tasa de éxito', 'Participantes que completan la tarea ÷ total, en porcentaje', 'Si la tarea es posible. Es la primera que se mira: si está baja, el resto no importa.'],
            ['Tiempo en tarea', 'Mediana de los tiempos de quienes la completaron', 'Cuánto cuesta lograrlo. Se usa la mediana, no el promedio, porque un participante atascado distorsiona el promedio.'],
            ['Errores por tarea', 'Acciones incorrectas ÷ participantes', 'Dónde está la fricción concreta que hay que arreglar.'],
          ],
        },
        {
          t: 'p',
          texto:
            'Detalle que se pregunta en el parcial: los tiempos de quienes NO completaron la tarea no entran en el tiempo en tarea. Alguien que abandonó a los 30 segundos produciría un tiempo bajísimo que haría parecer eficiente un formulario que nadie logra llenar.',
        },
        {
          t: 'p',
          texto:
            'Con cinco participantes se detecta la mayoría de los problemas graves de usabilidad, pero cinco no alcanzan para estimar porcentajes con precisión. Sirven para encontrar qué arreglar, no para afirmar "el 80 % de nuestros usuarios lo logra".',
        },
      ],
    },
    'Adecuación funcional y corrección funcional': {
      titulo: 'Tres fallas que parecen la misma y no lo son',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Lo que reporta el usuario', 'Qué pasó en realidad', 'Característica afectada'],
          filas: [
            ['"No puedo cancelar mi reserva"', 'La función de cancelar no existe', 'Adecuación funcional · completitud'],
            ['"Cancelé la mía y se borró la de otro"', 'La función existe y hace algo distinto de lo especificado', 'Adecuación funcional · corrección'],
            ['"Sí se puede cancelar, pero nadie encuentra cómo"', 'La función existe, es correcta y está escondida', 'Usabilidad · operabilidad'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Por qué importa la distinción',
          texto:
            'Porque cada una la arregla alguien distinto. La primera es alcance: hay que construirla. La segunda es un defecto: hay que corregir la lógica. La tercera es diseño de interacción: el código está bien y aun así el usuario no logra su objetivo.',
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'Una prueba de usabilidad de verdad, con sus números',
    contexto:
      'La coordinación dice que «la gente se queja pero no sabemos de qué». Se monta una prueba con 10 estudiantes nuevos: «Reserve la sala 203 para mañana de 10 a 12», sin ayuda.',
    pasos: [
      {
        titulo: '1. Definir qué cuenta como éxito, antes de mirar los datos',
        texto: 'Éxito = la reserva queda creada, para la sala, el día y la franja correctos. Quien reserva el día equivocado no completó la tarea.',
      },
      {
        titulo: '2. Tasa de éxito',
        texto: 'Completaron 7 de 10 → 70 %. Tres de cada diez estudiantes se van sin sala.',
      },
      {
        titulo: '3. Tiempo en tarea',
        texto: 'Se usa la mediana de los siete que completaron: 2:30. El promedio sería 3:16, arrastrado por el más lento.',
        nota: 'Incluir a quienes abandonaron bajaría la mediana y haría parecer eficiente un formulario que nadie logra usar.',
      },
      {
        titulo: '4. Dónde estaba la fricción',
        texto: 'Seis de diez intentaron escribir la fecha a mano en un campo que exigía AAAA-MM-DD sin decirlo, y el error no explicaba qué corregir.',
      },
      {
        titulo: '5. Nombrar la característica afectada',
        texto: 'No es corrección funcional: el sistema guarda bien lo que recibe. Es usabilidad: protección contra errores de usuario.',
        nota: 'La frase que buscamos: no "la app es mala", sino "70 % de éxito por fallas de protección contra errores en el campo de fecha".',
      },
    ],
    cierre:
      'Con diez personas y dos números, la conversación pasó de «la gente se queja» a «tres de cada diez no reservan por el campo de fecha». Eso sí se puede arreglar y volver a medir.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e2-a1-detective',
      tipo: 'clasificar',
      nivel: 'base',
      puntos: 120,
      titulo: 'Detective de calidad',
      objetivo: 'Nombrar la característica de ISO/IEC 25010 afectada por una falla concreta.',
      instrucciones:
        'Clasifica cada falla según la característica principal que afecta. Algunas podrían tocar más de una; elige la que el reporte describe de forma más directa y revisa después por qué.',
      conceptoPrevio: 'Las ocho características de ISO/IEC 25010:2011 y sus subcaracterísticas.',
      conceptos: ['calidad', 'adecuacion-funcional', 'usabilidad', 'square'],
      grupos: [
        { id: 'funcional', nombre: 'Adecuación funcional' },
        { id: 'usabilidad', nombre: 'Usabilidad' },
        { id: 'fiabilidad', nombre: 'Fiabilidad' },
        { id: 'desempeno', nombre: 'Eficiencia de desempeño' },
        { id: 'mantenibilidad', nombre: 'Mantenibilidad' },
        { id: 'seguridad', nombre: 'Seguridad' },
      ],
      items: [
        {
          texto: 'El sistema calcula mal el total de horas reservadas: suma 3 horas cuando la reserva fue de 2.',
          grupo: 'funcional',
          porQue: 'La función existe y produce un resultado distinto del especificado: es corrección funcional, subcaracterística de adecuación funcional.',
        },
        {
          texto: 'La opción de cancelar existe, pero está en un menú de tres niveles y solo 2 de 10 estudiantes la encuentran.',
          grupo: 'usabilidad',
          porQue: 'El código es correcto; lo que falla es que el usuario no logra operarlo. Subcaracterística: operabilidad.',
        },
        {
          texto: 'La consulta de disponibilidad tarda 14 segundos cuando hay 200 usuarios conectados.',
          grupo: 'desempeno',
          porQue: 'Cumple su función, pero el comportamiento temporal bajo carga no es aceptable. Subcaracterística: comportamiento temporal.',
        },
        {
          texto: 'El servidor se cae cada viernes a las 6 p. m. y tarda 40 minutos en volver.',
          grupo: 'fiabilidad',
          porQue: 'Disponibilidad y capacidad de recuperación: el sistema no está operativo cuando se necesita. También podría discutirse tolerancia a fallos.',
        },
        {
          texto: 'Cualquier estudiante puede ver el listado completo de reservas con nombre y código de los demás.',
          grupo: 'seguridad',
          porQue: 'Confidencialidad: el sistema expone datos a quien no debería acceder a ellos. Además compromete la Ley 1581 de 2012.',
        },
        {
          texto: 'Cambiar el límite de reservas por semana obliga a tocar siete archivos distintos.',
          grupo: 'mantenibilidad',
          porQue: 'Modularidad y capacidad de ser modificado: la regla está dispersa, así que cada cambio cuesta y arriesga más de lo necesario.',
        },
        {
          texto: 'No existe forma de cancelar una reserva; hay que llamar al monitor.',
          grupo: 'funcional',
          porQue: 'Completitud funcional: la función simplemente no está. No es usabilidad, porque no hay nada que el usuario pudiera encontrar.',
        },
        {
          texto: 'El mensaje de error dice «ERR_4021» y no indica qué corregir.',
          grupo: 'usabilidad',
          porQue: 'Protección contra errores de usuario: el sistema detectó el problema pero no ayuda a resolverlo.',
        },
      ],
      remate: {
        pregunta:
          'El caso «cualquier estudiante ve las reservas de los demás» se clasificó como seguridad. ¿Qué otra característica podría defenderse con argumento, y por qué NO es la principal?',
        opciones: [
          'Usabilidad, porque ver muchos datos confunde al usuario.',
          'Adecuación funcional, porque el sistema hace algo distinto de lo especificado si el requisito decía que cada quien ve solo lo suyo; aun así, la característica que nombra el riesgo real es seguridad.',
          'Eficiencia de desempeño, porque mostrar más datos es más lento.',
          'Ninguna otra: un caso solo puede afectar una característica.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'La cantidad de datos en pantalla no es el problema aquí; el problema es quién puede verlos.',
          2: 'El costo de desempeño es secundario y podría no existir. Clasificar por él ignoraría la fuga de datos.',
          3: 'Falso: es común que una falla toque varias características. Lo que se pide es nombrar la principal y saber justificar por qué.',
        },
        explicacion:
          'Sí, una falla puede afectar varias características a la vez. La disciplina consiste en nombrar la principal —la que describe el riesgo real— y poder argumentar las secundarias. Aquí, si el requisito decía "cada estudiante ve solo sus reservas", también hay una falla de corrección funcional; pero llamar a esto "un bug de cálculo" ocultaría que se están exponiendo datos personales.',
      },
      pistas: [
        'Pregúntate primero: ¿la función existe? Si no existe, es adecuación funcional (completitud), no usabilidad.',
        'Si la función existe y da un resultado equivocado, sigue siendo adecuación funcional (corrección). Si da el resultado correcto pero el usuario no logra llegar a él, es usabilidad.',
        'Mantenibilidad se reconoce porque el afectado no es el usuario: es quien tiene que modificar el sistema.',
      ],
      explicacion:
        'El criterio que ordena todo: mira a quién afecta la falla y en qué momento. Al usuario mientras usa → adecuación funcional, usabilidad, desempeño, fiabilidad o seguridad. A quien modifica el sistema después → mantenibilidad. A quien lo instala en otro entorno → portabilidad. Este criterio resuelve la mayoría de los casos del parcial.',
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e2-a2-friccion',
      tipo: 'formulario-friccion',
      nivel: 'base',
      puntos: 120,
      titulo: 'Encuentra la fricción',
      objetivo: 'Experimentar en carne propia los problemas de usabilidad antes de nombrarlos.',
      instrucciones:
        'Abajo hay un formulario de reserva con problemas deliberados. Intenta completarlo: reserva la sala 203 para el 20 de octubre de 2026, de 10:00 a 12:00. Cuando lo logres (o te rindas), marca los problemas que encontraste.',
      conceptoPrevio: 'Subcaracterísticas de usabilidad: operabilidad, protección contra errores de usuario, reconocibilidad de la adecuación.',
      conceptos: ['usabilidad', 'calidad'],
      aviso:
        'Este formulario es una simulación con datos ficticios. No está conectado con tu cuenta ni guarda nada de lo que escribas aquí.',
      tarea: { sala: '203', fecha: '2026-10-20', desde: '10:00', hasta: '12:00' },
      // Los defectos son reales: los aplica el componente al validar.
      defectos: [
        {
          id: 'formato-fecha',
          etiqueta: 'El campo de fecha exige un formato que no está escrito en ninguna parte.',
          real: true,
          subcaracteristica: 'Protección contra errores de usuario',
          porQue:
            'El campo acepta solo AAAA-MM-DD y no lo dice. El usuario escribe 20/10/2026, recibe "Dato inválido" y no tiene forma de saber qué se espera.',
        },
        {
          id: 'borra-todo',
          etiqueta: 'Al fallar la validación, el formulario borra lo que ya estaba escrito.',
          real: true,
          subcaracteristica: 'Protección contra errores de usuario',
          porQue:
            'Perder el trabajo hecho por un error en un solo campo es de los defectos de usabilidad que más abandono producen.',
        },
        {
          id: 'error-generico',
          etiqueta: 'El mensaje de error no dice cuál campo está mal.',
          real: true,
          subcaracteristica: 'Protección contra errores de usuario',
          porQue:
            'Un error que no señala el campo obliga al usuario a revisar todo de nuevo. El mensaje debe apuntar al campo y decir qué se espera.',
        },
        {
          id: 'sin-etiqueta',
          etiqueta: 'Un campo obligatorio no está marcado como obligatorio.',
          real: true,
          subcaracteristica: 'Reconocibilidad de la adecuación',
          porQue:
            'El campo "Motivo" es obligatorio pero no lo indica. El usuario solo se entera cuando el formulario ya falló.',
        },
        {
          id: 'orden-raro',
          etiqueta: 'El campo de hora de fin está antes que el de hora de inicio.',
          real: true,
          subcaracteristica: 'Operabilidad',
          porQue:
            'El orden en pantalla debe seguir el orden mental de la tarea. Invertirlo genera errores que el usuario ni siquiera nota.',
        },
        {
          id: 'color-solo',
          etiqueta: 'El error se señala únicamente con color rojo, sin texto ni icono.',
          real: false,
          porQue:
            'En esta simulación el error sí trae texto además del color. Marcarlo sería reportar un defecto que no existe: en un reporte real, eso le cuesta tiempo al equipo.',
        },
        {
          id: 'lento',
          etiqueta: 'El formulario tarda más de 5 segundos en responder.',
          real: false,
          porQue:
            'La respuesta es inmediata. Además, aunque fuera lenta, sería eficiencia de desempeño y no usabilidad.',
        },
      ],
      pistas: [
        'Intenta escribir la fecha como la escribirías normalmente (20/10/2026) y observa qué pasa con el resto del formulario.',
        'Envía el formulario dejando algún campo vacío y lee con atención el mensaje: ¿te dice cuál campo corregir?',
        'Cinco de los siete problemas listados son reales. Dos describen cosas que no ocurren: marcarlos resta.',
      ],
      explicacion:
        'Los cinco defectos reales son de usabilidad, no de corrección funcional: el formulario guarda bien lo que recibe. Los dos falsos están ahí a propósito, porque en la práctica reportar defectos inexistentes es tan costoso como no reportar los reales: el equipo gasta tiempo reproduciendo algo que nunca pasó. Un reporte de usabilidad sirve cuando nombra la subcaracterística y describe la conducta observada, no cuando dice "está feo".',
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'e2-a3-mejora',
      tipo: 'mejora-interfaz',
      nivel: 'base',
      puntos: 110,
      titulo: 'Mejora la interfaz',
      objetivo: 'Elegir cambios concretos y ver cómo se transforma el formulario que acabas de sufrir.',
      instrucciones:
        'Selecciona los cambios que aplicarías. El formulario de la derecha se actualiza con cada elección, para que veas el efecto y no solo la teoría. Elige los cinco que corrigen defectos reales.',
      conceptoPrevio: 'Los defectos identificados en la actividad anterior.',
      conceptos: ['usabilidad'],
      cambios: [
        { id: 'selector-fecha', texto: 'Reemplazar el campo de texto por un selector de fecha', correcto: true, efecto: 'El usuario no puede escribir un formato inválido: el error deja de ser posible.' },
        { id: 'conservar', texto: 'Conservar lo escrito cuando la validación falla', correcto: true, efecto: 'El usuario corrige un campo en vez de volver a llenar cinco.' },
        { id: 'error-campo', texto: 'Mostrar el error junto al campo que lo causa, con texto que diga qué se espera', correcto: true, efecto: 'El usuario sabe dónde y qué corregir sin adivinar.' },
        { id: 'marcar-obligatorio', texto: 'Marcar los campos obligatorios antes de enviar', correcto: true, efecto: 'El usuario se entera de lo que falta mientras llena, no después de fallar.' },
        { id: 'reordenar', texto: 'Poner hora de inicio antes de hora de fin', correcto: true, efecto: 'El orden en pantalla coincide con el orden de la tarea.' },
        { id: 'colores', texto: 'Cambiar la paleta de colores a una más moderna', correcto: false, efecto: 'Se ve distinto. Ningún defecto identificado desaparece: la tasa de éxito no cambia.' },
        { id: 'animacion', texto: 'Agregar una animación al enviar', correcto: false, efecto: 'Agrega espera sin agregar información. En un formulario con errores, empeora la sensación.' },
        { id: 'quitar-motivo', texto: 'Eliminar el campo Motivo para que el formulario sea más corto', correcto: false, efecto: 'Más corto no es mejor si el dato hace falta. El defecto era no avisar que era obligatorio, no que existiera.' },
      ],
      pistas: [
        'Un cambio sirve si elimina un defecto que identificaste, no si hace el formulario más bonito.',
        'Uno de los cambios incorrectos es tentador: acortar el formulario. Pregúntate si el problema era la longitud o la falta de aviso.',
        'Son cinco cambios correctos, uno por cada defecto real de la actividad anterior.',
      ],
      explicacion:
        'La diferencia entre rediseñar y maquillar: los cinco cambios correctos eliminan la causa de un fracaso observado; los tres incorrectos cambian la apariencia sin mover la tasa de éxito. El más instructivo es "eliminar el campo Motivo": acortar formularios suele mejorar la usabilidad, pero aquí el defecto no era la longitud sino la falta de señal, y quitar el campo destruiría información que la coordinación necesita.',
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'e2-a7-subcaracteristicas',
      tipo: 'clasificar',
      nivel: 'opcional',
      puntos: 90,
      titulo: 'Cada subcaracterística en su lugar',
      objetivo: 'Ubicar subcaracterísticas bajo la característica correcta del modelo de 2011.',
      instrucciones: 'Trabaja sobre ISO/IEC 25010:2011, la edición de ocho características.',
      conceptoPrevio: 'El modelo de calidad del producto y sus subcaracterísticas.',
      conceptos: ['square', 'usabilidad', 'portabilidad'],
      grupos: [
        { id: 'usabilidad', nombre: 'Usabilidad' },
        { id: 'mantenibilidad', nombre: 'Mantenibilidad' },
        { id: 'portabilidad', nombre: 'Portabilidad' },
        { id: 'fiabilidad', nombre: 'Fiabilidad' },
      ],
      items: [
        { texto: 'Accesibilidad', grupo: 'usabilidad', porQue: 'En la edición 2011 la accesibilidad vive dentro de usabilidad. En la de 2023 sigue bajo capacidad de interacción.' },
        { texto: 'Capacidad de ser probado', grupo: 'mantenibilidad', porQue: 'Describe cuán fácil es verificar el sistema después de un cambio, no si el sistema es correcto.' },
        { texto: 'Adaptabilidad', grupo: 'portabilidad', porQue: 'Capacidad de adaptarse a distinto hardware, software o entorno de uso.' },
        { texto: 'Tolerancia a fallos', grupo: 'fiabilidad', porQue: 'Seguir operando pese a fallas de hardware o software.' },
        { texto: 'Operabilidad', grupo: 'usabilidad', porQue: 'Facilidad de operar y controlar el producto.' },
        { texto: 'Modularidad', grupo: 'mantenibilidad', porQue: 'Grado en que el sistema se compone de partes independientes.' },
        { texto: 'Capacidad de recuperación', grupo: 'fiabilidad', porQue: 'Recuperar datos y estado tras una interrupción.' },
        { texto: 'Facilidad de instalación', grupo: 'portabilidad', porQue: 'Cuán fácil es instalar o desinstalar en un entorno determinado.' },
        { texto: 'Protección contra errores de usuario', grupo: 'usabilidad', porQue: 'Evitar que el usuario cometa errores y ayudarle a corregirlos.' },
        { texto: 'Capacidad de ser analizado', grupo: 'mantenibilidad', porQue: 'Poder diagnosticar deficiencias o identificar las partes a modificar.' },
      ],
      pistas: [
        'Dos subcaracterísticas hablan de lo que pasa cuando algo ya falló: esas son fiabilidad.',
        'Las que hablan de cuán fácil es cambiar o diagnosticar el sistema son mantenibilidad, aunque suenen a pruebas.',
        'Hay tres de usabilidad, tres de mantenibilidad, dos de portabilidad y dos de fiabilidad.',
      ],
      explicacion:
        'Dos trampas frecuentes. "Capacidad de ser probado" suena a calidad funcional pero es mantenibilidad: mide cuán fácil es verificar, no si el sistema funciona. Y "accesibilidad" no es una característica de primer nivel: en 2011 es subcaracterística de usabilidad, cosa que en el parcial se pregunta con frecuencia.',
    },
  ],

  sintesis: {
    puntos: [
      'ISO/IEC 25010 es el modelo de calidad del producto dentro de la familia SQuaRE (ISO/IEC 25000). En el curso se trabaja la edición 2011, de ocho características.',
      'Función ausente = completitud funcional. Función incorrecta = corrección funcional. Función que el usuario no logra usar = usabilidad.',
      'La usabilidad se mide con personas: tasa de éxito, tiempo en tarea (mediana, solo de quienes completaron) y errores por tarea.',
      'Una misma falla puede tocar varias características; el oficio está en nombrar la principal y justificar las demás.',
      'Calidad no es una propiedad absoluta del código: es el grado en que satisface necesidades de usuarios concretos en un contexto concreto.',
      'Con cinco a diez participantes se descubre qué arreglar, pero no se puede estimar un porcentaje poblacional.',
    ],
    conexion:
      'La estación 3 continúa por el mismo modelo: robustez, compatibilidad y portabilidad son también características de calidad, pero se comprueban de otra forma —atacando el sistema con entradas que no espera en vez de observando usuarios. Y lo que aprendiste aquí sobre medir antes de afirmar es exactamente lo que en la estación 5 harás con los casos de prueba de un algoritmo.',
  },

  glosario: ['calidad', 'square', 'adecuacion-funcional', 'usabilidad', 'tasa-exito', 'calidad-en-uso', 'accesibilidad'],

  taller: {
    id: 'e2-taller',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Taller en clase · Tu propio caso',
    objetivo: 'Aplicar las 8 características de ISO/IEC 25010 sobre un programa que tú mismo construyas.',
    instrucciones:
      'Trabajo individual. Programa en Python o en Java (no en el Laboratorio de pseudocódigo de esta app): escribe el código en tu editor de siempre, córrelo ahí, y pega aquí el código y lo que te mostró. El entregable no lo califica esta aplicación — lo revisa la docente.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Te asignamos un caso al azar (abajo). Escribe uno o dos requisitos comprobables para resolverlo, prográmalo, y luego pruébalo tú mismo con las 8 preguntas: son las 8 características de calidad de ISO/IEC 25010, ya con su nombre.',
    casoPersonal: true,
    bancoCasos: [
      { titulo: 'Turnos para la fila del casino', contexto: 'Asignar un número de turno consecutivo a cada estudiante que llega, sin repetir turno a quien ya tiene uno activo.' },
      { titulo: 'Préstamo de libros de la biblioteca', contexto: 'Registrar el préstamo de un libro y calcular la fecha de devolución, sin permitir prestar un libro que ya está prestado.' },
      { titulo: 'Reserva de cubículos de estudio', contexto: 'Reservar un cubículo por una franja horaria, sin permitir dos reservas que se solapen en el mismo cubículo.' },
      { titulo: 'Registro de asistencia a tutorías de Bienestar', contexto: 'Marcar la asistencia de un estudiante a una tutoría y contar cuántas lleva en el semestre.' },
      { titulo: 'Reportar daños en equipos del laboratorio', contexto: 'Registrar un reporte de daño con el equipo, la falla y la fecha, y marcarlo como resuelto o pendiente.' },
      { titulo: 'Inscripción a monitorías', contexto: 'Inscribir a un estudiante a una monitoría con cupo limitado, sin permitir inscribirse si ya no hay cupo.' },
      { titulo: 'Cartelera digital de eventos del campus', contexto: 'Registrar un evento con fecha y lugar, y mostrar solo los que todavía no han pasado.' },
      { titulo: 'Compartir transporte entre estudiantes (carpooling)', contexto: 'Publicar un viaje con cupos disponibles y permitir que otros se unan, sin superar el cupo.' },
      { titulo: 'Seguimiento de horas de servicio social', contexto: 'Registrar horas de servicio social de un estudiante y avisar cuándo ya completó el mínimo exigido.' },
      { titulo: 'Solicitud de certificados académicos', contexto: 'Registrar una solicitud de certificado con su tipo y calcular la fecha en que estará listo (3 días hábiles después).' },
      { titulo: 'Préstamo de balones e implementos deportivos', contexto: 'Registrar el préstamo de un implemento y no permitir prestarlo si ya está prestado.' },
      { titulo: 'Agenda de citas con Bienestar Psicológico', contexto: 'Agendar una cita en un horario disponible, sin permitir dos citas en el mismo horario.' },
      { titulo: 'Control de ingreso al parqueadero de bicicletas', contexto: 'Registrar la entrada y salida de una bicicleta y calcular cuánto tiempo estuvo parqueada.' },
      { titulo: 'Reserva de salas de cómputo fuera de horario de clase', contexto: 'Reservar un puesto en una sala de cómputo por una franja horaria, con un máximo de 2 horas por estudiante al día.' },
      { titulo: 'Registro de objetos perdidos y encontrados', contexto: 'Registrar un objeto encontrado con su descripción y lugar, y marcarlo como reclamado cuando el dueño aparece.' },
      { titulo: 'Encuesta de satisfacción de la cafetería', contexto: 'Registrar una calificación de 1 a 5 por estudiante y calcular el promedio del día.' },
      { titulo: 'Turnos de atención en la fotocopiadora del bloque', contexto: 'Asignar turnos de atención y calcular cuánto tiempo lleva esperando cada uno.' },
      { titulo: 'Registro de asistencia a un evento o conferencia', contexto: 'Registrar la asistencia de un estudiante a un evento y evitar que quede registrado dos veces.' },
      { titulo: 'Solicitud de paz y salvo para grado', contexto: 'Registrar una solicitud de paz y salvo y marcar cada requisito (biblioteca, financiero, académico) como cumplido o pendiente.' },
    ],
    campos: [
      { id: 'requisitos', etiqueta: 'Tu(s) requisito(s) comprobable(s) para tu caso (qué se mide, en qué condiciones, con qué umbral)', filas: 3 },
      { id: 'codigo', etiqueta: 'Tu código completo, en Python o en Java (no en pseudocódigo)', filas: 10, mono: true },
      { id: 'salida', etiqueta: 'Qué mostró al correrlo, con al menos un caso de prueba', filas: 4, mono: true },
      { id: 'c1', etiqueta: '1. ¿Hace exactamente lo que pedía tu requisito, ni más ni menos? (Adecuación funcional)', filas: 2 },
      { id: 'c2', etiqueta: '2. Dale una entrada vacía o rara a propósito. ¿Se cae o responde con orden? (Fiabilidad)', filas: 2 },
      { id: 'c3', etiqueta: '3. Pídele a alguien que lo use sin explicarle nada. ¿Entendió qué hacer? (Usabilidad)', filas: 2 },
      { id: 'c4', etiqueta: '4. Pruébalo con muchos datos de una vez. ¿Sigue respondiendo rápido? (Eficiencia de desempeño)', filas: 2 },
      { id: 'c5', etiqueta: '5. ¿Tu programa podría compartir su resultado con otro programa, por ejemplo exportarlo? (Compatibilidad)', filas: 2 },
      { id: 'c6', etiqueta: '6. ¿Lo corriste en otro computador o celular? ¿Funcionó igual ahí? (Portabilidad)', filas: 2 },
      { id: 'c7', etiqueta: '7. Métele un dato absurdo o con símbolos raros. ¿Qué pasa? (Seguridad)', filas: 2 },
      { id: 'c8', etiqueta: '8. Tápate la pantalla y explica en voz alta, en una sola frase, qué hace cada parte de tu código, sin mirarlo. ¿Pudiste de corrido o te trabaste? (Mantenibilidad)', filas: 2 },
    ],
    listaChequeo: [
      'Escribiste al menos un requisito comprobable para tu caso.',
      'Tu código corre sin errores con al menos un caso de prueba real.',
      'Pegaste el código completo, no un fragmento suelto.',
      'Respondiste las 8 preguntas sobre TU propio código, no en general.',
      'Al menos una de las 8 respuestas dice honestamente que no cumple, y por qué.',
    ],
  },
}
