import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    // En développement, les appels à /api sont transmis à l'API Node (port 3001)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 utilise encore l'ancienne syntaxe Sass (@import...) :
        // on masque les avertissements de dépréciation qui ne viennent pas de notre code
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
})
