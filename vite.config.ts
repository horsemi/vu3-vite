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
        port: 8096,
        open: true,
        host: 'test.ods.otwb.linshimuye.com',
        proxy: {
          '/policy-manage': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            // rewrite: (path: string) => {
            //   return path.replace('/policy-manage', '');
            // },
            changeOrigin: true,
          },
          '/wms-foundation': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
          '/permission': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
          '/ods/api': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
          '/passport': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
        },
        cors: true,
      },
      plugins: createVitePlugins(isBuild),
    };
  }
);
