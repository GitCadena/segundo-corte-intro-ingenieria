export default {
  id: 'tic',
  sesion: 'Sesiones 8 y 9',
  titulo: 'Ley de Moore, TIC en la sociedad e implicaciones de la informática',
  gancho: 'El crecimiento exponencial del hardware explica el mundo actual. También explica sus problemas.',
  objetivo:
    'Interpretar la Ley de Moore y sus límites, y analizar las implicaciones sociales, éticas y legales de la informática en el contexto colombiano.',
  lecciones: [
    {
      titulo: 'Qué dice y qué no dice la Ley de Moore',
      cuerpo: [
        {
          t: 'p',
          texto: 'Gordon Moore observó en 1965 que la densidad de transistores por chip se duplica cada cierto periodo. No es una ley física.',
        },
        {
          t: 'lista',
          items: [
            'Dice: la densidad de transistores crece de forma exponencial.',
            'No dice: que la velocidad del procesador se duplique igual.',
            'No dice: que el software vaya a ser más rápido solo.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Qué pasó cuando se frenó',
          texto: 'Al no poder subir la frecuencia, la industria se movió al paralelismo: más núcleos. Aprovecharlos exige programar concurrencia.',
        },
      ],
    },
    {
      titulo: 'Calcular con crecimiento exponencial',
      cuerpo: [
        {
          t: 'codigo',
          etiqueta: 'Fórmula y ejemplo',
          texto: `valor_final = valor_inicial × 2^(t / p)

Ejemplo: 5 000 millones, p = 2 años, t = 6 años
         5 000 × 2^(6/2) = 40 000 millones`,
        },
        {
          t: 'clave',
          titulo: 'La intuición humana falla',
          texto: 'Treinta duplicaciones son mil millones de veces el valor inicial.',
        },
      ],
    },
    {
      titulo: 'Las TIC en la sociedad',
      cuerpo: [
        {
          t: 'lista',
          items: [
            'Brecha digital: acceso, calidad de conexión, dispositivo y competencias para usarlo.',
            'Transformación del trabajo: automatización, teletrabajo, nuevos roles.',
            'Gobierno digital: trámites en línea que excluyen a quien no puede acceder.',
            'Huella ambiental: centros de datos, consumo eléctrico, residuos electrónicos.',
          ],
        },
      ],
    },
    {
      titulo: 'Marco legal colombiano que deben conocer',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Norma', 'Objeto'],
          filas: [
            ['Ley 1273 de 2009', 'Delitos informáticos: acceso abusivo, daño informático, suplantación'],
            ['Ley 1581 de 2012', 'Protección de datos personales: autorización, finalidad, seguridad'],
            ['Ley 1266 de 2008', 'Habeas data financiero y crediticio'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Consecuencia práctica',
          texto: 'Un proyecto que recolecta datos de personas necesita autorización informada y finalidad explícita. Aplica también al proyecto final del curso.',
        },
      ],
    },
    {
      titulo: 'Ética profesional y casos que cambiaron la ingeniería',
      cuerpo: [
        {
          t: 'p',
          texto: 'El interés público está por encima del interés del cliente. Estos casos muestran por qué.',
        },
        {
          t: 'tabla',
          encabezados: ['Caso', 'Lección de ingeniería'],
          filas: [
            ['Therac-25', 'Un mecanismo de seguridad no debe depender de una sola capa.'],
            ['Ariane 5, vuelo 501', 'Reutilizar código exige revalidar el contexto para el que fue escrito.'],
            ['Knight Capital', 'El despliegue debe ser automatizado, verificable y reversible.'],
            ['Boeing 737 MAX', 'Un punto único de falla, con información oculta al usuario, tiene víctimas.'],
          ],
        },
      ],
    },
  ],
  retos: [
    {
      tipo: 'respuesta',
      id: 't-resp-moore1',
      nivel: 'base',
      puntos: 15,
      enunciado:
        'Un procesador integra 8 000 millones de transistores en 2024. Si se mantiene la duplicación cada dos años, ¿cuántos miles de millones tendría en 2030? Responde solo el número en miles de millones.',
      pista: 'Son 6 años, es decir tres duplicaciones.',
      respuestas: ['64'],
      explicacion:
        '8 × 2^(6/2) = 8 × 8 = 64 mil millones. Es un ejercicio de proyección, no una predicción: la duplicación se ha desacelerado y hoy la mejora viene más de empaquetado, especialización y paralelismo que de densidad pura.',
    },
    {
      tipo: 'respuesta',
      id: 't-resp-moore2',
      nivel: 'reto',
      puntos: 25,
      enunciado:
        'Un sistema de sensores genera 2 TB de datos al mes y ese volumen se duplica cada 6 meses. El almacenamiento contratado es de 64 TB. ¿En cuántos meses se llena, si el dato mensual es lo que se acumula ese mes y se mantiene el crecimiento? Considera únicamente el volumen generado en el mes y responde solo el número de meses hasta que el mes supere por primera vez los 64 TB.',
      pista: 'Mes 0: 2 TB. Cada 6 meses se duplica: 4, 8, 16, 32, 64, 128... Busca el primer valor que supera 64.',
      respuestas: ['36'],
      explicacion:
        '2 → 4 (6) → 8 (12) → 16 (18) → 32 (24) → 64 (30) → 128 (36). A los 30 meses iguala los 64 TB y a los 36 los supera. Lo importante no es el número: es que entre "vamos en la mitad" y "se desbordó" pasan seis meses. Por eso la capacidad se planea contra la curva y no contra el consumo actual.',
    },
    {
      tipo: 'quiz',
      id: 't-q1',
      nivel: 'base',
      puntos: 10,
      pregunta: '¿Cuál afirmación sobre la Ley de Moore es correcta?',
      opciones: [
        'Es una ley física que garantiza que los computadores se vuelvan más rápidos.',
        'Es una observación sobre la duplicación de la densidad de transistores, con un periodo de unos dos años.',
        'Predice que el software mejora su rendimiento automáticamente cada año.',
        'Fue formulada por Dennard en los años noventa.',
      ],
      correcta: 1,
      explicacion:
        'Moore la enunció en 1965 y la ajustó en 1975. La relación con la velocidad venía del escalamiento de Dennard, que es un fenómeno distinto y ya se detuvo.',
    },
    {
      tipo: 'quiz',
      id: 't-q2',
      nivel: 'base',
      puntos: 10,
      pregunta:
        'Una aplicación guarda cédulas y correos de estudiantes sin informarles para qué y sin pedir autorización. ¿Qué norma colombiana se está incumpliendo principalmente?',
      opciones: ['Ley 1273 de 2009', 'Ley 1581 de 2012', 'Ley 527 de 1999', 'Ley 1341 de 2009'],
      correcta: 1,
      explicacion:
        'La 1581 regula el tratamiento de datos personales: autorización previa, finalidad informada y medidas de seguridad. La 1273 aplicaría si además hubiera acceso abusivo o divulgación indebida de esos datos.',
    },
    {
      tipo: 'clasificar',
      id: 't-clas-leyes',
      nivel: 'reto',
      puntos: 25,
      enunciado: 'Asigna cada situación a la norma colombiana que la rige de forma más directa.',
      grupos: [
        { id: 'l1273', nombre: 'Ley 1273 (delitos informáticos)' },
        { id: 'l1581', nombre: 'Ley 1581 (datos personales)' },
        { id: 'l527', nombre: 'Ley 527 (mensajes de datos)' },
      ],
      items: [
        { texto: 'Entrar al sistema de notas con la contraseña de otra persona', grupo: 'l1273' },
        { texto: 'Clonar el sitio del banco para capturar credenciales', grupo: 'l1273' },
        { texto: 'Vender la base de correos de los clientes sin su autorización', grupo: 'l1581' },
        { texto: 'Negarse a eliminar los datos de alguien que revocó su autorización', grupo: 'l1581' },
        { texto: 'Discutir si un contrato firmado electrónicamente tiene validez probatoria', grupo: 'l527' },
        { texto: 'Determinar si un correo electrónico equivale a un documento escrito', grupo: 'l527' },
      ],
      explicacion:
        'Un mismo hecho puede activar varias normas a la vez. Vender datos sin autorización infringe la 1581 y, si además hubo sustracción de un sistema, entra la 1273. La pregunta pide la norma más directa, no la única aplicable.',
    },
    {
      tipo: 'quiz',
      id: 't-q3',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Un equipo entrena un modelo que decide qué solicitudes de crédito se aprueban, usando datos históricos de una entidad. ¿Cuál es el riesgo de ingeniería más serio?',
      opciones: [
        'Que el modelo sea lento al responder.',
        'Que reproduzca y amplifique sesgos presentes en las decisiones históricas, sin que nadie pueda explicar un rechazo.',
        'Que use más memoria de la presupuestada.',
        'Que el lenguaje de programación no sea el estándar de la empresa.',
      ],
      correcta: 1,
      explicacion:
        'El riesgo no es técnico en el sentido estrecho: es que el sistema automatice una discriminación existente y la vuelva inauditable. Por eso se exige trazabilidad de la decisión, evaluación de sesgos por subgrupo y un canal de revisión humana.',
    },
    {
      tipo: 'quiz',
      id: 't-q4',
      nivel: 'reto',
      puntos: 20,
      pregunta: '¿Qué tienen en común Therac-25, Ariane 501 y Knight Capital?',
      opciones: [
        'Los tres fueron ataques informáticos externos.',
        'En los tres, un supuesto no verificado sobre el entorno o el estado del sistema llegó a producción sin defensa en profundidad.',
        'Los tres se debieron a lenguajes de programación obsoletos.',
        'Los tres ocurrieron por falta de presupuesto.',
      ],
      correcta: 1,
      explicacion:
        'Condición de carrera con seguros retirados, reutilización de código con supuestos de otro vehículo y un despliegue parcial con código viejo activo: en los tres, el sistema confió en algo que nadie verificó y no había una segunda capa que detuviera la falla.',
    },
    {
      tipo: 'taller',
      id: 't-taller-debate',
      nivel: 'reto',
      puntos: 35,
      enunciado:
        'Debate estructurado en clase. Cada grupo recibe una postura —que puede no ser la propia— y debe sostenerla con argumentos técnicos, no morales genéricos.',
      entregables: [
        'Postura asignada, en una frase, y los tres argumentos que la sostienen.',
        'El mejor argumento de la postura contraria, formulado con honestidad, y su respuesta.',
        'Qué evidencia técnica cambiaría la posición del grupo.',
        'Una recomendación concreta para un equipo que enfrente ese dilema mañana.',
      ],
      rubrica: [
        'Los argumentos referencian consecuencias verificables, no intuiciones.',
        'El contraargumento está formulado en su versión fuerte, no como caricatura.',
        'La recomendación es accionable por un equipo de desarrollo, no por "la sociedad".',
      ],
      temas: [
        'Una app de transporte usa los datos de ubicación de sus usuarios para vender análisis de movilidad a un municipio, de forma anonimizada.',
        'Una universidad usa un sistema automático que detecta si un trabajo fue escrito con IA y reprueba según su resultado.',
        'Una empresa despliega reconocimiento facial en la entrada de un conjunto residencial para reemplazar la portería.',
        'Un equipo descubre una vulnerabilidad grave en el sistema de una entidad pública y debate entre reportarla, publicarla o callarla.',
      ],
    },
  ],
}
