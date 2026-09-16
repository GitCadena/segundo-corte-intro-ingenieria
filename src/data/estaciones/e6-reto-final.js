/**
 * Estación 6 · Reto final de práctica (preparación para la sesión 11).
 *
 * No es el parcial: es el ensayo. No genera nota académica. El cronómetro es
 * opcional a propósito, porque practicar bajo presión es útil pero aprender
 * bajo presión no lo es.
 */

export default {
  id: 'reto-final',
  orden: 6,
  sesion: 'Preparación sesión 11',
  titulo: 'Reto final de práctica',
  gancho: 'Un caso completo, del problema al algoritmo. Mismo alcance del parcial, sin nota.',

  esRetoFinal: true,
  duracionMinutos: 45,

  aprenderas: {
    objetivo:
      'Comprobar si puedes recorrer solo el camino completo de las cinco estaciones sobre un caso que no habías visto, y saber con precisión qué te falta repasar antes del parcial.',
    puntos: [
      'Interpretar una necesidad y separarla de la solución.',
      'Seleccionar requisitos comprobables.',
      'Identificar problemas de calidad nombrando la característica.',
      'Proponer entradas de prueba que cubran las clases y las fronteras.',
      'Resolver un algoritmo pequeño que pase sus casos.',
      'Revisar una decisión sobre accesibilidad y datos personales.',
    ],
    duracion: '45 minutos con cronómetro, o sin límite',
  },

  comprende: [
    {
      titulo: 'Cómo usar este reto',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Este reto cubre las cinco estaciones del corte con un caso que no aparece en ninguna de ellas. Está pensado como ensayo general del segundo parcial: mismo alcance y mismo tipo de preguntas. No es el examen oficial, no lo reemplaza y no produce una nota académica.',
        },
        {
          t: 'lista',
          items: [
            'Con cronómetro: 45 minutos, para practicar el manejo del tiempo. El reloj no bloquea nada cuando llega a cero; solo lo señala.',
            'Sin cronómetro: el mismo reto, sin reloj. Úsalo la primera vez, y deja el cronómetro para el segundo intento.',
            'Al terminar verás el resultado por concepto, no solo un puntaje, con el enlace a la sección exacta que conviene repasar.',
            'Puedes repetirlo. Se conserva tu mejor resultado, no la suma de los intentos.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Qué mide y qué no',
          texto:
            'Mide si puedes aplicar los conceptos del corte a un caso nuevo. No mide tu nota del parcial, que depende del examen que aplique la docente. Un buen resultado aquí es una señal, no una garantía.',
        },
      ],
    },
  ],

  ejemplo: {
    titulo: 'Cómo se lee el resultado',
    contexto:
      'Antes de empezar conviene saber qué vas a recibir al final, porque el informe por concepto es más útil que el puntaje.',
    pasos: [
      {
        titulo: 'Un puntaje solo no dice qué estudiar',
        texto:
          'Saber que sacaste 420 de 600 no te dice nada accionable. Podrías haber fallado seis preguntas de requisitos o una de cada tema: las dos cosas dan resultados parecidos y exigen repasos completamente distintos.',
      },
      {
        titulo: 'Por eso el informe es por concepto',
        texto:
          'Al terminar verás algo como:\n\nRequisitos comprobables ......... 2 de 2   ✓\nCalidad: características ......... 1 de 2   Repasar estación 2\nPruebas: fronteras ............... 0 de 1   Repasar estación 3\nAlgoritmos: contador/acumulador .. 1 de 1   ✓\nDatos personales: finalidad ...... 1 de 1   ✓\n\nCon eso sabes exactamente qué abrir: la sección «Comprende» de la estación 3 y la actividad de límites.',
      },
      {
        titulo: 'Y cada error trae su explicación',
        texto:
          'Cada paso que falles muestra por qué la respuesta elegida no funciona —no solo cuál era la correcta—, porque el error concreto es más informativo que el acierto. Las opciones incorrectas de este reto están construidas sobre equivocaciones reales, no son absurdos para facilitar el acierto.',
      },
    ],
    cierre:
      'Falla aquí todo lo que puedas: cada error que cometas en este reto es uno que no cometerás en el parcial.',
  },

  actividades: [],

  reto: {
    id: 'e6-reto-final',
    tipo: 'secuencia',
    nivel: 'base',
    puntos: 600,
    titulo: 'Caso completo: préstamo de equipos del laboratorio',
    objetivo: 'Recorrer las seis decisiones del corte sobre un caso nuevo.',
    instrucciones:
      'Seis pasos, uno por cada bloque del corte. Puedes activar el cronómetro de 45 minutos o trabajar sin límite. Al final verás el resultado por concepto.',
    conceptoPrevio: 'Las cinco estaciones anteriores.',
    conceptos: ['requisito', 'verificable', 'calidad', 'frontera', 'algoritmo', 'finalidad'],
    cronometroOpcional: true,
    contexto:
      'El laboratorio de Ingeniería Informática presta equipos (portátiles, proyectores, kits de Arduino). Hoy el monitor anota los préstamos en un cuaderno. Problemas reportados: se pierde el rastro de quién tiene qué, a veces se presta un equipo que ya estaba prestado, y al final del semestre nadie sabe qué equipos faltan. Reglas del laboratorio: un estudiante puede tener máximo 2 equipos prestados a la vez, y el préstamo dura entre 1 y 7 días.',
    pasos: [
      /* ---- 1. Interpretar la necesidad ---- */
      {
        id: 'f1',
        tipo: 'quiz',
        conceptos: ['requisito'],
        seccion: { estacion: 'proceso', titulo: 'Problema, necesidad y solución' },
        pregunta:
          'Paso 1. ¿Cuál enunciado describe el problema sin colarse una solución?',
        opciones: [
          'El laboratorio necesita un sistema de gestión de inventario con código de barras.',
          'No se puede saber en cualquier momento qué equipo tiene cada estudiante ni si un equipo está disponible.',
          'El cuaderno de préstamos es una herramienta obsoleta.',
          'Los estudiantes no devuelven los equipos a tiempo.',
        ],
        correcta: 1,
        porQueNo: {
          0: 'Nombra una solución y hasta una tecnología (código de barras) antes de entender qué falla. Es el error del paso 1 en cualquier proyecto.',
          2: 'Culpa a la herramienta actual. Puede ser cierto y aun así no dice qué necesita el usuario ni permite verificar si se resolvió.',
          3: 'Es un síntoma posible, pero no es lo que reportan: los tres problemas listados hablan de falta de información, no de incumplimiento de plazos.',
        },
        explicacion:
          'El problema se enuncia como una incapacidad: qué no se puede saber o hacer. Los tres problemas reportados —se pierde el rastro, se presta lo prestado, no se sabe qué falta— apuntan todos a lo mismo: la información sobre el estado de los equipos no está disponible cuando se necesita.',
      },

      /* ---- 2. Seleccionar requisitos comprobables ---- */
      {
        id: 'f2',
        tipo: 'clasificar',
        conceptos: ['verificable', 'restriccion'],
        seccion: { estacion: 'proceso', titulo: 'Requisitos que se pueden verificar' },
        instrucciones: 'Paso 2. Clasifica cada enunciado propuesto para el sistema de préstamos.',
        grupos: [
          { id: 'verificable', nombre: 'Requisito comprobable' },
          { id: 'vago', nombre: 'Frase vaga' },
          { id: 'restriccion', nombre: 'Restricción' },
        ],
        items: [
          {
            texto: 'El sistema debe impedir registrar un préstamo de un equipo que ya está prestado.',
            grupo: 'verificable',
            porQue: 'Se puede montar el escenario exacto y observar si el sistema lo impide.',
          },
          {
            texto: 'El sistema debe ser ágil y fácil de manejar para el monitor.',
            grupo: 'vago',
            porQue: 'Ni «ágil» ni «fácil» definen una medición. Con «el monitor registra un préstamo en menos de 30 segundos» sí sería comprobable.',
          },
          {
            texto: 'El préstamo debe registrarse con una duración entre 1 y 7 días; cualquier otro valor se rechaza.',
            grupo: 'verificable',
            porQue: 'Trae el rango exacto y dice qué pasa fuera de él. Es un requisito que se puede probar con fronteras.',
          },
          {
            texto: 'El sistema debe funcionar en el computador del laboratorio, que tiene Windows 10 y 4 GB de RAM.',
            grupo: 'restriccion',
            porQue: 'Limita la solución sin describir ninguna función del sistema.',
          },
          {
            texto: 'El sistema debe mostrar una advertencia cuando un estudiante intente un tercer préstamo simultáneo.',
            grupo: 'verificable',
            porQue: 'Escenario reproducible con un umbral concreto tomado de la regla del laboratorio.',
          },
          {
            texto: 'El tratamiento de los datos de los estudiantes debe cumplir la Ley 1581 de 2012.',
            grupo: 'restriccion',
            porQue: 'Obligación legal impuesta a la solución. Se deriva en requisitos concretos, pero por sí misma limita.',
          },
        ],
        explicacion:
          'Tres comprobables, una vaga y dos restricciones. Los dos requisitos comprobables más fuertes —el límite de 2 equipos y la duración de 1 a 7 días— salen directamente de las reglas del laboratorio que aparecen en el contexto. Cuando un enunciado trae reglas de negocio con números, ahí están tus requisitos verificables.',
      },

      /* ---- 3. Identificar problemas de calidad ---- */
      {
        id: 'f3',
        tipo: 'emparejar',
        conceptos: ['calidad', 'usabilidad', 'adecuacion-funcional'],
        seccion: { estacion: 'calidad', titulo: 'El modelo de calidad del producto' },
        instrucciones:
          'Paso 3. La primera versión ya está en uso. Asigna a cada reclamo la característica de calidad que lo describe.',
        izquierda: [
          { id: 'r1', texto: 'Registré la devolución y el equipo sigue apareciendo prestado.' },
          { id: 'r2', texto: 'Sí se puede ver el historial de un equipo, pero ningún monitor encontró cómo.' },
          { id: 'r3', texto: 'Cualquier estudiante puede consultar qué equipos tiene otro y desde cuándo.' },
          { id: 'r4', texto: 'No hay forma de registrar que un equipo se dañó y salió de circulación.' },
          { id: 'r5', texto: 'Cambiar el límite de 2 a 3 equipos obliga a modificar cinco archivos.' },
        ],
        derecha: [
          { id: 'c1', texto: 'Adecuación funcional · corrección' },
          { id: 'c2', texto: 'Usabilidad · operabilidad' },
          { id: 'c3', texto: 'Seguridad · confidencialidad' },
          { id: 'c4', texto: 'Adecuación funcional · completitud' },
          { id: 'c5', texto: 'Mantenibilidad' },
        ],
        pares: { r1: 'c1', r2: 'c2', r3: 'c3', r4: 'c4', r5: 'c5' },
        porQueNo: {
          r1: 'La función existe y se ejecutó, pero el resultado no corresponde: corrección funcional.',
          r2: 'La función existe y es correcta; el usuario no logra llegar a ella: operabilidad.',
          r3: 'Datos de una persona visibles para quien no debe verlos: confidencialidad.',
          r4: 'La función no existe: completitud funcional. No es usabilidad, porque no hay nada que encontrar.',
          r5: 'El afectado no es el usuario sino quien modifica el sistema: mantenibilidad.',
        },
        explicacion:
          'Los dos primeros y el cuarto son la distinción central de la estación 2: función incorrecta, función escondida y función ausente se confunden constantemente y las arregla gente distinta. El quinto es el único cuyo afectado no es el usuario final, y esa es la señal que identifica mantenibilidad.',
      },

      /* ---- 4. Proponer entradas de prueba ---- */
      {
        id: 'f4',
        tipo: 'limites',
        conceptos: ['frontera', 'validacion'],
        seccion: { estacion: 'robustez', titulo: 'Diseñar casos límite' },
        instrucciones:
          'Paso 4. Elige los valores con los que probarías el campo «Días de préstamo». La regla es: número entero, entre 1 y 7 días.',
        regla: { min: 1, max: 7, descripcion: 'Días de préstamo: número entero, entre 1 y 7 (ambos incluidos).' },
        valores: [
          { valor: '0', clase: 'frontera', necesario: true, porQue: 'Frontera inferior externa: el último valor que debe rechazarse por debajo.' },
          { valor: '1', clase: 'frontera', necesario: true, porQue: 'Frontera inferior interna: el primer valor que debe aceptarse. Atrapa el error de > en vez de >=.' },
          { valor: '4', clase: 'normal', necesario: true, porQue: 'Caso normal, lejos de ambos bordes.' },
          { valor: '5', clase: 'normal', necesario: false, porQue: 'Redundante con 4: misma clase de equivalencia, sin información nueva.' },
          { valor: '7', clase: 'frontera', necesario: true, porQue: 'Frontera superior interna: atrapa el error de < en vez de <=.' },
          { valor: '8', clase: 'frontera', necesario: true, porQue: 'Frontera superior externa: el primer valor que debe rechazarse.' },
          { valor: '3.5', clase: 'invalida', necesario: true, porQue: 'Prueba el formato: está dentro del rango pero no es entero.' },
          { valor: 'una semana', clase: 'invalida', necesario: true, porQue: 'Prueba el tipo: única entrada no numérica de la lista.' },
          { valor: '-5', clase: 'invalida', necesario: false, porQue: 'Redundante con 0 para la regla de rango.' },
          { valor: '1000', clase: 'invalida', necesario: false, porQue: 'Redundante con 8, salvo que se sospeche desbordamiento, que sería otra prueba.' },
        ],
        explicacion:
          'Seis valores necesarios: las cuatro fronteras (0, 1, 7, 8), un caso normal y dos entradas inválidas que atacan el formato y el tipo. Los cuatro descartados no están mal, simplemente repiten una clase ya cubierta. La disciplina consiste en cubrir todas las clases con los menos casos posibles, no en probar mucho.',
      },

      /* ---- 5. Resolver un algoritmo ---- */
      {
        id: 'f5',
        tipo: 'pseudo',
        conceptos: ['algoritmo', 'contador', 'acumulador'],
        seccion: { estacion: 'paradigmas', titulo: 'Las tres estructuras de control' },
        instrucciones:
          'Paso 5. Escribe el algoritmo del informe de fin de semestre. Se ejecuta contra cinco casos de prueba.',
        requisitos: [
          'Lee n y luego n duraciones de préstamo en días (enteros).',
          'Escribe: TOTAL: seguido de la suma de todos los días prestados. Ejemplo exacto: TOTAL: 15',
          'En la segunda línea: LARGOS: seguido de cuántos préstamos duraron 5 días o más.',
          'En la tercera línea: MAXIMO: seguido de la duración más larga.',
          'Si n es 0, las tres salidas son 0.',
        ],
        plantilla: `Algoritmo Informe
	Definir n, i, dias, total, largos, maximo Como Entero
	Leer n
	total <- 0
	largos <- 0
	maximo <- 0
	// procesa aquí
FinAlgoritmo`,
        casos: [
          { descripcion: 'Caso normal', entradas: [5, 2, 6, 1, 7, 3], esperado: ['TOTAL: 19', 'LARGOS: 2', 'MAXIMO: 7'] },
          { descripcion: 'Ninguno largo', entradas: [3, 1, 2, 4], esperado: ['TOTAL: 7', 'LARGOS: 0', 'MAXIMO: 4'] },
          { descripcion: 'Frontera: 5 días exactos SÍ cuenta como largo', entradas: [2, 5, 4], esperado: ['TOTAL: 9', 'LARGOS: 1', 'MAXIMO: 5'] },
          { descripcion: 'Límite: un solo préstamo', entradas: [1, 3], esperado: ['TOTAL: 3', 'LARGOS: 0', 'MAXIMO: 3'] },
          { descripcion: 'Límite: ningún préstamo', entradas: [0], esperado: ['TOTAL: 0', 'LARGOS: 0', 'MAXIMO: 0'] },
        ],
        pistas: [
          'Tres variables sobreviven al ciclo: total (acumulador), largos (contador) y maximo. Las tres ya están inicializadas en la plantilla.',
          '«5 días o más» es >= 5, no > 5. El tercer caso de prueba existe exactamente para comprobarlo.',
          'Con n = 0 el Para no entra ni una vez y las tres variables conservan su valor inicial: por eso ese caso funciona solo si no reinicializas nada adentro.',
        ],
        solucion: `Algoritmo Informe
	Definir n, i, dias, total, largos, maximo Como Entero
	Leer n
	total <- 0
	largos <- 0
	maximo <- 0
	Para i <- 1 Hasta n Hacer
		Leer dias
		total <- total + dias
		Si dias >= 5 Entonces
			largos <- largos + 1
		FinSi
		Si dias > maximo Entonces
			maximo <- dias
		FinSi
	FinPara
	Escribir "TOTAL: ", total
	Escribir "LARGOS: ", largos
	Escribir "MAXIMO: ", maximo
FinAlgoritmo`,
        explicacion:
          'Acumulador, contador y máximo en el mismo ciclo. El caso de 5 días exactos separa >= de >, y el de n = 0 comprueba que el Para evalúa antes de entrar y que nada se reinicializa dentro del ciclo. Son los mismos dos tipos de caso límite que viste en la estación 3, aplicados a un algoritmo.',
      },

      /* ---- 6. Accesibilidad y datos personales ---- */
      {
        id: 'f6',
        tipo: 'caso',
        conceptos: ['finalidad', 'accesibilidad', 'datos-personales'],
        seccion: { estacion: 'tic', titulo: 'Marco legal colombiano que deben conocer' },
        escenario:
          'Paso 6. El laboratorio propone: para agilizar el préstamo, guardar una foto de la cédula de cada estudiante al registrarlo, «así el monitor verifica rápido y queda constancia». Además, la pantalla del monitor señala los préstamos vencidos únicamente pintándolos de rojo.',
        decisiones: [
          {
            id: 'a',
            texto: 'Aceptar las dos cosas: la foto agiliza el trámite y el rojo es claro para cualquiera.',
            acertada: false,
            consecuencia:
              'El sistema acumula imágenes de documentos de identidad de cientos de estudiantes, sin política de tratamiento ni control de acceso. Y el monitor con daltonismo que entró este semestre no distingue los vencidos.',
            porQue:
              'Se aceptan dos problemas distintos a la vez: un dato sensible sin finalidad proporcional y una señal que depende solo del color.',
          },
          {
            id: 'b',
            texto:
              'Rechazar la foto de la cédula —el carné institucional ya identifica y el código estudiantil ya está registrado— y agregar a la señal de color un texto y un icono además del rojo.',
            acertada: true,
            consecuencia:
              'El préstamo se verifica con el carné, que ya existe y no hay que custodiar. Los vencidos aparecen en rojo, con la palabra «VENCIDO» y un icono, así que cualquier monitor los distingue, incluso en la pantalla despintada del laboratorio.',
            porQue:
              'Aplica el principio de finalidad —no se pide un dato que otro ya cubre— y la regla de accesibilidad de no transmitir información solo por color. Los dos cambios cuestan casi nada y eliminan dos riesgos reales.',
          },
          {
            id: 'c',
            texto: 'Aceptar la foto pero guardarla cifrada, y dejar la señal de color como está.',
            acertada: false,
            consecuencia:
              'El dato queda mejor protegido pero sigue sin tener finalidad propia, y la universidad responde por custodiarlo. La barrera de accesibilidad permanece intacta.',
            porQue:
              'Cifrar es una medida de seguridad, no una justificación. El principio de finalidad se resuelve antes: si el dato no hace falta, no se recoge, y así no hay nada que cifrar.',
          },
          {
            id: 'd',
            texto: 'Rechazar solo la señal de color: la foto de la cédula es un dato que la universidad ya tiene.',
            acertada: false,
            consecuencia:
              'Se corrige la accesibilidad. El sistema de préstamos termina con su propia copia de documentos de identidad, que ahora hay que proteger, conservar y suprimir en un sistema que no fue diseñado para eso.',
            porQue:
              'Que la institución ya tenga un dato en otro sistema no autoriza a duplicarlo en uno nuevo. Cada copia multiplica la superficie de riesgo y necesita su propia finalidad.',
          },
        ],
        explicacion:
          'Las dos decisiones son del mismo tipo: técnicas con consecuencias sobre personas. La del color se resuelve con una palabra y un icono; la de la cédula se resuelve preguntando qué función exige ese dato y comprobando que otro ya la cumple. La opción de cifrar es la más tentadora porque suena responsable, y ahí está su lección: la seguridad no sustituye a la finalidad. El dato que no se recoge es el único que no se puede filtrar.',
      },
    ],
    explicacion:
      'Seis pasos, seis bloques del corte, un solo caso. Así es como aparecen estas decisiones en un proyecto real: mezcladas. El informe por concepto que verás ahora te dice cuáles dominas y cuáles conviene repasar antes del parcial.',
  },

  sintesis: {
    puntos: [
      'El problema se enuncia como una incapacidad del usuario, nunca como la ausencia de una herramienta.',
      'Las reglas de negocio con números son la fuente más directa de requisitos comprobables.',
      'Función ausente, función incorrecta y función escondida son tres características de calidad distintas.',
      'Toda restricción «entre A y B» exige cuatro casos de frontera más uno normal, más tipo y formato.',
      'Un algoritmo se comprueba con casos límite: una vuelta, cero vueltas y el valor exacto de la frontera.',
      'El dato que no se recoge es el único que no se puede filtrar, y ninguna información debe transmitirse solo por color.',
    ],
    conexion:
      'Si este reto te salió bien, el parcial cubre lo mismo. Si algo falló, el informe por concepto te dice exactamente qué sección abrir: no vuelvas a leerlo todo, vuelve a lo que falló y repite el reto.',
  },

  glosario: ['requisito', 'verificable', 'calidad', 'frontera', 'algoritmo', 'finalidad'],
}
