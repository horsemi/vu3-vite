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
        path: 'policy-manage',
        name: 'PolicyManage',
        redirect: '/strategy-configuration/policy-manage/shipping-rules/list',
        meta: {
          title: '发运策略',
        },
        children: [
          {
            path: 'shipping-rules/list',
            name: 'PolicyManageShippingRulesList',
            component: () => import('/@/views/policy-manage/shipping-rules/list/index.vue'),
            meta: {
              title: '发运方式策略',
              permissions: ['PolicyManageShippingRulesList'],
              isUuid: true,
            },
          },
          {
            path: 'shipping-rules/detail',
            name: 'PolicyManageShippingRulesDetail',
            component: () => import('/@/views/policy-manage/shipping-rules/detail/index.vue'),
            meta: {
              title: '发运方式策略详情',
              hideMenu: true,
              isUuid: true,
            },
          },
        ],
      },
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
              frameSrc: `${import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL}#/recommendrule/list`,
              permissions: ['RecommendRuleList'],
            },
          },
          {
            path: 'restrictive-rule/list',
            name: 'RestrictiveRuleList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '限制策略',
              frameSrc: `${
                import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL
              }#/restrictive-rule/list`,
              permissions: ['RestrictiveRuleList'],
            },
          },
          {
            path: 'operational-rule/list',
            name: 'OperationalRuleList',
            // component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '运费策略',
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
