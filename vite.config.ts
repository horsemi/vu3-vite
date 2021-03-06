import type { UserConfig, ConfigEnv } from 'vite';

import { defineConfig } from 'vite';
import { resolve } from 'path';

import { createVitePlugins } from './build/vite/plugin';
import { generateModifyVars } from './build/generate/generateModifyVars';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(
  ({ command }: ConfigEnv): UserConfig => {
    const isBuild = command === 'build';
    const root = process.cwd();
    return {
      base: '/',
      root,
      mode: 'development',
      resolve: {
        alias: [
          // /@/xxxx => src/xxxx
          {
            find: /\/@\//,
            replacement: pathResolve('src') + '/',
          },
          // /#/xxxx => types/xxxx
          {
            find: /\/#\//,
            replacement: pathResolve('types') + '/',
          },
        ],
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
        proxy: {
          '/api/foundation': {
            target: 'http://10.10.14.207:30034',
            changeOrigin: true,
          },
          '/api': {
            target: 'http://10.10.14.207:30037',
            changeOrigin: true,
          },
        },
        cors: true,
      },
      plugins: createVitePlugins(isBuild),
    };
  }
);
