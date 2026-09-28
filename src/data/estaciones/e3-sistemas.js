import base from '../m3-sistemas.js'

/**
 * Estación 3 · Los sistemas de información (sesión 9).
 *
 * Reemplaza el contenido anterior de robustez/compatibilidad/portabilidad,
 * que ni el propio microcurrículo distinguía con claridad de la sesión 8.
 * Corresponde a la Unidad 2 del microcurrículo: "Los sistemas de información".
 * Nadie había completado actividades de esta estación cuando se hizo el
 * cambio, así que no hay historial de estudiantes que preservar.
 */

export default {
  id: 'sistemas',
  orden: 3,
  sesion: 'Sesión 9',
  titulo: 'Los sistemas de información',
  gancho: 'Una cafetería, un cuerpo humano y una app de mensajería tienen algo en común: los tres son sistemas. Aprende a verlo y vas a poder analizar cualquiera.',

  aprenderas: {
    objetivo:
      'Al terminar podrás desarmar cualquier sistema en sus cuatro piezas, distinguir un sistema manual de uno automatizado, y reconocer los cinco elementos de un sistema de información.',
    puntos: [
      'Identificar la entrada, el proceso, la salida y la retroalimentación de un sistema real.',
      'Distinguir un sistema manual de uno automatizado, más allá de si usa o no una pantalla.',
      'Reconocer los cinco elementos que sostienen cualquier sistema de información.',
      'Analizar un sistema de tu propia vida con el mismo modelo.',
    ],
    duracion: '30 a 40 minutos',
  },

  comprende: base.lecciones,

  profundiza: {
    'Qué hace bueno a un sistema de información': {
      titulo: 'Tipos de sistemas de información, sin memorizar una lista',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Los libros de texto suelen nombrar varios tipos: sistemas transaccionales (registran operaciones del día a día, como una caja registradora), sistemas de apoyo a decisiones (cruzan datos para sugerir qué hacer, como un reporte de qué producto reponer) y sistemas expertos (imitan el criterio de un especialista, como un diagnóstico automático). No hace falta memorizar la lista: lo que importa es notar que todos comparten las mismas cuatro piezas y los mismos cinco elementos que ya viste.',
        },
        {
          t: 'clave',
          titulo: 'El hilo con la Estación 1',
          texto:
            'El "ciclo de vida del desarrollo de sistemas" que menciona el microcurrículo es el mismo proceso de desarrollo que ya viste en la Estación 1 (comunicación, planeación, modelado, construcción, despliegue), aplicado esta vez a construir un sistema de información completo, no solo software.',
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'Del casino del campus a un sistema completo',
    contexto:
      'El casino del campus vende comida a la hora del almuerzo. Vamos a desarmarlo pieza por pieza, con el mismo modelo de toda la estación.',
    pasos: [
      {
        titulo: '1. El objetivo del sistema',
        texto:
          'Que un estudiante pueda pedir y pagar su almuerzo rápido, y que el casino sepa exactamente qué vendió y qué le queda en inventario.',
      },
      {
        titulo: '2. Entrada',
        texto:
          'El pedido que el estudiante indica en pantalla (el plato, la bebida) y el pago, en efectivo o con tarjeta.',
      },
      {
        titulo: '3. Proceso',
        texto:
          'El sistema calcula el total, aplica el descuento si es día de promoción, y descuenta del inventario los ingredientes que se usaron en ese pedido.',
      },
      {
        titulo: '4. Salida',
        texto: 'El recibo que se le entrega al estudiante, y el corte de caja que se genera al cerrar el turno.',
      },
      {
        titulo: '5. Retroalimentación',
        texto:
          'El reporte semanal muestra que el jugo de mora se agota siempre antes del mediodía. Con ese dato, el casino decide pedir más la próxima semana.',
        nota: 'Nota la diferencia con la salida: el recibo resuelve la compra de HOY; el reporte corrige lo que va a pasar la próxima semana.',
      },
      {
        titulo: '6. ¿Manual o automatizado?',
        texto:
          'El inventario se actualiza solo con cada venta: eso es automatizado. Pero el conteo físico de las bandejas se sigue haciendo a mano una vez al mes: en la práctica, es un sistema híbrido, no uno puramente automatizado.',
      },
    ],
    cierre:
      'En seis pasos se desarmó un sistema completo sin haber escrito una línea de código: eso es exactamente lo que vas a practicar ahora, con otros sistemas.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e3-a1-diseccion',
      tipo: 'clasificar',
      nivel: 'base',
      puntos: 140,
      titulo: 'Diseca un sistema real',
      objetivo: 'Reconocer la entrada, el proceso, la salida y la retroalimentación en sistemas cotidianos.',
      instrucciones:
        'Estos hechos vienen de cuatro sistemas distintos del campus. Clasifica cada uno en la pieza del modelo a la que pertenece, sin importar de qué sistema venga.',
      conceptoPrevio: 'Las cuatro piezas de todo sistema: entrada, proceso, salida, retroalimentación.',
      conceptos: ['sistema', 'entrada', 'proceso-sistema', 'salida', 'retroalimentacion'],
      grupos: [
        { id: 'entrada', nombre: 'Entrada' },
        { id: 'proceso', nombre: 'Proceso' },
        { id: 'salida', nombre: 'Salida' },
        { id: 'retro', nombre: 'Retroalimentación' },
      ],
      items: [
        { texto: 'El estudiante indica en pantalla qué plato quiere y cómo va a pagar.', grupo: 'entrada', porQue: 'Es el dato con el que arranca todo lo demás: nada se calcula todavía.' },
        { texto: 'El carné del estudiante se escanea al entrar a la biblioteca.', grupo: 'entrada', porQue: 'Es información que ingresa al sistema, antes de cualquier verificación.' },
        { texto: 'El monitor marca la hora exacta de llegada del estudiante a la tutoría.', grupo: 'entrada', porQue: 'Es el dato crudo que se captura en el momento.' },
        { texto: 'La estudiante entrega el libro que quiere fotocopiar en el mostrador.', grupo: 'entrada', porQue: 'Todavía no se ha hecho nada con esa información: apenas ingresa.' },
        { texto: 'El sistema calcula el total del pedido y aplica el descuento del día.', grupo: 'proceso', porQue: 'Es una transformación: toma un dato y lo convierte en otro.' },
        { texto: 'El sistema verifica si el carné pertenece a un estudiante activo.', grupo: 'proceso', porQue: 'Es una comprobación, no un resultado final todavía.' },
        { texto: 'Se calcula cuántas tutorías lleva el estudiante en el semestre.', grupo: 'proceso', porQue: 'Es un cálculo interno, no lo que finalmente se le entrega a alguien.' },
        { texto: 'Se cuentan las páginas para calcular el costo de la fotocopia.', grupo: 'proceso', porQue: 'Convierte una entrada (el libro) en un valor a cobrar.' },
        { texto: 'Se imprime el recibo con el total a pagar.', grupo: 'salida', porQue: 'Es el resultado final que recibe la persona que hizo la compra.' },
        { texto: 'La puerta de la biblioteca se abre y deja pasar al estudiante.', grupo: 'salida', porQue: 'Es la consecuencia final y visible de todo el proceso de verificación.' },
        { texto: 'Se entrega la constancia de asistencia a la tutoría.', grupo: 'salida', porQue: 'Es lo que la persona se lleva como resultado de ese trámite puntual.' },
        { texto: 'Se entrega la fotocopia ya lista para llevar.', grupo: 'salida', porQue: 'Es el producto final de ese trámite, lo que la persona vino a buscar.' },
        { texto: 'Un reporte semanal muestra que el jugo de mora se agota antes del mediodía.', grupo: 'retro', porQue: 'No resuelve el pedido de nadie: sirve para ajustar cuánto pedir la próxima semana.' },
        { texto: 'La coordinación nota que los lunes casi nadie va a las tutorías y cambia el horario.', grupo: 'retro', porQue: 'Es información sobre el desempeño del sistema, usada para corregirlo.' },
        { texto: 'El encargado de la fotocopiadora nota que se traba siempre con hojas tamaño oficio y pide revisión técnica.', grupo: 'retro', porQue: 'Es una observación sobre cómo se está comportando el sistema, no un resultado para un usuario puntual.' },
        { texto: 'La biblioteca revisa qué libros nunca se prestan y decide dejar de comprar esa colección.', grupo: 'retro', porQue: 'Ajusta una decisión futura a partir del comportamiento observado, no resuelve un préstamo puntual.' },
      ],
      pistas: [
        'Si el hecho describe algo que la persona hace ANTES de que el sistema calcule nada, es entrada.',
        'Si describe un cálculo o una verificación interna, es proceso.',
        'Si es lo último que recibe la persona que inició el trámite, es salida.',
        'Si sirve para decidir algo distinto en el futuro, sin resolver el trámite de hoy, es retroalimentación.',
      ],
      explicacion:
        'La trampa más común es confundir salida con retroalimentación: las dos son "algo que el sistema produce", pero la salida resuelve lo que la persona pidió HOY, mientras que la retroalimentación ajusta lo que el sistema va a hacer DESPUÉS. El recibo de la fotocopia es salida; que el técnico decida revisar la máquina por las fallas repetidas es retroalimentación.',
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e3-a2-manual-auto',
      tipo: 'clasificar',
      nivel: 'base',
      puntos: 120,
      titulo: 'Manual o automatizado',
      objetivo: 'Distinguir un sistema manual de uno automatizado más allá de si usa pantalla o papel.',
      instrucciones:
        'La misma papelería puede trabajar de dos formas. Clasifica cada característica según a cuál de las dos corresponde.',
      conceptoPrevio: 'Un sistema automatizado ejecuta las reglas de decisión solo; uno manual las deja en manos de una persona.',
      conceptos: ['sistema-automatizado'],
      grupos: [
        { id: 'manual', nombre: 'Manual' },
        { id: 'automatizado', nombre: 'Automatizado' },
      ],
      items: [
        { texto: 'El inventario se actualiza al instante con cada venta registrada.', grupo: 'automatizado', porQue: 'La actualización ocurre sola, sin que nadie la escriba a mano.' },
        { texto: 'Las órdenes de compra se archivan en carpetas físicas.', grupo: 'manual', porQue: 'La información vive en papel, sin respaldo electrónico.' },
        { texto: 'El sistema avisa automáticamente cuando un producto llega al mínimo de existencias.', grupo: 'automatizado', porQue: 'La regla de "avisar cuando esté bajo" la ejecuta el sistema, nadie la revisa a diario.' },
        { texto: 'El encargado decide reordenar mirando qué tan vacío se ve el estante.', grupo: 'manual', porQue: 'La decisión la toma una persona, a criterio, no una regla programada.' },
        { texto: 'Tres sucursales consultan los mismos datos al mismo tiempo.', grupo: 'automatizado', porQue: 'Requiere una base de datos centralizada que se sincroniza sola.' },
        { texto: 'Los movimientos se anotan a mano en un libro de control.', grupo: 'manual', porQue: 'No hay ningún cálculo ni regla ejecutándose: solo un registro escrito.' },
        { texto: 'El conteo de existencias se hace físicamente una vez al mes.', grupo: 'manual', porQue: 'Es una persona contando uno por uno, no un proceso continuo del sistema.' },
        { texto: 'El sistema calcula el total con IVA y aplica el descuento sin que nadie lo escriba.', grupo: 'automatizado', porQue: 'La regla de cálculo la aplica el sistema solo, con cada venta.' },
      ],
      pistas: [
        'Pregúntate: si nadie mira la pantalla hoy, ¿la regla se aplica igual? Si sí, es automatizado.',
        'Que algo esté "en el computador" no basta: si una persona decide caso por caso, sigue siendo manual.',
        'Hay cuatro de cada tipo.',
      ],
      explicacion:
        'La trampa de esta actividad es "está en una hoja de cálculo, entonces ya es automatizado". No es así: lo que define la automatización es que la REGLA de decisión —no solo el dato— la ejecute el sistema sin depender de que alguien la aplique cada vez.',
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'e3-a3-elementos',
      tipo: 'clasificar',
      nivel: 'base',
      puntos: 130,
      titulo: 'Los cinco elementos de un sistema de información',
      objetivo: 'Ubicar hardware, software, datos, procedimientos y personas en un caso concreto.',
      instrucciones: 'Cada frase describe una parte del sistema de ventas de una tienda de útiles. Clasifícala en el elemento correcto.',
      conceptoPrevio: 'Los cinco elementos de un sistema de información: hardware, software, datos, procedimientos, personas.',
      conceptos: ['elementos-si'],
      grupos: [
        { id: 'hardware', nombre: 'Hardware' },
        { id: 'software', nombre: 'Software' },
        { id: 'datos', nombre: 'Datos' },
        { id: 'procedimientos', nombre: 'Procedimientos' },
        { id: 'personas', nombre: 'Personas' },
      ],
      items: [
        { texto: 'El computador del mostrador y el lector de código de barras.', grupo: 'hardware', porQue: 'Es el equipo físico que se puede tocar.' },
        { texto: 'El servidor donde queda guardada toda la información de la tienda.', grupo: 'hardware', porQue: 'También es equipo físico, aunque esté en otro lugar.' },
        { texto: 'El sistema operativo instalado en el computador del mostrador.', grupo: 'software', porQue: 'Es un programa: no se puede tocar, corre sobre el hardware.' },
        { texto: 'El programa de ventas que calcula el total de cada compra.', grupo: 'software', porQue: 'Es la aplicación que ejecuta la lógica del negocio.' },
        { texto: 'La lista de precios de los productos.', grupo: 'datos', porQue: 'Es información almacenada, no un programa ni un equipo.' },
        { texto: 'El registro de las ventas del día.', grupo: 'datos', porQue: 'Es información capturada por el sistema, lista para consultarse.' },
        { texto: 'La regla de que todo reembolso mayor a $50.000 lo debe autorizar la administradora.', grupo: 'procedimientos', porQue: 'Es una norma de cómo se debe usar el sistema, no un dato ni un programa.' },
        { texto: 'El paso a paso para abrir la caja registradora cada mañana.', grupo: 'procedimientos', porQue: 'Describe cómo se opera el sistema, no qué guarda ni qué equipo usa.' },
        { texto: 'La cajera que atiende a los clientes.', grupo: 'personas', porQue: 'Es quien opera el sistema directamente.' },
        { texto: 'El administrador que revisa los reportes de ventas cada semana.', grupo: 'personas', porQue: 'Es quien usa la información que el sistema produce para tomar decisiones.' },
      ],
      pistas: [
        'Si se puede tocar, es hardware. Si es un programa que corre sobre ese equipo, es software.',
        'Si es información guardada, es dato. Si es una regla de cómo actuar, es procedimiento.',
        'Hay dos de cada elemento.',
      ],
      explicacion:
        'El error más común es confundir "datos" con "procedimientos": un dato es información (la lista de precios), un procedimiento es una regla de comportamiento (quién autoriza un reembolso). Los dos son necesarios, pero cumplen funciones distintas dentro del sistema.',
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'e3-a4-mitos',
      tipo: 'vf',
      nivel: 'opcional',
      puntos: 90,
      titulo: 'Mitos sobre los sistemas de información',
      objetivo: 'Desarmar afirmaciones que suenan ciertas sobre sistemas y no lo son.',
      instrucciones: 'Marca cada afirmación como verdadera o falsa.',
      conceptoPrevio: 'Toda la estación.',
      conceptos: ['sistema', 'sistema-automatizado', 'elementos-si'],
      afirmaciones: [
        {
          texto: 'Un sistema de información es, en el fondo, solo el software.',
          verdadero: false,
          explicacion: 'El software es uno de cinco elementos. Sin hardware, datos, procedimientos y personas, el software solo no hace nada.',
        },
        {
          texto: 'Pasar los datos de papel a una hoja de Excel ya automatiza el sistema.',
          verdadero: false,
          explicacion: 'Solo cambia dónde vive el dato. Si una persona sigue decidiendo caso por caso, la regla de decisión sigue siendo manual.',
        },
        {
          texto: 'La salida y la retroalimentación pueden ser cosas distintas del mismo sistema.',
          verdadero: true,
          explicacion: 'La salida resuelve el trámite de quien lo pidió; la retroalimentación ajusta el sistema para el futuro. Pueden coexistir sin ser lo mismo.',
        },
        {
          texto: 'Un sistema manual no puede tener buenos procedimientos.',
          verdadero: false,
          explicacion: 'Los procedimientos son reglas de cómo operar, no dependen de que haya o no un computador. Un archivo en papel puede estar perfectamente organizado con procedimientos claros.',
        },
        {
          texto: 'Todo sistema, sin importar su tamaño, se puede describir con las mismas cuatro piezas.',
          verdadero: true,
          explicacion: 'Entrada, proceso, salida y retroalimentación aparecen igual en un cajero automático que en el cuerpo humano: cambia el contenido, no el modelo.',
        },
      ],
      pistas: [
        'Sospecha de cualquier frase que reduzca el sistema a un solo elemento de los cinco.',
        'Dos de las cinco son verdaderas.',
      ],
      explicacion:
        'El patrón detrás de los mitos falsos es el mismo: confundir "tiene computador" con "es automatizado", o confundir "el software" con "todo el sistema". Los cinco elementos y las cuatro piezas son el antídoto contra esa confusión.',
    },
  ],

  reto: {
    id: 'e3-reto',
    tipo: 'secuencia',
    nivel: 'base',
    puntos: 150,
    titulo: 'Desarma el sistema de préstamos de la biblioteca',
    objetivo: 'Aplicar en un solo caso nuevo todo lo trabajado en la estación: piezas, tipo de sistema y elementos.',
    instrucciones: 'Un caso nuevo, la biblioteca del campus. Cada paso depende del anterior.',
    conceptoPrevio: 'Todo lo trabajado en esta estación.',
    conceptos: ['sistema', 'entrada', 'salida', 'retroalimentacion', 'sistema-automatizado', 'elementos-si'],
    contexto:
      'La biblioteca presta libros a los estudiantes. Cada préstamo dura 8 días; si se pasa, genera una multa. El sistema registra quién tiene qué libro y cuándo debe devolverlo.',
    pasos: [
      {
        id: 'p1',
        tipo: 'quiz',
        conceptos: ['entrada'],
        seccion: { estacion: 'sistemas', titulo: 'Las cuatro piezas de todo sistema' },
        pregunta: 'Paso 1. Cuando el estudiante entrega su carné y el libro que quiere llevar, ¿qué pieza del sistema es eso?',
        opciones: [
          'Salida, porque el estudiante se está llevando algo.',
          'Entrada, porque es lo que ingresa al sistema antes de cualquier verificación.',
          'Retroalimentación, porque sirve para mejorar el servicio.',
          'Proceso, porque ya se está decidiendo si se presta o no.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Todavía no ha salido nada del sistema: el estudiante apenas está entregando información.',
          2: 'La retroalimentación ajusta el sistema a futuro; esto es el arranque de un trámite puntual.',
          3: 'El proceso es lo que pasa DESPUÉS de recibir el carné y el libro, no el momento de entregarlos.',
        },
        explicacion: 'Es entrada: el dato ingresa al sistema antes de que ocurra cualquier verificación o cálculo.',
      },
      {
        id: 'p2',
        tipo: 'clasificar',
        conceptos: ['salida', 'retroalimentacion'],
        seccion: { estacion: 'sistemas', titulo: 'Las cuatro piezas de todo sistema' },
        instrucciones: 'Paso 2. Clasifica estos cuatro hechos del sistema de préstamos.',
        grupos: [
          { id: 'proceso', nombre: 'Proceso' },
          { id: 'salida', nombre: 'Salida' },
          { id: 'retro', nombre: 'Retroalimentación' },
        ],
        items: [
          { texto: 'El sistema verifica que el estudiante no tenga otra multa pendiente.', grupo: 'proceso', porQue: 'Es una comprobación interna antes de decidir si se presta el libro.' },
          { texto: 'Se le entrega el libro con la fecha de devolución marcada.', grupo: 'salida', porQue: 'Es el resultado final que el estudiante se lleva.' },
          { texto: 'Un reporte mensual muestra qué libros nunca se prestan.', grupo: 'retro', porQue: 'No resuelve el préstamo de hoy: ajusta qué comprar en el futuro.' },
          { texto: 'Se calcula la fecha exacta de devolución sumando 8 días.', grupo: 'proceso', porQue: 'Es un cálculo interno antes de generar el resultado final.' },
        ],
        pistas: ['Lo que el estudiante se lleva hoy es salida; lo que cambia decisiones futuras es retroalimentación.'],
        explicacion: 'Dos hechos son proceso (verificaciones y cálculos internos), uno es salida (el libro entregado) y uno es retroalimentación (el reporte que orienta compras futuras).',
      },
      {
        id: 'p3',
        tipo: 'quiz',
        conceptos: ['sistema-automatizado'],
        seccion: { estacion: 'sistemas', titulo: 'Sistemas manuales y automatizados' },
        pregunta:
          'Paso 3. La biblioteca calcula la multa sola, apenas el sistema detecta que el libro se devolvió tarde, sin que nadie la escriba a mano. ¿Cómo se clasifica esa parte del sistema?',
        opciones: [
          'Manual, porque un libro es un objeto físico.',
          'Automatizado, porque la regla de calcular la multa la ejecuta el sistema solo.',
          'No se puede saber sin conocer el hardware que usan.',
          'Manual, porque alguien tuvo que programar esa regla alguna vez.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Que el objeto prestado sea físico no define si el sistema que lo administra es manual o automatizado.',
          2: 'Lo que define la automatización es si la regla se ejecuta sola, no qué marca de computador se use.',
          3: 'Que alguien haya programado la regla una vez no la vuelve manual: lo manual es que alguien la aplique cada vez.',
        },
        explicacion:
          'Es automatizado: la regla "si se pasa la fecha, genera multa" se ejecuta sola con cada préstamo, sin que una persona decida caso por caso.',
      },
      {
        id: 'p4',
        tipo: 'quiz',
        conceptos: ['elementos-si'],
        seccion: { estacion: 'sistemas', titulo: 'Los cinco elementos de un sistema de información' },
        pregunta:
          'Paso 4. "Ningún préstamo puede superar los 3 libros por estudiante al mismo tiempo" es una regla que ya existía antes de que la biblioteca tuviera computadores. ¿A qué elemento del sistema de información pertenece?',
        opciones: ['Datos', 'Procedimientos', 'Hardware', 'Personas'],
        correcta: 1,
        porQueNo: {
          0: 'No es información almacenada: es una regla de cómo debe operar el sistema.',
          2: 'No es un equipo físico.',
          3: 'Describe una regla, no a quién opera el sistema.',
        },
        explicacion:
          'Es un procedimiento: una regla de operación que existe independientemente de si el sistema es manual o automatizado. Automatizar solo cambia quién la ejecuta, no si existe.',
      },
    ],
    explicacion:
      'El recorrido completo: identificar la entrada de un trámite, separar proceso de salida y de retroalimentación, decidir si una parte del sistema es manual o automatizada, y reconocer que los procedimientos existen aunque no haya un solo computador de por medio. Son las mismas cuatro preguntas que se pueden hacer sobre cualquier sistema que uses en tu vida diaria.',
  },

  sintesis: {
    puntos: [
      'Todo sistema —una cafetería, un cajero, tu cuerpo— se puede desarmar en las mismas cuatro piezas: entrada, proceso, salida y retroalimentación.',
      'La salida resuelve el trámite de hoy; la retroalimentación ajusta el sistema para el futuro. Son las piezas que más se confunden entre sí.',
      'Automatizar no es "usar computador": es que la regla de decisión la ejecute el propio sistema, no una persona caso por caso.',
      'Un sistema de información necesita cinco elementos completos: hardware, software, datos, procedimientos y personas.',
      'Una buena información es oportuna, relevante, completa y confiable — el mismo espíritu de medir con criterios, no con impresiones, que ya viste con la calidad de software.',
    ],
    conexion:
      'Esta estación es el puente entre las dos anteriores y las que siguen. Ya sabes cómo se construye software (Estación 1) y qué lo hace bueno (Estación 2); ahora sabes qué es, en el fondo, un sistema. En la Estación 5 vas a construir la pieza más pequeña de todas —el algoritmo— que es justamente el corazón del "proceso" del que habla esta estación.',
  },

  glosario: ['sistema', 'entrada', 'proceso-sistema', 'salida', 'retroalimentacion', 'sistema-automatizado', 'elementos-si'],

  taller: {
    id: 'e3-taller',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Taller en clase · Ficha de análisis de un sistema',
    objetivo: 'Aplicar el modelo de las cuatro piezas a un sistema real de tu propia vida.',
    instrucciones:
      'Trabajo individual. Elige un sistema real que conozcas de verdad —tu trabajo, tu casa, un negocio familiar, un club al que perteneces— y analízalo con el mismo modelo de esta estación. El entregable no lo califica esta aplicación: lo revisa el docente.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Describe un sistema real que conozcas bien, con sus cuatro piezas y si es manual o automatizado. Entre mejor lo conozcas, más fácil te va a resultar.',
    ideas: [
      { titulo: 'Un negocio familiar', contexto: 'Una tienda, un restaurante, un taller — cómo reciben pedidos, los procesan y entregan el resultado.' },
      { titulo: 'Un equipo o club deportivo', contexto: 'Cómo se inscriben los jugadores, cómo se arman los horarios de entrenamiento, cómo se avisa un cambio.' },
      { titulo: 'La rutina de tu casa', contexto: 'El sistema de turnos para usar la lavadora, o de quién cocina cada día — sí cuenta como sistema.' },
      { titulo: 'Un grupo o comunidad en línea', contexto: 'Cómo entra alguien nuevo, cómo se modera el contenido, cómo se sabe si algo salió mal.' },
    ],
    campos: [
      { id: 'sistema', etiqueta: 'Qué sistema elegiste y cuál es su objetivo', filas: 2 },
      { id: 'entrada', etiqueta: 'Entrada: qué información o materia prima ingresa', filas: 2 },
      { id: 'proceso', etiqueta: 'Proceso: qué transformación se le aplica a esa entrada', filas: 2 },
      { id: 'salida', etiqueta: 'Salida: qué resultado final se entrega, y a quién', filas: 2 },
      { id: 'retroalimentacion', etiqueta: 'Retroalimentación: qué información de vuelta ayuda a ajustar el sistema', filas: 2 },
      { id: 'tipo', etiqueta: '¿Es manual, automatizado, o una mezcla de los dos? Justifica con un ejemplo concreto', filas: 3 },
    ],
    listaChequeo: [
      'El sistema que elegiste lo conoces de verdad, no lo inventaste para la tarea.',
      'La salida y la retroalimentación que describiste son cosas distintas entre sí.',
      'La justificación de manual/automatizado da un ejemplo concreto, no solo la palabra.',
    ],
  },
}
