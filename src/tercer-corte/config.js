/**
 * Bandera del tercer corte.
 *
 * La sección está activa por defecto. Para desactivarla sin tocar código,
 * define VITE_TERCER_CORTE=0 en Vercel (o en .env.local) y vuelve a desplegar:
 * desaparecen el enlace de la barra y las rutas /tercer-corte.
 */
export const TERCER_CORTE_ACTIVO = String(import.meta.env.VITE_TERCER_CORTE ?? '1').trim() !== '0'

export const RUTA_TERCER_CORTE = '/tercer-corte'
