import { useEffect, useRef, useState } from 'react'
import Consola from '../componentes/Consola.jsx'
import { useProgreso } from '../estado/ProgresoProvider.jsx'

const EJEMPLOS = [
  {
    id: 'tablas',
    nombre: 'Tabla de multiplicar',
    descripcion: 'Un ciclo Para y la variable del ciclo dentro del cuerpo.',
    entradas: '7',
    codigo: `Algoritmo Tabla
	// Escribe un número y verás su tabla del 1 al 10.
	Definir n, i Como Entero
	Leer n
	Para i <- 1 Hasta 10 Hacer
		Escribir i, " x ", n, " = ", i * n
	FinPara
FinAlgoritmo`,
  },
  {
    id: 'contador',
    nombre: 'Contador y acumulador juntos',
    descripcion: 'La diferencia entre contar cuántos y sumar cuánto.',
    entradas: '5\n3\n8\n2\n9\n4',
    codigo: `Algoritmo ContarYSumar
	Definir n, i, x, cuantos, total Como Entero
	Leer n
	cuantos <- 0
	total <- 0
	Para i <- 1 Hasta n Hacer
		Leer x
		total <- total + x
		Si x > 4 Entonces
			cuantos <- cuantos + 1
		FinSi
	FinPara
	Escribir "TOTAL: ", total
	Escribir "MAYORES QUE 4: ", cuantos
FinAlgoritmo`,
  },
  {
    id: 'centinela',
    nombre: 'Lectura con centinela',
    descripcion: 'Lectura adelantada: se lee antes del ciclo y al final del cuerpo.',
    entradas: '10\n20\n30\n-1',
    codigo: `Algoritmo Centinela
	Definir x, suma Como Entero
	suma <- 0
	Leer x
	Mientras x <> -1 Hacer
		suma <- suma + x
		Leer x
	FinMientras
	Escribir "SUMA: ", suma
FinAlgoritmo`,
  },
  {
    id: 'vector',
    nombre: 'Vector y búsqueda del máximo',
    descripcion: 'Arreglos de base 1 y el patrón del máximo.',
    entradas: '5\n12\n7\n25\n3\n18',
    codigo: `Algoritmo Maximo
	Definir n, i, maximo Como Entero
	Leer n
	Dimension v[100]
	Para i <- 1 Hasta n Hacer
		Leer v[i]
	FinPara
	maximo <- v[1]
	Para i <- 2 Hasta n Hacer
		Si v[i] > maximo Entonces
			maximo <- v[i]
		FinSi
	FinPara
	Escribir "MAXIMO: ", maximo
FinAlgoritmo`,
  },
  {
    id: 'cadenas',
    nombre: 'Funciones de cadena',
    descripcion: 'longitud, mayusculas y subcadena.',
    entradas: 'Unimayor',
    codigo: `Algoritmo Cadenas
	Definir texto Como Cadena
	Leer texto
	Escribir "Original: ", texto
	Escribir "Mayúsculas: ", mayusculas(texto)
	Escribir "Longitud: ", longitud(texto)
	Escribir "Primeras 3: ", subcadena(texto, 1, 3)
FinAlgoritmo`,
  },
  {
    id: 'repetir',
    nombre: 'Repetir … Hasta Que',
    descripcion: 'El cuerpo se ejecuta al menos una vez, a diferencia de Mientras.',
    entradas: '0\n0\n4',
    codigo: `Algoritmo ValidarEntrada
	Definir x Como Entero
	Repetir
		Leer x
		Si x < 1 O x > 5 Entonces
			Escribir "Fuera del rango 1 a 5. Intenta de nuevo."
		FinSi
	Hasta Que x >= 1 Y x <= 5
	Escribir "Valor aceptado: ", x
FinAlgoritmo`,
  },
]

/** Laboratorio libre: mismo intérprete, sin casos de prueba ni puntaje. */
export default function Laboratorio() {
  const { borradores, guardarBorrador } = useProgreso()
  const [ejemplo, setEjemplo] = useState(EJEMPLOS[0])
  const [clave, setClave] = useState(0)
  const codigoActual = useRef(ejemplo.codigo)
  const [estadoBorrador, setEstadoBorrador] = useState('inactivo')
  const temporizador = useRef(null)

  const guardadoPrevio = borradores['laboratorio']?.contenido

  useEffect(() => {
    if (guardadoPrevio?.codigo && clave === 0) {
      codigoActual.current = guardadoPrevio.codigo
    }
  }, [guardadoPrevio, clave])

  function alCambiarCodigo(v) {
    codigoActual.current = v
    setEstadoBorrador('guardando')
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(async () => {
      const r = await guardarBorrador('laboratorio', { codigo: v })
      setEstadoBorrador(r.ok ? 'guardado' : 'pendiente')
    }, 1200)
  }

  function cargar(e) {
    setEjemplo(e)
    codigoActual.current = e.codigo
    setClave((k) => k + 1)
  }

  return (
    <article className="laboratorio">
      <header className="laboratorio__cabecera">
        <h1>Laboratorio de pseudocódigo</h1>
        <p>
          El mismo intérprete de las actividades, sin casos de prueba y sin puntaje. Sirve para
          probar una idea en clase, verificar una traza a mano o resolver ejercicios del tablero. Tu
          código se guarda como borrador para que lo encuentres la próxima vez.
        </p>
      </header>

      <section className="laboratorio__ejemplos">
        <h2 className="titulo-seccion">Cargar un ejemplo</h2>
        <ul className="ejemplos">
          {EJEMPLOS.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                className={ejemplo.id === e.id ? 'ejemplo ejemplo--activo' : 'ejemplo'}
                onClick={() => cargar(e)}
              >
                <span className="ejemplo__nombre">{e.nombre}</span>
                <span className="ejemplo__descripcion">{e.descripcion}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Consola
        key={clave}
        codigoInicial={clave === 0 && guardadoPrevio?.codigo ? guardadoPrevio.codigo : ejemplo.codigo}
        entradasIniciales={ejemplo.entradas}
        alCambiarCodigo={alCambiarCodigo}
      />

      <p className={`guardado guardado--${estadoBorrador === 'guardado' ? 'ok' : estadoBorrador === 'pendiente' ? 'pendiente' : 'proceso'}`}>
        {estadoBorrador === 'guardando' && 'Guardando borrador…'}
        {estadoBorrador === 'guardado' && 'Borrador guardado.'}
        {estadoBorrador === 'pendiente' && 'Pendiente de sincronización: el borrador quedó en este navegador.'}
        {estadoBorrador === 'inactivo' && (guardadoPrevio ? 'Se recuperó tu último código.' : 'El código se guarda solo mientras escribes.')}
      </p>

      <Sintaxis />
    </article>
  )
}

/* ------------------------- documentación de sintaxis ---------------------- */

function Sintaxis() {
  return (
    <section className="referencia" id="sintaxis">
      <h2 className="titulo-seccion">Sintaxis admitida</h2>
      <p className="referencia__intro">
        Esta es la lista completa de lo que el intérprete entiende. Cualquier otra instrucción
        produce un error con el número de línea. Las palabras clave no distinguen mayúsculas:{' '}
        <code>Mientras</code>, <code>mientras</code> y <code>MIENTRAS</code> son la misma.
      </p>

      <div className="tabla-envoltura">
        <table className="tabla">
          <caption>Estructura del programa</caption>
          <thead>
            <tr>
              <th scope="col">Instrucción</th>
              <th scope="col">Forma exacta</th>
              <th scope="col">Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Inicio y fin</th>
              <td>
                <code>Algoritmo Nombre … FinAlgoritmo</code>
              </td>
              <td>
                También se acepta <code>Proceso … FinProceso</code>. Ambas cabeceras son opcionales.
              </td>
            </tr>
            <tr>
              <th scope="row">Declaración</th>
              <td>
                <code>Definir a, b Como Entero</code>
              </td>
              <td>
                Tipos admitidos: Entero, Real, Cadena, Caracter, Logico. La declaración no obliga al
                tipo: es documentación.
              </td>
            </tr>
            <tr>
              <th scope="row">Arreglos</th>
              <td>
                <code>Dimension v[10]</code>
              </td>
              <td>
                Una dimensión, base 1: el primero es <code>v[1]</code>. Tamaño máximo 10 000.
              </td>
            </tr>
            <tr>
              <th scope="row">Comentarios</th>
              <td>
                <code>// hasta fin de línea</code> · <code>/* varias líneas */</code>
              </td>
              <td>Se ignoran al ejecutar.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tabla-envoltura">
        <table className="tabla">
          <caption>Entrada, salida y asignación</caption>
          <thead>
            <tr>
              <th scope="col">Instrucción</th>
              <th scope="col">Forma exacta</th>
              <th scope="col">Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Asignación</th>
              <td>
                <code>x &lt;- 5</code>
              </td>
              <td>
                También se aceptan <code>=</code>, <code>:=</code> y <code>←</code>.
              </td>
            </tr>
            <tr>
              <th scope="row">Entrada</th>
              <td>
                <code>Leer x, y</code>
              </td>
              <td>
                Toma un dato por línea del recuadro de entradas. Si el texto parece número, se
                convierte en número.
              </td>
            </tr>
            <tr>
              <th scope="row">Salida</th>
              <td>
                <code>Escribir "texto", x</code>
              </td>
              <td>
                Cada <code>Escribir</code> produce una línea. Las partes se concatenan sin
                separador. También valen <code>Imprimir</code> y <code>Mostrar</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tabla-envoltura">
        <table className="tabla">
          <caption>Control de flujo</caption>
          <thead>
            <tr>
              <th scope="col">Estructura</th>
              <th scope="col">Forma exacta</th>
              <th scope="col">Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Selección</th>
              <td>
                <code>Si cond Entonces … Sino … FinSi</code>
              </td>
              <td>
                <code>Sino</code> es opcional. Se puede anidar sin límite.
              </td>
            </tr>
            <tr>
              <th scope="row">Mientras</th>
              <td>
                <code>Mientras cond Hacer … FinMientras</code>
              </td>
              <td>Evalúa la condición ANTES de entrar: puede no ejecutarse ninguna vez.</td>
            </tr>
            <tr>
              <th scope="row">Repetir</th>
              <td>
                <code>Repetir … Hasta Que cond</code>
              </td>
              <td>Ejecuta el cuerpo al menos una vez y termina cuando la condición es verdadera.</td>
            </tr>
            <tr>
              <th scope="row">Para</th>
              <td>
                <code>Para i &lt;- 1 Hasta n Con Paso 2 Hacer … FinPara</code>
              </td>
              <td>
                <code>Con Paso</code> es opcional (por defecto 1) y puede ser negativo. El paso 0 es
                un error.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="tabla-envoltura">
        <table className="tabla">
          <caption>Operadores y funciones</caption>
          <thead>
            <tr>
              <th scope="col">Grupo</th>
              <th scope="col">Símbolos o nombres</th>
              <th scope="col">Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Aritméticos</th>
              <td>
                <code>+ − * / ^ MOD</code>
              </td>
              <td>
                <code>MOD</code> (o <code>%</code>) entrega el residuo. Dividir entre 0 es error.
              </td>
            </tr>
            <tr>
              <th scope="row">Relacionales</th>
              <td>
                <code>= == &lt;&gt; != &lt; &lt;= &gt; &gt;=</code>
              </td>
              <td>Con cadenas comparan sin distinguir mayúsculas.</td>
            </tr>
            <tr>
              <th scope="row">Lógicos</th>
              <td>
                <code>Y O NO</code>
              </td>
              <td>
                Operan sobre condiciones. Constantes: <code>Verdadero</code> y <code>Falso</code>.
              </td>
            </tr>
            <tr>
              <th scope="row">Numéricas</th>
              <td>
                <code>raiz, abs, trunc, redondear, sen, cos, ln, exp</code>
              </td>
              <td>
                <code>trunc</code> corta los decimales; <code>redondear</code> aproxima.
              </td>
            </tr>
            <tr>
              <th scope="row">De cadena</th>
              <td>
                <code>longitud, mayusculas, minusculas, subcadena, concatenar</code>
              </td>
              <td>
                <code>subcadena(texto, desde, hasta)</code> con posiciones que empiezan en 1, ambas
                incluidas.
              </td>
            </tr>
            <tr>
              <th scope="row">Conversión</th>
              <td>
                <code>ConvertirANumero, ConvertirATexto</code>
              </td>
              <td>Útiles cuando un dato leído debe tratarse como el otro tipo.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="clave">
        <p className="clave__titulo">Límites del intérprete</p>
        <p className="clave__texto">
          La ejecución se corta a los 400 000 pasos o a las 400 líneas de salida, así que un ciclo
          sin fin produce un mensaje de error en vez de congelar la página. Tu código nunca se
          evalúa como JavaScript: lo lee un intérprete propio, paso a paso.
        </p>
      </div>
    </section>
  )
}
