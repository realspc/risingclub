import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
    include: ['react', 'react-dom']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});