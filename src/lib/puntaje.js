/**
 * Reglas de puntaje del curso.
 *
 * Este archivo es la versión que ve el estudiante en pantalla. La versión que
 * MANDA es la función puntaje_de() de la migración SQL: el navegador informa
 * evidencia (acertó / cuántas pistas abrió / cuántos intentos falló) y el
 * servidor recalcula. Si algún día cambian, la de Postgres es la correcta.
 *
 * Diseño deliberado:
 *  - No hay puntos por repetir: el mejor puntaje se conserva, no se acumula.
 *  - Abrir una tarjeta o marcar una lista no da puntos.
 *  - Ver la solución completa da 0 puntos, pero la actividad queda "completada":
 *    sirve para estudiar, no para puntuar.
 *  - El piso del 40 % existe para que equivocarse varias veces siga valiendo la
 *    pena; sin piso, el estudiante que más necesita reintentar es el que menos
 *    gana.
 */

export const PENALIZACION_PISTA = 0.2
export const PENALIZACION_FALLO = 0.1
export const FACTOR_MINIMO = 0.4
export const MAX_PENALIZACIONES = 3

/** Puntaje obtenido en un intento concreto. */
export function calcularPuntaje({
  puntosMax,
  correcto,
  pistas = 0,
  intentosFallidos = 0,
  solucionVista = false,
}) {
  if (!correcto || solucionVista) return 0
  const factor = Math.max(
    FACTOR_MINIMO,
    1 -
      PENALIZACION_PISTA * Math.min(Math.max(pistas, 0), MAX_PENALIZACIONES) -
      PENALIZACION_FALLO * Math.min(Math.max(intentosFallidos, 0), MAX_PENALIZACIONES),
  )
  return Math.round(puntosMax * factor)
}

/**
 * Tres estados distintos, a propósito:
 *  intentada  → lo abrió y envió algo, todavía no lo resuelve.
 *  completada → lo resolvió, con ayuda o después de varios intentos.
 *  dominada   → lo resolvió al primer intento y sin pistas.
 * Abrir contenido no produce ninguno de los tres.
 */
export function calcularEstado({ correcto, pistas = 0, intentosFallidos = 0, solucionVista = false }) {
  if (!correcto) return 'intentada'
  if (pistas === 0 && intentosFallidos === 0 && !solucionVista) return 'dominada'
  return 'completada'
}

export const ORDEN_ESTADO = { intentada: 1, completada: 2, dominada: 3 }

/** El estado solo avanza: haber dominado algo no se pierde al reintentarlo. */
export function mejorEstado(a, b) {
  if (!a) return b
  if (!b) return a
  return ORDEN_ESTADO[a] >= ORDEN_ESTADO[b] ? a : b
}

export const ETIQUETA_ESTADO = {
  intentada: 'Intentada',
  completada: 'Completada',
  dominada: 'Dominio demostrado',
}

/** Vista previa de lo que vale el siguiente envío, para mostrarla antes de enviar. */
export function puntajePosible(puntosMax, pistas, intentosFallidos, solucionVista) {
  return calcularPuntaje({ puntosMax, correcto: true, pistas, intentosFallidos, solucionVista })
}
