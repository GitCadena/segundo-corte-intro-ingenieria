/**
 * Glosario contextual del corte.
 *
 * Cada entrada se muestra al tocar un término subrayado dentro de la teoría o
 * del enunciado de una actividad. La definición es de trabajo: dice qué es y
 * cómo se reconoce, no repite el nombre con otras palabras.
 */

const glosario = {
  /* ---- Estación 1: proceso ---- */
  proceso: {
    termino: 'Proceso de software',
    definicion:
      'Conjunto de actividades, restricciones y recursos que transforman una necesidad en un sistema que la resuelve y en la evidencia de que la resuelve.',
    ejemplo: 'Dos equipos entregan la misma app; uno con pruebas automáticas y otro sin ellas. El producto se parece, el proceso no.',
  },
  requisito: {
    termino: 'Requisito',
    definicion:
      'Afirmación sobre lo que el sistema debe hacer o cumplir, escrita de modo que alguien distinto del autor pueda comprobar si se cumple o no.',
    ejemplo: '"Responder en menos de 800 ms" se puede comprobar. "Ser rápido" no.',
  },
  'requisito-funcional': {
    termino: 'Requisito funcional',
    definicion: 'Describe una acción que el sistema realiza: qué entra, qué hace y qué sale.',
    ejemplo: 'El sistema permite cancelar una reserva hasta 30 minutos antes de la hora de inicio.',
  },
  restriccion: {
    termino: 'Restricción',
    definicion:
      'Límite impuesto a la solución que no describe una función: tecnología obligatoria, presupuesto, norma legal, plazo o compatibilidad exigida.',
    ejemplo: 'El sistema debe funcionar en los equipos de la sala 2, que tienen 4 GB de RAM.',
  },
  verificable: {
    termino: 'Verificable',
    definicion:
      'Un enunciado es verificable si se puede diseñar una prueba que lo haga fallar. Necesita magnitud, condición y umbral.',
    ejemplo: '"El 95 % de las consultas responde en menos de 800 ms con 200 usuarios concurrentes."',
  },
  iteracion: {
    termino: 'Iteración',
    definicion:
      'Vuelta completa por las actividades del proceso que termina en algo utilizable, aunque sea pequeño. Su valor está en que permite corregir antes de gastar más.',
    ejemplo: 'Dos semanas al final de las cuales el usuario puede reservar una sala, sin cancelar ni reportes todavía.',
  },
  incremento: {
    termino: 'Incremento',
    definicion: 'La porción de producto que agrega una iteración a lo ya construido.',
    ejemplo: 'La primera iteración entrega el registro; la segunda agrega la reserva.',
  },
  'actividad-sombrilla': {
    termino: 'Actividad sombrilla',
    definicion:
      'Actividad que corre en paralelo a todo el proceso y nunca "termina": gestión de riesgos, aseguramiento de calidad, control de versiones, medición y revisiones.',
    ejemplo: 'El control de versiones acompaña desde el primer día hasta el último parche.',
  },
  rol: {
    termino: 'Rol',
    definicion:
      'Conjunto de responsabilidades dentro del proceso. No es un cargo ni una persona: en un equipo de tres, una persona puede cubrir tres roles.',
    ejemplo: 'Quien escribe los criterios de aceptación ejerce el rol de analista, aunque su contrato diga "desarrollador".',
  },
  'alcance-minimo': {
    termino: 'Alcance mínimo',
    definicion:
      'Conjunto más pequeño de funcionalidades con el que el usuario ya puede resolver su necesidad de punta a punta.',
    ejemplo: 'Reservar y cancelar. Sin reportes, sin estadísticas y sin recordatorios.',
  },

  /* ---- Estación 2: calidad ---- */
  calidad: {
    termino: 'Calidad del software',
    definicion:
      'Grado en que el producto satisface necesidades declaradas e implícitas cuando se usa en condiciones específicas. Se afirma con evidencia, no con opinión.',
    ejemplo: 'Decir "la app es de calidad" sin datos de uso es una impresión, no una medición.',
  },
  square: {
    termino: 'SQuaRE (ISO/IEC 25000)',
    definicion:
      'Familia de normas de requisitos y evaluación de calidad del producto software. Reemplazó a ISO/IEC 9126 y se organiza en divisiones.',
    ejemplo: 'La división 2501n contiene los modelos de calidad; ISO/IEC 25010 es el del producto.',
  },
  'adecuacion-funcional': {
    termino: 'Adecuación funcional',
    definicion:
      'Grado en que las funciones cubren las necesidades declaradas. Sus subcaracterísticas son completitud, corrección y pertinencia funcional.',
    ejemplo: 'Falta el botón de cancelar: completitud. El botón existe pero cancela otra reserva: corrección.',
  },
  usabilidad: {
    termino: 'Usabilidad',
    definicion:
      'Grado en que usuarios determinados pueden usar el producto para lograr objetivos con eficacia, eficiencia y satisfacción. Se mide con personas, no se opina.',
    ejemplo: 'Tasa de éxito, tiempo en tarea y número de errores por tarea.',
  },
  'tasa-exito': {
    termino: 'Tasa de éxito',
    definicion:
      'Porcentaje de participantes que completan una tarea sin ayuda. Es la medida de usabilidad más barata y la que primero se reporta.',
    ejemplo: '7 de 10 completan la reserva → 70 %.',
  },
  'calidad-en-uso': {
    termino: 'Calidad en uso',
    definicion:
      'Cómo le va al usuario real con el producto en su contexto real. Es un modelo distinto del de calidad del producto y vive en ISO/IEC 25010 como segundo modelo.',
    ejemplo: 'El sistema cumple sus requisitos, pero el bibliotecario tarda 12 minutos en cada préstamo.',
  },

  /* ---- Estación 3: robustez ---- */
  robustez: {
    termino: 'Robustez',
    definicion:
      'Capacidad de seguir comportándose de forma razonable ante entradas inválidas, condiciones inesperadas o fallas del entorno.',
    ejemplo: 'Escribir letras en el campo de cantidad produce un mensaje, no una pantalla en blanco.',
  },
  validacion: {
    termino: 'Validación de entradas',
    definicion:
      'Comprobar, antes de usar un dato, que cumple el tipo, el rango y el formato esperados, y decidir qué pasa si no los cumple.',
    ejemplo: 'La cantidad debe ser entera, entre 1 y 5; si llega 0, se rechaza con un mensaje que dice el rango.',
  },
  frontera: {
    termino: 'Caso de frontera',
    definicion:
      'Valor justo en el borde de lo permitido o inmediatamente fuera de él. Es donde se concentran los defectos de comparación.',
    ejemplo: 'Si el rango válido es 1 a 5, las fronteras son 0, 1, 5 y 6.',
  },
  compatibilidad: {
    termino: 'Compatibilidad',
    definicion:
      'Capacidad de intercambiar información con otros productos o de coexistir con ellos compartiendo recursos, sin afectarse.',
    ejemplo: 'La app exporta un CSV que Excel abre sin corromper las tildes.',
  },
  portabilidad: {
    termino: 'Portabilidad',
    definicion:
      'Facilidad de llevar el producto a otro entorno de hardware, software o uso. Incluye adaptabilidad, facilidad de instalación y de reemplazo.',
    ejemplo: 'La misma app corre en Windows 10 y en Ubuntu sin cambiar el código.',
  },
  disponibilidad: {
    termino: 'Disponibilidad',
    definicion:
      'Proporción del tiempo en que el sistema está operativo y accesible cuando se necesita. Es subcaracterística de fiabilidad.',
    ejemplo: '99,5 % mensual admite unas 3,6 horas de caída al mes.',
  },
  defecto: {
    termino: 'Defecto',
    definicion:
      'Diferencia comprobable entre lo que el sistema hace y lo que debería hacer. Se reporta con pasos, resultado esperado y resultado observado.',
    ejemplo: '"No sirve" no es un reporte de defecto; es una queja.',
  },

  /* ---- Estación 4: informática y sociedad ---- */
  'ley-de-moore': {
    termino: 'Ley de Moore',
    definicion:
      'Observación empírica de Gordon Moore (1965, revisada en 1975) según la cual el número de transistores en un circuito integrado de costo mínimo se duplica aproximadamente cada dos años. No es una ley física.',
    ejemplo: 'Describe densidad de transistores, no velocidad de ejecución de un programa.',
  },
  exponencial: {
    termino: 'Crecimiento exponencial',
    definicion:
      'El valor se multiplica por un factor constante en cada periodo. La diferencia con el lineal no es "más rápido": es que la diferencia misma crece.',
    ejemplo: 'Sumar 100 cada año es lineal; duplicar cada año es exponencial.',
  },
  'brecha-digital': {
    termino: 'Brecha digital',
    definicion:
      'Desigualdad en el acceso, el uso y el aprovechamiento de las tecnologías de la información entre personas, grupos o territorios.',
    ejemplo: 'Dos estudiantes del mismo curso: uno con fibra óptica, otro con 500 MB de datos al mes.',
  },
  accesibilidad: {
    termino: 'Accesibilidad',
    definicion:
      'Grado en que el producto puede ser usado por personas con el mayor rango de características y capacidades, incluida la discapacidad.',
    ejemplo: 'Que el formulario se pueda completar solo con el teclado y que el lector de pantalla anuncie los errores.',
  },
  'datos-personales': {
    termino: 'Dato personal',
    definicion:
      'Cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable.',
    ejemplo: 'El código estudiantil identifica a una persona concreta: es dato personal.',
  },
  finalidad: {
    termino: 'Principio de finalidad',
    definicion:
      'Los datos se recogen para un propósito legítimo, informado al titular, y no se usan para otro distinto. Si no hay finalidad, no se pide el dato.',
    ejemplo: 'Un formulario de reserva de salas no necesita el tipo de sangre.',
  },

  /* ---- Estación 5: pensar como programador ---- */
  algoritmo: {
    termino: 'Algoritmo',
    definicion:
      'Secuencia finita, ordenada y no ambigua de pasos que, a partir de unas entradas, produce una salida y termina.',
    ejemplo: 'Si un paso admite dos interpretaciones o el proceso no termina, todavía no es un algoritmo.',
  },
  variable: {
    termino: 'Variable',
    definicion:
      'Nombre asociado a un espacio de memoria que guarda un valor y puede cambiarlo durante la ejecución.',
    ejemplo: 'suma <- suma + 1 lee el valor viejo, calcula y guarda el nuevo en el mismo nombre.',
  },
  asignacion: {
    termino: 'Asignación',
    definicion:
      'Operación que guarda el resultado de una expresión en una variable. Se lee de derecha a izquierda y no es una igualdad matemática.',
    ejemplo: 'x <- x + 1 es válido; en matemáticas, x = x + 1 no tiene solución.',
  },
  contador: {
    termino: 'Contador',
    definicion:
      'Variable que aumenta en una cantidad fija (casi siempre 1) cada vez que ocurre algo. Responde "cuántos".',
    ejemplo: 'cuantos <- cuantos + 1 por cada nota mayor o igual a 3,0.',
  },
  acumulador: {
    termino: 'Acumulador',
    definicion:
      'Variable que suma valores variables para responder "cuánto en total". Se inicializa en 0 (o en 1 si acumula productos).',
    ejemplo: 'total <- total + nota suma el valor de cada nota, no cuenta cuántas hay.',
  },
  bandera: {
    termino: 'Bandera',
    definicion:
      'Variable lógica que recuerda si una condición ya ocurrió, para decidir después. Se inicializa en Falso.',
    ejemplo: 'encontrado <- Verdadero cuando aparece el dato buscado, para no seguir buscando.',
  },
  centinela: {
    termino: 'Centinela',
    definicion:
      'Valor especial acordado que indica el fin de los datos, cuando no se sabe de antemano cuántos habrá.',
    ejemplo: 'Leer notas hasta que el usuario escriba -1.',
  },
  'programacion-estructurada': {
    termino: 'Programación estructurada',
    definicion:
      'Forma de construir programas usando solo tres estructuras de control —secuencia, selección y repetición— con una entrada y una salida por bloque.',
    ejemplo: 'Prescinde del salto incondicional, que vuelve el flujo imposible de seguir.',
  },
  clase: {
    termino: 'Clase',
    definicion:
      'Plantilla que define qué datos (atributos) y qué comportamientos (métodos) comparten los objetos de un mismo tipo.',
    ejemplo: 'Sala define nombre, capacidad y los métodos reservar() y liberar().',
  },
  objeto: {
    termino: 'Objeto',
    definicion: 'Ejemplar concreto de una clase, con valores propios en sus atributos.',
    ejemplo: 'La sala 203, con capacidad 30, es un objeto de la clase Sala.',
  },
  atributo: {
    termino: 'Atributo',
    definicion: 'Dato que describe el estado de un objeto.',
    ejemplo: 'capacidad = 30.',
  },
  metodo: {
    termino: 'Método',
    definicion: 'Comportamiento que un objeto sabe ejecutar, normalmente sobre sus propios atributos.',
    ejemplo: 'reservar(hora) cambia el estado de la sala a ocupada.',
  },
}

export default glosario

/** Lista alfabética, para la página de consulta del glosario. */
export const terminosOrdenados = Object.entries(glosario)
  .map(([clave, v]) => ({ clave, ...v }))
  .sort((a, b) => a.termino.localeCompare(b.termino, 'es'))
