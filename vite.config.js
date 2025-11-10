import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors para melhor cache
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'utils': ['axios']
        },
        // Otimizar nomes de arquivos
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Otimizar chunk size
    chunkSizeWarningLimit: 1000,
    // Comprimir assets
    assetsInlineLimit: 4096, // 4kb
  },
  server: {
    port: 3000,
    open: true
  },
  // Otimizar dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: []
  }
})
