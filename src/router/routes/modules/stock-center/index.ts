import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const stockCenter: Array<AppRouteRecordRaw> = [
  {
    path: '/stock-center',
    name: 'StockCenter',
    component: LAYOUT,
    meta: {
      title: '库存中心',
      icon: 'order',
      order: 4,
    },
    children: [
      {
        path: 'stock-center-test',
        name: 'StockCenterTest',
        redirect: '/order-management/shipping-management/shipping-order/list',
        meta: {
          title: '库存中心测试',
        },
        children: [
          {
            path: 'stock-center-test/list',
            name: 'StockCenterTestList',
            component: () => import('/@/views/ods/shipping-order/list/index.vue'),
            meta: {
              title: '库存中心测试',
            },
          },
        ],
      },
    ],
  },
];

export default stockCenter;
