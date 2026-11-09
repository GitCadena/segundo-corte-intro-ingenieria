/**
 * Contenido de la Ficha 3 · Calidad (ISO/IEC 25010).
 *
 * Los atributos son las características que ya se ven en la Estación 2 de la
 * página («¿Cuándo un software es bueno?»), con el nombre usado allí.
 */

export const ATRIBUTOS_ISO = [
  { id: 'adecuacion', nombre: 'Adecuación funcional (corrección funcional)', corto: 'Adecuación funcional' },
  { id: 'fiabilidad', nombre: 'Fiabilidad (robustez)', corto: 'Fiabilidad' },
  { id: 'usabilidad', nombre: 'Usabilidad', corto: 'Usabilidad' },
  { id: 'desempeno', nombre: 'Eficiencia de desempeño', corto: 'Eficiencia de desempeño' },
  { id: 'compatibilidad', nombre: 'Compatibilidad', corto: 'Compatibilidad' },
  { id: 'portabilidad', nombre: 'Portabilidad', corto: 'Portabilidad' },
  { id: 'seguridad', nombre: 'Seguridad', corto: 'Seguridad' },
  { id: 'mantenibilidad', nombre: 'Mantenibilidad', corto: 'Mantenibilidad' },
]

export const nombreAtributo = (id) => ATRIBUTOS_ISO.find((a) => a.id === id)?.nombre ?? ''

/** Ejemplo desplegable: la panadería «La Esquina». */
export const EJEMPLO_LA_ESQUINA = {
  titulo: 'Ejemplo: la panadería «La Esquina»',
  intro:
    'La Esquina quiere un sistema para registrar los pedidos del mostrador. Así se vería una ficha bien hecha con tres atributos:',
  atributos: [
    {
      atributo: 'Usabilidad',
      significa: 'Que una persona nueva pueda registrar un pedido sin que nadie le explique.',
      criterio: 'Registrar un pedido toma menos de 2 minutos.',
      prueba: 'Se cronometra a tres personas que nunca han usado el sistema, con un pedido de cinco productos.',
    },
    {
      atributo: 'Adecuación funcional (corrección funcional)',
      significa: 'Que el total que muestra el sistema sea el correcto.',
      criterio: 'El total coincide con el cálculo a mano en 10 de 10 pedidos.',
      prueba: 'Se registran 10 pedidos y se compara cada total con una calculadora.',
    },
    {
      atributo: 'Fiabilidad (robustez)',
      significa: 'Que el sistema no se dañe cuando alguien se equivoca al escribir.',
      criterio: 'Ante un dato faltante muestra un aviso y no se cierra (sí/no).',
      prueba: 'Se envía el formulario vacío y se revisa que aparezca el aviso y el programa siga abierto.',
    },
  ],
  importante:
    'El más importante es la corrección funcional: si el total está mal, la panadería pierde dinero aunque el sistema sea rápido y fácil de usar.',
}

export const NUMERO_ATRIBUTOS = 3
