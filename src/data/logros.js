/**
 * Logros.
 *
 * Regla que los gobierna: cada logro se otorga por una evidencia de
 * aprendizaje comprobable en los datos, nunca por tiempo de permanencia,
 * cantidad de clics ni por repetir una actividad ya resuelta.
 *
 * `condicion(resumen)` recibe el resumen de progreso ya calculado y devuelve
 * booleano. No tiene efectos secundarios.
 */

const logros = [
  {
    id: 'primer-dominio',
    titulo: 'Sin pistas',
    descripcion: 'Resolviste una actividad al primer intento y sin abrir pistas.',
    evidencia: 'Al menos una actividad en estado "dominio demostrado".',
    condicion: (r) => r.dominadas >= 1,
  },
  {
    id: 'estacion-1-completa',
    titulo: 'El proceso, entendido',
    descripcion: 'Completaste todas las actividades base de la estación 1.',
    evidencia: 'Todas las actividades de nivel base de la estación 1, completadas.',
    condicion: (r) => r.estacionBaseCompleta('proceso'),
  },
  {
    id: 'estacion-2-completa',
    titulo: 'Criterio de calidad',
    descripcion: 'Completaste todas las actividades base de la estación 2.',
    evidencia: 'Todas las actividades de nivel base de la estación 2, completadas.',
    condicion: (r) => r.estacionBaseCompleta('calidad'),
  },
  {
    id: 'estacion-3-completa',
    titulo: 'A prueba de usuarios',
    descripcion: 'Completaste todas las actividades base de la estación 3.',
    evidencia: 'Todas las actividades de nivel base de la estación 3, completadas.',
    condicion: (r) => r.estacionBaseCompleta('robustez'),
  },
  {
    id: 'estacion-4-completa',
    titulo: 'Con los pies en la tierra',
    descripcion: 'Completaste todas las actividades base de la estación 4.',
    evidencia: 'Todas las actividades de nivel base de la estación 4, completadas.',
    condicion: (r) => r.estacionBaseCompleta('tic'),
  },
  {
    id: 'estacion-5-completa',
    titulo: 'Pensamiento algorítmico',
    descripcion: 'Completaste todas las actividades base de la estación 5.',
    evidencia: 'Todas las actividades de nivel base de la estación 5, completadas.',
    condicion: (r) => r.estacionBaseCompleta('paradigmas'),
  },
  {
    id: 'algoritmo-ejecutado',
    titulo: 'Tu algoritmo corre',
    descripcion: 'Escribiste un algoritmo que pasó todos sus casos de prueba, incluidos los límites.',
    evidencia: 'Una actividad de pseudocódigo completada.',
    condicion: (r) => r.completadasPorTipo('pseudo') >= 1 || r.completadasPorTipo('algoritmo') >= 1,
  },
  {
    id: 'tres-algoritmos',
    titulo: 'Ya no es suerte',
    descripcion: 'Tres algoritmos distintos pasando sus casos de prueba.',
    evidencia: 'Tres actividades de pseudocódigo o de armado de algoritmos, completadas.',
    condicion: (r) => r.completadasPorTipo('pseudo') + r.completadasPorTipo('algoritmo') + r.completadasPorTipo('completar') >= 3,
  },
  {
    id: 'sin-ayuda',
    titulo: 'Racha limpia',
    descripcion: 'Cinco actividades con dominio demostrado.',
    evidencia: 'Cinco actividades en estado "dominio demostrado".',
    condicion: (r) => r.dominadas >= 5,
  },
  {
    id: 'ruta-completa',
    titulo: 'Ruta principal terminada',
    descripcion: 'Completaste las actividades base de las cinco estaciones de contenido.',
    evidencia: 'Estaciones 1 a 5 con su nivel base completo.',
    condicion: (r) =>
      ['proceso', 'calidad', 'robustez', 'tic', 'paradigmas'].every((e) => r.estacionBaseCompleta(e)),
  },
  {
    id: 'desafios-opcionales',
    titulo: 'Fuiste más allá',
    descripcion: 'Resolviste cinco desafíos opcionales.',
    evidencia: 'Cinco actividades de nivel opcional, completadas.',
    condicion: (r) => r.completadasOpcionales >= 5,
  },
  {
    id: 'reto-final',
    titulo: 'Listo para el parcial',
    descripcion: 'Terminaste el reto final de práctica con al menos el 70 % del puntaje.',
    evidencia: 'Puntaje del reto final ≥ 70 % de su máximo.',
    condicion: (r) => r.porcentajeEstacion('reto-final') >= 70,
  },
]

export default logros
