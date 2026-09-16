export default {
  id: 'simulacro',
  sesion: 'Sesión 11',
  titulo: 'Simulacro del examen del segundo parcial',
  gancho: 'Mismo alcance, mismo tipo de preguntas, sin nota. Es el ensayo general.',
  simulacro: true,
  duracionMinutos: 60,
  objetivo:
    'Verificar en condiciones parecidas al parcial si el segundo corte quedó entendido, e identificar qué repasar antes de la evaluación real.',
  lecciones: [
    {
      titulo: 'Cómo usar este simulacro',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Este bloque cubre las cinco sesiones del corte: proceso de desarrollo, calidad ISO/IEC 25010, portabilidad y robustez, Ley de Moore e implicaciones sociales, y paradigmas de programación con pseudocódigo.',
        },
        {
          t: 'lista',
          items: [
            'Activa el cronómetro y trabaja sin consultar los módulos. Sesenta minutos es el tiempo del parcial real.',
            'En los problemas de pseudocódigo, escribe la solución completa antes de ejecutarla. En el parcial no habrá botón de ejecutar.',
            'Al terminar, revisa cada explicación, incluso las de los ítems que acertaste: ahí está la mitad del contenido.',
            'Si un tema te costó más de dos intentos, vuelve a su módulo antes de la clase siguiente.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Criterio de aprobación del ensayo',
          texto:
            'Menos del 60% de los puntos significa repasar el corte completo. Entre 60% y 80%, repasar los módulos donde perdiste puntos. Por encima del 80%, dedica el tiempo restante a los retos marcados como avanzados.',
        },
      ],
    },
  ],
  retos: [
    {
      tipo: 'quiz',
      id: 's-q1',
      nivel: 'base',
      puntos: 10,
      pregunta: 'Las actividades sombrilla de un proceso de software se caracterizan porque:',
      opciones: [
        'Solo se ejecutan al final del proyecto.',
        'Acompañan todo el proyecto: gestión de riesgos, calidad, configuración y medición.',
        'Son exclusivas de los modelos ágiles.',
        'Reemplazan a las actividades marco en proyectos pequeños.',
      ],
      correcta: 1,
      explicacion:
        'Nunca terminan mientras el proyecto viva, y cuando se descuidan es cuando los proyectos fracasan sin que nadie sepa explicar en qué momento.',
    },
    {
      tipo: 'quiz',
      id: 's-q2',
      nivel: 'base',
      puntos: 10,
      pregunta: 'El reporte del sistema existe y la cifra que muestra está equivocada. ¿Qué subcaracterística falla?',
      opciones: ['Completitud funcional', 'Corrección funcional', 'Pertinencia funcional', 'Interoperabilidad'],
      correcta: 1,
      explicacion:
        'La función está presente, así que no es completitud; entrega un resultado incorrecto, así que es corrección funcional.',
    },
    {
      tipo: 'quiz',
      id: 's-q3',
      nivel: 'base',
      puntos: 10,
      pregunta: 'Que una aplicación se pueda instalar y ejecutar en Windows, Linux y macOS es un asunto de:',
      opciones: ['Compatibilidad', 'Portabilidad', 'Fiabilidad', 'Eficiencia de desempeño'],
      correcta: 1,
      explicacion:
        'Cambiar de entorno es portabilidad. La compatibilidad se refiere a convivir o intercambiar información con otros sistemas dentro de un mismo entorno.',
    },
    {
      tipo: 'quiz',
      id: 's-q4',
      nivel: 'base',
      puntos: 10,
      pregunta: 'La Ley de Moore, en su formulación de 1975, plantea que la densidad de transistores se duplica:',
      opciones: ['Cada seis meses', 'Aproximadamente cada dos años', 'Cada cinco años', 'Cada década'],
      correcta: 1,
      explicacion:
        'El enunciado original de 1965 hablaba de duplicación anual; Moore lo ajustó a unos dos años en 1975, y así se cita hoy.',
    },
    {
      tipo: 'quiz',
      id: 's-q5',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Un sistema hospitalario no logra enviar los resultados de laboratorio al sistema de historia clínica porque cada uno usa un formato distinto de fecha y de identificación del paciente. ¿Qué característica está comprometida y qué la resolvería?',
      opciones: [
        'Portabilidad; migrar ambos sistemas al mismo servidor.',
        'Interoperabilidad, dentro de compatibilidad; adoptar un estándar de intercambio común.',
        'Fiabilidad; aumentar la disponibilidad de los servidores.',
        'Usabilidad; capacitar al personal en el ingreso de datos.',
      ],
      correcta: 1,
      explicacion:
        'Dos sistemas que deben intercambiar información y no logran interpretarla correctamente tienen un problema de interoperabilidad. La solución estructural es un estándar compartido, no un traductor hecho a la medida para cada pareja de sistemas.',
    },
    {
      tipo: 'quiz',
      id: 's-q6',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        '¿Cuál de estas prácticas aporta evidencia directa sobre la mantenibilidad de un producto?',
      opciones: [
        'Medir el tiempo de respuesta bajo carga.',
        'Medir cuánto tarda el equipo en localizar y corregir un defecto, y cuántos módulos hay que tocar para lograrlo.',
        'Aplicar un cuestionario SUS a los usuarios.',
        'Verificar que la aplicación instale en tres sistemas operativos.',
      ],
      correcta: 1,
      explicacion:
        'Analizabilidad y modularidad son subcaracterísticas de mantenibilidad, y ambas se evidencian en cuánto cuesta un cambio. Las otras opciones miden desempeño, usabilidad y portabilidad.',
    },
    {
      tipo: 'quiz',
      id: 's-q7',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Un programa recorre una lista y, al encontrar el primer elemento que cumple una condición, debe dejar de reportar pero seguir leyendo toda la entrada. ¿Qué construcción resuelve esto correctamente?',
      opciones: [
        'Terminar el ciclo apenas se cumpla la condición.',
        'Usar una bandera que se activa la primera vez y condiciona el reporte, sin interrumpir el recorrido.',
        'Usar dos ciclos anidados.',
        'Contar las ocurrencias y reportar al final la cantidad total.',
      ],
      correcta: 1,
      explicacion:
        'Detener el efecto y detener el recorrido son decisiones independientes. La bandera separa ambas cosas; salir del ciclo dejaría datos sin consumir.',
    },
    {
      tipo: 'quiz',
      id: 's-q8',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'En un diseño orientado a objetos, ¿cuándo es incorrecto usar herencia?',
      opciones: [
        'Siempre que existan más de tres clases.',
        'Cuando la relación entre las clases no es realmente "es un" y solo se busca reutilizar código.',
        'Cuando la clase padre tiene atributos privados.',
        'Cuando se usa polimorfismo en el mismo sistema.',
      ],
      correcta: 1,
      explicacion:
        'Heredar solo para reutilizar produce jerarquías frágiles donde la subclase recibe comportamiento que no le corresponde. En ese caso la composición —tener un objeto en vez de ser uno— es la herramienta correcta.',
    },
    {
      tipo: 'respuesta',
      id: 's-resp-1',
      nivel: 'base',
      puntos: 15,
      enunciado:
        'Se ejecutaron 180 casos de prueba y fallaron 27. ¿Cuál es el porcentaje de corrección funcional? Responde solo el número, sin el signo de porcentaje.',
      pista: 'Primero calcula cuántos pasaron.',
      respuestas: ['85'],
      explicacion: '180 − 27 = 153 aprobados; 153/180 = 0,85 → 85%.',
    },
    {
      tipo: 'respuesta',
      id: 's-resp-2',
      nivel: 'reto',
      puntos: 20,
      enunciado:
        'Un equipo mide una capacidad de cómputo de 12 unidades y proyecta que se duplica cada 18 meses. ¿Cuántas unidades tendría a los 54 meses? Responde solo el número.',
      pista: '54 meses son tres periodos de 18.',
      respuestas: ['96'],
      explicacion: '12 × 2^(54/18) = 12 × 2^3 = 96 unidades.',
    },
    {
      tipo: 'respuesta',
      id: 's-resp-3',
      nivel: 'reto',
      puntos: 20,
      enunciado:
        'Traza el algoritmo y escribe el valor final de t.\n\nt <- 1\ni <- 1\nMientras i <= 4 Hacer\n   t <- t * i\n   i <- i + 1\nFinMientras',
      pista: 'Es un acumulador multiplicativo sobre 1, 2, 3 y 4.',
      respuestas: ['24'],
      explicacion:
        '1×1×2×3×4 = 24, el factorial de 4. Nota que el acumulador multiplicativo se inicializa en 1 y no en 0: con 0 el resultado sería siempre 0.',
    },
    {
      tipo: 'clasificar',
      id: 's-clas',
      nivel: 'reto',
      puntos: 25,
      enunciado: 'Clasifica cada hallazgo según la característica de calidad que compromete.',
      grupos: [
        { id: 'usab', nombre: 'Usabilidad' },
        { id: 'fiab', nombre: 'Fiabilidad' },
        { id: 'segu', nombre: 'Seguridad' },
      ],
      items: [
        { texto: 'Los mensajes de error dicen "Error 0x2F" y nada más', grupo: 'usab' },
        { texto: 'Las contraseñas se guardan sin cifrar en la base de datos', grupo: 'segu' },
        { texto: 'El servicio se reinicia solo dos veces por semana sin causa identificada', grupo: 'fiab' },
        { texto: 'Cualquier usuario autenticado puede ver los datos de los demás cambiando el número en la URL', grupo: 'segu' },
        { texto: 'Tras una caída, la aplicación pierde los formularios a medio llenar', grupo: 'fiab' },
        { texto: 'Para cancelar una inscripción hay que pasar por siete pantallas', grupo: 'usab' },
      ],
      explicacion:
        'El último caso de seguridad es una referencia directa e insegura a objetos, una de las fallas más comunes en aplicaciones web y un ejemplo de por qué la autorización se verifica en el servidor, no en la interfaz.',
    },
    {
      tipo: 'pseudo',
      id: 's-pseudo-1',
      nivel: 'base',
      puntos: 30,
      enunciado:
        'Clasifica una nota en la escala institucional. Lee una nota entre 0 y 5 e informa su categoría.',
      requisitos: [
        'Lee una nota.',
        'Si la nota es menor que 3, escribe: REPROBADO',
        'Si está entre 3 y menos de 4, escribe: APROBADO',
        'Si es 4 o más, escribe: SOBRESALIENTE',
      ],
      plantilla: `Algoritmo Clasificar
	Definir nota Como Real
	Leer nota
	// clasifica aquí
FinAlgoritmo`,
      casos: [
        { descripcion: 'Reprobado', entradas: [2.9], esperado: ['REPROBADO'] },
        { descripcion: 'Frontera de aprobación', entradas: [3.0], esperado: ['APROBADO'] },
        { descripcion: 'Aprobado', entradas: [3.8], esperado: ['APROBADO'] },
        { descripcion: 'Frontera superior', entradas: [4.0], esperado: ['SOBRESALIENTE'] },
        { descripcion: 'Nota máxima', entradas: [5.0], esperado: ['SOBRESALIENTE'] },
      ],
      pista: 'Usa Si anidados y ordena las condiciones de menor a mayor para no repetir comparaciones.',
      solucion: `Algoritmo Clasificar
	Definir nota Como Real
	Leer nota
	Si nota < 3 Entonces
		Escribir "REPROBADO"
	Sino
		Si nota < 4 Entonces
			Escribir "APROBADO"
		Sino
			Escribir "SOBRESALIENTE"
		FinSi
	FinSi
FinAlgoritmo`,
      explicacion:
        'Al ordenar las condiciones de menor a mayor, cada rama ya sabe lo que descartaron las anteriores y no hay que escribir nota >= 3 Y nota < 4. Menos condiciones significa menos lugares donde equivocarse.',
    },
    {
      tipo: 'pseudo',
      id: 's-pseudo-2',
      nivel: 'reto',
      puntos: 45,
      enunciado:
        'Procesa las ventas de un día. Lee la cantidad de ventas y el valor de cada una; reporta el total, el promedio y cuántas superaron los 100 000 pesos.',
      requisitos: [
        'Lee n y luego n valores de venta.',
        'Escribe: TOTAL: seguido de la suma.',
        'Escribe: PROMEDIO: seguido del promedio redondeado al entero más cercano.',
        'Escribe: ALTAS: seguido de cuántas ventas superaron estrictamente 100000.',
        'Si n es 0, escribe únicamente: SIN VENTAS',
      ],
      plantilla: `Algoritmo Ventas
	Definir n, i, altas Como Entero
	Definir v, total Como Real
	Leer n
	// no olvides el caso n = 0
FinAlgoritmo`,
      casos: [
        {
          descripcion: 'Cuatro ventas',
          entradas: [4, 50000, 120000, 100000, 30000],
          esperado: ['TOTAL: 300000', 'PROMEDIO: 75000', 'ALTAS: 1'],
        },
        {
          descripcion: 'Todas altas',
          entradas: [2, 200000, 300000],
          esperado: ['TOTAL: 500000', 'PROMEDIO: 250000', 'ALTAS: 2'],
        },
        { descripcion: 'Sin ventas', entradas: [0], esperado: ['SIN VENTAS'] },
      ],
      pista:
        'Atiende primero el caso n = 0 y deja el resto en el Sino. El valor de 100000 exacto no cuenta como alta: la comparación es estricta.',
      solucion: `Algoritmo Ventas
	Definir n, i, altas Como Entero
	Definir v, total Como Real
	Leer n
	Si n = 0 Entonces
		Escribir "SIN VENTAS"
	Sino
		total <- 0
		altas <- 0
		Para i <- 1 Hasta n Hacer
			Leer v
			total <- total + v
			Si v > 100000 Entonces
				altas <- altas + 1
			FinSi
		FinPara
		Escribir "TOTAL: ", total
		Escribir "PROMEDIO: ", redondear(total/n)
		Escribir "ALTAS: ", altas
	FinSi
FinAlgoritmo`,
      explicacion:
        'El caso n = 0 no es un adorno: sin él, el promedio dividiría entre cero. Proteger la división antes de ejecutarla es justamente la robustez del módulo anterior, aplicada a un algoritmo de cinco líneas.',
    },
  ],
}
