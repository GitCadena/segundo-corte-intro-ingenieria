export default {
  id: 'paradigmas',
  sesion: 'Sesión 10',
  titulo: 'Paradigmas de programación: del algoritmo a la orientación a objetos',
  gancho: 'Un paradigma no es una sintaxis. Es una forma de repartir la responsabilidad dentro de un programa.',
  objetivo:
    'Representar algoritmos con pseudocódigo, dominar las estructuras de control y explicar el paso de la programación estructurada a la orientada a objetos.',
  lecciones: [
    {
      titulo: 'Algoritmo y sus representaciones',
      cuerpo: [
        {
          t: 'p',
          texto: 'Un algoritmo es una secuencia finita y precisa de pasos que transforma entradas en salidas.',
        },
        {
          t: 'tabla',
          encabezados: ['Representación', 'Fortaleza'],
          filas: [
            ['Lenguaje natural', 'Cualquiera lo lee, pero es ambiguo'],
            ['Pseudocódigo', 'Preciso, independiente del lenguaje'],
            ['Diagrama de flujo', 'Muestra el control visualmente'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Entrada – proceso – salida',
          texto: 'Antes de escribir una línea: qué datos entran, qué transformación ocurre, qué debe salir exactamente.',
        },
      ],
    },
    {
      titulo: 'El pseudocódigo que usamos en el curso',
      cuerpo: [
        {
          t: 'codigo',
          etiqueta: 'Referencia rápida',
          texto: `Algoritmo Nombre           Si cond Entonces ... FinSi
   Definir x Como Entero   Mientras cond Hacer ... FinMientras
   Leer x                  Para i <- 1 Hasta n Hacer ... FinPara
   Escribir "texto", x     Dimension v[10]   // índice empieza en 1
FinAlgoritmo

Operadores: + - * / ^ MOD    Comparación: = <> < <= > >=    Lógicos: Y O NO`,
        },
      ],
    },
    {
      titulo: 'Las tres estructuras de control',
      cuerpo: [
        {
          t: 'lista',
          items: [
            'Secuencia: instrucciones una tras otra.',
            'Selección: Si / Sino, para casos que se excluyen.',
            'Mientras: evalúa antes; puede ejecutar cero veces.',
            'Repetir-Hasta Que: evalúa después; ejecuta al menos una vez.',
            'Para: la cantidad de vueltas se conoce antes de empezar.',
          ],
        },
        {
          t: 'clave',
          titulo: 'Los cuatro patrones que resuelven casi todo',
          texto: 'Contador (c <- c + 1), acumulador (s <- s + x), bandera (encontrado <- Verdadero), centinela (valor que marca el fin).',
        },
      ],
    },
    {
      titulo: 'De estructurada a modular',
      cuerpo: [
        {
          t: 'p',
          texto: 'Cuando un algoritmo crece, se divide en subprogramas con responsabilidad única.',
        },
        {
          t: 'clave',
          titulo: 'El criterio de diseño que no pasa de moda',
          texto: 'Cohesión alta (cada módulo hace una sola cosa) y acoplamiento bajo (dependen poco entre sí).',
        },
      ],
    },
    {
      titulo: 'Orientación a objetos',
      cuerpo: [
        {
          t: 'p',
          texto: 'La POO pregunta qué entidades existen en el problema, qué sabe cada una y qué puede hacer.',
        },
        {
          t: 'tabla',
          encabezados: ['Concepto', 'Ejemplo académico'],
          filas: [
            ['Clase', 'Estudiante'],
            ['Objeto', 'el estudiante con código 20241234'],
            ['Atributo', 'código, nombre, semestre'],
            ['Método', 'inscribirMateria(), calcularPromedio()'],
          ],
        },
        {
          t: 'lista',
          items: [
            'Abstracción: se modela solo lo que el problema necesita.',
            'Encapsulamiento: el estado interno se protege.',
            'Herencia: una clase especializa a otra (Estudiante y Docente heredan de Persona).',
            'Polimorfismo: distintos objetos responden al mismo mensaje a su manera.',
          ],
        },
      ],
    },
    {
      titulo: 'Otros paradigmas que van a encontrar',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Paradigma', 'Idea central'],
          filas: [
            ['Estructurado', 'Describir los pasos y el cambio de estado'],
            ['Orientado a objetos', 'Objetos que encapsulan estado y comportamiento'],
            ['Funcional', 'Funciones sin efectos secundarios'],
            ['Declarativo', 'Describir qué se quiere, no cómo obtenerlo (SQL, HTML)'],
          ],
        },
      ],
    },
  ],
  retos: [
    {
      tipo: 'pseudo',
      id: 'pg-pseudo-mayor',
      nivel: 'base',
      puntos: 20,
      enunciado: 'Lee dos números e informa cuál es el mayor, contemplando el caso en que sean iguales.',
      requisitos: [
        'Lee dos valores: a y b.',
        'Si a es mayor, escribe: MAYOR: seguido del valor de a. Ejemplo exacto: MAYOR: 9',
        'Si b es mayor, escribe: MAYOR: seguido del valor de b.',
        'Si son iguales, escribe: IGUALES',
      ],
      plantilla: `Algoritmo Mayor
	Definir a, b Como Real
	Leer a
	Leer b
	// compara aquí
FinAlgoritmo`,
      casos: [
        { descripcion: 'El primero es mayor', entradas: [9, 4], esperado: ['MAYOR: 9'] },
        { descripcion: 'El segundo es mayor', entradas: [3, 12], esperado: ['MAYOR: 12'] },
        { descripcion: 'Iguales', entradas: [7, 7], esperado: ['IGUALES'] },
        { descripcion: 'Con negativos', entradas: [-8, -2], esperado: ['MAYOR: -2'] },
      ],
      pista: 'Escribir "MAYOR: ", a concatena el texto con el valor. Necesitas tres ramas: a > b, b > a e iguales.',
      solucion: `Algoritmo Mayor
	Definir a, b Como Real
	Leer a
	Leer b
	Si a > b Entonces
		Escribir "MAYOR: ", a
	Sino
		Si b > a Entonces
			Escribir "MAYOR: ", b
		Sino
			Escribir "IGUALES"
		FinSi
	FinSi
FinAlgoritmo`,
      explicacion:
        'El caso de números iguales es el que separa una solución completa de una que solo cubre lo evidente. El caso con negativos verifica que la comparación no se haya resuelto con trucos sobre el valor absoluto.',
    },
    {
      tipo: 'pseudo',
      id: 'pg-pseudo-pares',
      nivel: 'base',
      puntos: 25,
      enunciado: 'Cuenta cuántos números pares hay en una lista de n valores enteros.',
      requisitos: [
        'Lee n y luego n valores enteros.',
        'Escribe exactamente: PARES: seguido de la cantidad. Ejemplo: PARES: 3',
        'El cero cuenta como par.',
      ],
      plantilla: `Algoritmo ContarPares
	Definir n, i, x, pares Como Entero
	Leer n
	pares <- 0
	// recorre y cuenta aquí
FinAlgoritmo`,
      casos: [
        { descripcion: 'Mezcla de pares e impares', entradas: [5, 1, 2, 3, 4, 6], esperado: ['PARES: 3'] },
        { descripcion: 'Ningún par', entradas: [3, 1, 3, 5], esperado: ['PARES: 0'] },
        { descripcion: 'Incluye el cero', entradas: [4, 0, 7, 8, 9], esperado: ['PARES: 2'] },
        { descripcion: 'Un solo valor', entradas: [1, 10], esperado: ['PARES: 1'] },
      ],
      pista: 'Un número es par cuando x MOD 2 = 0. Usa un contador que arranca en 0 dentro de un Para.',
      solucion: `Algoritmo ContarPares
	Definir n, i, x, pares Como Entero
	Leer n
	pares <- 0
	Para i <- 1 Hasta n Hacer
		Leer x
		Si x MOD 2 = 0 Entonces
			pares <- pares + 1
		FinSi
	FinPara
	Escribir "PARES: ", pares
FinAlgoritmo`,
      explicacion:
        'Patrón contador en su forma pura: inicializar antes del ciclo, incrementar bajo condición, escribir después. Si el contador se inicializa dentro del ciclo, el resultado siempre será 0 o 1.',
    },
    {
      tipo: 'pseudo',
      id: 'pg-pseudo-centinela',
      nivel: 'reto',
      puntos: 35,
      enunciado:
        'Suma valores hasta encontrar un centinela. La entrada termina cuando llega el valor -1, que no se suma.',
      requisitos: [
        'Lee valores uno a uno hasta leer -1.',
        'Escribe: SUMA: seguido del total. Ejemplo: SUMA: 25',
        'En la línea siguiente escribe: DATOS: seguido de cuántos valores se sumaron (sin contar el -1).',
        'Si el primer valor es -1, la suma es 0 y los datos son 0.',
      ],
      plantilla: `Algoritmo Centinela
	Definir x, suma, cuantos Como Entero
	suma <- 0
	cuantos <- 0
	Leer x
	// usa un Mientras con el centinela
FinAlgoritmo`,
      casos: [
        { descripcion: 'Cuatro valores', entradas: [5, 10, 4, 6, -1], esperado: ['SUMA: 25', 'DATOS: 4'] },
        { descripcion: 'Un solo valor', entradas: [8, -1], esperado: ['SUMA: 8', 'DATOS: 1'] },
        { descripcion: 'Centinela inmediato', entradas: [-1], esperado: ['SUMA: 0', 'DATOS: 0'] },
        { descripcion: 'Con negativos válidos', entradas: [-3, 10, -1], esperado: ['SUMA: 7', 'DATOS: 2'] },
      ],
      pista:
        'Lee una vez antes del ciclo, y dentro del Mientras acumula y vuelve a leer al final. Ese patrón se llama lectura adelantada.',
      solucion: `Algoritmo Centinela
	Definir x, suma, cuantos Como Entero
	suma <- 0
	cuantos <- 0
	Leer x
	Mientras x <> -1 Hacer
		suma <- suma + x
		cuantos <- cuantos + 1
		Leer x
	FinMientras
	Escribir "SUMA: ", suma
	Escribir "DATOS: ", cuantos
FinAlgoritmo`,
      explicacion:
        'La lectura adelantada evita el error clásico de sumar el centinela. El último caso confirma que -3 se suma con normalidad: el centinela es exactamente -1, no "cualquier negativo".',
    },
    {
      tipo: 'pseudo',
      id: 'pg-pseudo-notas',
      nivel: 'reto',
      puntos: 40,
      enunciado:
        'Procesa las notas de un grupo: calcula el promedio, cuenta aprobados y reporta la nota más alta. Escala de 0,0 a 5,0 y se aprueba con 3,0.',
      requisitos: [
        'Lee n y luego n notas.',
        'Escribe: PROMEDIO: seguido del promedio con un decimal. Ejemplo: PROMEDIO: 3.5',
        'Escribe en la siguiente línea: APROBADOS: seguido de la cantidad con nota mayor o igual a 3.',
        'Escribe en la tercera línea: MAXIMA: seguida de la nota más alta.',
      ],
      plantilla: `Algoritmo Notas
	Definir n, i, aprobados Como Entero
	Definir nota, suma, maxima Como Real
	Leer n
	suma <- 0
	aprobados <- 0
	maxima <- 0
	// procesa aquí
FinAlgoritmo`,
      casos: [
        {
          descripcion: 'Grupo mixto',
          entradas: [4, 2.0, 3.0, 4.0, 5.0],
          esperado: ['PROMEDIO: 3.5', 'APROBADOS: 3', 'MAXIMA: 5'],
        },
        {
          descripcion: 'Todos reprueban',
          entradas: [3, 1.0, 2.0, 2.4],
          esperado: ['PROMEDIO: 1.8', 'APROBADOS: 0', 'MAXIMA: 2.4'],
        },
        {
          descripcion: 'Frontera exacta en 3.0',
          entradas: [2, 3.0, 3.0],
          esperado: ['PROMEDIO: 3', 'APROBADOS: 2', 'MAXIMA: 3'],
        },
      ],
      pista:
        'Para el máximo, arranca maxima en 0 y actualiza cuando la nota leída sea mayor. Para el promedio con un decimal usa redondear(suma/n*10)/10.',
      solucion: `Algoritmo Notas
	Definir n, i, aprobados Como Entero
	Definir nota, suma, maxima Como Real
	Leer n
	suma <- 0
	aprobados <- 0
	maxima <- 0
	Para i <- 1 Hasta n Hacer
		Leer nota
		suma <- suma + nota
		Si nota >= 3 Entonces
			aprobados <- aprobados + 1
		FinSi
		Si nota > maxima Entonces
			maxima <- nota
		FinSi
	FinPara
	Escribir "PROMEDIO: ", redondear(suma/n*10)/10
	Escribir "APROBADOS: ", aprobados
	Escribir "MAXIMA: ", maxima
FinAlgoritmo`,
      explicacion:
        'Tres patrones conviviendo en un solo recorrido: acumulador, contador condicional y búsqueda de máximo. Inicializar el máximo en 0 funciona porque no hay notas negativas; con datos que sí pueden serlo, se inicializa con el primer valor leído.',
    },
    {
      tipo: 'pseudo',
      id: 'pg-pseudo-arreglo',
      nivel: 'reto',
      puntos: 45,
      enunciado:
        'Usando un arreglo, determina cuántas notas están por encima del promedio del grupo. Requiere dos recorridos: no se puede saber quién supera el promedio antes de conocerlo.',
      requisitos: [
        'Lee n (máximo 50) y guarda las n notas en un arreglo.',
        'Escribe: PROMEDIO: seguido del promedio redondeado a un decimal.',
        'Escribe en la línea siguiente: SOBRE EL PROMEDIO: seguido de la cantidad de notas estrictamente mayores al promedio.',
      ],
      plantilla: `Algoritmo SobrePromedio
	Definir n, i, cuantos Como Entero
	Definir suma, prom Como Real
	Dimension notas[50]
	Leer n
	suma <- 0
	// primer recorrido: leer y acumular
	// segundo recorrido: comparar contra el promedio
FinAlgoritmo`,
      casos: [
        {
          descripcion: 'Cinco notas',
          entradas: [5, 2.0, 3.0, 4.0, 5.0, 1.0],
          esperado: ['PROMEDIO: 3', 'SOBRE EL PROMEDIO: 2'],
        },
        {
          descripcion: 'Todas iguales',
          entradas: [3, 4.0, 4.0, 4.0],
          esperado: ['PROMEDIO: 4', 'SOBRE EL PROMEDIO: 0'],
        },
        {
          descripcion: 'Una sola nota',
          entradas: [1, 2.5],
          esperado: ['PROMEDIO: 2.5', 'SOBRE EL PROMEDIO: 0'],
        },
      ],
      pista:
        'El arreglo se indexa desde 1: notas[1] es la primera. Guarda el promedio en una variable antes del segundo recorrido y compara con > estricto.',
      solucion: `Algoritmo SobrePromedio
	Definir n, i, cuantos Como Entero
	Definir suma, prom Como Real
	Dimension notas[50]
	Leer n
	suma <- 0
	Para i <- 1 Hasta n Hacer
		Leer notas[i]
		suma <- suma + notas[i]
	FinPara
	prom <- suma / n
	cuantos <- 0
	Para i <- 1 Hasta n Hacer
		Si notas[i] > prom Entonces
			cuantos <- cuantos + 1
		FinSi
	FinPara
	Escribir "PROMEDIO: ", redondear(prom*10)/10
	Escribir "SOBRE EL PROMEDIO: ", cuantos
FinAlgoritmo`,
      explicacion:
        'Este es el primer problema del curso que obliga a conservar los datos: sin arreglo habría que pedirlos dos veces. El caso "todas iguales" verifica que la comparación sea estricta; con >= el resultado sería 3 en vez de 0.',
    },
    {
      tipo: 'pseudo',
      id: 'pg-pseudo-invertir',
      nivel: 'reto',
      puntos: 45,
      enunciado:
        'Invierte los dígitos de un número entero positivo y determina si es capicúa (se lee igual al derecho y al revés).',
      requisitos: [
        'Lee un entero positivo.',
        'Escribe: INVERTIDO: seguido del número con sus dígitos en orden inverso.',
        'Escribe en la línea siguiente: CAPICUA o NO CAPICUA, según corresponda.',
      ],
      plantilla: `Algoritmo Invertir
	Definir num, original, invertido, digito Como Entero
	Leer num
	original <- num
	invertido <- 0
	// extrae dígitos con MOD y divide entre 10
FinAlgoritmo`,
      casos: [
        { descripcion: 'Número común', entradas: [1234], esperado: ['INVERTIDO: 4321', 'NO CAPICUA'] },
        { descripcion: 'Capicúa', entradas: [1221], esperado: ['INVERTIDO: 1221', 'CAPICUA'] },
        { descripcion: 'Un dígito', entradas: [7], esperado: ['INVERTIDO: 7', 'CAPICUA'] },
        { descripcion: 'Con dígito repetido', entradas: [505], esperado: ['INVERTIDO: 505', 'CAPICUA'] },
      ],
      pista:
        'El último dígito es num MOD 10. Para quitarlo: num <- trunc(num/10). Y para agregarlo al invertido: invertido <- invertido*10 + digito.',
      solucion: `Algoritmo Invertir
	Definir num, original, invertido, digito Como Entero
	Leer num
	original <- num
	invertido <- 0
	Mientras num > 0 Hacer
		digito <- num MOD 10
		invertido <- invertido * 10 + digito
		num <- trunc(num / 10)
	FinMientras
	Escribir "INVERTIDO: ", invertido
	Si invertido = original Entonces
		Escribir "CAPICUA"
	Sino
		Escribir "NO CAPICUA"
	FinSi
FinAlgoritmo`,
      explicacion:
        'Guardar el valor original antes de destruirlo en el ciclo es el paso que más se olvida. La combinación MOD 10 para extraer y trunc(n/10) para desplazar es una herramienta que reaparece en conversión de bases y en validación de documentos.',
    },
    {
      tipo: 'respuesta',
      id: 'pg-traza-1',
      nivel: 'base',
      puntos: 15,
      enunciado:
        'Traza mentalmente este algoritmo y escribe el valor final de s.\n\ns <- 0\nPara i <- 1 Hasta 5 Hacer\n   Si i MOD 2 = 1 Entonces\n      s <- s + i\n   FinSi\nFinPara',
      pista: 'Solo entran los impares del 1 al 5.',
      respuestas: ['9'],
      explicacion:
        'Entran 1, 3 y 5: s vale 9. Trazar a mano —columna por variable, fila por iteración— es la técnica que evita la mayoría de los errores en el parcial, y es más rápida que ejecutar y adivinar.',
    },
    {
      tipo: 'respuesta',
      id: 'pg-traza-2',
      nivel: 'reto',
      puntos: 25,
      enunciado:
        'Traza este algoritmo y escribe cuántas veces se ejecuta la línea interna del ciclo (la asignación a c).\n\nc <- 0\ni <- 10\nMientras i > 1 Hacer\n   c <- c + 1\n   i <- trunc(i / 2)\nFinMientras',
      pista: 'i toma los valores 10, 5, 2 y 1. El ciclo termina cuando i deja de ser mayor que 1.',
      respuestas: ['3'],
      explicacion:
        'Iteraciones: i=10 → 5, i=5 → 2, i=2 → 1, y ahí se detiene: tres ejecuciones. Dividir a la mitad en cada paso da un número de iteraciones proporcional al logaritmo del dato, que es la razón por la que la búsqueda binaria es tan rápida.',
    },
    {
      tipo: 'clasificar',
      id: 'pg-clas-pilares',
      nivel: 'base',
      puntos: 25,
      enunciado: 'Cada situación ejemplifica uno de los pilares de la orientación a objetos. Ubícala.',
      grupos: [
        { id: 'encap', nombre: 'Encapsulamiento' },
        { id: 'heren', nombre: 'Herencia' },
        { id: 'poli', nombre: 'Polimorfismo' },
      ],
      items: [
        { texto: 'El atributo saldo es privado y solo cambia mediante depositar() y retirar()', grupo: 'encap' },
        { texto: 'Las validaciones del estado viven dentro de la propia clase, no en quien la usa', grupo: 'encap' },
        { texto: 'Estudiante y Docente comparten nombre y documento porque extienden Persona', grupo: 'heren' },
        { texto: 'CuentaAhorros extiende Cuenta y añade el cálculo de intereses', grupo: 'heren' },
        { texto: 'calcularArea() responde distinto en Circulo y en Rectangulo, con la misma invocación', grupo: 'poli' },
        { texto: 'Un método recibe cualquier objeto Notificador y llama enviar() sin saber si es correo o SMS', grupo: 'poli' },
      ],
      explicacion:
        'Encapsulamiento protege el estado, herencia reutiliza estructura y polimorfismo permite tratar distintos tipos de manera uniforme. La abstracción no aparece aquí porque es transversal: es la decisión previa de qué se modela y qué se deja por fuera.',
    },
    {
      tipo: 'orden',
      id: 'pg-orden-modelado',
      nivel: 'reto',
      puntos: 20,
      enunciado: 'Ordena los pasos para pasar de un enunciado en lenguaje natural a un modelo de clases.',
      items: [
        'Identificar los sustantivos relevantes del enunciado',
        'Descartar los que no tienen estado ni comportamiento propio',
        'Definir los atributos de cada clase candidata',
        'Asignar a cada clase los comportamientos que le corresponden',
        'Establecer las relaciones entre clases',
        'Verificar que cada clase tenga una única responsabilidad',
      ],
      explicacion:
        'Identificar sustantivos es una heurística de arranque, no una regla: muchos sustantivos son atributos y no clases. El último paso es el que más corrige el modelo, porque obliga a partir las clases que terminaron haciendo de todo.',
    },
    {
      tipo: 'quiz',
      id: 'pg-q1',
      nivel: 'base',
      puntos: 10,
      pregunta: '¿Cuál es la diferencia entre Mientras y Repetir-Hasta Que?',
      opciones: [
        'Mientras solo funciona con números y Repetir con cualquier tipo.',
        'Mientras evalúa la condición antes y puede ejecutar cero veces; Repetir evalúa después y ejecuta al menos una vez.',
        'Repetir es más eficiente porque no evalúa la condición.',
        'No hay diferencia: son sintaxis distintas de lo mismo.',
      ],
      correcta: 1,
      explicacion:
        'Por eso Repetir-Hasta Que es la estructura natural para pedir un dato y validarlo: hay que pedirlo al menos una vez antes de poder juzgarlo.',
    },
    {
      tipo: 'quiz',
      id: 'pg-q2',
      nivel: 'reto',
      puntos: 20,
      pregunta:
        'Un equipo modela un sistema de préstamos y crea la clase Libro con los métodos prestar(), imprimirRecibo(), enviarCorreo() y conectarBaseDatos(). ¿Cuál es la crítica de diseño correcta?',
      opciones: [
        'Le faltan atributos privados.',
        'La clase acumula responsabilidades que no son suyas: baja cohesión y alto acoplamiento con infraestructura.',
        'Debería heredar de una clase Documento.',
        'El problema es que no usa polimorfismo.',
      ],
      correcta: 1,
      explicacion:
        'Un libro puede saber si está disponible y quién lo tiene. Imprimir, enviar correos y hablar con la base de datos son responsabilidades de otros componentes. Es el mismo criterio de cohesión y acoplamiento de la programación modular, aplicado a clases.',
    },
    {
      tipo: 'quiz',
      id: 'pg-q3',
      nivel: 'reto',
      puntos: 20,
      pregunta: '¿Qué afirma el teorema de Böhm-Jacopini y por qué importa?',
      opciones: [
        'Que todo programa se puede escribir con secuencia, selección y repetición; por eso la programación estructurada puede prescindir del salto incondicional.',
        'Que todo programa orientado a objetos se puede convertir a estructurado.',
        'Que los ciclos anidados siempre se pueden reemplazar por recursión.',
        'Que un algoritmo correcto siempre termina.',
      ],
      correcta: 0,
      explicacion:
        'Es el sustento teórico de la programación estructurada. Su consecuencia práctica es enorme: un programa construido con esas tres estructuras se puede leer de arriba hacia abajo y razonar por bloques, cosa imposible con saltos arbitrarios.',
    },
    {
      tipo: 'taller',
      id: 'pg-taller-clases',
      nivel: 'reto',
      puntos: 35,
      enunciado:
        'Modelen en grupo el sistema de préstamo de equipos del laboratorio de la facultad: quién presta, qué se presta, por cuánto tiempo y qué pasa si se devuelve tarde.',
      entregables: [
        'Cuatro clases como mínimo, con sus atributos y métodos, en una tabla o diagrama.',
        'Una relación de herencia justificada con la prueba "es un", o la explicación de por qué decidieron no usar herencia.',
        'Un método donde el polimorfismo simplifique el diseño.',
        'El algoritmo, en pseudocódigo, del cálculo de la multa por retraso.',
      ],
      rubrica: [
        'Cada clase pasa la prueba de responsabilidad única enunciada en una sola frase.',
        'Ningún atributo del modelo queda sin usar en algún método.',
        'El pseudocódigo de la multa contempla el caso de devolución a tiempo y el de retraso cero.',
      ],
    },
  ],
}
