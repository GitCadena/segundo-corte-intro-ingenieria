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
          texto: 'Portabilidad es el grado en que un sistema puede trasladarse a otro entorno: otro sistema operativo, otro navegador, otro hardware.',
        },
        {
          t: 'lista',
          items: [
            'Adaptabilidad: se ajusta a entornos distintos sin cambiar el código.',
            'Instalabilidad: se instala y desinstala de forma confiable.',
            'Reemplazabilidad: puede sustituir a otro producto conservando los datos.',
          ],
        },
      ],
    },
    {
      titulo: 'Compatibilidad',
      cuerpo: [
        {
          t: 'p',
          texto: 'Compatibilidad es convivir con otros sistemas e intercambiar información con ellos.',
        },
        {
          t: 'tabla',
          encabezados: ['Subcaracterística', 'Ejemplo de falla'],
          filas: [
            ['Coexistencia', 'Un antivirus bloquea el puerto de otra aplicación'],
            ['Interoperabilidad', 'Un sistema exporta fechas MM/DD y el receptor las lee como DD/MM'],
          ],
        },
      ],
    },
    {
      titulo: 'Fiabilidad y robustez',
      cuerpo: [
        {
          t: 'p',
          texto: 'Fiabilidad es mantener el nivel de servicio. Robustez es cómo se comporta ante entradas inválidas o fallas.',
        },
        {
          t: 'lista',
          items: [
            'Madurez: frecuencia de fallas en operación normal.',
            'Disponibilidad: proporción del tiempo operativo.',
            'Tolerancia a fallos: sigue operando, degradado, cuando algo falla.',
            'Capacidad de recuperación: restablece el estado tras una falla.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Robustez en el código',
          texto: 'Asumir que toda entrada es hostil: validar rango y tipo, y definir qué pasa con cero, negativos y valores enormes.',
        },
      ],
    },
    {
      titulo: 'Indicadores que se usan en la industria',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Indicador', 'Fórmula'],
          filas: [
            ['Disponibilidad', 'tiempo operativo ÷ tiempo total × 100'],
            ['MTBF', 'tiempo operativo ÷ número de fallas'],
            ['MTTR', 'tiempo de reparación ÷ número de fallas'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Trampa clásica',
          texto: 'Alta cobertura de pruebas no implica alta corrección: solo dice qué porción del código se ejecutó, no si el resultado era correcto.',
        },
      ],
    },
    {
      titulo: 'Diseñar casos límite',
      cuerpo: [
        {
          t: 'p',
          texto: 'Clases de equivalencia: un representante por grupo. Valores de frontera: justo en el límite y sus vecinos.',
        },
        {
          t: 'codigo',
          etiqueta: 'Campo "edad" que acepta de 18 a 65',
          texto: `Valores de frontera:  17, 18, 19  y  64, 65, 66
Entradas hostiles:    vacío, "abc", -5, 3.5`,
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
