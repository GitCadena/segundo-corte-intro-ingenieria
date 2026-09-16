import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase.
 *
 * Si faltan las variables de entorno la app NO se cae: entra en "modo
 * demostración", que guarda todo en este navegador y lo rotula de forma
 * visible. El modo demostración nunca se presenta como si fuera la base de
 * datos real del curso.
 */

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const hayConfiguracion = Boolean(url && anon && url.startsWith('http'))

export const supabase = hayConfiguracion
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null

/** Texto único para explicar por qué la app está en modo demostración. */
export const motivoSinConfiguracion =
  'Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. ' +
  'Mientras tanto la aplicación funciona en modo demostración: el avance se guarda ' +
  'solo en este navegador y no viaja a otro dispositivo.'
