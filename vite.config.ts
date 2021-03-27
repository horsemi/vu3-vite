import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { createAlias } from './build/vite/alias';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/devextreme-vue3-vite2/',
  mode: 'development',
  plugins: [vue()],
  resolve: {
    alias: createAlias([
      // /@/xxxx => src/xxxx
      ['/@/', 'src'],
      // /#/xxxx => types/xxxx
      ['/#/', 'types'],
    ]),
  },
  server: {
    port: 8080,
    open: true,
    proxy: {

    },
    cors: true
  }
})
