import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Rpg-utility/' // Doit correspondre au nom de votre dépôt
});