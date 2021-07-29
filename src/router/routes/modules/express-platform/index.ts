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
        path: 'express-platform-test',
        name: 'ExpressPlatformTest',
        redirect: '/express-platform/express-platform-test/express-platform-test/list',
        meta: {
          title: '快递平台测试',
        },
        children: [
          {
            path: 'express-platform-test/list',
            name: 'ExpressPlatformTestList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '快递平台测试',
            },
          },
        ],
      },
    ],
  },
];

export default expressPlatform;
