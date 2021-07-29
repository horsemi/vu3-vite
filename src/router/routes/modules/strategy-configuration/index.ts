import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const strategyConfiguration: Array<AppRouteRecordRaw> = [
  {
    path: '/strategy-configuration',
    name: 'StrategyConfiguration',
    component: LAYOUT,
    meta: {
      title: '策略配置',
      icon: 'order',
      order: 6,
    },
    children: [
      {
        path: 'strategy-configuration-test',
        name: 'StrategyConfigurationTest',
        redirect: '/order-management/shipping-management/shipping-order/list',
        meta: {
          title: '策略配置测试',
        },
        children: [
          {
            path: 'strategy-configuration-test/list',
            name: 'StrategyConfigurationTestList',
            component: () => import('/@/views/ods/shipping-order/list/index.vue'),
            meta: {
              title: '策略配置测试',
            },
          },
        ],
      },
    ],
  },
];

export default strategyConfiguration;
