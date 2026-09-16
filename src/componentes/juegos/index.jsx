import { Quiz, VerdaderoFalso, Ordenar, Emparejar, Clasificar, Calcular, Caso } from './basicos.jsx'
import {
  Entrega,
  FormularioFriccion,
  MejoraInterfaz,
  RomperFormulario,
  Limites,
  TablaPruebas,
  SimuladorMoore,
  Predice,
  DatosNecesarios,
  ClaseObjeto,
} from './simuladores.jsx'
import { Traza, ArmarAlgoritmo, Completar, Pseudo } from './codigo.jsx'
import Taller from './Taller.jsx'
import { useActividad, MarcoActividad } from './marco.jsx'

const JUEGOS = {
  quiz: Quiz,
  vf: VerdaderoFalso,
  orden: Ordenar,
  emparejar: Emparejar,
  clasificar: Clasificar,
  calcular: Calcular,
  caso: Caso,
  entrega: Entrega,
  'formulario-friccion': FormularioFriccion,
  'mejora-interfaz': MejoraInterfaz,
  'romper-formulario': RomperFormulario,
  limites: Limites,
  'tabla-pruebas': TablaPruebas,
  'simulador-moore': SimuladorMoore,
  predice: Predice,
  'datos-necesarios': DatosNecesarios,
  'clase-objeto': ClaseObjeto,
  traza: Traza,
  algoritmo: ArmarAlgoritmo,
  completar: Completar,
  pseudo: Pseudo,
  taller: Taller,
}

/** Solo el juego, sin el marco. Lo usa la secuencia, que pone su propio marco. */
export function CuerpoJuego({ actividad, ctrl }) {
  const Juego = JUEGOS[actividad.tipo]
  if (!Juego) {
    return <p className="aviso aviso--error">Tipo de actividad no reconocido: {actividad.tipo}</p>
  }
  return <Juego actividad={actividad} ctrl={ctrl} />
}

/** Actividad completa: marco (ficha, pistas, resultado) más el juego. */
export default function Actividad({ actividad, glosario, numero }) {
  const ctrl = useActividad(actividad)
  return (
    <MarcoActividad actividad={actividad} ctrl={ctrl} glosario={glosario} numero={numero}>
      <CuerpoJuego actividad={actividad} ctrl={ctrl} />
    </MarcoActividad>
  )
}

export { useActividad, MarcoActividad }
