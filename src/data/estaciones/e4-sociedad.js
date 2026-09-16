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
    titulo: 'Duplicar tres veces no es triplicar',
    contexto: '«Crece 100 unidades cada dos años» y «se duplica cada dos años» suenan parecidas. Vamos a ver dónde se separan.',
    pasos: [
      {
        titulo: '1. Los dos crecimientos, lado a lado',
        texto:
          'Año | Lineal (+100) | Exponencial (×2)\n 0  |     100       |      100\n 6  |     400       |      800\n12  |     700       |    6.400\n\nA los 2 años son casi iguales. A los 12, uno vale 700 y el otro 6.400.',
      },
      {
        titulo: '2. La fórmula',
        texto: 'valor final = inicial × 2^(tiempo ÷ periodo). Con 12 años y periodo de 2: 100 × 2⁶ = 6.400. Seis duplicaciones multiplican por 64, no por 6.',
      },
      {
        titulo: '3. El error de intuición',
        texto: 'Se subestima el exponencial a largo plazo. Por eso conviene predecir antes de calcular: obliga a enfrentar el error propio.',
      },
      {
        titulo: '4. Qué sí se puede concluir de la Ley de Moore',
        texto: 'Que la densidad de transistores se ha duplicado cada ~2 años, y que la tendencia se ha desacelerado por límites físicos.',
      },
      {
        titulo: '5. Qué NO se puede concluir',
        texto: '«Mi programa correrá el doble de rápido» — los transistores van a más núcleos, no a un solo hilo. «Ya no hace falta optimizar» — dejó de ser cierto cuando la frecuencia se estancó.',
      },
      {
        titulo: '6. Qué tiene que ver con el campus',
        texto: 'El hardware más barato no reparte beneficios por igual: un sitio pesado funciona bien solo para quien tiene equipo nuevo.',
      },
    ],
    cierre: 'El crecimiento exponencial explica el computador en tu bolsillo. No explica que tu programa vaya a ser más rápido solo.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e4-a1-simulador',
      tipo: 'simulador-moore',
      nivel: 'base',
      puntos: 110,
      titulo: 'Simulador de duplicación',
      objetivo: 'Ver con tus propios datos cómo se separan el crecimiento lineal y el exponencial.',
      instrucciones:
        'Cambia el valor inicial, el periodo de duplicación y el tiempo total. Observa la tabla y el gráfico. Después responde las preguntas: se contestan leyendo el simulador, no de memoria.',
      conceptoPrevio: 'Valor final = valor inicial × 2^(tiempo ÷ periodo).',
      conceptos: ['exponencial', 'ley-de-moore'],
      inicial: { valorInicial: 100, periodo: 2, tiempo: 12, incrementoLineal: 100 },
      preguntas: [
        {
          id: 'q1',
          texto: 'Con valor inicial 100, periodo 2 años y 12 años, ¿cuántas duplicaciones completas ocurren?',
          respuestas: ['6'],
          porQueNo: 'Duplicaciones = tiempo ÷ periodo = 12 ÷ 2.',
        },
        {
          id: 'q2',
          texto: 'Con esos mismos valores, ¿cuál es el valor final del crecimiento exponencial?',
          respuestas: ['6400', '6.400'],
          porQueNo: '100 × 2⁶ = 100 × 64 = 6.400.',
        },
        {
          id: 'q3',
          texto: 'Pon el periodo en 3 años dejando lo demás igual. ¿Cuál es ahora el valor final exponencial?',
          respuestas: ['1600', '1.600'],
          porQueNo: 'Con periodo 3 hay 12 ÷ 3 = 4 duplicaciones: 100 × 2⁴ = 1.600. Alargar el periodo de 2 a 3 años reduce el resultado a la cuarta parte.',
        },
      ],
      pistas: [
        'El número de duplicaciones es el tiempo dividido entre el periodo. Es el exponente del 2.',
        'Para el valor final, calcula primero 2 elevado al número de duplicaciones y después multiplica por el valor inicial.',
        'Al cambiar el periodo de 2 a 3 años, las duplicaciones bajan de 6 a 4. Dos duplicaciones menos significan dividir por 4.',
      ],
      explicacion:
        'El detalle que más sorprende es el tercero: alargar el periodo de duplicación de 2 a 3 años —un cambio que suena menor— reduce el resultado a la cuarta parte. Por eso la desaceleración de la Ley de Moore importa tanto: no es que el progreso se detenga, es que cada año de retraso en el periodo de duplicación se compone con todos los anteriores.',
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e4-a2-predice',
      tipo: 'predice',
      nivel: 'base',
      puntos: 110,
      titulo: 'Predice antes de mover',
      objetivo: 'Enfrentar tu propia intuición sobre el crecimiento exponencial antes de ver el resultado.',
      instrucciones:
        'Primero escribe tu predicción sin calcular. Después ejecuta la simulación y compara. Se puntúa por completar el ciclo predicción-comprobación-explicación, no por acertar la predicción: equivocarse aquí es precisamente lo que enseña.',
      conceptoPrevio: 'La fórmula del crecimiento exponencial.',
      conceptos: ['exponencial'],
      escenarios: [
        {
          id: 's1',
          enunciado:
            'Una hoja de papel de 0,1 mm se dobla por la mitad 20 veces (cada doblez duplica el grosor). ¿Qué grosor tendría?',
          opciones: ['Unos 2 cm', 'Unos 10 cm', 'Unos 105 metros', 'Unos 2 kilómetros'],
          correcta: 2,
          valorInicial: 0.1,
          periodo: 1,
          tiempo: 20,
          unidad: 'mm',
          resultado: 104857.6,
          explicacion:
            '0,1 mm × 2²⁰ = 0,1 × 1.048.576 = 104.857,6 mm ≈ 105 metros, un edificio de unos 30 pisos. Casi todo el mundo responde «unos centímetros»: la intuición lineal falla de forma espectacular con 20 duplicaciones.',
        },
        {
          id: 's2',
          enunciado:
            'Un procesador tiene hoy 10.000 millones de transistores. Si la densidad se duplicara cada 2 años, ¿cuántos tendría en 10 años?',
          opciones: ['50.000 millones', '100.000 millones', '320.000 millones', '1 billón'],
          correcta: 2,
          valorInicial: 10000,
          periodo: 2,
          tiempo: 10,
          unidad: 'millones de transistores',
          resultado: 320000,
          explicacion:
            '10 años ÷ 2 = 5 duplicaciones. 10.000 × 2⁵ = 10.000 × 32 = 320.000 millones. La respuesta «50.000 millones» es la intuición lineal (sumar 10.000 por periodo); la correcta es 32 veces el valor inicial, no 5 veces.',
        },
        {
          id: 's3',
          enunciado:
            'Un archivo de registro crece 5 % cada día. Si hoy pesa 1 GB, ¿cuánto pesará en un año (365 días)?',
          opciones: ['Unos 2 GB', 'Unos 18 GB', 'Unos 54 millones de GB', 'Unos 500 GB'],
          correcta: 2,
          valorInicial: 1,
          periodo: 14.2,
          tiempo: 365,
          unidad: 'GB',
          resultado: 54211842,
          explicacion:
            'Un 5 % diario duplica aproximadamente cada 14,2 días (porque 1,05^14,2 ≈ 2). En 365 días caben unas 25,7 duplicaciones, y 1,05^365 ≈ 54,2 millones. Un crecimiento que suena modesto —«apenas 5 % al día»— es exponencial, y por eso los archivos de registro sin rotación llenan discos sin que nadie lo vea venir.',
        },
      ],
      remate: {
        pregunta: 'Los tres escenarios comparten un mismo error de intuición. ¿Cuál es?',
        opciones: [
          'Se subestima el resultado porque los números iniciales son pequeños.',
          'Se estima multiplicando el valor inicial por el número de periodos, cuando lo que corresponde es elevar 2 a esa cantidad de duplicaciones.',
          'Se olvida convertir las unidades de medida.',
          'Se confunde el periodo de duplicación con el tiempo total.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'El tamaño del valor inicial no tiene nada que ver: el mismo error aparece partiendo de 0,1 mm o de 10.000 millones.',
          2: 'En los tres escenarios las unidades se mantienen. El error está en la operación, no en la conversión.',
          3: 'Es un error posible, pero no el que comparten los tres: aquí el periodo está dado con claridad y aun así la intuición falla.',
        },
        explicacion:
          'El error es tratar un crecimiento multiplicativo como si fuera aditivo: pensar «son 5 periodos, entonces unas 5 veces más» en vez de «son 5 duplicaciones, entonces 32 veces más». Es el mismo salto de razonamiento que convierte la Ley de Moore en promesas que no dice.',
      },
      pistas: [
        'Cuenta primero cuántas duplicaciones caben en el tiempo dado: es el tiempo dividido entre el periodo.',
        'Recuerda que 2¹⁰ ≈ 1.000 y 2²⁰ ≈ 1.000.000. Con esos dos anclajes puedes estimar casi cualquier caso de memoria.',
        'Si tu respuesta se parece a «el valor inicial multiplicado por el número de periodos», estás pensando de forma lineal.',
      ],
      explicacion:
        'Los tres escenarios comparten el mismo error de intuición: se estima multiplicando por el número de periodos en vez de elevar 2 a esa potencia. El tercero es el más útil profesionalmente: «crece 5 % diario» suena inofensivo y es exponencial. Cuando en un proyecto alguien diga «el crecimiento es apenas de un pequeño porcentaje por periodo», calcula antes de tranquilizarte.',
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
        tipo: 'calcular',
        conceptos: ['exponencial'],
        seccion: { estacion: 'tic', titulo: 'Calcular con crecimiento exponencial' },
        instrucciones:
          'Paso 1. Estimar el crecimiento del almacenamiento. Se subirán 40 GB de contenido el primer mes y el volumen mensual crecerá 8 % cada mes.',
        datos: {
          encabezados: ['Dato', 'Valor'],
          filas: [
            ['Volumen del mes 1', '40 GB'],
            ['Crecimiento mensual', '8 %'],
            ['Factor mensual', '1,08'],
          ],
          nota: 'Se pregunta por el volumen SUBIDO en ese mes, no por el acumulado.',
        },
        formulas: [
          'Volumen del mes n = 40 × 1,08^(n−1)',
          'Periodo de duplicación aproximado = 72 ÷ porcentaje de crecimiento   (regla del 72)',
        ],
        campos: [
          {
            id: 'mes12',
            etiqueta: 'Volumen subido en el mes 12 (GB, entero más cercano)',
            respuestas: ['93'],
            tolerancia: 1,
            porQueNo: '40 × 1,08¹¹ = 40 × 2,3316 ≈ 93,3 GB. Ojo con el exponente: en el mes 12 han transcurrido 11 periodos de crecimiento, no 12.',
          },
          {
            id: 'duplica',
            etiqueta: 'Cada cuántos meses se duplica, aproximadamente (regla del 72)',
            respuestas: ['9'],
            tolerancia: 0.5,
            porQueNo: '72 ÷ 8 = 9 meses.',
          },
        ],
        explicacion:
          'La regla del 72 es la herramienta de estimación mental más útil que se llevan de esta sesión: dividiendo 72 entre el porcentaje de crecimiento por periodo se obtiene aproximadamente el número de periodos que tarda en duplicarse. Con 8 % mensual, el volumen se duplica cada 9 meses; en tres años se habrá multiplicado por 16.',
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
    titulo: 'Taller en clase · Un servicio digital del campus',
    objetivo: 'Analizar un servicio digital real de la universidad con los tres criterios de la estación.',
    instrucciones: 'En grupos de tres.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Elijan un servicio digital que use la universidad y analícenlo: qué beneficios aporta, qué barreras impone y qué datos pide con qué finalidad.',
    temas: [
      'La plataforma académica.',
      'El sistema de la biblioteca.',
      'El portal de matrículas.',
      'La app o el portal de Bienestar.',
      'El sistema de certificados y constancias.',
      'El correo institucional y sus servicios asociados.',
    ],
    campos: [
      { id: 'servicio', etiqueta: 'Servicio elegido y qué permite hacer', filas: 2 },
      { id: 'beneficios', etiqueta: 'Beneficios concretos: qué se podía hacer antes y qué se puede hacer ahora', filas: 3 },
      { id: 'barreras', etiqueta: 'Barreras por acceso, uso y aprovechamiento: ¿a quién deja fuera y por qué?', filas: 4 },
      { id: 'accesibilidad', etiqueta: 'Revisión de accesibilidad: teclado, contraste, error solo por color, peso de la página', filas: 3 },
      { id: 'datos', etiqueta: 'Datos personales que pide y finalidad declarada de cada uno (o ausencia de finalidad)', filas: 4 },
      { id: 'propuesta', etiqueta: 'Dos mejoras concretas, con la barrera que elimina cada una', filas: 3 },
    ],
    listaChequeo: [
      '¿El servicio funciona con conexión lenta o intermitente?',
      '¿Se puede usar completo desde un celular de gama baja?',
      '¿Se puede operar solo con el teclado?',
      '¿Los errores se señalan con algo más que color?',
      '¿Existe una política de tratamiento de datos accesible desde el formulario?',
      '¿Cada dato solicitado tiene una finalidad que ustedes puedan enunciar?',
      '¿Hay datos sensibles (salud, biométricos) y están justificados?',
    ],
    rubrica: [
      'Las barreras identificadas se ubican en acceso, uso o aprovechamiento y se sustentan con una observación concreta. (35 %)',
      'El análisis de datos aplica el principio de finalidad dato por dato, sin generalizar. (35 %)',
      'Cada mejora propuesta nombra la barrera que elimina y a quién beneficia. (30 %)',
    ],
  },
}
