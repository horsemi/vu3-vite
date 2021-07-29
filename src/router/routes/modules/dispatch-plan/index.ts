import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dispatchPlan: Array<AppRouteRecordRaw> = [
  {
    path: '/dispatch-plan',
    name: 'DispatchPlan',
    component: LAYOUT,
    meta: {
      title: '调度计划',
      icon: 'order',
      order: 3,
    },
    children: [
      {
        path: 'dispatch-plan-test',
        name: 'DispatchPlanTest',
        redirect: '/order-management/shipping-management/shipping-order/list',
        meta: {
          title: '调度计划测试',
        },
        children: [
          {
            path: 'dispatch-plan-test/list',
            name: 'DispatchPlanTestList',
            component: () => import('/@/views/ods/shipping-order/list/index.vue'),
            meta: {
              title: '调度计划测试',
            },
          },
        ],
      },
    ],
  },
];

export default dispatchPlan;
