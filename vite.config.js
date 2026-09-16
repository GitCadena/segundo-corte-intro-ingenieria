import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // El cliente de Supabase pesa más que toda la aplicación. Separarlo
        // permite que la teoría y las actividades carguen sin esperarlo, cosa
        // que importa en los equipos viejos de la sala y con datos móviles.
        manualChunks: {
          supabase: ['@supabase/supabase-js'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
