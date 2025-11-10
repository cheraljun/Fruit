import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@frontend': path.resolve(__dirname, '../../frontend/src'),
      'marked': path.resolve(__dirname, 'node_modules/marked'),
      'blockly': path.resolve(__dirname, 'node_modules/blockly')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000
  }
});

