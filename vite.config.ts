import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  preview: {
    port: 5173,
    strictPort: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendeurs (React, libs externes)
          vendor: ['react', 'react-dom'],
          
          // Auth0 et React Query dans un chunk séparé
          auth: ['@auth0/auth0-react', 'react-query'],
          
          // UI Components dans un chunk séparé
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-tabs'],
          
          // Utilitaires
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    // Augmenter la limite pour éviter l'avertissement en attendant l'optimisation
    chunkSizeWarningLimit: 1000
  }
})