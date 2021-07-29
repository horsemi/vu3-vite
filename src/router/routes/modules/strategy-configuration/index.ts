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
        path: 'strategy-configuration',
        name: 'StrategyConfiguration',
        redirect: '/strategy-configuration/strategy-configuration/strategy-configuration/list',
        meta: {
          title: '策略配置',
        },
        children: [
          {
            path: 'strategy-configuration/list',
            name: 'StrategyConfigurationList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '策略配置',
            },
          },
        ],
      },
    ],
  },
];

export default strategyConfiguration;
