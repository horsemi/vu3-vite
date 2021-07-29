import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const basicManagement: Array<AppRouteRecordRaw> = [
  {
    path: '/basic-management',
    name: 'BasicManagement',
    component: LAYOUT,
    meta: {
      title: '基础配置',
      icon: 'order',
      order: 7,
    },
    children: [
      {
        path: 'basic-management-test',
        name: 'BasicManagementTest',
        redirect: '/order-management/shipping-management/shipping-order/list',
        meta: {
          title: '基础配置测试',
        },
        children: [
          {
            path: 'basic-management-test/list',
            name: 'BasicManagementTestList',
            component: () => import('/@/views/ods/shipping-order/list/index.vue'),
            meta: {
              title: '基础配置测试',
            },
          },
        ],
      },
    ],
  },
];

export default basicManagement;
