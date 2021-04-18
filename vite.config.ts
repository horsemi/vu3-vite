import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { createAlias } from './build/vite/alias';
// import { generateModifyVars } from './build/generate/generateModifyVars';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/devextreme-vue3-vite2/',
  mode: 'development',
  resolve: {
    alias: createAlias([
      // /@/xxxx => src/xxxx
      ['/@/', 'src'],
      // /#/xxxx => types/xxxx
      ['/#/', 'types'],
    ]),
  },
  // css: {
  //   preprocessorOptions: {
  //     less: {
  //       modifyVars: generateModifyVars(),
  //       javascriptEnabled: true,
  //     },
  //   },
  // },
  server: {
    port: 8080,
    open: true,
    proxy: {

    },
    cors: true
  },
  plugins: [vue()]
})
