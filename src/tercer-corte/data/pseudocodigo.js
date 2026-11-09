/**
 * Contenido de la Ficha 4: ejemplo guiado «calcularTotal» de la panadería
 * «La Esquina» y plantillas del constructor.
 */

/** Líneas del algoritmo en su orden correcto; `s` es la sangría (en niveles de 2 espacios). */
export const LINEAS_EJEMPLO = [
  { id: 'l1', s: 0, texto: 'PROCESO calcularTotal' },
  { id: 'l2', s: 0, texto: 'ENTRADA: productos (lista)' },
  { id: 'l3', s: 0, texto: 'total ← 0' },
  { id: 'l4', s: 0, texto: 'unidades ← 0' },
  { id: 'l5', s: 0, texto: 'PARA CADA item EN productos' },
  { id: 'l6', s: 1, texto: 'total ← total + item.cantidad × item.precio' },
  { id: 'l7', s: 1, texto: 'unidades ← unidades + item.cantidad' },
  { id: 'l8', s: 0, texto: 'FIN PARA' },
  { id: 'l9', s: 0, texto: 'SI unidades ≥ 10 ENTONCES' },
  { id: 'l10', s: 1, texto: 'descuento ← total × 0,1' },
  { id: 'l11', s: 0, texto: 'SI NO' },
  { id: 'l12', s: 1, texto: 'descuento ← 0' },
  { id: 'l13', s: 0, texto: 'FIN SI' },
  { id: 'l14', s: 0, texto: 'total ← total − descuento' },
  { id: 'l15', s: 0, texto: 'SALIDA: total' },
]

export const textoDeLineas = (lineas) => lineas.map((l) => `${'  '.repeat(l.s)}${l.texto}`).join('\n')

export const PSEUDO_EJEMPLO = textoDeLineas(LINEAS_EJEMPLO)

/** Caso del ejemplo: 10 panes a $500 y 2 tortas a $15.000. */
export const CASO_EJEMPLO = 'cantidad=10, precio=500\ncantidad=2, precio=15000'
export const ESPERADO_EJEMPLO = 31500

/** Versión con falla: el umbral del descuento quedó mal puesto (debería ser ≥ 10). */
export const LINEAS_CON_FALLA = LINEAS_EJEMPLO.map((l) => (l.id === 'l9' ? { ...l, texto: 'SI unidades > 12 ENTONCES' } : l))
export const PSEUDO_CON_FALLA = textoDeLineas(LINEAS_CON_FALLA)
export const LINEA_DE_LA_FALLA = 'l9'

export const EXPLICACION_FALLA =
  'El descuento es para quien compra 10 unidades o más. Con «> 12» solo lo recibe quien compra 13 o más, así que el pedido de 12 unidades se quedó sin descuento: dio 35.000 en vez de 31.500. La falla estaba en el umbral, no en el cálculo del descuento.'

/** Plantillas de inserción del constructor. `{}` marca dónde queda el cursor. */
export const PLANTILLAS = [
  { id: 'entrada', etiqueta: 'ENTRADA', texto: 'ENTRADA: nombre (tipo)' },
  { id: 'asignacion', etiqueta: '←  asignación', texto: 'variable ← valor' },
  { id: 'si', etiqueta: 'SI … SI NO', texto: 'SI condición ENTONCES\n  \nSI NO\n  \nFIN SI' },
  { id: 'mientras', etiqueta: 'MIENTRAS', texto: 'MIENTRAS condición\n  \nFIN MIENTRAS' },
  { id: 'para', etiqueta: 'PARA CADA', texto: 'PARA CADA item EN lista\n  \nFIN PARA' },
  { id: 'salida', etiqueta: 'SALIDA', texto: 'SALIDA: resultado' },
]

export const PALABRAS_CLAVE = ['PROCESO', 'ENTRADA', 'SALIDA', 'SI NO', 'SI', 'ENTONCES', 'FIN SI', 'MIENTRAS', 'FIN MIENTRAS', 'PARA CADA', 'EN', 'FIN PARA', 'HACER', 'Y', 'O', 'NO', 'VERDADERO', 'FALSO']

export const IDEAS_DE_PROCESO = [
  'Calcular el total de un pedido con descuento',
  'Verificar si un usuario puede iniciar sesión',
  'Buscar el producto más barato de una lista',
  'Contar cuántos elementos cumplen una condición',
  'Calcular el promedio de unas notas y decir si aprueba',
]
