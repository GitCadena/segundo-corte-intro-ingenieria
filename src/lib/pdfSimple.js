/**
 * Generador mínimo de PDF (texto y líneas) sin dependencias.
 *
 * Alcanza para un comprobante de una o dos páginas: título, párrafos que se
 * ajustan al ancho, filas con columnas y una línea separadora. Usa las
 * fuentes estándar Helvetica y Helvetica-Bold con codificación WinAnsi, que
 * cubre las tildes y la ñ del español sin incrustar ninguna fuente.
 *
 * Bloques admitidos:
 *   { t: 'titulo', texto }            título grande
 *   { t: 'sub', texto }               línea gris pequeña
 *   { t: 'h', texto }                 encabezado de sección
 *   { t: 'p', texto, sangria? }       párrafo con ajuste de línea
 *   { t: 'fila', celdas, xs, negrita? }  columnas en posiciones fijas
 *   { t: 'linea' }                    línea horizontal
 *   { t: 'espacio', n }               espacio vertical en puntos
 */

const ANCHO = 612 // carta
const ALTO = 792
const MARGEN = 54
const UTIL = ANCHO - 2 * MARGEN

const SUSTITUTOS = {
  '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '…': '...',
  '≥': '>=', '≤': '<=', '✓': 'ok', '×': 'x', '→': '->', '•': '-',
}

/** Convierte a una cadena donde cada carácter es un byte Latin-1. */
function latin1(texto) {
  let salida = ''
  for (const ch of String(texto)) {
    const reemplazo = SUSTITUTOS[ch]
    if (reemplazo !== undefined) {
      salida += reemplazo
      continue
    }
    salida += ch.charCodeAt(0) <= 255 ? ch : '?'
  }
  return salida
}

const escapar = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

function ajustar(texto, tam, negrita, ancho) {
  const factor = negrita ? 0.57 : 0.52
  const maxCaracteres = Math.max(10, Math.floor(ancho / (tam * factor)))
  const lineas = []
  for (const parrafo of String(texto).split('\n')) {
    let actual = ''
    for (const palabra of parrafo.split(/\s+/).filter(Boolean)) {
      const prueba = actual ? `${actual} ${palabra}` : palabra
      if (prueba.length > maxCaracteres && actual) {
        lineas.push(actual)
        actual = palabra
      } else {
        actual = prueba
      }
    }
    lineas.push(actual)
  }
  return lineas
}

const ESTILOS = {
  titulo: { tam: 17, negrita: true, interlineado: 22, antes: 0, despues: 4 },
  sub: { tam: 9, negrita: false, interlineado: 12, antes: 0, despues: 6, gris: true },
  h: { tam: 12, negrita: true, interlineado: 15, antes: 8, despues: 2 },
  p: { tam: 10, negrita: false, interlineado: 12.5, antes: 0, despues: 2 },
  fila: { tam: 9.5, negrita: false, interlineado: 14, antes: 0, despues: 0 },
}

export function crearPdf(bloques) {
  const paginas = [[]]
  let y = ALTO - MARGEN

  const nuevaPagina = () => {
    paginas.push([])
    y = ALTO - MARGEN
  }
  const op = (s) => paginas[paginas.length - 1].push(s)
  const texto = (x, yy, tam, negrita, gris, t) => {
    op(`BT /${negrita ? 'F2' : 'F1'} ${tam} Tf ${gris ? '0.35 g' : '0 g'} ${x.toFixed(2)} ${yy.toFixed(2)} Td (${escapar(latin1(t))}) Tj ET`)
  }

  for (const b of bloques) {
    if (b.t === 'espacio') {
      y -= b.n ?? 6
      continue
    }
    if (b.t === 'linea') {
      if (y < MARGEN + 20) nuevaPagina()
      y -= 4
      op(`0.75 G 0.6 w ${MARGEN} ${y.toFixed(2)} m ${ANCHO - MARGEN} ${y.toFixed(2)} l S`)
      y -= 6
      continue
    }
    const e = ESTILOS[b.t]
    if (!e) continue
    const negrita = b.negrita ?? e.negrita
    y -= e.antes

    if (b.t === 'fila') {
      if (y - e.interlineado < MARGEN) nuevaPagina()
      y -= e.interlineado
      b.celdas.forEach((c, i) => texto(MARGEN + b.xs[i], y, e.tam, negrita, false, c))
      y -= e.despues
      continue
    }

    const sangria = b.sangria ?? 0
    const lineas = ajustar(b.texto, e.tam, negrita, UTIL - sangria)
    for (const l of lineas) {
      if (y - e.interlineado < MARGEN) nuevaPagina()
      y -= e.interlineado
      texto(MARGEN + sangria, y, e.tam, negrita, e.gris, l)
    }
    y -= e.despues
  }

  /* ------------------------------ ensamblado ------------------------------ */

  const objetos = [] // cada uno: contenido del objeto sin "n 0 obj" ni "endobj"
  const idPagina = (i) => 5 + 2 * i
  const idContenido = (i) => 6 + 2 * i

  objetos[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objetos[2] = `<< /Type /Pages /Kids [${paginas.map((_, i) => `${idPagina(i)} 0 R`).join(' ')}] /Count ${paginas.length} >>`
  objetos[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
  objetos[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
  paginas.forEach((ops, i) => {
    objetos[idPagina(i)] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ANCHO} ${ALTO}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${idContenido(i)} 0 R >>`
    const flujo = ops.join('\n')
    objetos[idContenido(i)] = `<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`
  })

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
  const desplazamientos = []
  for (let n = 1; n < objetos.length; n++) {
    desplazamientos[n] = pdf.length
    pdf += `${n} 0 obj\n${objetos[n]}\nendobj\n`
  }
  const inicioXref = pdf.length
  pdf += `xref\n0 ${objetos.length}\n0000000000 65535 f \n`
  for (let n = 1; n < objetos.length; n++) {
    pdf += `${String(desplazamientos[n]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`

  const bytes = new Uint8Array(pdf.length)
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff
  return bytes
}

/** Descarga un PDF en el navegador. */
export function descargarPdf(bytes, nombreArchivo) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
