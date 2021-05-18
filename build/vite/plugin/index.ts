import type { Plugin } from 'vite';

import vue from '@vitejs/plugin-vue';

import { configSvgIconsPlugin } from './svgSprite';

export function createVitePlugins(isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    vue(),
  ];

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  return vitePlugins;
}
