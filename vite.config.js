import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  server: {
    watch: {
      // marketing/ holds renders and a headless-Edge profile whose locked cache
      // files crash the watcher (EBUSY); tests/ holds Playwright reports.
      ignored: ['**/marketing/**', '**/tests/**', '**/dist/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
