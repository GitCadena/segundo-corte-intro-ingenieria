/**
 * Bandera del tercer corte.
 *
 * La sección está activa por defecto. Para desactivarla sin tocar código,
 * define VITE_TERCER_CORTE=0 en Vercel (o en .env.local) y vuelve a desplegar:
 * desaparecen el enlace de la barra y las rutas /tercer-corte.
 */
export const TERCER_CORTE_ACTIVO = String(import.meta.env.VITE_TERCER_CORTE ?? '1').trim() !== '0'

export const RUTA_TERCER_CORTE = '/tercer-corte'

/**
 * Cierre de entregas de la ficha 4: 12 de noviembre de 2026, 11:00 a. m. (hora de Colombia).
 * La base de datos es la que impide entregar después (función tercer_corte_entregar);
 * esto solo deja el botón claro en pantalla.
 */
export const CIERRE_FICHA_4 = new Date('2026-11-12T11:00:00-05:00')
