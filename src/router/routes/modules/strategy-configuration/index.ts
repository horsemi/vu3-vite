import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const strategyConfiguration: Array<AppRouteRecordRaw> = [
  {
    path: '/strategy-configuration',
    name: 'StrategyConfiguration',
    component: LAYOUT,
    meta: {
      title: '策略配置',
      icon: 'menu-policy',
      order: 6,
    },
    children: [
      {
        path: 'express-strategy',
        name: 'ExpressStrategy',
        redirect: '/strategy-configuration/express-strategy/recommendrule/list',
        meta: {
          title: '快递策略',
        },
        children: [
          {
            path: 'recommendrule/list',
            name: 'RecommendRuleList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '推荐策略',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/recommendrule/list',
              permissions: ['RecommendRuleList'],
            },
          },
          {
            path: 'restrictive-rule/list',
            name: 'RestrictiveRuleList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '限制策略',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/restrictive-rule/list',
              permissions: ['RestrictiveRuleList'],
            },
          },
          {
            path: 'operational-rule/list',
            name: 'OperationalRuleList',
            // component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '运营策略',
              // frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/restrictive-rule/list',
              permissions: ['OperationalRuleList'],
            },
          },
        ],
      },
    ],
  },
];

export default strategyConfiguration;
