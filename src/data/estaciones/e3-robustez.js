import base from '../m3-robustez.js'

/** Estación 3 · Que no se rompa (sesión 9). */

export default {
  id: 'robustez',
  orden: 3,
  sesion: 'Sesión 9',
  titulo: 'Que no se rompa',
  gancho: 'El software no falla cuando el usuario hace lo esperado. Falla en los bordes.',

  aprenderas: {
    objetivo:
      'Al terminar podrás diseñar las entradas que hacen fallar un sistema antes de que lo haga un usuario, y distinguir compatibilidad de portabilidad sin dudar.',
    puntos: [
      'Escribir las reglas de validación de un campo: tipo, rango y formato.',
      'Elegir los valores de frontera que hay que probar en cualquier restricción numérica.',
      'Separar compatibilidad, portabilidad y disponibilidad con casos concretos.',
      'Decidir cómo debe comportarse una aplicación cuando se cae la conexión.',
      'Redactar un reporte de defecto que otra persona pueda reproducir.',
    ],
    duracion: '40 a 50 minutos',
  },

  comprende: base.lecciones,

  profundiza: {
    'Fiabilidad y robustez': {
      titulo: 'Las tres clases de entrada que hay que probar siempre',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Clase', 'Qué es', 'Ejemplo con «cantidad de reservas, entre 1 y 5»'],
          filas: [
            ['Normal', 'Valor típico, dentro de lo válido, lejos de los bordes', '3'],
            ['Frontera', 'Justo en el borde permitido y justo afuera', '0, 1, 5, 6'],
            ['Inválida', 'Del tipo o formato equivocado, o ausente', '«tres», −2, 2.5, vacío, 999999999'],
          ],
        },
        {
          t: 'p',
          texto:
            'La mayor parte de los defectos de comparación vive en la frontera, porque ahí es donde se confunde < con <=. Un sistema que acepta 5 pero rechaza 1, o que acepta 6, tiene el mismo error escrito de dos maneras. Por eso las fronteras nunca se prueban de a una: se prueban en pareja, el último válido y el primer inválido.',
        },
        {
          t: 'clave',
          titulo: 'Regla práctica',
          texto:
            'Para una restricción «entre A y B» siempre hay cuatro valores obligatorios: A−1, A, B y B+1. Con esos cuatro se detecta cualquier error de operador de comparación.',
        },
      ],
    },
    Compatibilidad: {
      titulo: 'Compatibilidad y portabilidad: la pregunta que las separa',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Las dos suenan a «funcionar en otro lado» y por eso se confunden en el parcial. La pregunta que las separa es: ¿el sistema tiene que convivir o intercambiar con OTRO producto, o tiene que MUDARSE a otro entorno?',
        },
        {
          t: 'tabla',
          encabezados: ['Pregunta', 'Si la respuesta es sí', 'Subcaracterísticas'],
          filas: [
            [
              '¿Necesita intercambiar información con otro producto, o compartir recursos sin estorbarle?',
              'Compatibilidad',
              'Interoperabilidad, coexistencia',
            ],
            [
              '¿Necesita instalarse y funcionar en otro entorno de hardware, software o uso?',
              'Portabilidad',
              'Adaptabilidad, facilidad de instalación, capacidad de reemplazo',
            ],
          ],
        },
        {
          t: 'p',
          texto:
            'Caso que confunde a todo el mundo: «el CSV que exporta el sistema abre bien en Excel y en LibreOffice». Eso es compatibilidad —interoperabilidad, porque hay intercambio de información con otro producto— aunque mencione dos programas distintos. En cambio, «la misma app corre en Windows y en Ubuntu» es portabilidad: no hay intercambio, hay mudanza.',
        },
      ],
    },
    'Indicadores que se usan en la industria': {
      titulo: 'Qué significa realmente un 99,5 % de disponibilidad',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Disponibilidad', 'Caída máxima al mes', 'Caída máxima al año'],
          filas: [
            ['99 %', '7 h 18 min', '3 días 15 h'],
            ['99,5 %', '3 h 39 min', '1 día 19 h'],
            ['99,9 %', '43 min 50 s', '8 h 46 min'],
            ['99,99 %', '4 min 23 s', '52 min 36 s'],
          ],
        },
        {
          t: 'p',
          texto:
            'Dos consecuencias prácticas. Primera: cada nueve adicional cuesta aproximadamente diez veces más, porque exige redundancia, despliegue sin interrupción y monitoreo continuo. Segunda: un compromiso de disponibilidad sin ventana declarada no significa nada. «99,9 % en horario de atención de la biblioteca» y «99,9 % 24×7» son compromisos muy distintos y el segundo cuesta mucho más.',
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'Un campo de cuatro caracteres que se rompe de seis maneras',
    contexto:
      'Regla de negocio del sistema de reservas: «Un estudiante puede tener entre 1 y 5 reservas activas». En el formulario hay un campo «Cantidad de reservas a crear». Parece trivial. Vamos a romperlo.',
    pasos: [
      {
        titulo: '1. Escribir las reglas antes de probar',
        texto:
          'Tipo: número entero. Rango: de 1 a 5, ambos incluidos. Formato: sin decimales, sin signo, sin espacios. Obligatorio: sí. Nada de esto se puede probar hasta que esté escrito, porque hasta entonces no hay contra qué comparar.',
        nota: 'Este paso es el que más se salta la gente. Sin reglas escritas, «probar» se convierte en «teclear cosas a ver qué pasa».',
      },
      {
        titulo: '2. Las cuatro fronteras obligatorias',
        texto:
          'El rango es 1 a 5, así que las fronteras son 0, 1, 5 y 6.\n\n0 → debe rechazar. 1 → debe aceptar. 5 → debe aceptar. 6 → debe rechazar.\n\nSi el código escribió `if (n > 0 && n < 5)` en vez de `n <= 5`, la prueba con 5 falla y las otras tres pasan. Ese es exactamente el defecto que las fronteras existen para atrapar.',
      },
      {
        titulo: '3. Las entradas inválidas por tipo',
        texto:
          '«tres» → texto donde se espera número. 2.5 → decimal donde se espera entero. −3 → negativo. Vacío → ausencia de dato. Cada una debe producir un mensaje específico, no el mismo «Dato inválido» genérico: el usuario necesita saber si el problema es el tipo o el rango.',
      },
      {
        titulo: '4. Las entradas que nadie previó',
        texto:
          '999999999999 → ¿desborda algún cálculo? «  3  » con espacios → ¿se limpia o se rechaza? «3a» → ¿se lee el 3 y se ignora la letra? (Eso último es un defecto clásico: muchos lenguajes convierten «3a» a 3 sin avisar, y el sistema procesa una reserva que el usuario no pidió.)',
        nota:
          'Este paso distingue a quien prueba de quien solo confirma que funciona. Buscar entradas que nadie previó es el oficio.',
      },
      {
        titulo: '5. La tabla de casos de prueba',
        texto:
          'Entrada  | Resultado esperado                          | Motivo\n---------|---------------------------------------------|---------------------------\n3        | Acepta y crea 3 reservas                    | Caso normal\n0        | Rechaza: «El mínimo es 1»                   | Frontera inferior externa\n1        | Acepta                                      | Frontera inferior interna\n5        | Acepta                                      | Frontera superior interna\n6        | Rechaza: «El máximo es 5»                   | Frontera superior externa\n«tres»   | Rechaza: «Debe ser un número entero»        | Tipo incorrecto\n2.5      | Rechaza: «No se permiten decimales»         | Formato incorrecto\n(vacío)  | Rechaza: «Este campo es obligatorio»        | Dato ausente\n\nOcho casos para un campo. No es exageración: es la cantidad mínima para poder afirmar que el campo funciona.',
      },
      {
        titulo: '6. Y si se cae la conexión a mitad',
        texto:
          'El usuario llenó el formulario y presionó Guardar sin señal. Tres comportamientos posibles, de peor a mejor:\n\n(a) Pantalla en blanco y datos perdidos. Inaceptable.\n(b) Mensaje «Error de red» y datos perdidos. Honesto pero cruel.\n(c) Mensaje que explica qué pasó, el formulario conserva todo lo escrito, y el envío queda en cola para reintentarse. El usuario ve «Pendiente de envío», no «Guardado».\n\nLa diferencia entre (b) y (c) es robustez, y también es la diferencia entre una app que la gente usa en el campus y una que abandona.',
        nota:
          'Regla que no se negocia: nunca se confirma «Guardado» si la escritura no se completó. Esta misma aplicación aplica esa regla con tus intentos.',
      },
    ],
    cierre:
      'Un campo de un solo número produjo ocho casos de prueba y una decisión de diseño sobre la pérdida de conexión. Multiplica eso por los diez campos de un formulario real y entenderás por qué diseñar pruebas es un oficio completo, y por qué las tablas de casos se escriben antes de programar y no después.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e3-a1-romper',
      tipo: 'romper-formulario',
      nivel: 'base',
      puntos: 140,
      titulo: 'Rompe el formulario',
      objetivo: 'Encontrar defectos reales atacando un formulario con entradas que no espera.',
      instrucciones:
        'Las reglas de validación están a la vista. El formulario tiene defectos preparados: no los adivines, encuéntralos probando. Cada envío se valida de verdad, así que el resultado que veas es el comportamiento real del formulario.',
      conceptoPrevio: 'Validación de entradas: tipo, rango y formato.',
      conceptos: ['robustez', 'validacion', 'frontera', 'defecto'],
      aviso: 'Simulación con datos ficticios. No está conectada a tu cuenta ni guarda nada.',
      reglas: [
        'Cantidad de reservas: número entero, entre 1 y 5 (ambos incluidos). Obligatorio.',
        'Código de sala: exactamente 3 dígitos. Obligatorio.',
        'Correo de contacto: debe contener «@» y un punto después del «@». Obligatorio.',
        'Duración en horas: número entre 1 y 2. Se permite 1,5. Obligatorio.',
      ],
      // Cada defecto se detecta cuando una entrada concreta produce un veredicto
      // distinto del que exigen las reglas. La validación la ejecuta el componente.
      defectos: [
        {
          id: 'limite-superior',
          descripcion: 'La cantidad de reservas acepta un valor por encima del máximo declarado.',
          pistaBusqueda: 'Prueba la frontera superior y la que está justo afuera.',
        },
        {
          id: 'texto-numerico',
          descripcion: 'Un texto que empieza con dígitos se acepta como si fuera número.',
          pistaBusqueda: 'Escribe algo como «3a» en un campo numérico.',
        },
        {
          id: 'correo-flojo',
          descripcion: 'El correo se acepta sin punto después del «@».',
          pistaBusqueda: 'Prueba un correo con arroba pero sin dominio completo.',
        },
        {
          id: 'sala-larga',
          descripcion: 'El código de sala acepta más de 3 dígitos.',
          pistaBusqueda: 'Prueba con más dígitos de los permitidos.',
        },
      ],
      pistas: [
        'Empieza por las fronteras de cada regla numérica: el último valor válido y el primero inválido.',
        'Los campos de texto tienen defectos de formato: prueba entradas que casi cumplen la regla pero no del todo.',
        'Hay cuatro defectos. Dos están en campos numéricos y dos en campos de texto.',
      ],
      explicacion:
        'Los cuatro defectos son variantes del mismo error de fondo: la validación se escribió pensando en el usuario que colabora. «n <= 5» quedó como «n <= 6» por un descuido de frontera; la conversión a número aceptó «3a» porque el lenguaje lo permite en silencio; el correo se validó buscando solo «@»; y la longitud de la sala se comprobó con «al menos 3» en vez de «exactamente 3». Ninguno se habría encontrado probando únicamente valores razonables.',
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e3-a2-limites',
      tipo: 'limites',
      nivel: 'base',
      puntos: 110,
      titulo: 'Explora los límites',
      objetivo: 'Elegir el conjunto mínimo y suficiente de valores para probar una restricción.',
      instrucciones:
        'La regla es: «un estudiante puede tener entre 1 y 5 reservas activas». Selecciona los valores que probarías. El criterio no es probar muchos: es cubrir todas las clases con los menos posibles.',
      conceptoPrevio: 'Casos normales, de frontera e inválidos.',
      conceptos: ['frontera', 'validacion'],
      regla: { min: 1, max: 5, descripcion: 'Reservas activas por estudiante: entre 1 y 5 (ambos incluidos).' },
      valores: [
        { valor: '-1', clase: 'invalida', necesario: false, porQue: 'Aporta lo mismo que 0: comprueba el rechazo por debajo del mínimo. Uno de los dos basta, y 0 es más informativo porque está pegado a la frontera.' },
        { valor: '0', clase: 'frontera', necesario: true, porQue: 'Frontera inferior externa: el último valor que debe rechazarse por debajo.' },
        { valor: '1', clase: 'frontera', necesario: true, porQue: 'Frontera inferior interna: el primer valor que debe aceptarse.' },
        { valor: '3', clase: 'normal', necesario: true, porQue: 'Caso normal: confirma que el camino feliz funciona lejos de los bordes.' },
        { valor: '4', clase: 'normal', necesario: false, porQue: 'Redundante con 3: la misma clase de equivalencia, sin información nueva.' },
        { valor: '5', clase: 'frontera', necesario: true, porQue: 'Frontera superior interna: el último valor que debe aceptarse. Es el que atrapa el error de < en vez de <=.' },
        { valor: '6', clase: 'frontera', necesario: true, porQue: 'Frontera superior externa: el primer valor que debe rechazarse.' },
        { valor: '100', clase: 'invalida', necesario: false, porQue: 'Redundante con 6 para la regla de rango. Solo valdría la pena si se sospechara desbordamiento, que es otra prueba.' },
        { valor: '2.5', clase: 'invalida', necesario: true, porQue: 'Prueba el formato, no el rango: está dentro de 1 y 5 pero no es entero. Sin este caso, un sistema que acepta decimales pasaría todas las demás pruebas.' },
        { valor: 'tres', clase: 'invalida', necesario: true, porQue: 'Prueba el tipo. Es la única entrada de la lista que no es numérica.' },
      ],
      pistas: [
        'Para toda restricción «entre A y B» hay cuatro valores obligatorios. Búscalos primero.',
        'Además del rango hay dos reglas que probar: que sea entero y que sea un número. Cada una necesita su propio caso.',
        'Son seis valores necesarios. Los otros cuatro son redundantes: repiten una clase ya cubierta.',
      ],
      explicacion:
        'Seis casos: 0, 1, 3, 5, 6 para el rango y el camino normal, más 2.5 y «tres» para formato y tipo —siete en total si cuentas los dos últimos por separado, y los seis marcados como necesarios son el conjunto mínimo que cubre todas las clases. Los redundantes (−1, 4, 100) no están mal, simplemente no agregan información: pertenecen a una clase de equivalencia que otro caso ya cubre. Esa es la idea de partición en clases de equivalencia: un representante por clase, más todas las fronteras.',
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'e3-a3-compatible',
      tipo: 'clasificar',
      nivel: 'base',
      puntos: 110,
      titulo: '¿Compatible o portable?',
      objetivo: 'Separar compatibilidad, portabilidad y disponibilidad con casos que suenan parecidos.',
      instrucciones:
        'Clasifica cada situación. Antes de decidir, pregúntate: ¿hay intercambio con otro producto, o hay mudanza a otro entorno?',
      conceptoPrevio: 'Compatibilidad (interoperabilidad y coexistencia) frente a portabilidad (adaptabilidad, instalación, reemplazo).',
      conceptos: ['compatibilidad', 'portabilidad', 'disponibilidad'],
      grupos: [
        { id: 'compatibilidad', nombre: 'Compatibilidad' },
        { id: 'portabilidad', nombre: 'Portabilidad' },
        { id: 'disponibilidad', nombre: 'Disponibilidad / fiabilidad' },
      ],
      items: [
        {
          texto: 'El CSV que exporta el sistema abre correctamente en Excel y en LibreOffice, con las tildes intactas.',
          grupo: 'compatibilidad',
          porQue: 'Hay intercambio de información con otro producto: interoperabilidad. Que mencione dos programas no lo convierte en portabilidad.',
        },
        {
          texto: 'La misma aplicación se instala y funciona en Windows 10 y en Ubuntu sin cambiar el código.',
          grupo: 'portabilidad',
          porQue: 'Mudanza a otro entorno de software: adaptabilidad.',
        },
        {
          texto: 'La aplicación puede correr en el mismo servidor que el sistema de notas sin que ninguno de los dos se degrade.',
          grupo: 'compatibilidad',
          porQue: 'Coexistencia: comparten recursos sin afectarse. No hay intercambio de datos, pero sí convivencia.',
        },
        {
          texto: 'El sistema estuvo fuera de servicio 42 minutos el mes pasado.',
          grupo: 'disponibilidad',
          porQue: 'Proporción de tiempo operativo. 42 minutos al mes corresponde aproximadamente a un 99,9 %.',
        },
        {
          texto: 'El sistema consume el servicio de autenticación institucional mediante su API.',
          grupo: 'compatibilidad',
          porQue: 'Interoperabilidad: intercambia información con otro producto siguiendo un contrato acordado.',
        },
        {
          texto: 'La app se instala en los equipos de la sala 2, que tienen 4 GB de RAM, sin necesidad de configuración manual.',
          grupo: 'portabilidad',
          porQue: 'Facilidad de instalación en un entorno con restricciones de hardware.',
        },
        {
          texto: 'La nueva versión del sistema reemplaza a la anterior conservando los datos y sin reentrenar a los usuarios.',
          grupo: 'portabilidad',
          porQue: 'Capacidad de reemplazo: sustituir otro producto (o una versión previa) con el mismo propósito en el mismo entorno.',
        },
        {
          texto: 'Tras una caída de energía, el sistema vuelve a operar en menos de 5 minutos y sin perder reservas.',
          grupo: 'disponibilidad',
          porQue: 'Capacidad de recuperación, subcaracterística de fiabilidad. Se mide con el tiempo medio de recuperación.',
        },
      ],
      remate: {
        pregunta: '¿Cuál es la pregunta que separa compatibilidad de portabilidad en un caso dudoso?',
        opciones: [
          '¿Aparecen dos programas distintos mencionados en el enunciado?',
          '¿El sistema tiene que intercambiar o convivir con otro producto (compatibilidad), o tiene que funcionar en otro entorno (portabilidad)?',
          '¿El cambio lo hace el usuario o el administrador?',
          '¿El sistema está en la nube o instalado localmente?',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Es precisamente la trampa: «abre en Excel y en LibreOffice» menciona dos programas y es compatibilidad, mientras que «corre en Windows y Ubuntu» también menciona dos y es portabilidad.',
          2: 'Quién ejecuta la acción no cambia la característica afectada.',
          3: 'El modo de despliegue es independiente de las dos características.',
        },
        explicacion:
          'Intercambio o convivencia → compatibilidad. Mudanza de entorno → portabilidad. Con esa pregunta se resuelven todos los casos de la actividad, incluidos los dos que mencionan dos programas.',
      },
      pistas: [
        'Si el enunciado habla de datos que pasan de un sistema a otro, o de dos sistemas compartiendo un servidor, es compatibilidad.',
        'Si el enunciado habla de instalar, mudar, adaptar o reemplazar, es portabilidad.',
        'Si el enunciado habla de tiempo fuera de servicio o de recuperarse de una caída, no es ninguna de las dos.',
      ],
      explicacion:
        'Los dos casos diseñados para confundir son el del CSV y el de Windows/Ubuntu: ambos mencionan dos productos. El primero es compatibilidad porque hay información viajando entre productos; el segundo es portabilidad porque lo que viaja es la aplicación misma. La disponibilidad se cuela en la lista porque en los parciales suele mezclarse con ellas, aunque pertenece a fiabilidad.',
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'e3-a4-conexion',
      tipo: 'caso',
      nivel: 'base',
      puntos: 110,
      titulo: 'Se cayó la conexión',
      objetivo: 'Decidir cómo debe responder una aplicación cuando pierde la red a mitad de una operación.',
      instrucciones: 'Elige la respuesta y observa su consecuencia.',
      conceptoPrevio: 'Robustez ante fallas del entorno y manejo de errores.',
      conceptos: ['robustez', 'disponibilidad'],
      escenario:
        'Un estudiante llenó el formulario de reserva —seis campos— y presionó «Guardar». En ese momento pierde la señal del wifi del campus. El servidor nunca recibió la solicitud.',
      decisiones: [
        {
          id: 'blanco',
          texto: 'Mostrar una pantalla en blanco mientras se reintenta indefinidamente.',
          acertada: false,
          consecuencia:
            'El estudiante ve una pantalla vacía sin saber si la reserva se creó. Espera dos minutos, cierra la app y vuelve a entrar. No sabe si tiene una reserva, dos o ninguna, así que vuelve a llenar el formulario por si acaso.',
          porQue:
            'Reintentar sin informar es peor que fallar: el usuario no puede tomar ninguna decisión y termina generando duplicados por precaución.',
        },
        {
          id: 'error-seco',
          texto: 'Mostrar «Error de red» y volver al formulario vacío.',
          acertada: false,
          consecuencia:
            'El estudiante entiende que falló, pero perdió los seis campos. Vuelve a llenarlos. Si la señal sigue inestable, pierde el trabajo otra vez y abandona.',
          porQue:
            'Es honesto —no miente sobre el resultado— pero traslada al usuario el costo de una falla del entorno. La información que él ya aportó no tenía por qué perderse.',
        },
        {
          id: 'falso-ok',
          texto: 'Mostrar «Reserva guardada» y sincronizar después, cuando vuelva la señal.',
          acertada: false,
          consecuencia:
            'El estudiante se va tranquilo. Al llegar a la sala, otro grupo la está usando: la sincronización posterior falló porque alguien más reservó primero, y la app ya había dicho que estaba guardada.',
          porQue:
            'Nunca se confirma una escritura que no ocurrió. En operaciones donde otro usuario puede tomar el recurso primero, prometer éxito por adelantado produce exactamente el conflicto que el sistema existía para evitar.',
        },
        {
          id: 'pendiente',
          texto:
            'Conservar lo escrito, informar que no hay conexión, dejar el envío en cola y mostrar el estado «Pendiente de envío» hasta confirmarlo.',
          acertada: true,
          consecuencia:
            'El estudiante ve que su formulario sigue completo y que la reserva quedó pendiente. Cuando vuelve la señal, la app reintenta y el estado cambia a «Guardado» con la confirmación del servidor. Si el reintento falla porque otro tomó la sala, se lo dice con el formulario todavía lleno para elegir otra.',
          porQue:
            'Es la única opción que no pierde trabajo del usuario y no afirma nada falso. El estado intermedio —«Pendiente»— es información honesta: el usuario sabe exactamente en qué punto está.',
        },
      ],
      pistas: [
        'Descarta primero la que le miente al usuario sobre el resultado, aunque sea la que se siente mejor en el momento.',
        'De las que quedan, pregúntate cuál conserva el trabajo que el usuario ya hizo.',
        'La respuesta correcta introduce un tercer estado además de «guardado» y «error».',
      ],
      explicacion:
        'Tres estados, no dos: guardando, guardado y pendiente de sincronización. La opción del falso «guardado» es la más peligrosa porque es la que mejor se siente en el momento y la que produce el peor resultado después. Esta misma aplicación aplica la regla: cuando registras un intento sin conexión, verás «Pendiente de sincronización» y no «Guardado», y el envío se reintenta con un identificador que impide que se cuente dos veces.',
    },

    /* ------------------------------------------------------------------ 5 */
    {
      id: 'e3-a5-tabla',
      tipo: 'tabla-pruebas',
      nivel: 'base',
      puntos: 130,
      titulo: 'Diseña las pruebas',
      objetivo: 'Construir una tabla de casos de prueba con entrada, resultado esperado y motivo.',
      instrucciones:
        'Completa la tabla para la regla que aparece arriba. Para cada fila elige el resultado esperado y el motivo que corresponde. La tabla no se califica por opinión: cada fila tiene una única combinación coherente con las reglas.',
      conceptoPrevio: 'Clases de entrada y fronteras.',
      conceptos: ['frontera', 'validacion', 'defecto'],
      regla:
        'Campo «Duración en horas» de una reserva: número, mínimo 1, máximo 2, se permite 1,5. Obligatorio. Cualquier otro valor se rechaza con un mensaje que indique el rango.',
      resultados: [
        { id: 'acepta', texto: 'Acepta' },
        { id: 'rechaza-rango', texto: 'Rechaza: fuera del rango 1 a 2' },
        { id: 'rechaza-tipo', texto: 'Rechaza: no es un número' },
        { id: 'rechaza-vacio', texto: 'Rechaza: campo obligatorio' },
      ],
      motivos: [
        { id: 'normal', texto: 'Caso normal' },
        { id: 'frontera-int', texto: 'Frontera interna (último valor válido)' },
        { id: 'frontera-ext', texto: 'Frontera externa (primer valor inválido)' },
        { id: 'tipo', texto: 'Tipo incorrecto' },
        { id: 'ausente', texto: 'Dato ausente' },
      ],
      filas: [
        { entrada: '1,5', resultado: 'acepta', motivo: 'normal', porQue: 'Está dentro del rango y el enunciado permite explícitamente el medio punto. Es el caso típico.' },
        { entrada: '1', resultado: 'acepta', motivo: 'frontera-int', porQue: 'Primer valor válido: si el código usó > en vez de >=, este caso falla.' },
        { entrada: '2', resultado: 'acepta', motivo: 'frontera-int', porQue: 'Último valor válido: si el código usó < en vez de <=, este caso falla.' },
        { entrada: '0,5', resultado: 'rechaza-rango', motivo: 'frontera-ext', porQue: 'Justo por debajo del mínimo. Rechazo por rango, no por tipo: 0,5 sí es un número.' },
        { entrada: '2,5', resultado: 'rechaza-rango', motivo: 'frontera-ext', porQue: 'Justo por encima del máximo. Mismo criterio que el anterior.' },
        { entrada: 'dos', resultado: 'rechaza-tipo', motivo: 'tipo', porQue: 'No es un número. El mensaje debe distinguir esto del rechazo por rango: el usuario necesita saber qué corregir.' },
        { entrada: '(vacío)', resultado: 'rechaza-vacio', motivo: 'ausente', porQue: 'Ausencia de dato en un campo obligatorio. Es una clase distinta de las anteriores y necesita su propio mensaje.' },
      ],
      pistas: [
        'Los rechazos no son todos iguales: uno es por rango, otro por tipo y otro por ausencia. Cada uno necesita un mensaje distinto porque el usuario debe corregir cosas distintas.',
        'Fíjate en 0,5 y 2,5: son números válidos como tipo; lo que falla es el rango.',
        '«Frontera interna» es el último valor que SÍ se acepta; «frontera externa» es el primero que NO.',
      ],
      explicacion:
        'Siete filas para un solo campo, y la tabla sigue sin cubrirlo todo (faltaría el desbordamiento y las entradas con espacios). La disciplina que importa es la columna «motivo»: obliga a decir por qué está cada caso, y por eso revela de inmediato si la tabla tiene tres casos que prueban lo mismo o si falta una clase entera. Una tabla de pruebas sin la columna de motivo se convierte en una lista de ocurrencias.',
    },

    /* ------------------------------------------------------------------ 6 */
    {
      id: 'e3-a6-disponibilidad',
      tipo: 'calcular',
      nivel: 'opcional',
      puntos: 90,
      titulo: 'Cuánto es un nueve más',
      objetivo: 'Traducir un porcentaje de disponibilidad a tiempo real de caída.',
      instrucciones: 'Usa un mes de 30 días. Redondea a minutos enteros.',
      conceptoPrevio: 'Disponibilidad como proporción del tiempo operativo.',
      conceptos: ['disponibilidad'],
      datos: {
        encabezados: ['Dato', 'Valor'],
        filas: [
          ['Días del mes', '30'],
          ['Horas por día', '24'],
          ['Minutos totales del mes', '43.200'],
        ],
        nota: 'El compromiso se mide 24×7, sin ventanas de mantenimiento excluidas.',
      },
      formulas: [
        'Minutos del mes = 30 × 24 × 60 = 43.200',
        'Caída máxima permitida = minutos del mes × (100 − disponibilidad) ÷ 100',
      ],
      campos: [
        {
          id: 'd995',
          etiqueta: 'Caída máxima con 99,5 % (en minutos)',
          respuestas: ['216'],
          tolerancia: 1,
          porQueNo: '43.200 × 0,005 = 216 minutos, es decir 3 h 36 min.',
        },
        {
          id: 'd999',
          etiqueta: 'Caída máxima con 99,9 % (en minutos)',
          respuestas: ['43.2', '43,2', '43'],
          tolerancia: 0.5,
          porQueNo: '43.200 × 0,001 = 43,2 minutos.',
        },
        {
          id: 'factor',
          etiqueta: 'Cuántas veces menos caída permite 99,9 % frente a 99,5 %',
          respuestas: ['5'],
          tolerancia: 0.1,
          porQueNo: '216 ÷ 43,2 = 5. Cada paso de 99,5 a 99,9 reduce la caída permitida a la quinta parte.',
        },
      ],
      pistas: [
        'Un mes de 30 días tiene 43.200 minutos. Ese número es el que multiplicas.',
        'El porcentaje de caída permitido es 100 menos la disponibilidad: 0,5 % y 0,1 %.',
        'Para el factor, divide la caída permitida mayor entre la menor.',
      ],
      explicacion:
        'De 99,5 % a 99,9 % la caída permitida pasa de 3 h 36 min a 43 minutos al mes: cinco veces menos margen. Por eso cada nueve adicional multiplica el costo, y por eso un compromiso de disponibilidad sin ventana declarada no significa nada: «99,9 % en horario de biblioteca» permite mucho más tiempo de caída real que «99,9 % 24×7», porque las horas de la noche no cuentan.',
    },

    /* ------------------------------------------------------------------ 7 */
    {
      id: 'e3-a7-reporte',
      tipo: 'orden',
      nivel: 'opcional',
      puntos: 80,
      titulo: 'Anatomía de un reporte de defecto',
      objetivo: 'Ordenar las partes de un reporte de defecto útil.',
      instrucciones:
        'Organiza las secciones de un reporte de defecto de modo que quien lo lea pueda reproducirlo sin preguntarte nada.',
      conceptoPrevio: 'Un reporte de defecto contiene pasos, resultado esperado y resultado observado.',
      conceptos: ['defecto'],
      items: [
        { id: 'titulo', texto: 'Título: una frase que identifica el defecto («El campo Cantidad acepta 6 reservas»)' },
        { id: 'entorno', texto: 'Entorno: versión, navegador, sistema operativo y usuario con el que se probó' },
        { id: 'pasos', texto: 'Pasos para reproducir, numerados y con los datos exactos usados' },
        { id: 'esperado', texto: 'Resultado esperado, citando la regla o el requisito que lo respalda' },
        { id: 'observado', texto: 'Resultado observado, con el mensaje o la pantalla que apareció' },
        { id: 'evidencia', texto: 'Evidencia: captura de pantalla o registro del error' },
      ],
      dependencias: [
        ['titulo', 'entorno', 'El título va primero: es lo que se lee en la lista de defectos.'],
        ['entorno', 'pasos', 'Sin saber en qué entorno se probó, los pasos pueden no reproducir nada.'],
        ['pasos', 'esperado', 'Primero se dice cómo llegar al punto; después qué debía pasar ahí.'],
        ['esperado', 'observado', 'El contraste solo tiene sentido si antes se dijo qué se esperaba.'],
        ['observado', 'evidencia', 'La evidencia respalda lo observado, así que va después.'],
      ],
      pistas: [
        'El orden sigue la pregunta que se hace quien va a corregirlo: qué es, dónde pasó, cómo lo reproduzco, qué debía pasar, qué pasó.',
        'La evidencia nunca va primero: sin contexto, una captura de pantalla no dice nada.',
      ],
      explicacion:
        'La pareja esperado/observado es el corazón del reporte y la parte que más se omite. «No funciona» no es un reporte porque no dice qué se esperaba, así que quien lo lee no puede saber si hay defecto o si el reportante entendió mal la función. Citar la regla en el resultado esperado evita además la discusión más común del oficio: si eso es un defecto o el comportamiento acordado.',
    },
  ],

  reto: {
    id: 'e3-reto',
    tipo: 'secuencia',
    nivel: 'base',
    puntos: 150,
    titulo: 'Poner a prueba una función nueva',
    objetivo: 'Recorrer el ciclo completo: leer la regla, diseñar los casos, ejecutar y reportar.',
    instrucciones: 'Cuatro pasos sobre una función nueva del sistema de reservas.',
    conceptoPrevio: 'Toda la estación.',
    conceptos: ['validacion', 'frontera', 'robustez', 'defecto'],
    contexto:
      'Se agrega la función «Prestar proyector». Regla: un estudiante puede prestar un proyector por un mínimo de 30 minutos y un máximo de 180 minutos, en múltiplos de 30. El campo pide los minutos.',
    pasos: [
      {
        id: 'p1',
        tipo: 'limites',
        conceptos: ['frontera', 'validacion'],
        seccion: { estacion: 'robustez', titulo: 'Diseñar casos límite' },
        instrucciones: 'Paso 1. Elige los valores que probarías para el campo de minutos.',
        regla: { min: 30, max: 180, descripcion: 'Minutos de préstamo: entre 30 y 180, en múltiplos de 30.' },
        valores: [
          { valor: '0', clase: 'frontera', necesario: true, porQue: 'Por debajo del mínimo y además un valor que los usuarios escriben por error.' },
          { valor: '30', clase: 'frontera', necesario: true, porQue: 'Primer valor válido.' },
          { valor: '45', clase: 'invalida', necesario: true, porQue: 'Dentro del rango pero NO múltiplo de 30. Sin este caso, un sistema que ignora la regla de múltiplos pasaría todo lo demás.' },
          { valor: '60', clase: 'normal', necesario: false, porQue: 'Redundante con 90: misma clase de equivalencia.' },
          { valor: '90', clase: 'normal', necesario: true, porQue: 'Caso normal, lejos de los bordes y múltiplo válido.' },
          { valor: '180', clase: 'frontera', necesario: true, porQue: 'Último valor válido: atrapa el error de < en vez de <=.' },
          { valor: '210', clase: 'frontera', necesario: true, porQue: 'Primer múltiplo de 30 por encima del máximo. Más informativo que 181 porque separa la regla de rango de la de múltiplos.' },
          { valor: '-30', clase: 'invalida', necesario: false, porQue: 'Redundante con 0 para la regla de rango.' },
          { valor: 'una hora', clase: 'invalida', necesario: true, porQue: 'Prueba el tipo: es la única entrada no numérica.' },
        ],
        explicacion:
          'La regla de múltiplos es la que más se olvida, y 45 es el caso que la descubre: está dentro del rango, es un número entero, y aun así debe rechazarse. Cuando una regla tiene dos condiciones (rango y múltiplo), hacen falta casos que violen cada una por separado.',
      },
      {
        id: 'p2',
        tipo: 'quiz',
        conceptos: ['defecto', 'validacion'],
        seccion: { estacion: 'robustez', titulo: 'Fiabilidad y robustez' },
        pregunta:
          'Paso 2. Al probar con 45 el sistema acepta el préstamo y lo registra como 45 minutos. ¿Qué es esto?',
        opciones: [
          'No es un defecto: 45 está dentro del rango permitido.',
          'Es un defecto de adecuación funcional: la regla exige múltiplos de 30 y el sistema no la aplica.',
          'Es un defecto de usabilidad: el campo debió advertir sobre los múltiplos.',
          'Es una mejora pendiente, no un defecto, porque nadie va a pedir 45 minutos.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'El rango es solo una de las dos condiciones de la regla. Cumplir una y violar la otra sigue siendo violar la regla.',
          2: 'Que el campo no advierta es un problema adicional real, pero el defecto principal es que la validación no existe: aunque advirtiera, el sistema seguiría aceptando 45.',
          3: '«Nadie va a pedir eso» es la frase con la que se cierran defectos que después aparecen en producción. Además, la regla existe por algún motivo operativo que el probador no tiene que juzgar.',
        },
        explicacion:
          'El sistema hace algo distinto de lo especificado: es corrección funcional. La opción de usabilidad es tentadora porque describe un problema que también existe, pero confunde la causa con el síntoma: aquí falta la validación, no el aviso.',
      },
      {
        id: 'p3',
        tipo: 'caso',
        conceptos: ['defecto'],
        seccion: { estacion: 'robustez', titulo: 'Indicadores que se usan en la industria' },
        escenario:
          'Paso 3. Al probar con 210 el sistema muestra una pantalla en blanco y la aplicación deja de responder hasta recargarla. ¿Cómo lo reportas?',
        decisiones: [
          {
            id: 'a',
            texto: 'Como el mismo defecto anterior: los dos son problemas de validación del campo minutos.',
            acertada: false,
            consecuencia:
              'El equipo corrige la validación de múltiplos y cierra el reporte. La caída con 210 sigue ocurriendo, porque nadie la vio: quedó escondida dentro de otro reporte.',
            porQue:
              'Agrupar defectos distintos en un reporte hace que se cierre cuando se corrige el primero. Un reporte, un defecto.',
          },
          {
            id: 'b',
            texto: 'Como un defecto aparte, con severidad mayor, indicando pasos exactos, resultado esperado («rechaza: máximo 180») y observado («pantalla en blanco, app no responde»).',
            acertada: true,
            consecuencia:
              'El equipo lo prioriza por encima del anterior: una entrada de usuario que tumba la aplicación es más grave que una validación laxa. Lo reproducen con los pasos, encuentran una excepción sin manejar y la corrigen.',
            porQue:
              'Separar defectos permite priorizarlos por su gravedad real, y el par esperado/observado es lo que hace el reporte reproducible.',
          },
          {
            id: 'c',
            texto: 'No reportarlo todavía: primero probar más valores para entender el patrón completo.',
            acertada: false,
            consecuencia:
              'Se dedican dos horas a caracterizar el defecto. Mientras tanto, el equipo despliega la versión a producción sin saber que existe.',
            porQue:
              'Investigar más es valioso, pero no a costa de retener la información. Se reporta lo que se sabe y se amplía después: un defecto que tumba la app no espera a estar bien caracterizado.',
          },
        ],
        explicacion:
          'Dos principios: un reporte por defecto, y reportar temprano aunque el diagnóstico esté incompleto. La severidad la determina el impacto observado —la app deja de responder—, no lo raro que sea el valor que lo provoca.',
      },
      {
        id: 'p4',
        tipo: 'vf',
        conceptos: ['robustez', 'frontera'],
        seccion: { estacion: 'robustez', titulo: 'Diseñar casos límite' },
        instrucciones: 'Paso 4. Marca verdadero o falso sobre lo que se puede concluir de estas pruebas.',
        afirmaciones: [
          {
            texto: 'Que los siete casos de prueba pasen demuestra que el campo no tiene defectos.',
            verdadero: false,
            explicacion:
              'Las pruebas demuestran la presencia de defectos, nunca su ausencia. Los casos que pasan solo dicen que esas entradas concretas se comportan bien.',
          },
          {
            texto: 'El caso con 45 minutos era necesario porque la regla tiene dos condiciones independientes.',
            verdadero: true,
            explicacion:
              'Rango y múltiplo son condiciones separadas. Un caso que viola solo una de ellas es el único que puede revelar si esa condición se implementó.',
          },
          {
            texto: 'Que la app se caiga con 210 es más grave que aceptar 45, aunque 210 sea un valor menos común.',
            verdadero: true,
            explicacion:
              'La severidad se mide por el impacto, no por la probabilidad. Una caída afecta a todos los usuarios de la sesión; una validación laxa produce un préstamo raro.',
          },
          {
            texto: 'Como 210 es un valor que ningún estudiante escribiría, el defecto puede cerrarse como «no se corrige».',
            verdadero: false,
            explicacion:
              'Es exactamente el razonamiento que lleva defectos a producción. Además, si una entrada tumba la aplicación, el problema no es el valor: es que hay una excepción sin manejar, y otras entradas podrían alcanzarla.',
          },
        ],
        explicacion:
          'La afirmación más importante es la primera: ninguna batería de pruebas demuestra que no hay defectos. Por eso la pregunta útil nunca es «¿ya está probado?» sino «¿qué clases de entrada quedaron sin cubrir?».',
      },
    ],
    explicacion:
      'El ciclo completo de una función nueva: leer la regla con cuidado —incluidas las condiciones que se esconden en una sola frase—, diseñar casos que ataquen cada condición por separado, ejecutar y reportar de forma que otro pueda reproducir sin preguntarte nada.',
  },

  sintesis: {
    puntos: [
      'Toda restricción «entre A y B» exige cuatro casos: A−1, A, B y B+1. Ahí vive el error de < contra <=.',
      'Las entradas se prueban en tres clases: normales, de frontera e inválidas (por tipo, formato o ausencia).',
      'Compatibilidad es intercambiar o convivir con otro producto; portabilidad es funcionar en otro entorno.',
      'Disponibilidad sin ventana declarada no significa nada, y cada nueve adicional multiplica el costo.',
      'Ante una falla de red: conservar el trabajo del usuario, informar con honestidad y nunca confirmar una escritura que no ocurrió.',
      'Un reporte de defecto sin resultado esperado y observado no es un reporte: es una queja.',
      'Las pruebas demuestran la presencia de defectos, nunca su ausencia.',
    ],
    conexion:
      'Esta forma de pensar —qué entradas harían fallar esto— es exactamente la que vas a usar en la estación 5 cuando escribas algoritmos. Los casos de prueba de un algoritmo son las mismas tres clases: el caso normal, el caso límite (la lista vacía, el único elemento, el centinela inmediato) y el caso inválido. Y en la estación 6 el reto final te pedirá proponer entradas de prueba para un caso completo.',
  },

  glosario: ['robustez', 'validacion', 'frontera', 'compatibilidad', 'portabilidad', 'disponibilidad', 'defecto'],

  taller: {
    id: 'e3-taller',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Taller en clase · Reporte de defecto',
    objetivo: 'Encontrar y reportar un defecto real en una aplicación de uso cotidiano.',
    instrucciones: 'En parejas. El entregable va a la plataforma del curso.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Encuentren un defecto real en una aplicación que usen y redáctenlo de modo que otro grupo pueda reproducirlo exactamente, sin preguntarles nada.',
    temas: [
      'Un formulario de la plataforma académica.',
      'Un campo numérico de cualquier app (probando fronteras).',
      'El comportamiento de una app al perder la conexión.',
      'Un buscador con entradas raras (vacío, un solo carácter, símbolos).',
      'Una función de exportar o compartir.',
      'El manejo de tildes y ñ en algún campo de texto.',
    ],
    campos: [
      { id: 'titulo', etiqueta: 'Título del defecto (una frase que lo identifique en una lista)', filas: 1 },
      { id: 'entorno', etiqueta: 'Entorno: app y versión, dispositivo, sistema operativo, navegador', filas: 2 },
      { id: 'pasos', etiqueta: 'Pasos para reproducir, numerados y con los datos exactos usados', filas: 5 },
      { id: 'esperado', etiqueta: 'Resultado esperado y la regla o requisito que lo respalda', filas: 2 },
      { id: 'observado', etiqueta: 'Resultado observado (mensaje exacto o descripción de la pantalla)', filas: 2 },
      { id: 'severidad', etiqueta: 'Severidad propuesta y por qué', filas: 2 },
    ],
    listaChequeo: [
      'Otro grupo puede reproducirlo siguiendo solo lo escrito, sin preguntarnos.',
      'Los pasos incluyen los datos exactos que usamos, no «llenar el formulario».',
      'El resultado esperado cita una regla, no nuestra opinión.',
      'El resultado observado transcribe el mensaje real, no lo parafrasea.',
      'El reporte contiene un solo defecto.',
      'La severidad se justifica por impacto, no por lo raro que sea el caso.',
    ],
    rubrica: [
      'Otro grupo logra reproducir el defecto siguiendo únicamente el reporte. (40 %)',
      'El resultado esperado se apoya en una regla observable y no en una preferencia. (30 %)',
      'El reporte contiene un solo defecto y su severidad está justificada por impacto. (30 %)',
    ],
  },
}
