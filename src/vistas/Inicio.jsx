import { Link } from 'react-router-dom'
import { estaciones, curso, ejemploConsola, catalogoActividades } from '../data/catalogo.js'
import Consola from '../componentes/Consola.jsx'

/** Portada pública: qué es esto, cómo funciona y cómo se guarda el progreso. */
export default function Inicio() {
  const totalActividades = catalogoActividades.filter((a) => a.puntos > 0).length

  return (
    <>
      <section className="portada">
        <p className="portada__ubicacion">{curso.programa}</p>
        <h1 className="portada__titulo">
          Las cinco sesiones del segundo corte, convertidas en algo que puedes ejecutar.
        </h1>
        <p className="portada__bajada">
          Del proceso de desarrollo de software a los paradigmas de programación. Seis estaciones con
          teoría, un ejemplo desarrollado paso a paso, {totalActividades} actividades que se corrigen
          solas y un laboratorio donde tu pseudocódigo se ejecuta de verdad.
        </p>
        <div className="portada__acciones">
          <Link className="boton boton--principal boton--grande" to="/acceso">
            Crear cuenta o entrar
          </Link>
          <Link className="boton boton--secundario" to="/glosario">
            Ver el glosario
          </Link>
        </div>
      </section>

      <section className="como">
        <h2 className="titulo-seccion">Cómo funciona</h2>
        <div className="como__grid">
          <article>
            <h3>Qué vas a aprender</h3>
            <p>
              Cómo se construye el software y cómo se decide si es bueno; qué hace que no se rompa
              con entradas inesperadas; qué dice —y qué no— la Ley de Moore; y cómo se piensa un
              algoritmo antes de escribirlo. Es el alcance completo del segundo parcial.
            </p>
          </article>
          <article>
            <h3>Cómo son las estaciones</h3>
            <p>
              Cada una tiene la misma forma: qué aprenderás, la teoría en tarjetas breves, un ejemplo
              desarrollado paso a paso, actividades para practicar, un reto de aplicación y una
              síntesis. La teoría alcanza para resolver las actividades: nada importante está
              escondido detrás de una respuesta incorrecta.
            </p>
          </article>
          <article>
            <h3>Teoría, juego y práctica</h3>
            <p>
              Se ordena, se empareja, se clasifica, se calcula, se decide sobre casos, se rompen
              formularios a propósito y se arman algoritmos que el intérprete ejecuta contra casos de
              prueba. Cada actividad trae pistas progresivas y una explicación de por qué las otras
              respuestas fallan.
            </p>
          </article>
          <article>
            <h3>Cómo se guarda tu progreso</h3>
            <p>
              Con una cuenta, tu avance queda en el servidor del curso: puedes empezar en la sala de
              cómputo y seguir desde el celular. Si se cae la conexión, la aplicación te dice
              «Pendiente de sincronización» y reintenta; nunca te va a decir «Guardado» si no lo
              logró.
            </p>
          </article>
        </div>
      </section>

      <section className="estaciones">
        <h2 className="titulo-seccion">Las seis estaciones</h2>
        <ul className="estaciones__lista">
          {estaciones.map((e) => {
            const act = catalogoActividades.filter((a) => a.estacionId === e.id && a.puntos > 0)
            return (
              <li key={e.id}>
                <article className="estacion estacion--vitrina">
                  <span className="estacion__numero">{e.orden}</span>
                  <div className="estacion__cuerpo">
                    <p className="estacion__sesion">{e.sesion}</p>
                    <h3 className="estacion__titulo">{e.titulo}</h3>
                    <p className="estacion__gancho">{e.gancho}</p>
                    <p className="estacion__objetivo">{e.aprenderas.objetivo}</p>
                    <p className="estacion__meta">
                      {act.length} actividades · {e.aprenderas.duracion}
                    </p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="portada__demo">
        <h2 className="titulo-seccion">Pruébalo ahora, sin cuenta</h2>
        <p className="portada__nota">
          Este es el mismo intérprete de pseudocódigo que usan las actividades. Cambia el código o
          los datos de entrada y ejecútalo.
        </p>
        <Consola codigoInicial={ejemploConsola} entradasIniciales={'Mateo\n5'} compacta />
      </section>

      <section className="cierre">
        <h2 className="titulo-seccion">Para empezar</h2>
        <p>
          Necesitas una cuenta para que tu avance se guarde y para que el docente pueda acompañarte.
          El registro pide nombre, apellido, grupo, correo y contraseña; el código estudiantil es
          opcional y no sirve para entrar: es solo un dato de tu perfil.
        </p>
        <Link className="boton boton--principal boton--grande" to="/acceso">
          Crear mi cuenta
        </Link>
      </section>
    </>
  )
}
