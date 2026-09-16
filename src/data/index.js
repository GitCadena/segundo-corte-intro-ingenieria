import m1 from './m1-proceso.js'
import m2 from './m2-calidad.js'
import m3 from './m3-robustez.js'
import m4 from './m4-tic.js'
import m5 from './m5-paradigmas.js'
import m6 from './m6-simulacro.js'

export const modulos = [m1, m2, m3, m4, m5, m6]

export const curso = {
  nombre: 'Introducción a la Ingeniería Informática',
  corte: 'Segundo corte',
  programa: 'Ingeniería Informática · Institución Universitaria Colegio Mayor del Cauca',
  descripcion:
    'Cinco sesiones, seis estaciones de trabajo y un simulacro. Cada estación trae la teoría del microcurrículo y desafíos que se verifican solos.',
}

export const puntosTotales = modulos.reduce(
  (total, m) => total + m.retos.reduce((s, r) => s + r.puntos, 0),
  0,
)

export const ejemploConsola = `Algoritmo Bienvenida
	Definir nombre Como Cadena
	Definir creditos, i Como Entero
	Leer nombre
	Leer creditos
	Escribir "Hola ", nombre, ", vamos por el segundo corte."
	Para i <- 1 Hasta creditos Hacer
		Escribir "Sesión ", i + 6, " lista"
	FinPara
FinAlgoritmo`
