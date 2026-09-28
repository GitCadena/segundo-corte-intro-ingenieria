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
      'Al terminar podrás desarmar cualquier sistema en sus cinco piezas, distinguir un sistema manual de uno automatizado, y reconocer los cinco elementos de un sistema de información.',
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
            'Los libros de texto suelen nombrar varios tipos: sistemas transaccionales (registran operaciones del día a día, como una caja registradora), sistemas de apoyo a decisiones (cruzan datos para sugerir qué hacer, como un reporte de qué producto reponer) y sistemas expertos (imitan el criterio de un especialista, como un diagnóstico automático). No hace falta memorizar la lista: lo que importa es notar que todos comparten las mismas cinco piezas y los mismos cinco elementos que ya viste.',
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
      tipo: 'diseca-sistema',
      nivel: 'base',
      puntos: 140,
      titulo: 'Diseca un sistema real',
      objetivo: 'Reconocer la entrada, el proceso, la salida, el control y la retroalimentación de un sistema real.',
      instrucciones:
        'Elige un sistema de la lista y arrastra cada ficha a la pieza a la que pertenece. Puedes cambiar de sistema cuando quieras: para completar la actividad basta con terminar bien uno solo.',
      conceptoPrevio: 'Las cinco piezas de todo sistema: entrada, proceso, salida, control, retroalimentación.',
      conceptos: ['sistema', 'entrada', 'proceso-sistema', 'salida', 'control', 'retroalimentacion'],
      piezas: [
        { id: 'entrada', nombre: 'Entrada', ayuda: 'Lo que llega desde fuera.' },
        { id: 'proceso', nombre: 'Proceso', ayuda: 'Lo que transforma los datos.' },
        { id: 'salida', nombre: 'Salida', ayuda: 'El resultado que se entrega.' },
        { id: 'control', nombre: 'Control', ayuda: 'La regla o acción que regula.' },
        { id: 'retro', nombre: 'Retroalimentación', ayuda: 'Lo que regresa para orientar un ajuste.' },
      ],
      casos: [
        {
          titulo: 'Cajero automático',
          contexto: 'Analiza el servicio de retiro: el cajero y la validación bancaria forman el sistema. Distingue la medición de lo ocurrido de la acción que responde a ella.',
          fichas: [
            ['entrada', 'La persona introduce su tarjeta.', 'La tarjeta aporta los datos iniciales desde el exterior.'],
            ['entrada', 'La persona escribe el monto que desea retirar.', 'La solicitud del usuario ingresa al sistema.'],
            ['proceso', 'Se calcula el saldo que quedaría después del retiro.', 'Se transforman el saldo actual y el monto solicitado mediante un cálculo.'],
            ['proceso', 'Se calcula la combinación de billetes para entregar el monto.', 'Una operación convierte el monto solicitado en cantidades de billetes.'],
            ['salida', 'El cajero entrega los billetes a la persona.', 'El dinero entregado es un resultado que sale del sistema.'],
            ['salida', 'La pantalla muestra el comprobante del retiro.', 'El comprobante comunica el resultado al usuario.'],
            ['control', 'La regla de seguridad bloquea el acceso tras tres claves incorrectas.', 'Es una regla que limita el acceso y regula la operación.'],
            ['control', 'Al recibir una alerta de atasco, el sistema detiene el dispensador.', 'La acción correctiva actúa sobre el proceso para detener un fallo.'],
            ['retro', 'Un sensor informa al sistema que el dispensador está atascado.', 'La medición del estado real regresa al sistema para decidir qué hacer.'],
            ['retro', 'El contador devuelve cuántos billetes salieron para compararlos con lo esperado.', 'El resultado medido vuelve para detectar si la entrega coincidió con la orden.'],
          ],
        },
        {
          titulo: 'Pedidos de una cafetería',
          contexto: 'Analiza el sistema de pedidos y seguimiento de atención, desde el registro hasta la entrega. Incluye la información que usa la administración para corregir el servicio.',
          fichas: [
            ['entrada', 'La cajera registra dos cafés y un sándwich.', 'El pedido introduce datos desde el cliente.'],
            ['entrada', 'El cliente indica que su café debe llevar leche deslactosada.', 'La preferencia es un dato externo que entra al pedido.'],
            ['proceso', 'Se suman los precios y se calcula el descuento del pedido.', 'El cálculo transforma productos y precios en un total.'],
            ['proceso', 'Se agrupan las bebidas y los alimentos para preparar las órdenes de cada estación.', 'Los datos del pedido se organizan para producir órdenes de trabajo.'],
            ['salida', 'Se entrega el pedido preparado al cliente.', 'Los productos entregados son el resultado del servicio.'],
            ['salida', 'El cliente recibe su factura digital.', 'La factura sale del sistema hacia el cliente.'],
            ['control', 'La regla impide confirmar pedidos de productos sin existencias.', 'La restricción evita aceptar una operación que no se puede cumplir.'],
            ['control', 'La administradora abre otra caja cuando la espera supera diez minutos.', 'Es una acción correctiva para regular el tiempo de atención.'],
            ['retro', 'El registro de entrega devuelve el tiempo real de espera para ajustar la atención.', 'La medición del desempeño regresa para orientar mejoras.'],
            ['retro', 'La encuesta comunica que los pedidos llegaron fríos para revisar la preparación.', 'La información posterior al servicio vuelve para corregir su funcionamiento.'],
          ],
        },
        {
          titulo: 'Aplicación de domicilios',
          contexto: 'Analiza la plataforma que recibe pedidos, coordina la entrega y supervisa el servicio. Clientes, restaurantes y repartidores aportan datos a esa plataforma.',
          fichas: [
            ['entrada', 'El cliente escribe la dirección de entrega.', 'La dirección ingresa desde un actor externo.'],
            ['entrada', 'El restaurante envía su menú y sus precios a la plataforma.', 'La información llega desde el restaurante al sistema.'],
            ['proceso', 'Se calcula el precio total con el costo del envío.', 'Se transforman los precios en un total.'],
            ['proceso', 'El algoritmo calcula una ruta entre el restaurante y el destino.', 'Los datos de ubicación se transforman en una ruta.'],
            ['salida', 'La plataforma envía la orden de preparación al restaurante.', 'La orden sale de la plataforma hacia el restaurante.'],
            ['salida', 'La app muestra al cliente la hora estimada de llegada.', 'La estimación se entrega al usuario como resultado.'],
            ['control', 'Una regla impide confirmar un pedido si el pago es rechazado.', 'La condición regula si se permite continuar.'],
            ['control', 'La plataforma reasigna el pedido al recibir una alerta de avería del vehículo.', 'La reasignación es la respuesta correctiva sobre la entrega.'],
            ['retro', 'El repartidor reporta una avería para que la plataforma ajuste la entrega.', 'La información del estado real del servicio vuelve al coordinador.'],
            ['retro', 'La calificación posterior del cliente vuelve al sistema para mejorar el servicio.', 'Es información sobre el resultado usada para ajustar futuras operaciones.'],
          ],
        },
        {
          titulo: 'Préstamos de una biblioteca',
          contexto: 'Analiza el sistema informático de préstamos, devoluciones y seguimiento. Usuarios y personal interactúan con él desde el exterior.',
          fichas: [
            ['entrada', 'La bibliotecaria escanea el código del libro solicitado.', 'El código se introduce al sistema mediante un lector.'],
            ['entrada', 'El estudiante introduce su identificación para solicitar el préstamo.', 'La identificación es un dato que ingresa desde el usuario.'],
            ['proceso', 'Se calcula la fecha de devolución según la duración del préstamo.', 'Se transforma una fecha inicial y un plazo en una fecha límite.'],
            ['proceso', 'Se relaciona el ejemplar prestado con el registro del estudiante.', 'La operación organiza y vincula datos internos.'],
            ['salida', 'Se envía al estudiante el comprobante del préstamo.', 'El comprobante se entrega fuera del sistema.'],
            ['salida', 'La pantalla presenta la lista de préstamos activos que pidió la bibliotecaria.', 'La lista es un resultado presentado a quien consulta.'],
            ['control', 'La regla no permite más de tres préstamos simultáneos por estudiante.', 'El límite regula qué operaciones se autorizan.'],
            ['control', 'El sistema suspende nuevos préstamos al detectar una devolución vencida.', 'La suspensión es una acción reguladora para exigir el cumplimiento.'],
            ['retro', 'La revisión física informa que falta un ejemplar marcado como disponible, para corregir el catálogo.', 'La discrepancia del resultado real regresa para ajustar los datos del sistema.'],
            ['retro', 'El seguimiento informa cuántas devoluciones se retrasaron para ajustar las políticas de préstamo.', 'La medición del desempeño vuelve a quienes regulan el servicio.'],
          ],
        },
        {
          titulo: 'Tutorías de Bienestar Universitario',
          contexto: 'Analiza el sistema de agendamiento y seguimiento de tutorías del campus. Estudiantes y monitores interactúan con él para pedir cupo, tutorearse y mejorar el servicio.',
          fichas: [
            ['entrada', 'El estudiante indica en la app qué materia necesita reforzar.', 'La solicitud del estudiante ingresa al sistema desde fuera.'],
            ['entrada', 'El monitor registra su disponibilidad de horarios en la semana.', 'La disponibilidad es un dato que aporta el monitor al sistema.'],
            ['proceso', 'El sistema empareja al estudiante con un monitor disponible en esa materia.', 'Los datos de solicitud y disponibilidad se combinan para producir una asignación.'],
            ['proceso', 'Se calcula cuántas tutorías lleva el estudiante en el semestre.', 'Un cálculo interno acumula información para producir un conteo.'],
            ['salida', 'El estudiante recibe la confirmación con el monitor, el lugar y la hora.', 'La confirmación es el resultado que se entrega a quien pidió la tutoría.'],
            ['salida', 'El coordinador ve el reporte de tutorías agendadas esta semana.', 'El reporte es un resultado entregado a quien lo consulta.'],
            ['control', 'La regla no permite agendar más de dos tutorías activas por estudiante a la vez.', 'Es un límite que regula qué solicitudes se aceptan.'],
            ['control', 'El sistema cancela automáticamente una tutoría si nadie confirma asistencia diez minutos antes.', 'Es una acción correctiva y programada que regula el uso del recurso.'],
            ['retro', 'El monitor marca si el estudiante faltó, para que el coordinador decida si suspende el beneficio.', 'La información sobre lo ocurrido regresa para orientar una decisión futura.'],
            ['retro', 'La encuesta de satisfacción muestra que casi nadie va los lunes, y se decide cambiar el horario.', 'El resultado medido después del servicio vuelve para ajustar cómo funciona.'],
          ],
        },
      ],
      pistas: [
        'Si el hecho describe algo que llega desde fuera ANTES de que el sistema calcule nada, es entrada.',
        'Si describe un cálculo o una verificación interna, es proceso; si es lo último que recibe quien inició el trámite, es salida.',
        'Si es una regla o una acción que regula el sistema, es control. Si es una medición o un aviso sobre lo que pasó, es retroalimentación.',
        'Primero llega la retroalimentación (se sabe qué pasó); el control es lo que se hace con esa información.',
      ],
      explicacion:
        'Las dos trampas más comunes: confundir salida con retroalimentación (la salida resuelve el trámite de HOY, la retroalimentación ajusta el sistema para DESPUÉS), y confundir control con retroalimentación (la retroalimentación es la señal que avisa que algo pasó; el control es la regla o la acción que responde a esa señal).',
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
          texto: 'Todo sistema, sin importar su tamaño, se puede describir con las mismas cinco piezas.',
          verdadero: true,
          explicacion: 'Entrada, proceso, salida y retroalimentación aparecen igual en un cajero automático que en el cuerpo humano: cambia el contenido, no el modelo.',
        },
      ],
      pistas: [
        'Sospecha de cualquier frase que reduzca el sistema a un solo elemento de los cinco.',
        'Dos de las cinco son verdaderas.',
      ],
      explicacion:
        'El patrón detrás de los mitos falsos es el mismo: confundir "tiene computador" con "es automatizado", o confundir "el software" con "todo el sistema". Los cinco elementos y las cinco piezas son el antídoto contra esa confusión.',
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
        seccion: { estacion: 'sistemas', titulo: 'Las cinco piezas de todo sistema' },
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
        seccion: { estacion: 'sistemas', titulo: 'Las cinco piezas de todo sistema' },
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
      'Todo sistema —una cafetería, un cajero, tu cuerpo— se puede desarmar en las mismas cinco piezas: entrada, proceso, salida, control y retroalimentación.',
      'La retroalimentación informa qué pasó; el control decide qué hacer con esa información. Primero se mide, después se corrige.',
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
    objetivo: 'Aplicar el modelo de las cinco piezas a un sistema real de tu propia vida.',
    instrucciones:
      'Trabajo individual. Elige un sistema real que conozcas de verdad —tu trabajo, tu casa, un negocio familiar, un club al que perteneces— y analízalo con el mismo modelo de esta estación. El entregable no lo califica esta aplicación: lo revisa el docente.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Describe un sistema real que conozcas bien, con sus cinco piezas y si es manual o automatizado. Entre mejor lo conozcas, más fácil te va a resultar.',
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
      { id: 'control', etiqueta: 'Control: qué regla o acción regula el funcionamiento del sistema', filas: 2 },
      { id: 'retroalimentacion', etiqueta: 'Retroalimentación: qué información de vuelta avisa que algo pasó y ayuda a ajustar el sistema', filas: 2 },
      { id: 'tipo', etiqueta: '¿Es manual, automatizado, o una mezcla de los dos? Justifica con un ejemplo concreto', filas: 3 },
    ],
    listaChequeo: [
      'El sistema que elegiste lo conoces de verdad, no lo inventaste para la tarea.',
      'La salida y la retroalimentación que describiste son cosas distintas entre sí.',
      'La justificación de manual/automatizado da un ejemplo concreto, no solo la palabra.',
    ],
  },
}
