/**
 * Contenido del «Laboratorio de ingeniería: del problema al sistema».
 *
 * Son datos puros: ni React ni nada del navegador, para que la lógica de
 * puntuación (src/lib/labCdvs.js) y las pruebas (pruebas/verificar.mjs) los
 * usen igual que la interfaz. Toda respuesta correcta sale de aquí; ninguna
 * la decide una IA.
 *
 * Cada pieza puede marcarse `ampliada: true`: solo aparece en la modalidad de
 * 120 minutos. La de 60 minutos usa el resto y se completa por sí sola.
 */

export const LAB_ID = 'e5-laboratorio-cdvs'

export const MODALIDADES = [
  { id: '60', etiqueta: '60 minutos', ayuda: 'Versión principal, completa por sí sola.' },
  { id: '120', etiqueta: '120 minutos (ampliada)', ayuda: 'Más piezas, dos sectores y una revisión de decisiones.' },
]

/** Puntos académicos de cada componente (suman 100). */
export const PUNTOS = {
  ruta: 30,
  flujo: 20,
  calidad: 15,
  dependencias: 25,
  transferencia: 10,
}

export const COMPONENTES = [
  { id: 'ruta', numero: 1, titulo: 'La ruta de desarrollo', corto: 'Ruta', puntos: PUNTOS.ruta },
  { id: 'flujo', numero: 2, titulo: 'El flujo de información', corto: 'Flujo', puntos: PUNTOS.flujo },
  { id: 'calidad', numero: 3, titulo: 'La calidad de la información', corto: 'Calidad', puntos: PUNTOS.calidad },
  { id: 'dependencias', numero: 4, titulo: 'Las dependencias del proyecto', corto: 'Dependencias', puntos: PUNTOS.dependencias },
  { id: 'transferencia', numero: 5, titulo: 'Otro sector, el mismo proceso', corto: 'Otro sector', puntos: PUNTOS.transferencia },
]

/* ============================ CASO PRINCIPAL ============================== */

export const CASO = {
  titulo: 'Sistema de turnos de un hospital',
  texto:
    'Un hospital quiere un sistema digital para asignar turnos de atención. Hoy los pacientes piden turno en persona, el personal lo registra a mano, hay varias especialidades, los pacientes necesitan consultar sus turnos y la dirección necesita reportes. Su equipo no va a programar el sistema: va a organizar cómo se desarrolla.',
}

/* ===================== COMPONENTE 1 · LA RUTA ============================= */
/* Cada acción pertenece a una fase. Hay acciones que se confunden entre      */
/* requerimientos, análisis y diseño a propósito.                             */

export const ACCIONES_RUTA = [
  { id: 'r01', fase: 'f1', texto: 'Reconocer que los pacientes pasan horas en filas para conseguir un turno.',
    pista: 'Es el punto de partida: qué está pasando y a quién le afecta.',
    porque: 'Se identifica el problema que origina el proyecto. Es la fase 1.' },
  { id: 'r02', fase: 'f1', texto: 'Fijar como objetivo reducir el tiempo que tarda un paciente en obtener su turno.',
    pista: 'Un objetivo dice qué se quiere lograr, antes de saber cómo.',
    porque: 'Los objetivos se fijan al identificar el problema, no al diseñar la solución.' },
  { id: 'r03', fase: 'f1', texto: 'Pensar si vale la pena resolver el problema con el tiempo y el dinero que hay.',
    pista: 'Antes de invertir hay que preguntarse si vale la pena.',
    porque: 'Decidir si el proyecto vale la pena es parte de la fase 1.' },

  { id: 'r04', fase: 'f2', texto: 'Entrevistar al personal de atención sobre cómo registra los turnos hoy.',
    pista: 'Todavía se está recogiendo información de las personas.',
    porque: 'Entrevistar es una técnica de la fase 2: se averigua qué necesita saber y hacer cada usuario.' },
  { id: 'r05', fase: 'f2', texto: 'Observar cómo piden turno los pacientes en la ventanilla.',
    pista: 'Se mira el trabajo real, sin decidir todavía nada del sistema.',
    porque: 'Observar a los usuarios en su entorno también sirve para determinar requerimientos.' },
  { id: 'r06', fase: 'f2', texto: 'Preguntar a los pacientes qué información necesitan consultar sobre su turno.',
    pista: 'Se averigua lo que la gente necesita, no lo que el sistema hará.',
    porque: 'Se determina qué información necesita cada usuario; cómo se la dará el sistema se decide después.' },

  { id: 'r07', fase: 'f3', texto: 'Estudiar paso a paso cómo se asigna hoy un turno, para decidir qué debe hacer el sistema.',
    pista: 'Ya se estudia lo recogido para convertirlo en lo que el sistema hará.',
    porque: 'Analizar es estudiar cómo se trabaja hoy para definir lo que hará el sistema.' },
  { id: 'r08', fase: 'f3', texto: 'Definir la regla: un médico no puede tener dos turnos a la misma hora.',
    pista: 'Es una condición que el sistema debe cumplir, no una decisión sobre cómo se construye.',
    porque: 'Las reglas de funcionamiento se definen al analizar lo que el sistema debe hacer. El diseño decidirá cómo se cumplen.' },
  { id: 'r09', fase: 'f3', texto: 'Acordar que confirmar un turno debe ser rápido, por ejemplo menos de 5 segundos.',
    pista: 'Es algo que después se podrá comprobar.',
    porque: 'Lo que el sistema debe lograr se acuerda al analizar sus necesidades; luego se comprueba en las pruebas.' },

  { id: 'r10', fase: 'f4', texto: 'Decidir qué datos se guardarán: pacientes, médicos y turnos.',
    pista: 'Ya se sabe qué debe hacer el sistema; ahora se decide cómo organizarlo.',
    porque: 'Organizar los datos es parte del diseño del sistema.' },
  { id: 'r11', fase: 'f4', texto: 'Dibujar cómo se verá la pantalla para pedir un turno y la que lo confirma.',
    pista: 'Se decide la forma en que la información entra y sale.',
    porque: 'Cómo se ven las pantallas se define en el diseño.' },
  { id: 'r12', fase: 'f4', texto: 'Elegir con qué herramientas se construirá el sistema.',
    pista: 'Se decide con qué se construirá, pero aún no se construye nada.',
    porque: 'Elegir con qué se construye es una decisión de diseño; todavía no hay software.' },

  { id: 'r13', fase: 'f5', texto: 'Programar la función que registra un turno nuevo.',
    pista: 'Aquí sí se escribe código.',
    porque: 'Programar es desarrollar el software, la fase 5.' },
  { id: 'r14', fase: 'f5', texto: 'Redactar el manual de uso para el personal de atención.',
    pista: 'Explicar cómo se usa el sistema forma parte de construirlo.',
    porque: 'En la fase 5 se documenta el software (manuales, ayudas), además de programarlo.' },

  { id: 'r15', fase: 'f6', texto: 'Comprobar que el sistema nunca asigna dos turnos al mismo médico a la misma hora.',
    pista: 'Se compara lo construido con lo que se había definido.',
    porque: 'Probar es comprobar que el software cumple los requisitos antes de entregarlo.' },
  { id: 'r16', fase: 'f6', texto: 'Corregir errores y actualizar el sistema cuando el hospital abre una especialidad nueva.',
    pista: 'Después de entregado, el sistema sigue necesitando cuidado.',
    porque: 'Mantener el sistema (corregir y adaptar) pertenece a la fase 6, junto con probar.' },

  { id: 'r17', fase: 'f7', texto: 'Capacitar al personal y poner el sistema en uso real.',
    pista: 'El sistema pasa del equipo de desarrollo a quienes lo van a usar.',
    porque: 'Implementar es instalar el sistema, capacitar a los usuarios y ponerlo en operación.' },
  { id: 'r18', fase: 'f7', texto: 'Evaluar, tres meses después, si bajó el tiempo de espera según el objetivo inicial.',
    pista: 'Se compara el resultado con lo que se quería lograr al principio.',
    porque: 'Evaluar compara lo logrado con los objetivos de la fase 1; ocurre con el sistema ya en uso.' },

  // Solo modalidad de 120 minutos
  { id: 'r19', ampliada: true, fase: 'f1', texto: 'Identificar quiénes son los afectados por el problema: pacientes, personal y administración.',
    pista: 'Se delimita el problema y a quién afecta.',
    porque: 'Reconocer a los afectados es parte de identificar el problema.' },
  { id: 'r20', ampliada: true, fase: 'f2', texto: 'Revisar los formularios en papel que usa hoy el personal para registrar turnos.',
    pista: 'Los documentos existentes dicen qué información se maneja hoy.',
    porque: 'Revisar los documentos que ya existen es otra técnica para determinar requerimientos.' },
  { id: 'r21', ampliada: true, fase: 'f3', texto: 'Dibujar un esquema de cómo se mueve la información entre pacientes, atención y sistema.',
    pista: 'Se representa lo que debe pasar con la información, no cómo se programará.',
    porque: 'Dibujar cómo se mueve la información ayuda a definir lo que el sistema debe hacer.' },
  { id: 'r22', ampliada: true, fase: 'f4', texto: 'Decidir quién podrá ver y quién podrá cambiar cada información.',
    pista: 'Se decide cómo proteger la información dentro del sistema.',
    porque: 'Quién accede a qué se decide al diseñar el sistema.' },
  { id: 'r23', ampliada: true, fase: 'f5', texto: 'Escribir las instrucciones de ayuda que aparecerán dentro del sistema.',
    pista: 'Es documentación para quien lo use.',
    porque: 'Las ayudas para el usuario hacen parte de documentar el software en la fase 5.' },
  { id: 'r24', ampliada: true, fase: 'f6', texto: 'Ejecutar el sistema completo con datos de prueba antes de entregarlo.',
    pista: 'Todavía no se ha entregado; se está comprobando.',
    porque: 'Las pruebas con datos de ejemplo se hacen antes de la entrega, en la fase 6.' },
  { id: 'r25', ampliada: true, fase: 'f7', texto: 'Pasar al sistema nuevo los turnos que estaban anotados en cuadernos.',
    pista: 'Se traslada lo que existía para empezar a operar.',
    porque: 'Trasladar la información existente es parte de implementar el sistema.' },
]

/* ===================== COMPONENTE 2 · EL FLUJO ============================ */

export const ETAPAS_FLUJO = [
  { id: 'captura', nombre: 'Captura', ayuda: 'Los datos entran al sistema.' },
  { id: 'procesamiento', nombre: 'Procesamiento', ayuda: 'Se verifica, calcula o decide.' },
  { id: 'almacenamiento', nombre: 'Almacenamiento', ayuda: 'La información se guarda.' },
  { id: 'distribucion', nombre: 'Distribución', ayuda: 'El resultado llega a quien lo necesita.' },
]

export const ELEMENTOS_FLUJO = [
  { id: 'e01', etapa: 'captura', texto: 'Datos del paciente (nombre y documento).',
    pista: 'Es información que llega al sistema desde afuera.',
    porque: 'Capturar es recoger los datos en su origen.' },
  { id: 'e02', etapa: 'captura', texto: 'Solicitud de turno (especialidad y fecha deseada).',
    pista: 'Es lo que el paciente le pide al sistema.',
    porque: 'La solicitud es un dato de entrada: se captura.' },
  { id: 'e03', etapa: 'procesamiento', texto: 'Consulta de disponibilidad: buscar los horarios libres.',
    pista: 'Se trabaja con información que ya llegó.',
    porque: 'Buscar y verificar horarios es transformar o consultar información: procesamiento.' },
  { id: 'e04', etapa: 'procesamiento', texto: 'Asignación del turno: elegir médico, fecha y hora.',
    pista: 'El sistema decide a partir de lo que recibió.',
    porque: 'Decidir qué turno corresponde es procesar la solicitud con las reglas del sistema.' },
  { id: 'e05', etapa: 'almacenamiento', texto: 'Registro del turno asignado.',
    pista: 'La información queda guardada para usarla después.',
    porque: 'Registrar el turno es guardar el resultado para poder consultarlo luego.' },
  { id: 'e06', etapa: 'almacenamiento', texto: 'El lugar donde se guardan los turnos y los datos de los pacientes.',
    pista: 'Es el lugar donde se conserva la información.',
    porque: 'La base de datos es el almacén de la información del sistema.' },
  { id: 'e07', etapa: 'distribucion', texto: 'Confirmación de la asignación enviada al paciente.',
    pista: 'El resultado sale hacia quien lo pidió.',
    porque: 'Distribuir es entregar el resultado a quien lo necesita.' },
  { id: 'e08', etapa: 'distribucion', texto: 'Reporte administrativo de turnos por especialidad.',
    pista: 'La información llega a otra persona que la necesita para decidir.',
    porque: 'El reporte lleva información procesada a la dirección: distribución.' },
  { id: 'e09', etapa: 'distribucion', texto: 'Consulta del paciente sobre sus turnos.',
    pista: 'Alguien pide ver información que ya existe.',
    porque: 'Mostrarle al paciente sus turnos es entregarle información: distribución.' },

  // Solo modalidad de 120 minutos
  { id: 'e10', ampliada: true, etapa: 'procesamiento', texto: 'Verificar que el documento del paciente exista antes de asignar un turno.',
    pista: 'Se comprueba algo antes de decidir.',
    porque: 'Verificar datos antes de actuar es procesamiento.' },
  { id: 'e11', ampliada: true, etapa: 'almacenamiento', texto: 'Historial de turnos pasados de cada paciente.',
    pista: 'Es información acumulada con el tiempo.',
    porque: 'Conservar el historial es almacenar información.' },
  { id: 'e12', ampliada: true, etapa: 'distribucion', texto: 'Agenda del día enviada a cada médico.',
    pista: 'Llega a alguien distinto del paciente.',
    porque: 'Entregar la agenda al médico es distribuir información a quien la necesita.' },
]

/* ===================== COMPONENTE 3 · CALIDAD ============================= */

export const CARACTERISTICAS = [
  { id: 'oportuna', nombre: 'Oportuna', ayuda: 'Llega a tiempo para que sirva.' },
  { id: 'relevante', nombre: 'Relevante', ayuda: 'Responde lo que se necesita saber.' },
  { id: 'completa', nombre: 'Completa', ayuda: 'No le falta una parte que cambiaría la decisión.' },
  { id: 'confiable', nombre: 'Confiable', ayuda: 'Se puede rastrear de dónde salió.' },
]

/** Características que también se pueden defender para una situación (criterio propio). */
export const ALTERNAS_CALIDAD = {
  oportuna: ['relevante'],
  relevante: ['completa', 'oportuna'],
  completa: ['relevante', 'confiable'],
  confiable: ['completa'],
}

export const SITUACIONES_CALIDAD = [
  { id: 'q01', caracteristica: 'oportuna', texto: 'El turno aparece actualizado en cuanto otro paciente lo toma.',
    pista: 'Piensa en el momento en que llega la información.',
    porque: 'La información está disponible justo cuando se necesita para decidir: es oportuna.' },
  { id: 'q02', caracteristica: 'completa', texto: 'La confirmación incluye médico, especialidad, fecha, hora y consultorio.',
    pista: 'Piensa en si falta algún dato para que el paciente pueda asistir.',
    porque: 'No falta ningún dato que el paciente necesite: es completa.' },
  { id: 'q03', caracteristica: 'relevante', texto: 'Cada paciente ve solo sus propios turnos, no el listado de todos.',
    pista: 'Piensa en si la información responde lo que ese usuario necesita.',
    porque: 'Muestra justo lo que ese usuario necesita saber: es relevante.' },
  { id: 'q04', caracteristica: 'confiable', texto: 'Cada turno guarda quién lo registró y cuándo, para poder rastrearlo.',
    pista: 'Piensa en poder demostrar de dónde viene el dato.',
    porque: 'Permite rastrear el origen de la información: es confiable.' },
  { id: 'q05', caracteristica: 'oportuna', texto: 'El reporte semanal llega a la dirección antes de la reunión de planeación.',
    pista: 'Piensa en el momento en que llega.',
    porque: 'Llega a tiempo para que se use en la decisión: es oportuna.' },
  { id: 'q06', caracteristica: 'confiable', texto: 'Antes de asignar un turno, el sistema verifica que el documento coincida con el registro del paciente.',
    pista: 'Piensa en si se puede confiar en que el dato es el correcto.',
    porque: 'La verificación respalda que los datos son los correctos: es confiable.' },
  { id: 'q07', caracteristica: 'relevante', texto: 'El reporte administrativo muestra solo la ocupación por especialidad, que es lo que la dirección necesita decidir.',
    pista: 'Piensa en si trae lo necesario y no más.',
    porque: 'Se limita a lo que quien decide necesita saber: es relevante.' },
  { id: 'q08', caracteristica: 'completa', texto: 'Si falta la especialidad en la solicitud, el sistema no la acepta hasta que se complete.',
    pista: 'Piensa en que no falte nada necesario.',
    porque: 'Evita que se registre información a medias: busca que sea completa.' },

  // Solo modalidad de 120 minutos
  { id: 'q09', ampliada: true, caracteristica: 'oportuna', texto: 'El paciente recibe el recordatorio de su turno la víspera, no cuando ya pasó la hora.',
    pista: 'Piensa en el momento.',
    porque: 'Un recordatorio que llega tarde no sirve; llegar a tiempo es ser oportuna.' },
  { id: 'q10', ampliada: true, caracteristica: 'completa', texto: 'El reporte incluye turnos asignados, cancelados y no atendidos; sin los cancelados no se vería la ocupación real.',
    pista: 'Piensa en lo que cambiaría la decisión si faltara.',
    porque: 'Sin los cancelados, la decisión cambiaría: la información debe estar completa.' },
  { id: 'q11', ampliada: true, caracteristica: 'confiable', texto: 'El personal puede consultar el historial de cambios de un turno para saber quién lo modificó.',
    pista: 'Piensa en el rastro de la información.',
    porque: 'Poder rastrear los cambios respalda la información: es confiable.' },
  { id: 'q12', ampliada: true, caracteristica: 'relevante', texto: 'La pantalla del médico muestra su agenda del día y no la de toda la institución.',
    pista: 'Piensa en lo que ese usuario necesita.',
    porque: 'Muestra lo que ese médico necesita, nada más: es relevante.' },
]

/* ================== COMPONENTE 4 · LAS DEPENDENCIAS ======================= */

export const RESULTADOS = [
  { id: 'n1', fase: 'f1', corto: 'Problema', titulo: 'El problema y los objetivos' },
  { id: 'n2', fase: 'f2', corto: 'Necesidades', titulo: 'Lo que necesitan los usuarios' },
  { id: 'n3', fase: 'f3', corto: 'Qué hará', titulo: 'Lo que el sistema debe hacer' },
  { id: 'n4', fase: 'f4', corto: 'Diseño', titulo: 'Cómo se organizará el sistema' },
  { id: 'n5', fase: 'f5', corto: 'Software', titulo: 'El software y su manual' },
  { id: 'n6', fase: 'f6', corto: 'Pruebas', titulo: 'Los resultados de las pruebas' },
  { id: 'n7', fase: 'f7', corto: 'En uso', titulo: 'El sistema en uso y su evaluación' },
]

/**
 * Conexiones válidas. `tipo: 'avance'` sigue el ciclo; `'revision'` vuelve a una
 * decisión anterior. Qué conexiones cuentan para el puntaje de cada modalidad
 * está en REQUISITOS_DEPENDENCIAS; las demás válidas se aceptan como extra,
 * sin sumar ni restar.
 */
export const ENLACES = [
  { id: 'l1', desde: 'n1', hacia: 'n2', tipo: 'avance',
    opciones: [
      'Los objetivos indican qué necesidades de los usuarios hay que investigar.',
      'Los objetivos son el código que luego se programa.',
      'Los objetivos reemplazan las entrevistas con los usuarios.',
    ], correcta: 0,
    porque: 'Sin objetivos claros no se sabe qué información averiguar con los usuarios.' },
  { id: 'l2', desde: 'n2', hacia: 'n3', tipo: 'avance',
    opciones: [
      'Las necesidades de los usuarios indican en qué lenguaje se programa.',
      'Lo que los usuarios necesitan se analiza para definir las funciones y reglas del sistema.',
      'Las necesidades se prueban antes de haberlas definido.',
    ], correcta: 1,
    porque: 'Los requisitos nacen de lo que los usuarios necesitan: si no se averiguó, se inventa.' },
  { id: 'l3', desde: 'n3', hacia: 'n4', tipo: 'avance',
    opciones: [
      'El diseño decide cuáles son los requisitos del sistema.',
      'El diseño solo es necesario si el sistema falla.',
      'El diseño organiza los datos y procesos para cumplir los requisitos.',
    ], correcta: 2,
    porque: 'Primero se define qué debe hacer el sistema; después, cómo se organizará para lograrlo.' },
  { id: 'l4', desde: 'n4', hacia: 'n5', tipo: 'avance',
    opciones: [
      'Los programadores construyen siguiendo lo que el diseño especifica.',
      'El diseño sale del software ya terminado.',
      'El software se puede escribir sin ningún diseño previo.',
    ], correcta: 0,
    porque: 'El desarrollo construye lo que el diseño describe; sin diseño, cada programador decide por su cuenta.' },
  { id: 'l5', desde: 'n5', hacia: 'n6', tipo: 'avance',
    opciones: [
      'El software depende del informe de pruebas para existir.',
      'Las pruebas reemplazan al software.',
      'Las pruebas necesitan el software construido para comprobar si cumple los requisitos.',
    ], correcta: 2,
    porque: 'Lo que se prueba es el software que se construyó.' },
  { id: 'l6', desde: 'n6', hacia: 'n7', tipo: 'avance',
    opciones: [
      'Las pruebas dan evidencia de que el sistema está listo para ponerse en uso.',
      'Probar e implementar son la misma tarea.',
      'Implementar no requiere saber si el sistema funciona.',
    ], correcta: 0,
    porque: 'Se decide poner el sistema en uso apoyándose en la evidencia de las pruebas.' },
  { id: 'l7', desde: 'n6', hacia: 'n5', tipo: 'revision',
    opciones: [
      'El informe de pruebas se escribe a partir de la documentación.',
      'Las pruebas deben ignorarse una vez escrito el software.',
      'Los defectos que muestran las pruebas se corrigen en el software.',
    ], correcta: 2,
    porque: 'Cuando las pruebas encuentran errores se vuelve a la fase 5 para corregir.' },
  { id: 'l8', desde: 'n7', hacia: 'n3', tipo: 'revision',
    opciones: [
      'La evaluación solo sirve para decidir a quién se despide.',
      'Si el sistema en uso no logra los objetivos, hay que revisar los requisitos.',
      'Una vez en uso, los requisitos ya no pueden cambiar.',
    ], correcta: 1,
    porque: 'La evaluación puede mostrar que una necesidad cambió o se entendió mal, y entonces se vuelve a los requisitos.' },
  { id: 'l9', desde: 'n3', hacia: 'n6', tipo: 'avance',
    opciones: [
      'Los requisitos medibles son el criterio contra el que se prueba el sistema.',
      'Los requisitos se escriben después de las pruebas.',
      'Las pruebas definen los requisitos desde cero.',
    ], correcta: 0,
    porque: 'Un requisito medible es justamente lo que se comprueba al probar.' },
]

/** Qué hay que construir en cada modalidad para completar el componente. */
export const REQUISITOS_DEPENDENCIAS = {
  '60': { avance: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], revisiones: 1 },
  '120': { avance: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l9'], revisiones: 2 },
}

/** Revisión de decisiones (solo 120 minutos). */
export const REVISION = {
  texto:
    'El hospital descubre que muchos pacientes no tienen correo electrónico, y la confirmación se había diseñado para enviarse por correo. ¿Qué decisiones anteriores hay que reconsiderar primero? Marquen todas las que correspondan.',
  correctas: ['f2', 'f3', 'f4'],
  porque:
    'Cambia lo que se había averiguado (fase 2), lo que se había definido (fase 3) y cómo se había diseñado la salida (fase 4). El software y las pruebas se ajustarán después, a partir de esas decisiones.',
}

/* ============== COMPONENTE 5 · TRANSFERENCIA A OTRO SECTOR =============== */

export const SECTORES = [
  {
    id: 'universidad',
    nombre: 'Universidad',
    texto: 'Una universidad necesita un sistema para que los estudiantes se inscriban en las asignaturas de cada semestre.',
    acciones: [
      { id: 'u01', fase: 'f1', texto: 'Reconocer que las filas de inscripción dejan a muchos estudiantes sin cupo a tiempo.',
        pista: 'Es el problema que origina el proyecto.', porque: 'Identificar el problema es la fase 1.' },
      { id: 'u02', fase: 'f2', texto: 'Entrevistar a coordinadores y estudiantes sobre cómo escogen asignaturas.',
        pista: 'Se recoge información de las personas.', porque: 'Entrevistar usuarios es determinar requerimientos (fase 2).' },
      { id: 'u03', fase: 'f3', texto: 'Definir la regla: un estudiante no puede inscribirse en dos asignaturas con el mismo horario.',
        pista: 'Es una condición que el sistema debe cumplir.', porque: 'Las reglas de funcionamiento se definen en el análisis (fase 3).' },
      { id: 'u04', fase: 'f4', texto: 'Decidir cómo se organizan los datos de estudiantes, asignaturas, horarios y cupos.',
        pista: 'Se decide cómo organizar, sin construir todavía.', porque: 'Organizar los datos es diseño (fase 4).' },
      { id: 'u05', fase: 'f5', texto: 'Programar la verificación de cupos disponibles.',
        pista: 'Aquí se escribe código.', porque: 'Programar es desarrollar el software (fase 5).' },
      { id: 'u06', fase: 'f6', texto: 'Probar que el sistema rechaza la inscripción cuando ya no hay cupo.',
        pista: 'Se comprueba contra lo definido.', porque: 'Probar es comprobar que cumple los requisitos (fase 6).' },
      { id: 'u07', fase: 'f7', texto: 'Capacitar a los estudiantes y abrir las inscripciones del nuevo semestre.',
        pista: 'El sistema pasa a manos de sus usuarios.', porque: 'Implementar es capacitar y poner en uso (fase 7).' },
    ],
    elementos: [
      { id: 'ue1', etapa: 'captura', texto: 'Formulario donde el estudiante elige sus asignaturas.',
        pista: 'Los datos entran al sistema.', porque: 'Es el punto donde se capturan los datos.' },
      { id: 'ue2', etapa: 'procesamiento', texto: 'Verificación de cupos y de cruces de horario.',
        pista: 'Se comprueba y se decide.', porque: 'Verificar es procesar la solicitud.' },
      { id: 'ue3', etapa: 'almacenamiento', texto: 'Registro de la inscripción en el archivo académico.',
        pista: 'Queda guardado.', porque: 'Registrar en la base de datos es almacenar.' },
      { id: 'ue4', etapa: 'distribucion', texto: 'Comprobante de inscripción enviado al estudiante.',
        pista: 'El resultado sale hacia el estudiante.', porque: 'Entregar el comprobante es distribuir.' },
    ],
  },
  {
    id: 'comercio',
    nombre: 'Comercio',
    ampliada: true,
    texto: 'Una tienda de barrio quiere vender por internet y necesita un sistema de pedidos en línea.',
    acciones: [
      { id: 'c01', fase: 'f1', texto: 'Reconocer que los clientes abandonan el pedido por teléfono por la demora.',
        pista: 'Es el problema que origina el proyecto.', porque: 'Identificar el problema es la fase 1.' },
      { id: 'c02', fase: 'f2', texto: 'Observar cómo buscan productos los clientes en la tienda física.',
        pista: 'Se mira el comportamiento real de los usuarios.', porque: 'Observar usuarios es determinar requerimientos (fase 2).' },
      { id: 'c03', fase: 'f3', texto: 'Definir la regla: no se pueden vender más unidades de las que hay en inventario.',
        pista: 'Es una condición que el sistema debe cumplir.', porque: 'Las reglas se definen en el análisis (fase 3).' },
      { id: 'c04', fase: 'f4', texto: 'Dibujar cómo se verá el catálogo de productos y el carrito de compra.',
        pista: 'Se decide cómo organizar la información.', porque: 'Diseñar los datos y los formatos es la fase 4.' },
      { id: 'c05', fase: 'f5', texto: 'Programar el cálculo del total del pedido.',
        pista: 'Aquí se escribe código.', porque: 'Programar es desarrollar el software (fase 5).' },
      { id: 'c06', fase: 'f6', texto: 'Probar que el inventario baja correctamente después de cada venta.',
        pista: 'Se comprueba contra lo definido.', porque: 'Probar es comprobar que cumple los requisitos (fase 6).' },
      { id: 'c07', fase: 'f7', texto: 'Abrir la tienda en línea y medir, después de un mes, cuántos pedidos se completan.',
        pista: 'El sistema ya está en uso y se mide su resultado.', porque: 'Implementar y evaluar con el sistema en uso es la fase 7.' },
    ],
    elementos: [
      { id: 'ce1', etapa: 'captura', texto: 'Carrito donde el cliente indica productos y dirección.',
        pista: 'Los datos entran al sistema.', porque: 'Es el punto donde se capturan los datos.' },
      { id: 'ce2', etapa: 'procesamiento', texto: 'Cálculo del total y verificación de existencias.',
        pista: 'Se calcula y se verifica.', porque: 'Calcular y verificar es procesar.' },
      { id: 'ce3', etapa: 'almacenamiento', texto: 'Registro del pedido y actualización del inventario.',
        pista: 'Queda guardado.', porque: 'Guardar el pedido y el inventario es almacenar.' },
      { id: 'ce4', etapa: 'distribucion', texto: 'Factura y estado del envío entregados al cliente.',
        pista: 'El resultado sale hacia el cliente.', porque: 'Entregar la factura y el estado es distribuir.' },
    ],
  },
]

/* =========================== MENSAJES FIJOS =============================== */

export const INSTRUCCION_INICIAL =
  'Construyan el desarrollo del sistema: organicen las acciones, conecten las fases y completen los componentes del proyecto.'

export const RESUMEN_FINAL = {
  fases: 'Fases comprendidas',
  flujo: 'Flujo de información construido',
  calidad: 'Criterios de calidad aplicados',
  dependencias: 'Dependencias establecidas',
  transferencia: 'Transferencia a otro sector',
}
