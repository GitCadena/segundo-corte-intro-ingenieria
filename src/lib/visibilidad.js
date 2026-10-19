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

const REGLAS = [
  {
    grupo: /^grupo\s*1$/i,
    ocultas: ['e4-a5-datos', 'e4-a6-leyes'],
  },
]

/** Conjunto de identificadores de actividad que no debe ver ese grupo. */
export function idsOcultos(grupo) {
  const nombre = String(grupo ?? '').trim()
  return new Set(REGLAS.filter((r) => r.grupo.test(nombre)).flatMap((r) => r.ocultas))
}
