import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // C'est important d'utiliser 'node' comme environnement de test
  },
})