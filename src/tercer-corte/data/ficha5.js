/**
 * Contenido de la Ficha 5: por qué el pseudocódigo importó y cómo se ve el mismo
 * algoritmo de la ficha 4 en tres lenguajes (línea por línea).
 */

export const ARGUMENTOS = [
  {
    titulo: 'Ya saben qué debe hacer el programa',
    texto:
      'Nadie construye una casa sin plano. Su pseudocódigo es el plano: dice qué datos entran, qué se repite, qué se decide y qué sale. Quien escribe código sin plano descubre el problema a la mitad del trabajo.',
  },
  {
    titulo: 'No depende del lenguaje',
    texto:
      'Miren la tabla de abajo: el mismo algoritmo se escribe en Python, JavaScript o Java, y solo cambian los símbolos. La parte difícil (la lógica) ya la resolvieron. Elegir lenguaje ahora es traducir, no empezar de cero.',
  },
  {
    titulo: 'La prueba de escritorio les dio la respuesta correcta',
    texto:
      'Ya saben cuánto debe dar su proceso con un caso real. Cuando programen y el resultado sea otro, sabrán que el error está en el código y no en la idea. Eso ahorra horas de adivinar.',
  },
  {
    titulo: 'Es el lenguaje común del equipo',
    texto:
      'Cualquier integrante puede leerlo, aunque no conozca el lenguaje. Y se puede repartir el trabajo por bloques: uno traduce la entrada, otro la repetición, otro la decisión, otro la salida.',
  },
]

// Cada fila: qué hace la línea, el pseudocódigo y su traducción en cada lenguaje.
export const TRADUCCION = [
  {
    parte: 'Preparar',
    pseudo: 'PROCESO calcularTotal\nENTRADA: productos (lista)',
    python: 'def calcular_total(productos):',
    javascript: 'function calcularTotal(productos) {',
    java: 'static double calcularTotal(List<Producto> productos) {',
  },
  { parte: 'Preparar', pseudo: 'total ← 0', python: '    total = 0', javascript: '  let total = 0;', java: '  double total = 0;' },
  { parte: 'Preparar', pseudo: 'unidades ← 0', python: '    unidades = 0', javascript: '  let unidades = 0;', java: '  int unidades = 0;' },
  {
    parte: 'Repetir',
    pseudo: 'PARA CADA item EN productos',
    python: '    for item in productos:',
    javascript: '  for (const item of productos) {',
    java: '  for (Producto item : productos) {',
  },
  {
    parte: 'Repetir',
    pseudo: '  total ← total + item.cantidad × item.precio',
    python: '        total = total + item["cantidad"] * item["precio"]',
    javascript: '    total = total + item.cantidad * item.precio;',
    java: '    total = total + item.cantidad * item.precio;',
  },
  {
    parte: 'Repetir',
    pseudo: '  unidades ← unidades + item.cantidad',
    python: '        unidades = unidades + item["cantidad"]',
    javascript: '    unidades = unidades + item.cantidad;',
    java: '    unidades = unidades + item.cantidad;',
  },
  { parte: 'Repetir', pseudo: 'FIN PARA', python: '    # (la sangría marca dónde termina)', javascript: '  }', java: '  }' },
  {
    parte: 'Decidir',
    pseudo: 'SI unidades ≥ 10 ENTONCES',
    python: '    if unidades >= 10:',
    javascript: '  let descuento;\n  if (unidades >= 10) {',
    java: '  double descuento;\n  if (unidades >= 10) {',
  },
  { parte: 'Decidir', pseudo: '  descuento ← total × 0,1', python: '        descuento = total * 0.1', javascript: '    descuento = total * 0.1;', java: '    descuento = total * 0.1;' },
  { parte: 'Decidir', pseudo: 'SI NO', python: '    else:', javascript: '  } else {', java: '  } else {' },
  { parte: 'Decidir', pseudo: '  descuento ← 0', python: '        descuento = 0', javascript: '    descuento = 0;', java: '    descuento = 0;' },
  { parte: 'Decidir', pseudo: 'FIN SI', python: '    # (la sangría marca dónde termina)', javascript: '  }', java: '  }' },
  { parte: 'Entregar', pseudo: 'total ← total − descuento', python: '    total = total - descuento', javascript: '  total = total - descuento;', java: '  total = total - descuento;' },
  { parte: 'Entregar', pseudo: 'SALIDA: total', python: '    return total', javascript: '  return total;\n}', java: '  return total;\n}' },
]

export const LENGUAJES_TRADUCCION = [
  { id: 'python', nombre: 'Python', nota: 'Fíjate: casi no hay símbolos. La sangría reemplaza a FIN PARA y FIN SI.' },
  { id: 'javascript', nombre: 'JavaScript', nota: 'Aquí las llaves { } hacen el papel de FIN PARA y FIN SI, y cada instrucción termina en «;».' },
  { id: 'java', nombre: 'Java', nota: 'Igual que JavaScript, pero cada dato declara su tipo (double, int) y todo vive dentro de una clase.' },
]

export const PASOS_PARA_PROGRAMAR = [
  {
    titulo: 'Escojan uno o dos lenguajes para probar',
    texto: 'No tienen que decidir todavía. Prueben el que les llame la atención y, si alcanzan, un segundo para comparar.',
  },
  {
    titulo: 'Traduzcan su pseudocódigo de la ficha 4',
    texto: 'Usen la tabla de arriba como guía: cada línea del pseudocódigo se vuelve una línea (o dos) de código. Empiecen por la entrada, el ciclo y la decisión.',
  },
  {
    titulo: 'Ejecútenlo con su caso de la ficha 4',
    texto: 'Usen el mismo caso de su prueba de escritorio. Si el resultado coincide con el que calcularon a mano, la traducción está bien.',
  },
  {
    titulo: 'Cuenten qué tal les fue',
    texto: 'Qué les resultó fácil, qué les costó y qué no entendieron. Eso es lo que va a decidir su lenguaje en la parte D.',
  },
]

export const HERRAMIENTAS = [
  'Un compilador en línea (por ejemplo OnlineGDB, Replit o JDoodle): no hay que instalar nada.',
  'La consola del navegador (tecla F12): sirve para probar JavaScript.',
  'Un editor instalado en el computador (VS Code, IDLE, Visual Studio, NetBeans…).',
  'Si no lo pueden ejecutar, escriban el código igual y anoten qué les faltó. Se valora el intento.',
]

export const EJEMPLO_PROGRAMAR = {
  lenguaje: 'Python (y JavaScript para comparar).',
  herramienta: 'Un compilador en línea, desde el celular y desde la sala de cómputo.',
  codigo: 'def calcular_total(productos):\n    total = 0\n    unidades = 0\n    for item in productos:\n        total = total + item["cantidad"] * item["precio"]\n        unidades = unidades + item["cantidad"]\n    ...',
  resultado: 'Sí, con el pedido de 10 panes y 2 tortas dio 31.500, igual que en la prueba de escritorio.',
  nota: 'En Python casi no hubo que pensar: se parece al pseudocódigo. En JavaScript nos costó acordarnos de las llaves y los «;».',
}

export const PARA_LA_SUSTENTACION = [
  'El pseudocódigo del proceso principal (ficha 4) con su prueba de escritorio: es su plano.',
  'La traducción a código que hicieron y qué resultado les dio con el caso de prueba.',
  'El paradigma que eligieron y la justificación, hablando de su problema.',
  'Las clases (o funciones) del programa y qué hace cada una.',
  'El lenguaje elegido, las razones (apóyense en lo que probaron) y qué van a programar primero.',
]
