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

export const EJEMPLO_PROCESO_2 = {
  proceso: 'armar la lista de producción del día. Recorre los pedidos con fecha de hoy (repetición), y si un producto ya está en la lista suma la cantidad; si no, lo agrega (decisión).',
  paradigma: 'orientado a objetos.',
  justificacion:
    'el problema tiene entidades claras (pedidos, productos y clientes) con datos propios. Cada una tiene reglas propias, como el descuento del pedido. Además, nuevos productos se agregan sin tocar el resto.',
  clases: 'Pedido (calcula su total), Producto (nombre y precio), Cliente (nombre y contacto).',
}

export const PARA_LA_SUSTENTACION = [
  'El pseudocódigo del proceso 1 (ficha 4) y del proceso 2, cada uno con su prueba de escritorio.',
  'El paradigma que eligieron y la justificación, hablando de su problema.',
  'Las clases (o funciones) del programa y qué hace cada una.',
  'El lenguaje elegido y las razones, y qué van a programar primero.',
]
