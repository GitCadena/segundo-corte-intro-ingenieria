export default {
  id: 'robustez',
  sesion: 'Sesión 9',
  titulo: 'Portabilidad, compatibilidad, robustez y medición',
  gancho: 'El software no falla cuando el usuario hace lo esperado. Falla en los bordes.',
  objetivo:
    'Explicar portabilidad, compatibilidad y fiabilidad con sus subcaracterísticas, y calcular los indicadores que se usan para sustentarlas.',
  lecciones: [
    {
      titulo: 'Portabilidad',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Portabilidad es el grado en que un sistema puede trasladarse de un entorno a otro: otro sistema operativo, otro navegador, otro proveedor de nube, otro hardware.',
        },
        {
          t: 'lista',
          items: [
            'Adaptabilidad: se ajusta a entornos distintos sin cambiar el código. Ejemplo: la configuración vive en variables de entorno y no dentro de las clases.',
            'Instalabilidad: se instala y desinstala de forma confiable en el entorno destino. Un instalador que deja archivos huérfanos falla aquí.',
            'Reemplazabilidad: puede sustituir a otro producto que cumple el mismo propósito, conservando los datos. Es lo que evalúa una entidad cuando cambia de proveedor.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Decisiones que la determinan',
          texto:
            'La portabilidad se define en el diseño, no al final. Rutas absolutas del sistema de archivos, dependencias de una versión específica del sistema operativo, SQL propietario y supuestos sobre zona horaria o codificación de caracteres son las cuatro causas más frecuentes de que un sistema no sea portable.',
        },
      ],
    },
    {
      titulo: 'Compatibilidad',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Compatibilidad es la capacidad de convivir con otros sistemas y de intercambiar información con ellos. Tiene dos subcaracterísticas que se confunden con frecuencia.',
        },
        {
          t: 'tabla',
          encabezados: ['Subcaracterística', 'Definición', 'Ejemplo de falla'],
          filas: [
            [
              'Coexistencia',
              'Comparte recursos con otros sistemas sin afectarlos',
              'Un antivirus que bloquea el puerto que usa la aplicación contable',
            ],
            [
              'Interoperabilidad',
              'Intercambia información y la usa correctamente',
              'El sistema exporta fechas en formato MM/DD y el receptor las lee como DD/MM',
            ],
          ],
        },
        {
          t: 'p',
          texto:
            'La interoperabilidad depende de estándares compartidos: formatos (JSON, XML, CSV), protocolos (HTTP, MQTT), contratos de API (OpenAPI) y estándares de dominio (ISO 20022 en pagos, HL7 FHIR en salud, GTFS en transporte público). Cuando dos sistemas acuerdan un estándar, la integración deja de renegociarse con cada versión.',
        },
      ],
    },
    {
      titulo: 'Fiabilidad y robustez',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Fiabilidad es que el sistema mantenga su nivel de servicio durante un periodo. La robustez es su cara más exigente: cómo se comporta ante entradas inválidas, condiciones extremas o fallas de sus dependencias.',
        },
        {
          t: 'lista',
          items: [
            'Madurez: frecuencia de fallas en operación normal.',
            'Disponibilidad: proporción del tiempo en que el sistema está operativo y accesible.',
            'Tolerancia a fallos: sigue operando, quizá degradado, cuando algo falla. Ejemplo: la app muestra datos en caché si la API no responde.',
            'Capacidad de recuperación: restablece el estado y los datos tras una falla. Se demuestra probando la restauración de respaldos, no teniéndolos.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Robustez en el código',
          texto:
            'Programar de forma robusta es asumir que toda entrada es hostil hasta demostrar lo contrario: validar rango y tipo, no confiar en el orden de llegada, definir qué pasa con cero, con negativos, con cadenas vacías y con valores enormes, y fallar de forma explícita en vez de continuar con datos inválidos.',
        },
      ],
    },
    {
      titulo: 'Indicadores que se usan en la industria',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Indicador', 'Fórmula', 'Lectura'],
          filas: [
            ['Disponibilidad', 'tiempo operativo / tiempo total × 100', '99,9% son unas 43,8 min de caída al mes'],
            ['MTBF', 'tiempo operativo / número de fallas', 'Tiempo medio entre fallas: mide madurez'],
            ['MTTR', 'tiempo total de reparación / número de fallas', 'Tiempo medio de reparación: mide recuperación'],
            ['Densidad de defectos', 'defectos / KLOC', 'Defectos por cada mil líneas de código'],
            ['Cobertura de pruebas', 'líneas ejecutadas por pruebas / líneas totales × 100', 'Alcance de la verificación, no su calidad'],
          ],
        },
        {
          t: 'p',
          texto:
            'Los "nueves" son la forma corta de hablar de disponibilidad: 99% permite 7,2 horas de caída al mes; 99,9% permite 43,8 minutos; 99,99% permite 4,4 minutos. Cada nueve adicional cuesta bastante más que el anterior, así que el nivel se negocia con el cliente y se escribe en un acuerdo de nivel de servicio.',
        },
        {
          t: 'clave',
          titulo: 'Trampa clásica',
          texto:
            'Alta cobertura de pruebas no implica alta corrección funcional. La cobertura solo dice qué porción del código se ejecutó durante las pruebas; si esas pruebas no verifican resultados, el porcentaje es alto y el sistema sigue equivocándose.',
        },
      ],
    },
    {
      titulo: 'Diseñar casos límite',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Dos técnicas cubren la mayoría de los defectos de robustez con muy pocos casos. Clases de equivalencia: se parte el dominio en grupos donde el sistema debería comportarse igual, y se prueba un representante de cada grupo. Valores de frontera: se prueba justo en el límite y en sus vecinos inmediatos, porque ahí viven los errores de comparación.',
        },
        {
          t: 'codigo',
          etiqueta: 'Campo "edad" que acepta de 18 a 65',
          texto: `Clases de equivalencia:  17 (inválido) | 30 (válido) | 70 (inválido)
Valores de frontera:     17, 18, 19  y  64, 65, 66
Entradas hostiles:       vacío, "abc", -5, 3.5, 999999999
Resultado esperado en cada caso: definido ANTES de ejecutar la prueba.`,
        },
      ],
    },
  ],
  retos: [
    {
      tipo: 'clasificar',
      id: 'r-clas-incidentes',
      nivel: 'base',
      puntos: 25,
      enunciado: 'Clasifica cada incidente según la característica de calidad principal que está comprometida.',
      grupos: [
        { id: 'port', nombre: 'Portabilidad' },
        { id: 'comp', nombre: 'Compatibilidad' },
        { id: 'fiab', nombre: 'Fiabilidad' },
      ],
      items: [
        { texto: 'La aplicación funciona en Chrome pero la cámara no abre en Safari', grupo: 'port' },
        { texto: 'El archivo que exporta el sistema no lo puede leer el software contable de la empresa', grupo: 'comp' },
        { texto: 'El servicio se cae cada vez que superan los 500 usuarios simultáneos', grupo: 'fiab' },
        { texto: 'El instalador falla en equipos con Windows en español por una ruta con tilde', grupo: 'port' },
        { texto: 'Al instalarse, bloquea el puerto que usaba otro sistema del mismo servidor', grupo: 'comp' },
        { texto: 'Tras un corte de energía, la base de datos queda con registros a medio escribir', grupo: 'fiab' },
      ],
      explicacion:
        'Si el problema aparece al cambiar de entorno, es portabilidad. Si aparece al convivir o intercambiar con otro sistema, es compatibilidad. Si aparece con el paso del tiempo, la carga o una falla, es fiabilidad.',
    },
    {
      tipo: 'respuesta',
      id: 'r-resp-disp',
      nivel: 'base',
      puntos: 15,
      enunciado:
        'Un servicio estuvo caído 216 minutos durante un mes de 30 días. ¿Cuál fue su disponibilidad en porcentaje, con un decimal? Responde solo el número.',
      pista: 'Un mes de 30 días tiene 43 200 minutos. Disponibilidad = (total − caída) / total × 100.',
      respuestas: ['99.5', '99,5'],
      explicacion:
        '(43200 − 216)/43200 = 0,995 → 99,5%. Suena excelente hasta que se traduce: 3,6 horas sin servicio. Por eso los acuerdos de nivel de servicio se escriben en minutos de caída permitidos y no solo en porcentaje.',
    },
    {
      tipo: 'respuesta',
      id: 'r-resp-mttr',
      nivel: 'reto',
      puntos: 20,
      enunciado:
        'En un trimestre hubo 8 fallas y el equipo acumuló 12 horas reparándolas. ¿Cuál es el MTTR en minutos? Responde solo el número.',
      pista: 'MTTR = tiempo total de reparación / número de fallas. Pasa las horas a minutos.',
      respuestas: ['90'],
      explicacion:
        '12 h = 720 min; 720/8 = 90 minutos por falla. El MTTR mide recuperación; para medir madurez se usa el MTBF. Bajar el MTTR suele ser más barato que subir el MTBF, y por eso se invierte primero en monitoreo y despliegues reversibles.',
    },
    {
      tipo: 'respuesta',
      id: 'r-resp-densidad',
      nivel: 'reto',
      puntos: 20,
      enunciado:
        'Un módulo de 24 000 líneas de código reportó 36 defectos en su primer mes. ¿Cuál es la densidad de defectos por KLOC? Responde solo el número.',
      pista: '24 000 líneas son 24 KLOC.',
      respuestas: ['1.5', '1,5'],
      explicacion:
        '36/24 = 1,5 defectos por cada mil líneas. Sirve para comparar módulos entre sí y priorizar revisiones, pero es una medida frágil: penaliza el código conciso y depende de cuánto se busque. Un módulo con 0 defectos puede significar calidad o que nadie lo probó.',
    },
    {
      tipo: 'quiz',
      id: 'r-q1',
      nivel: 'base',
      puntos: 10,
      pregunta: 'La capacidad de que un sistema reemplace a otro conservando los datos corresponde a:',
      opciones: ['Interoperabilidad', 'Reemplazabilidad', 'Coexistencia', 'Adaptabilidad'],
      correcta: 1,
      explicacion:
        'La reemplazabilidad es una subcaracterística de portabilidad y es determinante en licitaciones: define qué tan atado queda el cliente a un proveedor.',
    },
    {
      tipo: 'quiz',
      id: 'r-q2',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Un equipo presume 92% de cobertura de pruebas, pero producción reporta cálculos errados en los reportes de cierre. ¿Qué explica mejor la contradicción?',
      opciones: [
        'La cobertura no puede ser real si hay defectos.',
        'Las pruebas ejecutan el código pero no verifican los resultados esperados contra un oráculo.',
        'El problema es de portabilidad, no de corrección.',
        'La cobertura solo aplica a pruebas de integración.',
      ],
      correcta: 1,
      explicacion:
        'Es posible tener cobertura alta con aserciones débiles o ausentes. La cobertura mide alcance de ejecución; la corrección exige comparar contra el resultado esperado.',
    },
    {
      tipo: 'quiz',
      id: 'r-q3',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Para un campo que acepta valores entre 1 y 100, ¿cuál conjunto de casos aplica correctamente valores de frontera?',
      opciones: ['1, 50, 100', '0, 1, 2, 99, 100, 101', '-1, 0, 1000', '50 y 51 únicamente'],
      correcta: 1,
      explicacion:
        'El análisis de frontera prueba el límite y sus vecinos a ambos lados, porque los defectos típicos son confundir < con <= o desplazarse en uno. El primer conjunto solo prueba valores válidos y no detectaría un rango mal escrito.',
    },
    {
      tipo: 'pseudo',
      id: 'r-pseudo-validar',
      nivel: 'base',
      puntos: 30,
      enunciado:
        'Escribe un algoritmo robusto que lea una edad y responda según el rango permitido para un trámite: de 18 a 65 años.',
      requisitos: [
        'Lee un valor entero en la variable edad.',
        'Si la edad está entre 18 y 65 inclusive, escribe exactamente: PERMITIDO',
        'Si es menor que 18, escribe exactamente: MENOR DE EDAD',
        'Si es mayor que 65, escribe exactamente: FUERA DE RANGO',
      ],
      plantilla: `Algoritmo ValidarEdad
	Definir edad Como Entero
	Leer edad
	// completa la validación aquí
FinAlgoritmo`,
      casos: [
        { descripcion: 'Dentro del rango', entradas: [30], esperado: ['PERMITIDO'] },
        { descripcion: 'Frontera inferior', entradas: [18], esperado: ['PERMITIDO'] },
        { descripcion: 'Frontera superior', entradas: [65], esperado: ['PERMITIDO'] },
        { descripcion: 'Justo por debajo', entradas: [17], esperado: ['MENOR DE EDAD'] },
        { descripcion: 'Justo por encima', entradas: [66], esperado: ['FUERA DE RANGO'] },
      ],
      pista: 'Usa Si edad >= 18 Y edad <= 65 Entonces ... Sino ... FinSi, y adentro distingue el caso menor del caso mayor.',
      solucion: `Algoritmo ValidarEdad
	Definir edad Como Entero
	Leer edad
	Si edad >= 18 Y edad <= 65 Entonces
		Escribir "PERMITIDO"
	Sino
		Si edad < 18 Entonces
			Escribir "MENOR DE EDAD"
		Sino
			Escribir "FUERA DE RANGO"
		FinSi
	FinSi
FinAlgoritmo`,
      explicacion:
        'Los casos 18 y 65 son los que separan una solución correcta de una que usa > y < en vez de >= y <=. Por eso se prueban las fronteras y no solo un valor cómodo del medio.',
    },
    {
      tipo: 'pseudo',
      id: 'r-pseudo-reintento',
      nivel: 'reto',
      puntos: 40,
      enunciado:
        'Simula la tolerancia a fallos de un cliente que reintenta una operación. Lee la cantidad de intentos disponibles y luego el resultado de cada intento (1 = éxito, 0 = falla).',
      requisitos: [
        'Lee n, la cantidad de intentos permitidos.',
        'Lee n valores, uno por intento, en orden.',
        'Al primer 1, escribe: CONECTADO EN INTENTO k  (donde k es el número de ese intento) y no debe escribir nada más.',
        'Si ningún intento tuvo éxito, escribe: SERVICIO NO DISPONIBLE',
        'Debes consumir todos los n valores de entrada en todos los casos.',
      ],
      plantilla: `Algoritmo Reintento
	Definir n, i, r, exito Como Entero
	Leer n
	exito <- 0
	// recorre los intentos aquí
FinAlgoritmo`,
      casos: [
        { descripcion: 'Éxito en el segundo intento', entradas: [3, 0, 1, 0], esperado: ['CONECTADO EN INTENTO 2'] },
        { descripcion: 'Éxito en el primero', entradas: [4, 1, 0, 0, 0], esperado: ['CONECTADO EN INTENTO 1'] },
        { descripcion: 'Nunca conecta', entradas: [3, 0, 0, 0], esperado: ['SERVICIO NO DISPONIBLE'] },
        { descripcion: 'Un solo intento exitoso', entradas: [1, 1], esperado: ['CONECTADO EN INTENTO 1'] },
      ],
      pista:
        'Usa una bandera (exito) y un Para de 1 hasta n que lea siempre el valor. Escribe el mensaje solo la primera vez que aparezca un 1, guardando en otra variable el número del intento.',
      solucion: `Algoritmo Reintento
	Definir n, i, r, exito, cual Como Entero
	Leer n
	exito <- 0
	cual <- 0
	Para i <- 1 Hasta n Hacer
		Leer r
		Si r = 1 Y exito = 0 Entonces
			exito <- 1
			cual <- i
		FinSi
	FinPara
	Si exito = 1 Entonces
		Escribir "CONECTADO EN INTENTO ", cual
	Sino
		Escribir "SERVICIO NO DISPONIBLE"
	FinSi
FinAlgoritmo`,
      explicacion:
        'El requisito de consumir toda la entrada obliga a separar dos ideas que los principiantes mezclan: detener el efecto (escribir una sola vez) no es lo mismo que detener el ciclo. La bandera resuelve el primero; salir del ciclo rompería el segundo.',
    },
    {
      tipo: 'taller',
      id: 'r-taller-pruebas',
      nivel: 'reto',
      puntos: 30,
      enunciado:
        'Diseñen el plan de pruebas de robustez de un formulario de registro con campos: nombre, correo, contraseña, fecha de nacimiento y programa académico.',
      entregables: [
        'Clases de equivalencia por cada campo, válidas e inválidas.',
        'Al menos tres valores de frontera con su resultado esperado escrito antes de probar.',
        'Cinco entradas hostiles (vacíos, tipos equivocados, longitudes extremas, caracteres especiales, espacios al inicio y final).',
        'Qué debe hacer el sistema en cada caso: mensaje, campo enfocado y si conserva lo ya escrito.',
      ],
      rubrica: [
        'Cada caso tiene resultado esperado definido previamente, no descrito después de ver qué pasó.',
        'El plan distingue validación en el cliente de validación en el servidor.',
        'Los mensajes de error propuestos dicen qué corregir, no solo que hubo un error.',
      ],
    },
  ],
}
