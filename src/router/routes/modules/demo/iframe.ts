import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const iframe: Array<AppRouteRecordRaw> = [
  {
    path: '/frame',
    name: 'Frame',
    component: LAYOUT,
    redirect: '/frame/doc',
    meta: {
      title: '外部链接',
    },
    children: [
      {
        path: 'doc',
        name: 'Doc',
        component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
        meta: {
          title: '外链文档',
          frameSrc: 'https://vvbin.cn/doc-next/',
        },
      },
      {
        path: 'baidu',
        name: 'Baidu',
        component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
        meta: {
          title: '外链百度',
          frameSrc: 'https://baidu.com/',
        },
      },
    ],
  },
];

export default iframe;
