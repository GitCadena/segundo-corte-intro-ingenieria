const PALABRAS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']

/** Número en letras para textos que cuentan estaciones, para que no queden desactualizados. */
export function enLetras(n, { capital = false } = {}) {
  const p = PALABRAS[n] ?? String(n)
  return capital ? p.charAt(0).toUpperCase() + p.slice(1) : p
}
