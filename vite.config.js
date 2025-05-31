import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vervang de path-oplossing met een relatieve alias
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
