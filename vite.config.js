import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  base: '/shimon-digital-book/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
