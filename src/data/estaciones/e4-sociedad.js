import base from '../m4-tic.js'

/**
 * Estación 4 · Informática y sociedad (sesiones 8 y 9).
 *
 * Las referencias a las leyes 1273 de 2009 y 1581 de 2012 se verificaron
 * contra el Gestor Normativo de Función Pública y la Secretaría del Senado.
 * Ver el bloque `referencias` al final del archivo.
 */

export default {
  id: 'tic',
  orden: 4,
  sesion: 'Sesiones 8 y 9',
  titulo: 'Informática y sociedad',
  gancho: 'El crecimiento exponencial del hardware explica el mundo actual. También explica sus problemas.',

  aprenderas: {
    objetivo:
      'Al terminar podrás explicar qué describe la Ley de Moore y qué no, reconocer cuándo un argumento sobre tecnología va más allá de lo que los datos permiten, y decidir qué datos personales pedir y con qué justificación.',
    puntos: [
      'Distinguir crecimiento lineal de exponencial con números concretos.',
      'Explicar por qué más transistores no implica programas más rápidos.',
      'Proponer soluciones para conectividad limitada, equipos antiguos y necesidades de accesibilidad.',
      'Aplicar el principio de finalidad al decidir qué datos pide un formulario.',
      'Separar protección de datos personales (Ley 1581 de 2012) de delitos informáticos (Ley 1273 de 2009).',
    ],
    duracion: '40 a 50 minutos',
  },

  comprende: base.lecciones,

  profundiza: {
    'Ética profesional y casos que cambiaron la ingeniería': {
      titulo: 'Qué pasó exactamente en cada caso',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Caso', 'Qué pasó'],
          filas: [
            ['Therac-25 (1985-1987)', 'Un equipo de radioterapia entregó sobredosis letales por una condición de carrera, agravada por retirar los seguros físicos y confiar todo al software.'],
            ['Ariane 5, vuelo 501 (1996)', 'Se reutilizó código del Ariane 4 sin revalidar sus supuestos; un desbordamiento numérico destruyó el cohete.'],
            ['Knight Capital (2012)', 'Un despliegue incompleto dejó código viejo activo en un servidor; la empresa perdió cientos de millones de dólares en menos de una hora.'],
            ['Boeing 737 MAX (2018-2019)', 'Un sistema de control dependía de un solo sensor y la documentación para pilotos era insuficiente.'],
          ],
        },
        {
          t: 'p',
          texto:
            'Los dilemas contemporáneos siguen la misma estructura: sesgos en decisiones automatizadas, datos personales usados para entrenar modelos, autoría con IA generativa. La pregunta útil no es «¿es legal?», sino «¿quién asume el riesgo de que yo me equivoque?».',
        },
      ],
    },
    'Qué es crecer de forma exponencial': {
      titulo: 'La fórmula y la regla del 72 (opcional)',
      cuerpo: [
        {
          t: 'codigo',
          etiqueta: 'Fórmula',
          texto: `valor final = valor inicial × 2^(tiempo ÷ periodo)

Ejemplo: 2.300 transistores en 1971, duplicando cada 2 años.
En 1975 han pasado 4 años: 2.300 × 2^(4 ÷ 2) = 2.300 × 4 = 9.200`,
        },
        {
          t: 'p',
          texto:
            'Atajo mental, la regla del 72: si algo crece un cierto porcentaje por periodo, divide 72 entre ese porcentaje y tendrás, aproximadamente, cuántos periodos tarda en duplicarse. Con 8 % mensual: 72 ÷ 8 = 9 meses.',
        },
      ],
    },
    'Qué dice y qué no dice la Ley de Moore': {
      titulo: 'Por qué el doble de transistores no da el doble de velocidad',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Hasta cerca de 2005, más transistores venían acompañados de más frecuencia de reloj, y eso sí aceleraba cualquier programa sin tocarlo. Ese acuerdo se rompió: el consumo y el calor crecen más rápido que la frecuencia, así que los fabricantes dejaron de subir megahercios y empezaron a poner más núcleos.',
        },
        {
          t: 'p',
          texto:
            'La consecuencia es directa: un programa escrito para ejecutarse en un solo hilo no corre más rápido porque el procesador tenga ocho núcleos en vez de dos. Aprovechar núcleos adicionales exige reescribir el programa, y muchas tareas simplemente no se pueden repartir porque cada paso depende del anterior.',
        },
        {
          t: 'clave',
          titulo: 'Ley de Amdahl, en una frase',
          texto:
            'La aceleración máxima que se puede obtener paralelizando está limitada por la fracción del programa que es forzosamente secuencial. Si el 20 % del trabajo no se puede repartir, ningún número de núcleos dará más de 5× de mejora.',
        },
        {
          t: 'p',
          texto:
            'Además, la Ley de Moore es una observación empírica sobre densidad de transistores en un circuito integrado de costo mínimo, formulada por Gordon Moore en 1965 y revisada por él mismo en 1975 al periodo de dos años. No es una ley física ni un derecho adquirido: es una tendencia de la industria que se ha ido frenando por límites físicos (fugas de corriente, disipación) y económicos (el costo de cada nueva planta de fabricación).',
        },
      ],
    },
    'Las TIC en la sociedad': {
      titulo: 'Brecha digital: tres dimensiones, no una',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Dimensión', 'Qué mide', 'Cómo se ve en el aula'],
          filas: [
            ['Acceso', '¿Tiene dispositivo y conexión?', 'Un estudiante con 500 MB de datos al mes frente a otro con fibra en casa'],
            ['Uso', '¿Sabe usarlos para lo que necesita?', 'Dos estudiantes con el mismo celular: uno sube el taller, el otro no encuentra cómo'],
            ['Aprovechamiento', '¿Obtiene beneficio real de usarlos?', 'Ambos suben el taller, pero solo uno usó la documentación en inglés que había en línea'],
          ],
        },
        {
          t: 'p',
          texto:
            'Diseñar «para todos» significa no suponer que el usuario está en la mejor de las tres columnas. Una aplicación que solo funciona con buena conexión excluye por acceso; una que exige un vocabulario técnico excluye por uso; una que solo ofrece su contenido en inglés excluye por aprovechamiento.',
        },
        {
          t: 'p',
          texto:
            'La accesibilidad es otra cosa, aunque se mezcle con la brecha: se refiere a que el producto pueda ser usado por personas con el mayor rango de capacidades, incluida la discapacidad. Un sitio puede tener conectividad perfecta y ser inaccesible para alguien que navega con lector de pantalla.',
        },
      ],
    },
    'Marco legal colombiano que deben conocer': {
      titulo: 'Dos leyes que se confunden todo el tiempo',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['', 'Ley 1273 de 2009', 'Ley 1581 de 2012'],
          filas: [
            ['Qué es', 'Reforma del Código Penal', 'Ley estatutaria de protección de datos'],
            [
              'Qué crea',
              'El bien jurídico «de la protección de la información y de los datos» (arts. 269A a 269J)',
              'El régimen general de tratamiento de datos personales',
            ],
            [
              'A quién se dirige',
              'A quien comete la conducta: es materia penal',
              'A quien trata los datos (responsable y encargado): es materia administrativa',
            ],
            [
              'Ejemplo típico',
              'Entrar al sistema con las credenciales de otro, aunque no se dañe nada (acceso abusivo, art. 269A)',
              'Guardar códigos y correos de estudiantes sin autorización ni finalidad declarada',
            ],
            ['Quién vigila', 'La Fiscalía y los jueces penales', 'La Superintendencia de Industria y Comercio'],
          ],
        },
        {
          t: 'clave',
          titulo: 'La distinción en una frase',
          texto:
            'La 1273 castiga a quien ataca un sistema o unos datos. La 1581 obliga a quien custodia datos a hacerlo bien. Un mismo incidente puede activar las dos: si alguien accede sin autorización a una base de datos mal protegida, hay un delito (1273) y también un incumplimiento del deber de seguridad (1581).',
        },
        {
          t: 'lista',
          items: [
            'Principios de la Ley 1581: legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.',
            'El principio de finalidad es el que más se incumple en proyectos académicos: se piden datos «por si acaso», sin propósito declarado.',
            'La Ley 1581 se reglamenta con el Decreto 1377 de 2013, que desarrolla la autorización, la política de tratamiento y los avisos de privacidad.',
          ],
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'Del Intel 4004 al chip lleno: duplicar no es sumar',
    contexto:
      'En 1971 un chip tenía 2.300 transistores. Vamos a entender qué observó Moore sin hacer cuentas: en la primera actividad lo vas a ver moverse en un simulador.',
    pasos: [
      {
        titulo: '1. Qué es un transistor',
        texto: 'Un interruptor microscópico. Un chip procesa información combinando muchísimos: desde miles hasta miles de millones.',
      },
      {
        titulo: '2. Qué observó Moore',
        texto: 'En 1965 notó que la cantidad de transistores por chip se duplicaba cada cierto tiempo. En 1975 él mismo ajustó ese tiempo a unos dos años.',
      },
      {
        titulo: '3. Duplicar no es sumar',
        texto: 'Con 2.300 transistores en 1971, duplicar cada dos años da 4.600 en 1973 y 9.200 en 1975. Sumar siempre 2.300 daría 6.900 en 1975. Al principio se parecen; después se separan cada vez más.',
      },
      {
        titulo: '4. Por qué sorprende',
        texto: 'Una hoja de papel de 0,1 mm doblada por la mitad 20 veces alcanzaría unos 105 metros. La intuición espera centímetros porque piensa en sumar, no en duplicar.',
      },
      {
        titulo: '5. Qué SÍ y qué NO dice la ley de Moore',
        texto: 'Sí dice que cada ~2 años caben el doble de transistores en un chip. No dice que tu programa corra el doble de rápido, ni que se vaya a cumplir para siempre.',
      },
      {
        titulo: '6. Qué tiene que ver con el campus',
        texto: 'El hardware más barato no reparte beneficios por igual: un sitio pesado funciona bien solo para quien tiene equipo nuevo.',
      },
    ],
    cierre: 'Duplicar una y otra vez explica por qué un computador cabe hoy en tu bolsillo. No explica que tu programa vaya a ser más rápido solo.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e4-a1-simulador',
      tipo: 'explora-moore',
      nivel: 'base',
      puntos: 110,
      titulo: 'Explora la ley de Moore',
      objetivo: 'Ver con tus propios ojos cómo caben cada vez más transistores en el mismo chip.',
      instrucciones:
        'Mueve los controles del simulador, mira lo que pasa y elige lo que observas. No hay que calcular nada: cada paso te explica lo que viste.',
      conceptoPrevio: 'La cantidad de transistores por chip se duplica cada cierto periodo (cerca de dos años).',
      conceptos: ['exponencial', 'ley-de-moore'],
      simulador: '/ley-moore/index.html',
      pasos: [
        {
          id: 'o1',
          accion: 'Deja el año en 1971 y el periodo en 24 meses. Mira «Transistores por chip».',
          pregunta: '¿Cuántos transistores tiene el chip en 1971?',
          opciones: ['230', 'Unos 2.300 (en pantalla: 2.3 mil)', 'Unos 23.000', 'Unos 2,3 millones'],
          correcta: 1,
          explicacion: 'Es el punto de partida real del modelo: el Intel 4004, con 2.300 transistores. En pantalla aparece como «2.3 mil», que es lo mismo.',
        },
        {
          id: 'o2',
          accion: 'Mueve el año a 1973 y luego a 1975. Fíjate en cómo cambia el número.',
          pregunta: 'Cada dos años, el número de transistores…',
          opciones: ['Suma siempre la misma cantidad (+2.300)', 'Se duplica (×2)', 'Se triplica', 'Se queda igual'],
          correcta: 1,
          explicacion: 'Pasa de 2.3 mil a 4.6 mil y luego a 9.2 mil: cada salto es el doble del anterior. Sumar 2.300 cada vez habría dado 6.9 mil en 1975. Esa diferencia, pequeña al principio, es la que vuelve explosivo lo exponencial.',
        },
        {
          id: 'o3',
          accion: 'Mueve el año hasta 2015 y mira la superficie del chip.',
          pregunta: '¿Qué ves en la superficie del chip?',
          opciones: [
            'Casi vacía, igual que en 1971',
            'Llena de bloques muy pequeños, en el mismo espacio',
            'Un chip mucho más grande',
            'Los mismos pocos bloques, pero más grandes',
          ],
          correcta: 1,
          explicacion: 'El tamaño del chip no cambia: lo que cambia es el tamaño de cada transistor, que se encoge (de 10 µm en 1971 a unos 5 nm en 2015 dentro del modelo). Por eso caben cada vez más en el mismo espacio.',
        },
        {
          id: 'o4',
          accion: 'Deja el año en 2015 y cambia el periodo de duplicación de 24 a 36 meses. Mira «Transistores por chip».',
          pregunta: '¿Qué le pasa al número de transistores?',
          opciones: [
            'Casi no cambia',
            'Baja un poco',
            'Baja muchísimo: de miles de millones a decenas de millones',
            'Sube',
          ],
          correcta: 2,
          explicacion: 'Con 24 meses hay unos 9.6 mil millones; con 36 meses, unos 60 millones. Alargar el periodo «solo» un año suena a poco y deja el resultado en una fracción. Por eso importa tanto que la ley de Moore se haya ido desacelerando.',
        },
        {
          id: 'o5',
          accion: 'Lee la nota verde que está arriba del simulador.',
          pregunta: '¿Son reales las cifras que muestra el simulador después de 1971?',
          opciones: [
            'Sí, son los transistores de los chips reales de cada año',
            'No: son un modelo idealizado; solo el dato de 1971 es real',
            'Sí, pero solo hasta 2015',
            'No se sabe de dónde salen',
          ],
          correcta: 1,
          explicacion: 'El simulador calcula todo desde 1971 con una regla de duplicación. No es la historia real de los chips ni una predicción. Y solo muestra cantidad de transistores: no velocidad, ni calor, ni costo.',
        },
      ],
      pistas: [
        'Los números están en el panel izquierdo del simulador: «Transistores por chip» cambia cuando mueves el año o el periodo.',
        'Si dudas, mueve el control otra vez y compara el número antes y después.',
        'No hace falta calcular: basta con leer lo que muestra el simulador.',
      ],
      explicacion:
        'La idea de la sesión en una frase: cada ~2 años caben el doble de transistores en el mismo chip, y «el doble, una y otra vez» crece mucho más rápido de lo que la intuición espera. Lo que el simulador no muestra —velocidad, calor, costo— es justo lo que la ley de Moore tampoco dice.',
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e4-a2-predice',
      tipo: 'predice',
      nivel: 'base',
      puntos: 110,
      titulo: 'Predice antes de mirar',
      objetivo: 'Enfrentar tu propia intuición sobre el crecimiento exponencial antes de ver el resultado.',
      instrucciones:
        'Primero elige lo que crees, sin calcular. Después comprueba. Se puntúa por completar el ejercicio, no por acertar: equivocarse aquí es justo lo que enseña.',
      conceptoPrevio: 'Duplicar una y otra vez crece mucho más rápido que sumar siempre la misma cantidad.',
      conceptos: ['exponencial'],
      escenarios: [
        {
          id: 's1',
          enunciado: 'En 1971 un chip tenía 2.300 transistores. Si se duplican cada 2 años, ¿cuántos tendría en 1975?',
          opciones: ['4.600', '6.900', '9.200', '23.000'],
          correcta: 2,
          valorInicial: 2300,
          periodo: 2,
          tiempo: 4,
          unidad: 'transistores',
          resultado: 9200,
          explicacion:
            'De 1971 a 1975 hay dos duplicaciones: 2.300 → 4.600 → 9.200. Quien respondió 6.900 sumó 2.300 dos veces: pensó en crecimiento lineal. Es lo mismo que viste en el simulador.',
        },
        {
          id: 's2',
          enunciado: 'Una hoja de papel de 0,1 mm se dobla por la mitad 20 veces; cada doblez duplica el grosor. ¿Qué grosor tendría?',
          opciones: ['Unos 2 cm', 'Unos 10 cm', 'Unos 105 metros', 'Unos 2 kilómetros'],
          correcta: 2,
          explicacion:
            'Veinte duplicaciones multiplican por más de un millón: 0,1 mm se vuelve unos 105 metros, como un edificio de 30 pisos. Casi todo el mundo responde «unos centímetros»: la intuición piensa en sumar, no en duplicar.',
        },
        {
          id: 's3',
          enunciado: 'Un nenúfar cubre un lago y su superficie se duplica cada día. Tarda 30 días en cubrir todo el lago. ¿En qué día cubría la mitad?',
          opciones: ['Día 15', 'Día 20', 'Día 25', 'Día 29'],
          correcta: 3,
          explicacion:
            'Si cada día se duplica, el día anterior al final estaba la mitad: el día 29. Hasta el día 25 el lago se ve casi vacío (cerca del 3 %). Lo exponencial parece lento hasta que de pronto ya no queda tiempo.',
        },
      ],
      remate: {
        pregunta: 'Los tres casos comparten un mismo error de intuición. ¿Cuál es?',
        opciones: [
          'Se piensa que crece sumando la misma cantidad, cuando en realidad se multiplica.',
          'Se olvida convertir las unidades.',
          'Los números iniciales eran demasiado pequeños.',
          'Se confunde el año con el mes.',
        ],
        correcta: 0,
        porQueNo: {
          1: 'En los tres casos las unidades están claras. El error está en cómo se imagina el crecimiento.',
          2: 'El tamaño del número inicial no importa: el error aparece igual con 2.300 transistores o con 0,1 mm.',
          3: 'Las fechas están bien dadas en los tres casos; lo que falla es la intuición.',
        },
        explicacion:
          'Tratamos un crecimiento que multiplica como si sumara. Es el mismo salto de razonamiento detrás de las promesas que la ley de Moore no hace.',
      },
      pistas: [
        'Cuenta primero cuántas veces se duplica; cada duplicación multiplica por 2, no suma.',
        'Si tu respuesta es «lo de antes más lo mismo», estás pensando en crecimiento lineal.',
        'En el lago, pregúntate: ¿qué día antes de llenarse estaba a la mitad?',
      ],
      explicacion:
        'Los tres casos comparten el mismo error: se imagina que crece sumando cuando en realidad se multiplica. Por eso conviene predecir antes de mirar: obliga a enfrentar la intuición propia.',
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'e4-a3-mitos',
      tipo: 'vf',
      nivel: 'base',
      puntos: 120,
      titulo: 'Mito o conclusión válida',
      objetivo: 'Separar lo que la Ley de Moore permite afirmar de lo que se le atribuye sin fundamento.',
      instrucciones:
        'Marca cada afirmación. Todas circulan en clase, en internet y en entrevistas de trabajo.',
      conceptoPrevio: 'Qué magnitud describe la Ley de Moore y cuál es su naturaleza.',
      conceptos: ['ley-de-moore', 'exponencial'],
      afirmaciones: [
        {
          texto: 'La Ley de Moore es una ley física, como la de la gravedad.',
          verdadero: false,
          explicacion:
            'Es una observación empírica sobre una industria, formulada por Gordon Moore en 1965 y ajustada por él en 1975. Nada en la física obliga a que se cumpla, y de hecho se ha venido desacelerando.',
        },
        {
          texto: 'La Ley de Moore describe la cantidad de transistores, no la velocidad de ejecución de un programa.',
          verdadero: true,
          explicacion:
            'Esta es la distinción central de la sesión. Hasta 2005 las dos cosas avanzaron juntas, pero la frecuencia de reloj se estancó y los transistores adicionales pasaron a usarse en más núcleos.',
        },
        {
          texto: 'Un programa de un solo hilo se ejecuta más rápido por el solo hecho de correr en un procesador de más núcleos.',
          verdadero: false,
          explicacion:
            'Un solo hilo usa un núcleo. Los demás quedan disponibles para otros procesos, pero el programa no se acelera a menos que se reescriba para repartir su trabajo.',
        },
        {
          texto: 'Existen tareas que no se pueden acelerar repartiéndolas entre varios núcleos.',
          verdadero: true,
          explicacion:
            'Cuando cada paso depende del resultado del anterior, no hay nada que repartir. La Ley de Amdahl formaliza el límite: la fracción forzosamente secuencial acota la aceleración máxima.',
        },
        {
          texto: 'Como el hardware mejora cada año, optimizar el software dejó de ser importante.',
          verdadero: false,
          explicacion:
            'Este razonamiento funcionó mientras la frecuencia subía sola. Además ignora que quien usa un equipo de hace ocho años —buena parte del campus— no recibe ninguna de esas mejoras.',
        },
        {
          texto: 'Que la capacidad de cómputo se haya abaratado no implica que sus beneficios lleguen por igual a toda la población.',
          verdadero: true,
          explicacion:
            'Es precisamente la brecha digital. El precio del cómputo bajó de forma espectacular y aun así el acceso, el uso y el aprovechamiento siguen repartidos de forma desigual.',
        },
        {
          texto: 'Si una tendencia se ha cumplido durante 50 años, se seguirá cumpliendo.',
          verdadero: false,
          explicacion:
            'Extrapolar una tendencia empírica indefinidamente es un error de razonamiento, no una conclusión. Toda tendencia tiene límites físicos o económicos; los de la miniaturización ya se están alcanzando.',
        },
      ],
      pistas: [
        'Tres de las siete son verdaderas. Las cuatro falsas comparten un mismo defecto: extienden la observación a algo que no describe.',
        'Pregúntate de cada afirmación: ¿está hablando de transistores, o se pasó a hablar de velocidad, de garantías futuras o de necesidad de optimizar?',
        'Las verdaderas son cautas: hablan de lo que la observación sí cubre, o señalan un límite.',
      ],
      explicacion:
        'El patrón de los cuatro mitos es idéntico: tomar una observación sobre densidad de transistores y sacar de ella una conclusión sobre otra magnitud. Ese salto —de lo observado a lo deseado— es el error de razonamiento más común cuando se habla de tecnología, y aparece igual en las promesas sobre inteligencia artificial que vas a oír durante toda la carrera.',
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'e4-a4-todos',
      tipo: 'entrega',
      nivel: 'base',
      puntos: 120,
      titulo: 'Diseña para todos',
      objetivo: 'Elegir medidas que amplíen de verdad quién puede usar el sistema.',
      instrucciones:
        'El sistema de reservas se va a usar en todo el campus. Tienes 10 puntos de esfuerzo para el próximo incremento. Elige las medidas que más amplían el conjunto de personas que pueden usarlo.',
      conceptoPrevio: 'Brecha digital (acceso, uso, aprovechamiento) y accesibilidad.',
      conceptos: ['brecha-digital', 'accesibilidad'],
      capacidad: 10,
      unidad: 'puntos de esfuerzo',
      opciones: [
        {
          id: 'peso',
          texto: 'Reducir el peso de la página de 4 MB a 300 KB',
          costo: 3,
          necesidad: 'Quien se conecta con datos móviles limitados puede abrirla sin gastar su plan; en el equipo viejo de la sala 2 deja de congelarse.',
          esencial: true,
        },
        {
          id: 'teclado',
          texto: 'Hacer que todo el flujo se pueda completar solo con el teclado, con foco visible',
          costo: 2,
          necesidad: 'Habilita el uso con lector de pantalla y a quien no puede usar el ratón con precisión.',
          esencial: true,
        },
        {
          id: 'contraste',
          texto: 'Corregir el contraste del texto y dejar de señalar errores solo con color',
          costo: 2,
          necesidad: 'Permite leer la pantalla con baja visión, con daltonismo o bajo el sol en un patio.',
          esencial: true,
        },
        {
          id: 'offline',
          texto: 'Conservar el formulario y reintentar el envío cuando se cae la conexión',
          costo: 3,
          necesidad: 'En los edificios con wifi inestable el estudiante deja de perder su trabajo.',
          esencial: true,
        },
        {
          id: 'app-nativa',
          texto: 'Publicar una aplicación nativa para Android de última generación',
          costo: 8,
          necesidad: 'Mejora la experiencia de quien ya tiene un celular reciente. No ayuda a quien tiene un equipo viejo o poca conexión.',
          esencial: false,
        },
        {
          id: 'video',
          texto: 'Grabar un video tutorial de 10 minutos en alta definición',
          costo: 3,
          necesidad: 'Un video pesado es justamente lo que no puede ver quien tiene datos limitados. Un instructivo en texto costaría casi nada y llegaría a más gente.',
          esencial: false,
        },
        {
          id: 'modo-oscuro',
          texto: 'Agregar modo oscuro',
          costo: 2,
          necesidad: 'Es una preferencia estética legítima. No amplía quién puede usar el sistema.',
          esencial: false,
        },
      ],
      criterio: {
        obligatorias: ['peso', 'teclado', 'contraste', 'offline'],
        prohibidas: ['app-nativa', 'video'],
        explicacionObligatorias:
          'Las cuatro atacan una barrera concreta: conexión limitada, equipo antiguo, capacidad visual y motriz, e inestabilidad de red.',
        explicacionProhibidas:
          'La app nativa consume 8 de los 10 puntos y beneficia a quien menos barreras tiene; el video pesado excluye justamente a quien dice ayudar.',
      },
      pistas: [
        'Pregúntate de cada medida: ¿esto permite que alguien que HOY no puede usar el sistema empiece a poder?',
        'Dos de las opciones ayudan sobre todo a quien ya tiene buenas condiciones. Esas son las que hay que dejar fuera.',
        'Las cuatro correctas suman exactamente los 10 puntos disponibles.',
      ],
      explicacion:
        'Las cuatro medidas correctas suman 10 puntos exactos y cada una elimina una barrera distinta. Las dos descartadas son instructivas: la app nativa es la opción que suena más ambiciosa y beneficia a quien menos lo necesita; el video en alta definición es una trampa perfecta, porque se propone con la intención de ayudar y excluye justo a la población que dice atender. Diseñar para todos no es agregar funciones: es quitar barreras.',
    },

    /* ------------------------------------------------------------------ 5 */
    {
      id: 'e4-a5-datos',
      tipo: 'datos-necesarios',
      nivel: 'base',
      puntos: 130,
      titulo: '¿Necesitas ese dato?',
      objetivo: 'Aplicar el principio de finalidad al diseñar un formulario.',
      instrucciones:
        'Vas a construir el formulario de registro del sistema de reservas. Para cada dato, decide si lo pides y justifica su finalidad. La regla es simple: si no puedes escribir para qué lo usarás, no lo pidas.',
      conceptoPrevio: 'Principio de finalidad de la Ley 1581 de 2012: los datos se recogen para un propósito legítimo, informado y determinado.',
      conceptos: ['datos-personales', 'finalidad'],
      contexto:
        'El sistema permite a un estudiante consultar salas libres, reservar hasta 2 horas y cancelar. La coordinación necesita saber cuántas reservas se hacen por programa académico.',
      datos: [
        {
          id: 'correo',
          etiqueta: 'Correo institucional',
          pedir: true,
          finalidad: 'Identificar la cuenta y enviar la confirmación de la reserva.',
          porQue: 'Es la credencial de acceso y el canal de confirmación. Sin él no hay cuenta ni forma de avisar.',
        },
        {
          id: 'nombre',
          etiqueta: 'Nombres y apellidos',
          pedir: true,
          finalidad: 'Identificar a quién pertenece la reserva ante el monitor de la sala.',
          porQue: 'El monitor necesita verificar que quien llega es quien reservó. Finalidad concreta y verificable.',
        },
        {
          id: 'programa',
          etiqueta: 'Programa académico',
          pedir: true,
          finalidad: 'Producir el informe de uso por programa que necesita la coordinación.',
          porQue: 'Hay una finalidad declarada en el enunciado. Se pide, se informa para qué, y se reporta de forma agregada.',
        },
        {
          id: 'codigo',
          etiqueta: 'Código estudiantil',
          pedir: true,
          finalidad: 'Verificar que la persona está matriculada y vincular la reserva con el registro académico.',
          porQue: 'Tiene finalidad administrativa clara. Ojo: es un dato personal, así que no puede servir como contraseña ni exponerse a otros usuarios.',
        },
        {
          id: 'cedula',
          etiqueta: 'Número de cédula',
          pedir: false,
          finalidad: null,
          porQue:
            'El código estudiantil ya identifica a la persona dentro de la institución. Pedir la cédula además agrega un identificador nacional sin ninguna finalidad adicional, y aumenta el daño si hay una fuga.',
        },
        {
          id: 'telefono',
          etiqueta: 'Número de celular',
          pedir: false,
          finalidad: null,
          porQue:
            'La confirmación ya viaja por correo. Pedir el celular «por si acaso» es exactamente lo que el principio de finalidad prohíbe. Si mañana se decide notificar por mensaje, se pide entonces y se informa para qué.',
        },
        {
          id: 'nacimiento',
          etiqueta: 'Fecha de nacimiento',
          pedir: false,
          finalidad: null,
          porQue:
            'Ninguna función del sistema depende de la edad. Es un dato que se pide por costumbre de formulario, sin propósito.',
        },
        {
          id: 'eps',
          etiqueta: 'EPS y tipo de sangre',
          pedir: false,
          finalidad: null,
          porQue:
            'Son datos sensibles de salud. Recogerlos sin necesidad no solo incumple el principio de finalidad: los datos sensibles tienen un régimen más estricto y el riesgo de custodiarlos es mucho mayor.',
        },
        {
          id: 'foto',
          etiqueta: 'Fotografía',
          pedir: false,
          finalidad: null,
          porQue:
            'Se podría argumentar que ayuda al monitor a identificar a la persona, pero el carné institucional ya cumple esa función y el sistema no necesita almacenar imágenes de los estudiantes.',
        },
      ],
      pistas: [
        'Recorre las funciones del sistema —consultar, reservar, cancelar, informe por programa— y pregúntate qué dato hace falta para cada una.',
        'Si tu justificación empieza con «por si acaso» o «para tener más información», el dato no se pide.',
        'Son cuatro datos que sí se piden y cinco que no.',
      ],
      explicacion:
        'El principio de finalidad invierte la pregunta habitual. No es «¿qué datos podrían servir?» sino «¿qué función concreta exige este dato?». Los cinco datos descartados son los que aparecen en casi todos los formularios institucionales por inercia. Dos merecen atención especial: la cédula, porque duplica un identificador que ya se tiene y multiplica el daño de una fuga; y la EPS con el tipo de sangre, porque son datos sensibles cuyo tratamiento tiene requisitos reforzados. Recoger menos datos no es solo legal: es la forma más barata de reducir el riesgo, porque los datos que no se tienen no se pueden filtrar.',
    },

    /* ------------------------------------------------------------------ 6 */
    {
      id: 'e4-a6-leyes',
      tipo: 'clasificar',
      nivel: 'opcional',
      puntos: 100,
      titulo: 'Protección de datos o delito informático',
      objetivo: 'Ubicar situaciones bajo la ley colombiana que las gobierna.',
      instrucciones:
        'Clasifica cada situación. Algunas activan las dos leyes; en esos casos elige la que describe la conducta principal del enunciado.',
      conceptoPrevio: 'Ley 1273 de 2009 (delitos informáticos) y Ley 1581 de 2012 (protección de datos personales).',
      conceptos: ['datos-personales', 'finalidad'],
      grupos: [
        { id: 'delito', nombre: 'Ley 1273 de 2009 · delito informático' },
        { id: 'datos', nombre: 'Ley 1581 de 2012 · protección de datos' },
      ],
      items: [
        {
          texto: 'Un estudiante entra al sistema de notas con la contraseña de un compañero, solo para mirar.',
          grupo: 'delito',
          porQue: 'Acceso abusivo a sistema informático (art. 269A). El tipo penal no exige que se cause daño: basta el acceso sin autorización.',
        },
        {
          texto: 'Un proyecto de clase guarda nombres y correos de 200 estudiantes sin haberles pedido autorización.',
          grupo: 'datos',
          porQue: 'Incumple el deber de obtener autorización previa e informada. Aplica también a los trabajos académicos.',
        },
        {
          texto: 'Alguien instala un programa que cifra los archivos de la sala de cómputo y pide dinero para liberarlos.',
          grupo: 'delito',
          porQue: 'Daño informático y uso de software malicioso (arts. 269D y 269E), además de la extorsión.',
        },
        {
          texto: 'Una app pide el tipo de sangre para un servicio de reserva de salas y lo almacena sin política de tratamiento.',
          grupo: 'datos',
          porQue: 'Viola el principio de finalidad y, por tratarse de un dato sensible, incumple los requisitos reforzados de su tratamiento.',
        },
        {
          texto: 'Se publica un sitio idéntico al de la universidad para capturar las contraseñas de los estudiantes.',
          grupo: 'delito',
          porQue: 'Suplantación de sitios web para capturar datos personales (art. 269G).',
        },
        {
          texto: 'La universidad usa los correos recogidos para inscripción a un evento para enviar publicidad de un diplomado.',
          grupo: 'datos',
          porQue: 'Usar los datos para una finalidad distinta de la informada al titular vulnera el principio de finalidad.',
        },
        {
          texto: 'Un empleado descarga la base de datos de estudiantes y la vende a una empresa de mensajes de texto.',
          grupo: 'delito',
          porQue: 'Violación de datos personales (art. 269F), que sanciona sustraer, vender o divulgar datos contenidos en bases de datos. Además hay un incumplimiento grave de la 1581 por parte de la institución.',
        },
        {
          texto: 'Un sistema conserva los datos de estudiantes que se graduaron hace diez años sin ningún propósito vigente.',
          grupo: 'datos',
          porQue: 'El tratamiento debe responder a una finalidad vigente; conservar indefinidamente sin propósito vulnera los principios de la ley.',
        },
      ],
      pistas: [
        'Pregúntate quién es el protagonista: si alguien ATACA un sistema o unos datos ajenos, es la 1273. Si alguien CUSTODIA datos y lo hace mal, es la 1581.',
        'La 1273 es materia penal: hay una conducta que se castiga. La 1581 es un régimen de deberes para quien trata datos.',
        'Son cuatro de cada una.',
      ],
      explicacion:
        'La regla que resuelve casi todos los casos: la 1273 castiga a quien ataca; la 1581 obliga a quien custodia. El caso del empleado que vende la base de datos muestra que las dos pueden activarse a la vez —hay delito de quien sustrae y hay incumplimiento del deber de seguridad de la institución—, y se clasificó como delito porque el enunciado describe la conducta del atacante. Como futuros ingenieros ustedes estarán casi siempre del lado de la 1581: serán quienes custodian.',
    },
  ],

  reto: {
    id: 'e4-reto',
    tipo: 'secuencia',
    nivel: 'base',
    puntos: 150,
    titulo: 'Un servicio digital para todo el campus',
    objetivo: 'Integrar crecimiento, brecha digital y datos personales en una sola decisión de diseño.',
    instrucciones: 'Cuatro pasos sobre un servicio nuevo.',
    conceptoPrevio: 'Toda la estación.',
    conceptos: ['exponencial', 'brecha-digital', 'accesibilidad', 'finalidad'],
    contexto:
      'La universidad quiere lanzar una plataforma de contenidos: guías, videos de clase y talleres descargables, para los 3.000 estudiantes de todos los programas.',
    pasos: [
      {
        id: 'p1',
        tipo: 'quiz',
        conceptos: ['exponencial'],
        seccion: { estacion: 'tic', titulo: 'Qué es crecer de forma exponencial' },
        pregunta:
          'Paso 1. La plataforma recibirá 40 GB de contenido el primer mes, y cada mes se subirá 8 % más que el mes anterior. Para planear el almacenamiento, ¿qué conviene suponer?',
        opciones: [
          'Que el volumen sube siempre lo mismo cada mes (unos 3,2 GB más), así que basta con mirar el consumo de hoy.',
          'Que el volumen crece de forma exponencial: cada mes sube más que el anterior, así que la capacidad se planea contra la curva y no contra el consumo actual.',
          'Que un 8 % es poco, así que se puede ignorar el crecimiento.',
          'Que el crecimiento se detendrá solo cuando haga falta.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Eso sería crecimiento lineal. Con un 8 % mensual el aumento de cada mes es mayor que el del anterior.',
          2: '«Apenas un 8 %» suena inofensivo y es exponencial: el volumen se duplica más o menos cada 9 meses.',
          3: 'Nada garantiza que el crecimiento se detenga: hay que planear con lo que se espera, no con lo que se desea.',
        },
        explicacion:
          'Un crecimiento porcentual constante es exponencial. Con 8 % mensual el volumen se duplica cada 9 meses aproximadamente: en tres años se habrá multiplicado por unas 16 veces. Por eso se planea contra la curva, no contra el consumo actual.',
      },
      {
        id: 'p2',
        tipo: 'entrega',
        conceptos: ['brecha-digital', 'accesibilidad'],
        seccion: { estacion: 'tic', titulo: 'Las TIC en la sociedad' },
        instrucciones:
          'Paso 2. Elige cómo entregar el contenido. Capacidad: 8 puntos. Recuerda quiénes son los 3.000 estudiantes, no solo los que tienen buen equipo.',
        capacidad: 8,
        unidad: 'puntos',
        opciones: [
          { id: 'texto', texto: 'Publicar todas las guías también en HTML ligero y PDF de bajo peso', costo: 3, necesidad: 'Quien tiene datos limitados o un equipo antiguo puede leer el contenido completo.', esencial: true },
          { id: 'descarga', texto: 'Permitir descargar el material para consultarlo sin conexión', costo: 2, necesidad: 'Quien solo tiene internet en el campus puede estudiar en su casa.', esencial: true },
          { id: 'subtitulos', texto: 'Subtitular los videos y publicar su transcripción', costo: 3, necesidad: 'Habilita a quien tiene discapacidad auditiva y a quien no puede reproducir video por su plan de datos.', esencial: true },
          { id: 'hd', texto: 'Ofrecer los videos únicamente en alta definición', costo: 4, necesidad: 'Mejora la imagen para quien tiene buena conexión y deja fuera a quien no la tiene.', esencial: false },
          { id: 'app', texto: 'Desarrollar una app nativa exclusiva para iOS', costo: 6, necesidad: 'Atiende a la minoría con el dispositivo más costoso.', esencial: false },
        ],
        criterio: {
          obligatorias: ['texto', 'descarga', 'subtitulos'],
          prohibidas: ['hd', 'app'],
          explicacionObligatorias: 'Las tres amplían quién puede acceder al contenido: peso, ausencia de conexión y capacidad auditiva.',
          explicacionProhibidas: 'Las dos descartadas concentran el esfuerzo en quien ya tiene las mejores condiciones.',
        },
        explicacion:
          'Las tres correctas suman 8 puntos exactos. Los subtítulos son el caso más interesante: se piensan como una medida de accesibilidad para personas sordas y resultan igual de útiles para quien no puede gastar datos en video, para quien estudia en un lugar ruidoso y para quien quiere buscar una palabra dentro de la clase. Casi siempre ocurre así: una medida de accesibilidad mejora la experiencia de mucha más gente de la que la motivó.',
      },
      {
        id: 'p3',
        tipo: 'datos-necesarios',
        conceptos: ['finalidad', 'datos-personales'],
        seccion: { estacion: 'tic', titulo: 'Marco legal colombiano que deben conocer' },
        instrucciones:
          'Paso 3. Decide qué datos pide el registro de la plataforma. Funciones: identificar al estudiante, mostrarle el material de sus asignaturas y reportar a Vicerrectoría cuántos estudiantes usan la plataforma por programa.',
        contexto: 'Nada más: la plataforma no vende, no envía publicidad y no califica.',
        datos: [
          { id: 'correo', etiqueta: 'Correo institucional', pedir: true, finalidad: 'Identificar la cuenta y recuperar el acceso.', porQue: 'Es la credencial. Sin él no hay cuenta.' },
          { id: 'nombre', etiqueta: 'Nombres y apellidos', pedir: true, finalidad: 'Mostrar a quién pertenece la sesión y personalizar el material.', porQue: 'Identificación básica dentro del servicio.' },
          { id: 'programa', etiqueta: 'Programa académico', pedir: true, finalidad: 'Mostrar el material de sus asignaturas y producir el reporte agregado por programa.', porQue: 'Hay dos finalidades declaradas y ambas están en el enunciado.' },
          { id: 'estrato', etiqueta: 'Estrato socioeconómico', pedir: false, finalidad: null, porQue: 'Ninguna función lo necesita. Además permite segmentar a las personas por condición económica, lo que exige una justificación muy fuerte que aquí no existe.' },
          { id: 'ubicacion', etiqueta: 'Ubicación en tiempo real', pedir: false, finalidad: null, porQue: 'Consultar material no requiere saber dónde está la persona. Es un dato de alto riesgo sin ningún propósito.' },
          { id: 'contactos', etiqueta: 'Acceso a la lista de contactos del teléfono', pedir: false, finalidad: null, porQue: 'Serían datos de terceros que nunca autorizaron nada. Pedirlos traslada a la institución la responsabilidad sobre personas ajenas al servicio.' },
          { id: 'foto', etiqueta: 'Fotografía de perfil (opcional)', pedir: false, finalidad: null, porQue: 'Aunque sea opcional, no cumple ninguna finalidad del servicio. Un dato opcional sin propósito sigue siendo un dato que hay que custodiar.' },
        ],
        explicacion:
          'Tres datos bastan para las tres funciones declaradas. El caso de la foto «opcional» es el que más discusión genera: que un dato sea opcional no lo exime del principio de finalidad, porque una vez recogido hay que protegerlo, conservarlo y eventualmente suprimirlo. Y el de los contactos muestra un límite que se olvida: pedir datos de terceros que jamás autorizaron nada.',
      },
      {
        id: 'p4',
        tipo: 'quiz',
        conceptos: ['datos-personales', 'finalidad'],
        seccion: { estacion: 'tic', titulo: 'Marco legal colombiano que deben conocer' },
        pregunta:
          'Paso 4. Seis meses después, la Vicerrectoría pide la lista nominal de qué videos vio cada estudiante, para «identificar a los que no están estudiando». ¿Cuál es la respuesta correcta desde la ingeniería?',
        opciones: [
          'Entregarla: la universidad es dueña de la plataforma y de los datos.',
          'Advertir que el uso se informó a los estudiantes con una finalidad distinta —mostrar material y reportar de forma agregada— y que un uso nominal para evaluar comportamiento exige una nueva finalidad informada y autorizada.',
          'Negarse sin más explicación: los datos son privados.',
          'Entregarla con los nombres reemplazados por el código estudiantil.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Ser responsable del tratamiento no convierte a la institución en dueña de los datos. El titular es el estudiante, y la finalidad informada limita el uso.',
          2: 'La respuesta es correcta en el fondo pero inútil en la práctica: el trabajo del ingeniero es explicar el límite y ofrecer la alternativa que sí es legítima, no cerrar la conversación.',
          3: 'El código estudiantil identifica a la persona igual que el nombre: es un dato personal, no una anonimización. Es el error técnico más común al «anonimizar».',
        },
        explicacion:
          'Dos aprendizajes. Primero: el uso de los datos está limitado por la finalidad que se informó, y ampliarla requiere informar y obtener autorización de nuevo. Segundo, y muy técnico: reemplazar el nombre por el código NO es anonimizar, porque el código sigue apuntando a una persona determinada; eso es seudonimización, y los datos seudonimizados siguen siendo datos personales. La alternativa legítima existe y hay que ofrecerla: un reporte agregado por programa, sin identificar individuos, que es justamente para lo que se pidió el dato.',
      },
    ],
    explicacion:
      'Este reto junta las tres ideas de la estación: estimar un crecimiento exponencial antes de que sorprenda, diseñar pensando en quien tiene menos y no en quien tiene más, y sostener el principio de finalidad incluso cuando quien pide más datos tiene autoridad para pedirlos. Lo último es lo más difícil y lo más propio del oficio.',
  },

  sintesis: {
    puntos: [
      'La Ley de Moore describe la densidad de transistores. Es una observación empírica de 1965 (revisada en 1975), no una ley física ni una garantía.',
      'Más transistores no aceleran un programa de un solo hilo: desde 2005 se usan en más núcleos, y hay tareas que no se pueden repartir.',
      'En el crecimiento exponencial el valor se multiplica por un factor constante cada periodo. La regla del 72 permite estimar el periodo de duplicación de memoria.',
      'La brecha digital tiene tres dimensiones: acceso, uso y aprovechamiento. Una medida técnica puede ampliar o cerrar el acceso.',
      'Una medida de accesibilidad casi siempre beneficia a mucha más gente de la que la motivó.',
      'Principio de finalidad: si no puedes escribir para qué usarás un dato, no lo pidas. Los datos que no se tienen no se pueden filtrar.',
      'La Ley 1273 de 2009 castiga a quien ataca sistemas o datos; la Ley 1581 de 2012 obliga a quien custodia datos personales.',
      'Reemplazar el nombre por el código estudiantil no es anonimizar: es seudonimizar, y sigue siendo dato personal.',
    ],
    conexion:
      'Las decisiones de esta estación son técnicas y éticas a la vez, y esa mezcla no desaparece: el peso de una página, los datos que pide un formulario y los contrastes de color son decisiones de código con consecuencias sobre personas. En el proyecto final de la asignatura van a recoger datos de compañeros; el principio de finalidad les aplica desde ese mismo momento.',
  },

  glosario: ['ley-de-moore', 'exponencial', 'brecha-digital', 'accesibilidad', 'datos-personales', 'finalidad'],

  referencias: [
    {
      texto: 'Ley 1273 de 2009 — «De la protección de la información y de los datos» (arts. 269A a 269J del Código Penal). Diario Oficial, 5 de enero de 2009.',
      url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=34492',
      fuente: 'Gestor Normativo, Departamento Administrativo de la Función Pública',
    },
    {
      texto: 'Ley Estatutaria 1581 de 2012 — Régimen general de protección de datos personales. Principios: legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.',
      url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981',
      fuente: 'Gestor Normativo, Departamento Administrativo de la Función Pública',
    },
    {
      texto: 'Decreto 1377 de 2013 — Reglamenta parcialmente la Ley 1581 de 2012 (autorización, política de tratamiento y aviso de privacidad).',
      url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646',
      fuente: 'Gestor Normativo, Departamento Administrativo de la Función Pública',
    },
    {
      texto: 'Superintendencia de Industria y Comercio — autoridad de vigilancia en protección de datos personales.',
      url: 'https://sic.gov.co/preguntas-frecuentes-pdp',
      fuente: 'SIC',
    },
  ],

  taller: {
    id: 'e4-taller',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Taller en grupo · Cuatro experimentos con el simulador',
    objetivo: 'Entender cómo funciona la ley de Moore moviendo el simulador y explicando con tus palabras lo que ves.',
    instrucciones:
      'En grupos de 3 o 4. Cada integrante hace un experimento con el simulador y escribe dos líneas. Al final el grupo escribe una frase. Se entrega un solo documento por equipo.',
    conceptoPrevio: 'La cantidad de transistores por chip se duplica cada cierto periodo.',
    enunciado:
      'Usen el simulador de abajo. Dejen siempre el periodo en 24 meses, salvo en el experimento 1. Cada experimento pide un dato que se lee en la pantalla y una explicación con sus palabras.',
    campos: [
      { id: 'integrantes', etiqueta: 'Integrantes del grupo', filas: 2 },
      { id: 'e1', etiqueta: 'Experimento 1 · Pongan el año en 1995 y cambien el periodo a 12, 24 y 36 meses. Anoten los tres números de «Transistores por chip». ¿Qué les dice eso sobre el periodo de duplicación?', filas: 3 },
      { id: 'e2', etiqueta: 'Experimento 2 · Con 24 meses, muevan el año hasta que el chip llegue a mil millones de transistores. ¿En qué año pasa? ¿Cuántos años tardó desde 1971?', filas: 3 },
      { id: 'e3', etiqueta: 'Experimento 3 · Comparen el tamaño de cada transistor en 1971 y en 2015. ¿Cuántas veces más pequeño es? ¿Por qué eso permite meter más transistores en el mismo chip?', filas: 3 },
      { id: 'e4', etiqueta: 'Experimento 4 · Pongan el año en 2025. ¿Dice el simulador algo sobre qué tan rápido corre un programa? ¿Qué cosas importantes no muestra?', filas: 3 },
      { id: 'frase', etiqueta: 'Entre todos: una frase para explicarle a un compañero qué es la ley de Moore y qué no dice', filas: 3 },
    ],
    listaChequeo: [
      'Cada experimento tiene un dato leído del simulador, no inventado.',
      'Cada explicación está escrita con nuestras palabras.',
      'La frase final dice qué cuenta la ley de Moore y qué no.',
    ],
    rubrica: [
      'Cada experimento: el dato es correcto y la explicación es propia y clara. (80 %)',
      'La frase final distingue lo que la ley dice de lo que no dice. (20 %)',
    ],
    simulador: '/ley-moore/index.html',
  },
}
