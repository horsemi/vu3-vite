import type { UserConfig, ConfigEnv } from 'vite';

import { defineConfig } from 'vite';

import { createAlias } from './build/vite/alias';
import { createVitePlugins } from './build/vite/plugin';
import { generateModifyVars } from './build/generate/generateModifyVars';

// https://vitejs.dev/config/
export default defineConfig(
  ({ command }: ConfigEnv): UserConfig => {
    const isBuild = command === 'build';

    return {
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
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: generateModifyVars(),
            javascriptEnabled: true,
          },
        },
      },
      server: {
        port: 8080,
        open: true,
        proxy: {},
        cors: true,
      },
      plugins: createVitePlugins(isBuild),
    };
  }
);
