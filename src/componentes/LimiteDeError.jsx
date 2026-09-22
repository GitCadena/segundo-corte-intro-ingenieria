import { Component } from 'react'

/**
 * Límite de error.
 *
 * Sin esto, cualquier fallo de render deja al estudiante frente a una pantalla
 * en blanco, que es justo el comportamiento que la estación 3 enseña a evitar:
 * no perder el trabajo del usuario y decirle con honestidad qué pasó.
 *
 * Importante: NO borra nada. El progreso ya guardado sigue en el servidor y los
 * envíos pendientes siguen en su cola; recargar la página los recupera.
 */
export default class LimiteDeError extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Queda en la consola para que el docente pueda reportarlo con detalle.
    console.error('Error de render en la aplicación del segundo corte:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <section className="vacio" role="alert">
        <h1>Algo se rompió en esta pantalla</h1>
        <p>
          No es culpa tuya y no perdiste nada: tu progreso está guardado y los envíos que estuvieran
          pendientes siguen en cola. Recargar la página suele bastar.
        </p>
        <div className="acciones" style={{ justifyContent: 'center' }}>
          <button type="button" className="boton boton--principal" onClick={() => window.location.reload()}>
            Recargar la página
          </button>
          <a className="boton boton--secundario" href="#/panel" onClick={() => window.location.reload()}>
            Volver al panel
          </a>
        </div>
        <details className="solucion" style={{ marginTop: '2rem', textAlign: 'left' }}>
          <summary>Detalle técnico (para reportarlo)</summary>
          <figure className="bloque-codigo">
            <pre>{String(this.state.error?.message ?? this.state.error)}</pre>
          </figure>
        </details>
      </section>
    )
  }
}
