import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const expressPlatform: Array<AppRouteRecordRaw> = [
  {
    path: '/express-platform',
    name: 'ExpressPlatform',
    component: LAYOUT,
    meta: {
      title: '快递平台',
      icon: 'order',
      order: 5,
    },
    children: [
      {
        path: 'express-platform',
        name: 'ExpressPlatform',
        redirect: '/express-platform/express-platform/express-platform/list',
        meta: {
          title: '快递平台',
        },
        children: [
          {
            path: 'express-platform/list',
            name: 'ExpressPlatformList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '快递平台',
            },
          },
        ],
      },
    ],
  },
];

export default expressPlatform;
