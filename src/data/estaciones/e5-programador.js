import base from '../m5-paradigmas.js'

/**
 * Estación 5 · Pensar como programador (sesión 10).
 *
 * Todas las actividades de código EJECUTAN el algoritmo del estudiante contra
 * casos de prueba. Ninguna se da por buena porque el orden de los bloques
 * coincida con una solución guardada: si existe otra solución válida, pasa
 * igual, y si el orden "correcto" no produce la salida esperada, no pasa.
 */

export default {
  id: 'paradigmas',
  orden: 5,
  sesion: 'Sesión 10',
  titulo: 'Pensar como programador',
  gancho: 'Un paradigma no es una sintaxis. Es una forma de repartir la responsabilidad dentro de un programa.',

  aprenderas: {
    objetivo:
      'Al terminar podrás leer un algoritmo y decir qué valor tiene cada variable en cada paso, escribir uno que resuelva un problema con datos variables, y explicar qué son una clase y un objeto con un ejemplo propio.',
    puntos: [
      'Trazar la ejecución de un algoritmo paso a paso sin ejecutarlo.',
      'Usar secuencia, condición y repetición para resolver un problema.',
      'Distinguir contador, acumulador, bandera y centinela, y saber cuándo usar cada uno.',
      'Escribir pseudocódigo que pase casos normales y casos límite.',
      'Modelar un objeto con sus atributos y métodos, y decir qué clase lo describe.',
    ],
    duracion: '60 a 75 minutos',
  },

  comprende: base.lecciones,

  profundiza: {
    'Algoritmo y sus representaciones': {
      titulo: 'Entrada, proceso y salida: la pregunta previa a escribir nada',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Antes de la primera línea de pseudocódigo hay tres preguntas que ordenan todo lo demás: ¿qué datos recibe el algoritmo?, ¿qué hace con ellos?, ¿qué produce? Si no puedes responderlas, todavía no tienes un problema bien planteado y cualquier código que escribas será un intento a ciegas.',
        },
        {
          t: 'tabla',
          encabezados: ['Problema', 'Entrada', 'Proceso', 'Salida'],
          filas: [
            ['Promedio de notas', 'n y n notas', 'Acumular y dividir', 'Un número con un decimal'],
            ['Contar pares', 'n y n enteros', 'Revisar el residuo de cada uno', 'Una cantidad'],
            ['Buscar un dato', 'La lista y el valor buscado', 'Recorrer hasta encontrarlo', 'Encontrado o no encontrado'],
          ],
        },
        {
          t: 'clave',
          titulo: 'Cómo detectar que falta precisión',
          texto:
            'Si dos personas leen tu enunciado y escriben salidas distintas —una «3.5» y otra «El promedio es 3.5»—, el problema está mal planteado. En los ejercicios de esta estación la salida se indica con su formato exacto por esa razón.',
        },
      ],
    },
    'Las tres estructuras de control': {
      titulo: 'Los cuatro patrones que resuelven casi todo',
      cuerpo: [
        {
          t: 'tabla',
          encabezados: ['Patrón', 'Pregunta que responde', 'Inicialización', 'Dentro del ciclo'],
          filas: [
            ['Contador', '¿Cuántos?', 'c <- 0', 'c <- c + 1 (bajo condición)'],
            ['Acumulador', '¿Cuánto en total?', 's <- 0 (o 1 si multiplica)', 's <- s + x'],
            ['Bandera', '¿Ocurrió al menos una vez?', 'b <- Falso', 'b <- Verdadero cuando ocurre'],
            ['Centinela', '¿Hasta cuándo leo?', 'Leer el primer dato antes del ciclo', 'Procesar y volver a leer'],
          ],
        },
        {
          t: 'p',
          texto:
            'El error más frecuente con contadores y acumuladores no es de sintaxis: es inicializar dentro del ciclo. Si `c <- 0` queda adentro, se reinicia en cada vuelta y el resultado siempre será 0 o 1, sin que el programa falle nunca. Es un defecto silencioso, de los peores.',
        },
        {
          t: 'p',
          texto:
            'Con el centinela el error clásico es el opuesto: leer dentro del ciclo antes de comprobar la condición, con lo cual el propio centinela se procesa como si fuera un dato. Por eso se usa lectura adelantada: se lee una vez antes del Mientras, y dentro del ciclo se procesa y se vuelve a leer al final.',
        },
      ],
    },
    'Orientación a objetos': {
      titulo: 'Cómo decidir qué es atributo y qué es método',
      cuerpo: [
        {
          t: 'p',
          texto:
            'Regla de trabajo: los atributos responden «qué sé de este objeto» y son sustantivos; los métodos responden «qué sabe hacer este objeto» y son verbos. Un atributo guarda estado; un método lo consulta o lo cambia.',
        },
        {
          t: 'tabla',
          encabezados: ['Clase', 'Atributos (sustantivos)', 'Métodos (verbos)'],
          filas: [
            ['Sala', 'código, capacidad, tiene proyector, estado', 'reservar(franja), liberar(), estaDisponible(franja)'],
            ['Reserva', 'sala, estudiante, fecha, hora inicio, hora fin', 'cancelar(), duracion(), seSolapaCon(otra)'],
            ['Estudiante', 'nombres, código, programa', 'reservasActivas(), puedeReservar()'],
          ],
        },
        {
          t: 'clave',
          titulo: 'La prueba que separa clase de objeto',
          texto:
            'Si puedes contar cuántos hay, es objeto. «Sala» no se puede contar —no existe «la sala» en abstracto—, así que es clase. «La sala 203» sí se puede señalar: es un objeto. Y la capacidad 30 no es una clase ni un objeto: es el valor de un atributo.',
        },
        {
          t: 'p',
          texto:
            'Un error común en el parcial es tratar cada valor concreto como si fuera una clase distinta. «Sala203» no es una clase: es una instancia de Sala. Si necesitaras una clase por cada sala, tendrías que reescribir el programa cada vez que la universidad habilite un aula.',
        },
      ],
    },
  },

  ejemplo: {
    titulo: 'Un algoritmo, paso a paso, con las variables a la vista',
    contexto: 'Problema: leer las notas de un grupo y reportar el promedio y cuántos aprobaron (nota ≥ 3,0).',
    pasos: [
      {
        titulo: '1. Entrada, proceso y salida',
        texto: 'Entrada: n notas. Proceso: sumarlas, contar las que llegan a 3,0, dividir. Salida: «PROMEDIO: x.x» y «APROBADOS: k».',
      },
      {
        titulo: '2. Elegir las variables',
        texto: 'suma → ACUMULADOR, arranca en 0, crece según cada nota. aprobados → CONTADOR, arranca en 0, crece de a 1.',
      },
      {
        titulo: '3. El algoritmo',
        texto:
          'Algoritmo Notas\n\tDefinir n, i, aprobados Como Entero\n\tDefinir nota, suma Como Real\n\tLeer n\n\tsuma <- 0\n\taprobados <- 0\n\tPara i <- 1 Hasta n Hacer\n\t\tLeer nota\n\t\tsuma <- suma + nota\n\t\tSi nota >= 3 Entonces\n\t\t\taprobados <- aprobados + 1\n\t\tFinSi\n\tFinPara\n\tEscribir "PROMEDIO: ", trunc(suma / n * 10) / 10\n\tEscribir "APROBADOS: ", aprobados\nFinAlgoritmo',
        nota: 'Las dos inicializaciones están ANTES del Para. Si estuvieran adentro, se reiniciarían en cada vuelta.',
      },
      {
        titulo: '4. La traza con n = 4 y notas 2,0 · 3,0 · 4,0 · 5,0',
        texto:
          'i | nota | suma | aprobados\n1 | 2.0  | 2.0  |    0\n2 | 3.0  | 5.0  |    1\n3 | 4.0  | 9.0  |    2\n4 | 5.0  | 14.0 |    3\n\nPromedio = 14,0 ÷ 4 = 3,5. Aprobados = 3.',
        nota: 'La variable `nota` se sobrescribe en cada vuelta; lo que recuerda el total es `suma`. Esa es la razón de existir de un acumulador.',
      },
      {
        titulo: '5. Los casos límite que hay que probar',
        texto: 'n = 1 (una sola vuelta). Nota exactamente 3,0 (¿cuenta? sí, y descubre un > mal puesto en vez de >=). n = 0 (¿qué pasa al dividir?).',
      },
      {
        titulo: '6. Lo mismo, visto con objetos',
        texto: 'En POO existiría una clase Grupo con métodos promedio() y cuantosAprobaron(). Un paradigma reparte responsabilidad, no cambia la lógica.',
      },
    ],
    cierre:
      'Las variables se eligen antes de escribir, cada una con un papel. La traza encuentra el error sin ejecutar nada. El intérprete va a correr tu código de verdad contra los casos.',
  },

  actividades: [
    /* ------------------------------------------------------------------ 1 */
    {
      id: 'e5-a1-traza',
      tipo: 'traza',
      nivel: 'base',
      puntos: 110,
      titulo: 'Sigue las variables',
      objetivo: 'Leer un algoritmo y saber qué vale cada variable en cada paso, sin ejecutarlo.',
      instrucciones:
        'Completa la tabla de traza. Cada fila es una instrucción ya ejecutada: escribe el valor que tiene cada variable JUSTO DESPUÉS de esa instrucción. Cuando termines, puedes ejecutar el algoritmo para comparar tu traza con la real.',
      conceptoPrevio: 'Asignación: se evalúa la expresión de la derecha y el resultado se guarda a la izquierda.',
      conceptos: ['variable', 'asignacion', 'contador', 'acumulador'],
      codigo: `Algoritmo Traza
	Definir a, b, t Como Entero
	a <- 5
	b <- 3
	t <- a
	a <- b
	b <- t
	a <- a + b
	b <- a - b
FinAlgoritmo`,
      entradas: [],
      variables: ['a', 'b', 't'],
      // Las respuestas NO están escritas a mano: las calcula el intérprete al
      // cargar la actividad, así el enunciado y la solución no se desincronizan.
      pistas: [
        'La asignación no es una igualdad: primero se calcula todo lo que está a la derecha de <-, y después se guarda en la variable de la izquierda.',
        'Las tres primeras asignaciones hacen un intercambio clásico. La variable t existe solo para no perder el valor de a cuando se sobrescribe.',
        'En `a <- a + b`, el `a` de la derecha vale lo que tenía ANTES de esta línea.',
      ],
      explicacion:
        'Las tres primeras asignaciones son el intercambio de dos variables usando una temporal: sin t, la línea `a <- b` destruiría el valor de a para siempre. Las dos últimas muestran por qué la asignación no es una igualdad matemática: `a <- a + b` sería imposible en álgebra y aquí es la operación más común del mundo. Trazar a mano es la habilidad que permite encontrar un error sin ejecutar, y es exactamente lo que se pregunta en el parcial.',
    },

    /* ------------------------------------------------------------------ 2 */
    {
      id: 'e5-a2-armar',
      tipo: 'algoritmo',
      nivel: 'base',
      puntos: 130,
      titulo: 'Arma el algoritmo',
      objetivo: 'Construir un algoritmo completo ordenando sus bloques, y comprobarlo ejecutándolo.',
      instrucciones:
        'Ordena los bloques para que el algoritmo lea n valores y escriba cuántos son mayores que 10. Al verificar, el algoritmo que armaste SE EJECUTA contra los casos de prueba: si tu orden funciona, pasa, aunque no coincida con el que yo tenía en mente.',
      conceptoPrevio: 'Patrón contador: inicializar antes del ciclo, incrementar bajo condición, escribir después.',
      conceptos: ['algoritmo', 'contador', 'variable'],
      cabecera: 'Algoritmo Mayores',
      pie: 'FinAlgoritmo',
      bloques: [
        { id: 'b1', codigo: 'Definir n, i, x, cuantos Como Entero', indent: 1 },
        { id: 'b2', codigo: 'Leer n', indent: 1 },
        { id: 'b3', codigo: 'cuantos <- 0', indent: 1 },
        { id: 'b4', codigo: 'Para i <- 1 Hasta n Hacer', indent: 1 },
        { id: 'b5', codigo: 'Leer x', indent: 2 },
        { id: 'b6', codigo: 'Si x > 10 Entonces', indent: 2 },
        { id: 'b7', codigo: 'cuantos <- cuantos + 1', indent: 3 },
        { id: 'b8', codigo: 'FinSi', indent: 2 },
        { id: 'b9', codigo: 'FinPara', indent: 1 },
        { id: 'b10', codigo: 'Escribir "MAYORES: ", cuantos', indent: 1 },
      ],
      casos: [
        { descripcion: 'Mezcla de valores', entradas: [5, 4, 11, 10, 20, 3], esperado: ['MAYORES: 2'] },
        { descripcion: 'Ninguno supera 10', entradas: [3, 1, 2, 3], esperado: ['MAYORES: 0'] },
        { descripcion: 'El valor 10 no cuenta (frontera)', entradas: [2, 10, 11], esperado: ['MAYORES: 1'] },
        { descripcion: 'Un solo valor, y sí cuenta', entradas: [1, 99], esperado: ['MAYORES: 1'] },
        { descripcion: 'Todos cuentan', entradas: [3, 50, 60, 70], esperado: ['MAYORES: 3'] },
      ],
      pistas: [
        'Todo lo que debe ocurrir una sola vez va antes del Para: definir, leer n e inicializar el contador.',
        'Dentro del ciclo hay que leer el valor ANTES de compararlo. Si comparas antes de leer, el intérprete dirá que la variable no tiene valor.',
        'La escritura del resultado va después de FinPara. Si queda adentro, se escribirá una línea por cada valor leído y los casos fallarán.',
      ],
      explicacion:
        'Hay más de un orden que funciona: `Definir` y `Leer n` pueden intercambiarse con `cuantos <- 0` sin que nada se rompa, y por eso la verificación ejecuta el código en vez de comparar con una lista guardada. Lo que no admite variación son las dependencias reales: leer antes de comparar, inicializar antes de acumular, y escribir después de terminar el ciclo. El caso con el valor 10 es el que distingue `>` de `>=`: es la frontera de la estación 3 dentro de un algoritmo.',
    },

    /* ------------------------------------------------------------------ 3 */
    {
      id: 'e5-a3-decision',
      tipo: 'completar',
      nivel: 'base',
      puntos: 120,
      titulo: 'Completa la decisión',
      objetivo: 'Elegir la condición correcta y comprobar su efecto en todos los casos, no solo en el evidente.',
      instrucciones:
        'Elige qué va en cada hueco. El algoritmo debe clasificar una nota entre 0,0 y 5,0: «EXCELENTE» si es 4,5 o más, «APROBADO» si llega a 3,0, y «REPROBADO» en los demás casos. Al verificar se ejecuta contra los casos de prueba, incluidas las notas exactamente en la frontera.',
      conceptoPrevio: 'Selección anidada: el Sino de un Si puede contener otro Si.',
      conceptos: ['algoritmo', 'frontera'],
      plantilla: `Algoritmo Clasificar
	Definir nota Como Real
	Leer nota
	Si {{h1}} Entonces
		Escribir "EXCELENTE"
	Sino
		Si {{h2}} Entonces
			Escribir {{h3}}
		Sino
			Escribir "REPROBADO"
		FinSi
	FinSi
FinAlgoritmo`,
      huecos: {
        h1: {
          etiqueta: 'Condición de EXCELENTE',
          opciones: ['nota >= 4.5', 'nota > 4.5', 'nota >= 4', 'nota = 4.5'],
          porQueNo: {
            'nota > 4.5': 'Deja fuera la nota 4,5 exacta, que según el enunciado sí es excelente. Es el error de frontera más común.',
            'nota >= 4': 'Cambia el umbral que pide el enunciado: clasificaría un 4,2 como excelente.',
            'nota = 4.5': 'Solo aceptaría exactamente 4,5. Un 5,0 caería a la rama siguiente.',
          },
        },
        h2: {
          etiqueta: 'Condición de APROBADO',
          opciones: ['nota >= 3', 'nota > 3', 'nota >= 3 Y nota < 4.5', 'nota <= 3'],
          porQueNo: {
            'nota > 3': 'Deja fuera el 3,0 exacto, que sí aprueba.',
            'nota <= 3': 'Invierte el sentido: aprobaría con 1,0 y reprobaría con 4,0.',
          },
          nota:
            '«nota >= 3 Y nota < 4.5» también funciona y pasa todos los casos: dentro del Sino ya sabemos que la nota es menor que 4,5, así que la segunda condición es redundante pero no es incorrecta.',
        },
        h3: {
          etiqueta: 'Texto de la rama intermedia',
          opciones: ['"APROBADO"', '"Aprobado"', 'APROBADO', '"APROBADO "'],
          porQueNo: {
            APROBADO: 'Sin comillas, el intérprete lo leería como el nombre de una variable que nunca recibió valor, y el algoritmo fallaría antes de escribir nada.',
          },
          nota:
            '«Aprobado» y «APROBADO » (con espacio final) también pasan: la comparación de salidas de esta aplicación ignora mayúsculas y espacios sobrantes. En un sistema real, en cambio, serían datos distintos, así que conviene escribir el formato exacto que pide el enunciado.',
        },
      },
      casos: [
        { descripcion: 'Excelente claro', entradas: [4.8], esperado: ['EXCELENTE'] },
        { descripcion: 'Frontera de excelente: exactamente 4,5', entradas: [4.5], esperado: ['EXCELENTE'] },
        { descripcion: 'Justo por debajo de excelente', entradas: [4.4], esperado: ['APROBADO'] },
        { descripcion: 'Frontera de aprobado: exactamente 3,0', entradas: [3.0], esperado: ['APROBADO'] },
        { descripcion: 'Justo por debajo de aprobado', entradas: [2.9], esperado: ['REPROBADO'] },
        { descripcion: 'Nota mínima', entradas: [0], esperado: ['REPROBADO'] },
        { descripcion: 'Nota máxima', entradas: [5], esperado: ['EXCELENTE'] },
      ],
      pistas: [
        'Lee el enunciado con atención: dice «4,5 o más» y «llega a 3,0». Las dos frases incluyen el valor.',
        'El orden de las ramas importa: la condición más exigente va primero, porque un 4,8 también cumple «mayor o igual que 3».',
        'De los casos de prueba, dos son exactamente los valores de frontera. Si eliges > en vez de >=, esos dos son los que fallan.',
      ],
      explicacion:
        'Los dos casos de frontera —4,5 y 3,0 exactos— son los que separan una solución correcta de una que funciona «casi siempre». Fíjate también en el orden de las ramas: si se preguntara primero por «>= 3», un 4,8 entraría por ahí y nunca llegaría a EXCELENTE. En una selección anidada, la condición más restrictiva va primero.',
    },

    /* ------------------------------------------------------------------ 4 */
    {
      id: 'e5-a4-ciclo',
      tipo: 'pseudo',
      nivel: 'base',
      puntos: 120,
      titulo: 'Repara el ciclo',
      objetivo: 'Encontrar y corregir un ciclo que no termina o que cuenta mal.',
      instrucciones:
        'El algoritmo de abajo debería escribir los números del 1 al n, uno por línea, y después su suma. Tiene dos defectos. Corrígelos y ejecuta las pruebas. No lo reescribas desde cero: encuentra qué está mal.',
      conceptoPrevio: 'Un ciclo Mientras necesita que algo dentro del cuerpo modifique la condición.',
      conceptos: ['algoritmo', 'contador', 'acumulador'],
      requisitos: [
        'Lee n.',
        'Escribe los números del 1 al n, uno por línea, sin ningún texto adicional.',
        'Al final escribe: SUMA: seguido del total. Ejemplo exacto: SUMA: 15',
        'Si n es 0, no escribe ningún número y la suma es 0.',
      ],
      plantilla: `Algoritmo Contar
	Definir n, i, suma Como Entero
	Leer n
	i <- 1
	Mientras i <= n Hacer
		suma <- 0
		Escribir i
		suma <- suma + i
	FinMientras
	Escribir "SUMA: ", suma
FinAlgoritmo`,
      casos: [
        { descripcion: 'Caso normal', entradas: [5], esperado: ['1', '2', '3', '4', '5', 'SUMA: 15'] },
        { descripcion: 'Un solo número', entradas: [1], esperado: ['1', 'SUMA: 1'] },
        { descripcion: 'Límite: n = 0, no escribe números', entradas: [0], esperado: ['SUMA: 0'] },
        { descripcion: 'Valor mayor', entradas: [10], esperado: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'SUMA: 55'] },
      ],
      pistas: [
        'Primer defecto: ejecuta el algoritmo tal como está y mira qué pasa. ¿Qué modifica el valor de i dentro del ciclo? Nada.',
        'Segundo defecto: `suma <- 0` está dentro del ciclo. Piensa qué le ocurre a la suma en cada vuelta.',
        'La inicialización de suma debe ir antes del Mientras, y hay que agregar `i <- i + 1` al final del cuerpo del ciclo.',
      ],
      solucion: `Algoritmo Contar
	Definir n, i, suma Como Entero
	Leer n
	i <- 1
	suma <- 0
	Mientras i <= n Hacer
		Escribir i
		suma <- suma + i
		i <- i + 1
	FinMientras
	Escribir "SUMA: ", suma
FinAlgoritmo`,
      explicacion:
        'Dos defectos de naturaleza distinta. El primero —no incrementar i— produce un ciclo infinito: el intérprete lo detiene con un aviso en vez de congelar la página, pero en un programa real bloquearía el equipo. El segundo —inicializar suma dentro del ciclo— es peor porque es silencioso: el programa termina, no da error, y devuelve siempre el último número en vez de la suma. Los defectos que no se anuncian son los que llegan a producción. El caso con n = 0 confirma además que el Mientras evalúa la condición ANTES de entrar: con n = 0 el cuerpo no se ejecuta ni una vez.',
    },

    /* ------------------------------------------------------------------ 5 */
    {
      id: 'e5-a5-contador',
      tipo: 'completar',
      nivel: 'base',
      puntos: 130,
      titulo: 'Contador o acumulador',
      objetivo: 'Distinguir en la práctica qué variable cuenta y cuál suma, y ver qué representa cada una.',
      instrucciones:
        'El algoritmo debe leer n notas y reportar cuántas aprobaron (≥ 3,0) y el total sumado de todas. Completa los huecos. Al verificar podrás ver la traza de las variables para comprobar qué hace cada una en cada vuelta.',
      conceptoPrevio: 'Contador crece de a 1 bajo condición; acumulador crece según el valor leído.',
      conceptos: ['contador', 'acumulador', 'variable'],
      mostrarTraza: true,
      trazaEntradas: [4, 2.0, 3.0, 4.5, 1.5],
      plantilla: `Algoritmo Notas
	Definir n, i, aprobados Como Entero
	Definir nota, total Como Real
	Leer n
	aprobados <- {{h1}}
	total <- {{h2}}
	Para i <- 1 Hasta n Hacer
		Leer nota
		total <- {{h3}}
		Si nota >= 3 Entonces
			aprobados <- {{h4}}
		FinSi
	FinPara
	Escribir "APROBADOS: ", aprobados
	Escribir "TOTAL: ", total
FinAlgoritmo`,
      huecos: {
        h1: {
          etiqueta: 'Valor inicial del contador',
          opciones: ['0', '1', 'n'],
          porQueNo: {
            1: 'Empezar en 1 daría una aprobada de más incluso si ninguna llega a 3,0.',
            n: 'No tiene sentido: n es cuántas notas hay, no cuántas aprobaron.',
          },
        },
        h2: {
          etiqueta: 'Valor inicial del acumulador',
          opciones: ['0', '1', 'nota'],
          porQueNo: {
            1: 'Un acumulador de suma arranca en 0. El 1 se usa cuando acumula productos, porque es el neutro de la multiplicación.',
            nota: '`nota` todavía no tiene valor en ese punto: el intérprete lo rechazaría.',
          },
        },
        h3: {
          etiqueta: 'Cómo crece el acumulador',
          opciones: ['total + nota', 'total + 1', 'nota', 'total + n'],
          porQueNo: {
            'total + 1': 'Eso es un contador: contaría las notas en vez de sumar su valor.',
            nota: 'Sobrescribiría el total en cada vuelta: al final valdría la última nota leída.',
            'total + n': 'Sumaría siempre la cantidad de notas, no el valor de cada una.',
          },
        },
        h4: {
          etiqueta: 'Cómo crece el contador',
          opciones: ['aprobados + 1', 'aprobados + nota', 'aprobados + n', '1'],
          porQueNo: {
            'aprobados + nota': 'Eso es un acumulador: sumaría el valor de la nota en vez de contar una ocurrencia.',
            'aprobados + n': 'Sumaría la cantidad total de notas cada vez que una aprueba.',
            1: 'Asignar 1 en vez de incrementar deja el resultado en 1 sin importar cuántas aprueben.',
          },
        },
      },
      casos: [
        { descripcion: 'Grupo mixto', entradas: [4, 2.0, 3.0, 4.5, 1.5], esperado: ['APROBADOS: 2', 'TOTAL: 11'] },
        { descripcion: 'Ninguna aprueba', entradas: [3, 1.0, 2.0, 2.9], esperado: ['APROBADOS: 0', 'TOTAL: 5.9'] },
        { descripcion: 'Frontera: exactamente 3,0', entradas: [1, 3.0], esperado: ['APROBADOS: 1', 'TOTAL: 3'] },
        { descripcion: 'Todas aprueban', entradas: [3, 3.0, 4.0, 5.0], esperado: ['APROBADOS: 3', 'TOTAL: 12'] },
      ],
      pistas: [
        'Pregúntate de cada variable: ¿responde «cuántos» o «cuánto en total»? La primera es contador, la segunda acumulador.',
        'Las dos inicializaciones son 0, pero por razones distintas: el contador porque aún no hay ninguno, el acumulador porque 0 es el neutro de la suma.',
        'Si un acumulador creciera de a 1, sería un contador con otro nombre: lo que lo hace acumulador es sumar el VALOR leído.',
      ],
      explicacion:
        'Las cuatro opciones incorrectas de h3 y h4 son exactamente los cuatro errores que se ven en los parciales: confundir contador con acumulador en cualquiera de las dos direcciones, sobrescribir en vez de acumular, y asignar en vez de incrementar. La traza que puedes abrir al terminar muestra la diferencia con claridad: `aprobados` sube de a 1 y solo a veces; `total` sube en cantidades distintas y siempre.',
    },

    /* ------------------------------------------------------------------ 6 */
    {
      id: 'e5-a6-objetos',
      tipo: 'clase-objeto',
      nivel: 'base',
      puntos: 120,
      titulo: 'Del objeto a la clase',
      objetivo: 'Agrupar objetos bajo la clase que los describe y separar atributos de métodos.',
      instrucciones:
        'Primera parte: agrupa los objetos bajo su clase. Segunda parte: decide si cada elemento es un atributo o un método de esa clase.',
      conceptoPrevio: 'Clase es la plantilla; objeto es el ejemplar concreto. Atributos son sustantivos; métodos, verbos.',
      conceptos: ['clase', 'objeto', 'atributo', 'metodo'],
      clases: [
        { id: 'sala', nombre: 'Sala' },
        { id: 'reserva', nombre: 'Reserva' },
        { id: 'estudiante', nombre: 'Estudiante' },
      ],
      objetos: [
        { texto: 'La sala 203, con capacidad para 30 personas', clase: 'sala', porQue: 'Es un ejemplar concreto que se puede señalar. La clase que lo describe es Sala.' },
        { texto: 'El auditorio del bloque B, con proyector', clase: 'sala', porQue: 'Otro ejemplar de Sala, con valores distintos en sus atributos.' },
        { texto: 'El apartado de la 203 del martes de 10 a 12 a nombre de Laura', clase: 'reserva', porQue: 'Relaciona una sala, un estudiante y una franja: eso es una Reserva.' },
        { texto: 'El apartado del laboratorio del jueves de 2 a 4 a nombre de Andrés', clase: 'reserva', porQue: 'Otro ejemplar de Reserva.' },
        { texto: 'Laura Ospina, código 2026110, de Ingeniería Informática', clase: 'estudiante', porQue: 'Persona concreta con sus datos: ejemplar de Estudiante.' },
        { texto: 'Andrés Muñoz, código 2026145, de Diseño Visual', clase: 'estudiante', porQue: 'Otro ejemplar de Estudiante.' },
      ],
      miembros: [
        { texto: 'capacidad', clase: 'sala', tipo: 'atributo', porQue: 'Sustantivo: describe un estado del objeto.' },
        { texto: 'estaDisponible(franja)', clase: 'sala', tipo: 'metodo', porQue: 'Verbo: consulta el estado y devuelve una respuesta.' },
        { texto: 'tieneProyector', clase: 'sala', tipo: 'atributo', porQue: 'Aunque suene a pregunta, guarda un dato verdadero/falso del objeto.' },
        { texto: 'horaInicio', clase: 'reserva', tipo: 'atributo', porQue: 'Dato que describe la reserva.' },
        { texto: 'cancelar()', clase: 'reserva', tipo: 'metodo', porQue: 'Verbo: cambia el estado de la reserva.' },
        { texto: 'duracion()', clase: 'reserva', tipo: 'metodo', porQue: 'Calcula a partir de sus propios atributos. No se guarda: se deriva.' },
        { texto: 'codigoEstudiantil', clase: 'estudiante', tipo: 'atributo', porQue: 'Dato identificador del objeto.' },
        { texto: 'reservasActivas()', clase: 'estudiante', tipo: 'metodo', porQue: 'Verbo: consulta y devuelve una cantidad calculada.' },
      ],
      distractores: [
        {
          texto: 'Sala203',
          porQue:
            'No es una clase: es el nombre de un objeto concreto. Si cada sala fuera una clase, habría que modificar el programa cada vez que la universidad habilite un aula.',
        },
        {
          texto: '30',
          porQue:
            'No es clase, ni objeto, ni miembro: es el VALOR que toma el atributo capacidad en un objeto determinado.',
        },
      ],
      pistas: [
        'Para separar clase de objeto: si puedes contar cuántos hay o señalar uno, es objeto. Si es el molde que describe a todos, es clase.',
        'Para separar atributo de método: si responde «qué sé de este objeto» es atributo; si responde «qué sabe hacer» es método.',
        'Ojo con `tieneProyector`: parece pregunta pero guarda un dato. Y con `duracion()`: parece dato pero se calcula.',
      ],
      explicacion:
        'Dos casos merecen atención. `tieneProyector` es atributo aunque suene a pregunta, porque guarda un estado que no se deduce de nada más. `duracion()` es método aunque suene a dato, porque se calcula a partir de horaInicio y horaFin: guardarlo como atributo crearía la posibilidad de que quede desactualizado respecto de las horas, que es el tipo de inconsistencia que la orientación a objetos existe para evitar. Y los dos distractores señalan el error más frecuente: confundir el valor de un atributo, o el nombre de un ejemplar, con una clase.',
    },

    /* ------------------------------------------------------------------ 7 */
    {
      id: 'e5-a7-centinela',
      tipo: 'pseudo',
      nivel: 'opcional',
      puntos: 130,
      titulo: 'Lectura con centinela',
      objetivo: 'Procesar una cantidad desconocida de datos usando un valor de fin acordado.',
      instrucciones:
        'Escribe el algoritmo. Se ejecuta contra cuatro casos, incluido el que llega con el centinela de primeras.',
      conceptoPrevio: 'Lectura adelantada: leer una vez antes del ciclo y volver a leer al final del cuerpo.',
      conceptos: ['centinela', 'acumulador', 'contador'],
      requisitos: [
        'Lee valores uno a uno hasta leer −1. El −1 marca el fin y NO se suma.',
        'Escribe: SUMA: seguido del total. Ejemplo exacto: SUMA: 25',
        'En la línea siguiente escribe: DATOS: seguido de cuántos valores se sumaron, sin contar el −1.',
        'Si el primer valor es −1, la suma es 0 y los datos son 0.',
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
        { descripcion: 'Límite: centinela inmediato', entradas: [-1], esperado: ['SUMA: 0', 'DATOS: 0'] },
        { descripcion: 'Negativos válidos que NO son el centinela', entradas: [-3, 10, -1], esperado: ['SUMA: 7', 'DATOS: 2'] },
      ],
      pistas: [
        'La primera lectura ya está hecha antes del ciclo. Dentro del Mientras, procesa el valor que ya tienes y lee el siguiente al final.',
        'La condición del Mientras compara x con el centinela: `Mientras x <> -1 Hacer`.',
        'Si lees al principio del cuerpo en vez de al final, el −1 entrará al acumulador y el primer valor se perderá.',
      ],
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
        'El caso del centinela inmediato comprueba que el Mientras evalúa antes de entrar: con −1 como primer dato el cuerpo no se ejecuta y los dos resultados quedan en 0. El último caso es el más instructivo: −3 se suma con normalidad, porque el centinela es exactamente −1 y no «cualquier negativo». Quien resolvió con `Mientras x > 0` pasa los tres primeros casos y falla el cuarto; por eso el cuarto está ahí.',
    },
  ],

  reto: {
    id: 'e5-reto',
    tipo: 'pseudo',
    nivel: 'base',
    puntos: 170,
    titulo: 'Reto integrador · Informe de notas',
    objetivo: 'Combinar contador, acumulador y máximo en un solo algoritmo que pase casos normales y límite.',
    instrucciones:
      'Este reto junta todo lo de la estación. Se ejecuta contra cinco casos, dos de ellos límite. Tienes pistas progresivas y, si lo necesitas, la solución (que vale 0 puntos pero te deja estudiarla).',
    conceptoPrevio: 'Todos los patrones de la estación.',
    conceptos: ['algoritmo', 'contador', 'acumulador', 'variable'],
    requisitos: [
      'Lee n y luego n notas (escala de 0,0 a 5,0).',
      'Escribe: PROMEDIO: seguido del promedio con un decimal. Ejemplo exacto: PROMEDIO: 3.5',
      'En la segunda línea: APROBADOS: seguido de cuántas notas son mayores o iguales a 3.',
      'En la tercera línea: MAXIMA: seguida de la nota más alta.',
      'El promedio se trunca a un decimal, no se redondea: usa trunc(suma / n * 10) / 10.',
    ],
    plantilla: `Algoritmo Informe
	Definir n, i, aprobados Como Entero
	Definir nota, suma, maxima Como Real
	Leer n
	suma <- 0
	aprobados <- 0
	maxima <- 0
	// procesa aquí
FinAlgoritmo`,
    casos: [
      { descripcion: 'Grupo mixto', entradas: [4, 2.0, 3.0, 4.0, 5.0], esperado: ['PROMEDIO: 3.5', 'APROBADOS: 3', 'MAXIMA: 5'] },
      { descripcion: 'Todos reprueban', entradas: [3, 1.0, 2.0, 2.4], esperado: ['PROMEDIO: 1.8', 'APROBADOS: 0', 'MAXIMA: 2.4'] },
      { descripcion: 'Límite: una sola nota', entradas: [1, 4.2], esperado: ['PROMEDIO: 4.2', 'APROBADOS: 1', 'MAXIMA: 4.2'] },
      { descripcion: 'Frontera: la nota 3,0 exacta aprueba', entradas: [2, 3.0, 2.9], esperado: ['PROMEDIO: 2.9', 'APROBADOS: 1', 'MAXIMA: 3'] },
      { descripcion: 'Todas iguales', entradas: [3, 4.0, 4.0, 4.0], esperado: ['PROMEDIO: 4', 'APROBADOS: 3', 'MAXIMA: 4'] },
    ],
    pistas: [
      'Necesitas tres variables que sobrevivan al ciclo: suma (acumulador), aprobados (contador) y maxima. Las tres se inicializan antes del Para.',
      'Para la máxima: dentro del ciclo, si la nota leída es mayor que maxima, maxima toma ese valor. Como la escala arranca en 0, inicializar maxima en 0 funciona.',
      'Para el promedio con un decimal usa exactamente: trunc(suma / n * 10) / 10. Multiplica por 10, corta los decimales y vuelve a dividir.',
    ],
    solucion: `Algoritmo Informe
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
	Escribir "PROMEDIO: ", trunc(suma / n * 10) / 10
	Escribir "APROBADOS: ", aprobados
	Escribir "MAXIMA: ", maxima
FinAlgoritmo`,
    explicacion:
      'Tres patrones distintos conviviendo en el mismo ciclo: un acumulador (suma), un contador (aprobados) y una comparación que retiene el mejor valor visto (maxima). El caso de la nota 3,0 exacta vuelve a poner a prueba >= contra >, y el de una sola nota comprueba que el ciclo funciona con una vuelta. Sobre `maxima <- 0`: funciona porque la escala no admite negativos. Si las notas pudieran ser negativas, habría que inicializarla con la primera nota leída, y ese detalle —qué valor inicial usar para un máximo— es una pregunta clásica de parcial.',
  },

  sintesis: {
    puntos: [
      'Antes de escribir: entrada, proceso y salida, con el formato exacto de la salida.',
      'La asignación no es una igualdad: se evalúa la derecha y se guarda en la izquierda. Por eso x <- x + 1 tiene sentido.',
      'Contador responde «cuántos» y crece de a 1; acumulador responde «cuánto en total» y crece según el valor leído.',
      'Inicializar dentro del ciclo es el defecto silencioso más común: el programa no falla, solo entrega un resultado equivocado.',
      'Con centinela se usa lectura adelantada: leer antes del ciclo y volver a leer al final del cuerpo.',
      'Los casos límite de un algoritmo son los de la estación 3: una sola vuelta, cero vueltas, el valor exacto de la frontera.',
      'Clase es el molde, objeto es el ejemplar. Atributos son sustantivos (estado); métodos, verbos (comportamiento).',
      'Un paradigma reparte la responsabilidad de otra manera; la lógica del algoritmo sigue siendo la misma.',
    ],
    conexion:
      'Lo que hiciste aquí es lo que hace un ingeniero informático la mayor parte del tiempo, aunque con otro lenguaje: decidir qué datos entran, qué transformación ocurre y qué sale, y comprobarlo con casos que incluyan los bordes. En el reto final de la estación 6 vas a resolver un algoritmo pequeño junto con decisiones de requisitos, calidad y datos personales, porque en un proyecto real esas cosas no vienen separadas.',
  },

  glosario: ['algoritmo', 'variable', 'asignacion', 'contador', 'acumulador', 'bandera', 'centinela', 'programacion-estructurada', 'clase', 'objeto', 'atributo', 'metodo'],

  taller: {
    id: 'e5-taller',
    tipo: 'taller',
    nivel: 'base',
    puntos: 0,
    titulo: 'Taller en clase · Tu algoritmo, explicado',
    objetivo: 'Escribir un algoritmo propio y sostener sus decisiones por escrito.',
    instrucciones:
      'Individual o en parejas. Pueden probar el algoritmo en el laboratorio de pseudocódigo de esta aplicación antes de entregarlo.',
    conceptoPrevio: 'Toda la estación.',
    enunciado:
      'Elijan un problema de la lista, escriban el algoritmo en pseudocódigo y expliquen sus decisiones: qué variables eligieron y por qué, y qué casos límite probaron.',
    temas: [
      'Dado un conjunto de notas, informar cuántas están por encima del promedio del grupo.',
      'Dado un conjunto de tiempos de espera en el casino, informar el mayor, el menor y el promedio.',
      'Leer las reservas de una semana e informar qué día tuvo más.',
      'Determinar si una palabra es palíndroma.',
      'Leer una cantidad de dinero e informar con cuántos billetes de cada denominación se paga.',
      'Contar cuántas veces aparece un valor dentro de una lista de n datos.',
    ],
    campos: [
      { id: 'problema', etiqueta: 'Problema elegido y su entrada, proceso y salida (con formato exacto de la salida)', filas: 3 },
      { id: 'variables', etiqueta: 'Variables usadas: nombre, qué representa y si es contador, acumulador, bandera o dato temporal', filas: 4 },
      { id: 'codigo', etiqueta: 'Pseudocódigo completo', filas: 14, mono: true },
      { id: 'limites', etiqueta: 'Casos límite que probaron y qué descubrió cada uno', filas: 4 },
      { id: 'decision', etiqueta: 'Una decisión que tomaron y su alternativa descartada, con el motivo', filas: 3 },
    ],
    listaChequeo: [
      'El enunciado indica el formato exacto de la salida.',
      'Todas las variables están inicializadas antes del ciclo que las usa.',
      'Probamos el caso de cero elementos o cero vueltas.',
      'Probamos el valor exacto de la frontera de cada comparación.',
      'El algoritmo termina en todos los casos probados.',
      'Cada variable tiene un nombre que dice qué guarda.',
    ],
    rubrica: [
      'El algoritmo produce la salida correcta en los casos normales y en los límite. (40 %)',
      'La explicación de las variables identifica correctamente el papel de cada una. (30 %)',
      'Los casos límite elegidos son los que efectivamente pueden fallar, no repeticiones del caso normal. (30 %)',
    ],
  },
}
