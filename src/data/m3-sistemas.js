export default {
  id: 'sistemas',
  sesion: 'Sesión 9',
  titulo: 'Los sistemas de información',
  gancho: 'Una cafetería, un cuerpo humano y una app de mensajería tienen algo en común: los tres son sistemas. Aprende a verlo y vas a poder analizar cualquiera.',
  objetivo:
    'Reconocer las cuatro piezas de cualquier sistema, distinguir un sistema manual de uno automatizado, e identificar los cinco elementos de un sistema de información.',
  lecciones: [
    {
      titulo: '¿Qué es un sistema?',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Un sistema es un conjunto de elementos relacionados entre sí que trabajan juntos para lograr un objetivo común. No importa si es una cafetería, tu cuerpo o una app: siempre se puede desarmar en las mismas piezas.',
        },
        {
          t: 'clave',
          titulo: 'Definición de trabajo',
          texto: 'Un sistema es un conjunto de elementos en interacción. — Ludwig von Bertalanffy, Teoría general de los sistemas (1968).',
        },
      ],
    },
    {
      titulo: 'Las cuatro piezas de todo sistema',
      cuerpo: [
        {
          t: 'p',
          texto: 'Toda esta estación se resume en cuatro piezas. Aparecen siempre, en cualquier sistema, en cualquier escala.',
        },
        {
          t: 'tabla',
          encabezados: ['Pieza', 'Qué es', 'Ejemplo: un cajero automático'],
          filas: [
            ['Entrada', 'Los datos o la materia prima que ingresan', 'La tarjeta y la clave que el usuario digita'],
            ['Proceso', 'La transformación aplicada a esa entrada', 'Verificar la clave y consultar el saldo disponible'],
            ['Salida', 'El resultado ya procesado que el sistema entrega', 'El dinero entregado y el recibo impreso'],
            ['Retroalimentación', 'Información de retorno sobre el desempeño, para ajustar el sistema', 'El banco nota que ese cajero falla seguido y programa mantenimiento'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Ojo con la retroalimentación',
          texto:
            'Es la pieza que más se confunde con la salida. La salida entrega un resultado a quien lo pidió; la retroalimentación dice si el sistema está funcionando bien y qué habría que corregir. No van al mismo lugar ni cumplen la misma función.',
        },
      ],
    },
    {
      titulo: 'Sistemas manuales y automatizados',
      cuerpo: [
        {
          t: 'p',
          texto:
            'La misma tarea se puede resolver de dos formas. Un sistema manual la resuelve con papel y criterio humano caso por caso; uno automatizado la resuelve con reglas programadas que se ejecutan solas.',
        },
        {
          t: 'tabla',
          encabezados: ['', 'Manual', 'Automatizado'],
          filas: [
            ['Dónde vive la información', 'Libros, carpetas, formatos de papel', 'Bases de datos electrónicas, con respaldo'],
            ['Quién decide', 'Una persona, revisando caso por caso', 'El sistema, siguiendo reglas ya programadas'],
            ['Actualización', 'Por lotes: al final del día, la semana o el mes', 'Al instante, con cada movimiento'],
          ],
        },
        {
          t: 'clave',
          titulo: 'La trampa frecuente',
          texto:
            'Automatizar no es solo "pasarlo a computador". Si los datos están en una hoja de Excel pero sigue siendo una persona la que decide cada caso mirando la pantalla, la decisión sigue siendo manual: lo único que cambió fue dónde se guarda la información.',
        },
      ],
    },
    {
      titulo: 'Los cinco elementos de un sistema de información',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Un sistema de información no es solo el programa. Necesita cinco recursos trabajando juntos; si falta uno, el sistema no funciona completo.',
        },
        {
          t: 'tabla',
          encabezados: ['Elemento', 'Qué incluye', 'Ejemplo: una tienda de útiles'],
          filas: [
            ['Hardware', 'El equipo físico', 'El computador del mostrador y el lector de código de barras'],
            ['Software', 'Los programas que corren en ese equipo', 'El sistema operativo y el programa de ventas'],
            ['Datos', 'La información que se guarda y procesa', 'La lista de precios y las ventas del día'],
            ['Procedimientos', 'Las reglas de cómo se usa el sistema', 'Todo reembolso mayor a $50.000 lo autoriza la administradora'],
            ['Personas', 'Quienes operan y administran el sistema', 'La cajera y quien administra el inventario'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Por qué importan los cinco',
          texto:
            'Un computador sin datos no sirve de nada. Datos sin nadie que los use, tampoco. Un sistema de información completo necesita los cinco elementos al tiempo, no solo el software.',
        },
      ],
    },
    {
      titulo: 'Qué hace bueno a un sistema de información',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Todo sistema de información cumple cuatro funciones básicas: capturar datos, procesarlos, almacenarlos y distribuir el resultado a quien lo necesita.',
        },
        {
          t: 'lista',
          items: [
            'Oportuna: llega a tiempo para que sirva de algo.',
            'Relevante: responde justo lo que se necesitaba saber.',
            'Completa: no le falta una parte que cambiaría la decisión.',
            'Confiable: se puede rastrear de dónde salió y cómo se calculó.',
          ],
        },
        {
          t: 'clave',
          titulo: 'La conexión con la estación anterior',
          texto:
            'Esto es exactamente el mismo principio de la Estación 2: la calidad no es una sensación, se mide con criterios concretos. Aquí los criterios son de la información que el sistema entrega, no del software en sí.',
        },
      ],
    },
  ],
  retos: [],
}
