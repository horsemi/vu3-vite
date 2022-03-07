import type { UserConfig, ConfigEnv } from 'vite';

import { defineConfig } from 'vite';
import { resolve } from 'path';

import { createVitePlugins } from './build/vite/plugin';
import { generateModifyVars } from './build/generate/generateModifyVars';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

/**
 * @see {@link https://vitejs.dev/config/}
 */
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
          '/api/exportation': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
          '/passport': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
          '/noticication': {
            target: 'http://test.api.otwb.linshimuye.com:30024',
            changeOrigin: true,
          },
          /**
           * @description 发起连接的地址,`本地开发`时不可以使用框架自带的反向代理来转发,只能通过写死URL的方式
           * vitejs会发起用于HMR的webSocket,并让同源下的webSocket链接一直为'pending'状态
           * {@see src\utils\websocket\index.ts}
           */
          // '/hubs': {
          //   target: 'http://10.10.14.164:30039',
          //   changeOrigin: true,
          // },
        },
        cors: true,
      },
      plugins: createVitePlugins(isBuild),
    };
  }
);
