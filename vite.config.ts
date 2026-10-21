import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VERBUM_DESKTOP === '1' ? './' : '/Verbum/',
  build: { outDir: 'dist' },
  test: { environment: 'node' },
});
