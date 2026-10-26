/**
 * Actividades que se ocultan según el grupo del estudiante.
 *
 * Sirve para ajustar el ritmo de un grupo que va con poco tiempo sin tocar el
 * contenido de los demás. Una actividad oculta no se muestra en su estación ni
 * en el panel, y tampoco cuenta para el avance, los logros ni la nota
 * orientativa de quien no la ve. El historial que ya exista no se borra.
 * El docente la sigue viendo completa en su panel.
 *
 * El grupo se reconoce por el nombre que trae el perfil («Grupo 1»).
 */

// Sin reglas activas. El Grupo 1 tuvo ocultas «¿Necesitas ese dato?» y «Protección de
// datos o delito informático» (e4-a5-datos y e4-a6-leyes) mientras iba corto de tiempo;
// el 26 de octubre se habilitaron de nuevo para que pudieran completar toda la estación.
// Para ocultar algo a un grupo otra vez: { grupo: /^grupo\s*1$/i, ocultas: ['id-de-actividad'] }
const REGLAS = []

/** Conjunto de identificadores de actividad que no debe ver ese grupo. */
export function idsOcultos(grupo) {
  const nombre = String(grupo ?? '').trim()
  return new Set(REGLAS.filter((r) => r.grupo.test(nombre)).flatMap((r) => r.ocultas))
}

/**
 * Orden en que cada grupo ve las estaciones. Es solo de presentación: los
 * identificadores, los intentos y las notas no cambian, así que calificaciones
 * y avance son los mismos. El Grupo 3 trabajó el ciclo de vida antes que la ley
 * de Moore, y por eso ve primero el ciclo de vida (4) y después Moore (5).
 */
const ORDEN_POR_GRUPO = [
  {
    grupo: /^grupo\s*3$/i,
    orden: { cdvs: 4, tic: 5 },
  },
]

/** Número con el que ese grupo ve la estación. */
export function ordenDe(grupo, estacion) {
  const nombre = String(grupo ?? '').trim()
  const regla = ORDEN_POR_GRUPO.find((r) => r.grupo.test(nombre))
  return regla?.orden[estacion.id] ?? estacion.orden
}

/** Estaciones con el número y el orden que ve ese grupo. */
export function estacionesPara(grupo, lista) {
  return lista.map((e) => ({ ...e, orden: ordenDe(grupo, e) })).sort((a, b) => a.orden - b.orden)
}

/**
 * Actividades que, para un grupo, se pueden hacer pero no son obligatorias: se
 * tratan como opcionales (no cuentan para completar la estación ni para la nota
 * orientativa). Se usa cuando la nota de ese grupo se calculó sin ellas.
 * El Grupo 1 se evalúa sobre 27 actividades base (2190 puntos): «¿Necesitas ese
 * dato?» queda disponible para quien quiera, pero opcional.
 */
const OPCIONALES_POR_GRUPO = [
  {
    grupo: /^grupo\s*1$/i,
    ids: ['e4-a5-datos'],
  },
]

/** Devuelve la actividad tal como la cuenta ese grupo (nivel y nota). */
export function ajustarActividad(grupo, actividad) {
  const nombre = String(grupo ?? '').trim()
  const regla = OPCIONALES_POR_GRUPO.find((r) => r.grupo.test(nombre))
  if (!regla?.ids.includes(actividad.id)) return actividad
  return { ...actividad, nivel: 'opcional', cuentaNota: false, cuenta_nota: false }
}
