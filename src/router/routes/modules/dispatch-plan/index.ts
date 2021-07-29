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
        path: 'wave-time-plan',
        name: 'WaveTimePlan',
        redirect: '/dispatch-plan/wave-time-plan/wave-delivery-time/list',
        meta: {
          title: '波次计划',
        },
        children: [
          {
            path: 'wave-delivery-time/list',
            name: 'WaveDeliveryTimeList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '发货波次',
            },
          },
          {
            path: 'wave-time-kanban/list',
            name: 'WaveTimeKanbanList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '波次看板',
            },
          },
        ],
      },
      {
        path: 'scheduling-plan',
        name: 'SchedulingPlan',
        redirect: '/dispatch-plan/scheduling-plan/scheduling-record/list',
        meta: {
          title: '排班计划',
        },
        children: [
          {
            path: 'scheduling-record/list',
            name: 'SchedulingRecordList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '排班记录',
            },
          },
          {
            path: 'scheduling-kanban/list',
            name: 'SchedulingKanbanList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '排班看板',
            },
          },
        ],
      },
      {
        path: 'about-car-plan',
        name: 'AboutCarPlan',
        redirect: '/dispatch-plan/about-car-plan/about-car-record/list',
        meta: {
          title: '约车计划',
        },
        children: [
          {
            path: 'about-car-record/list',
            name: 'AboutCarRecordList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '约车记录',
            },
          },
          {
            path: 'about-car-kanban/list',
            name: 'AboutCarKanbanList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '约车看板',
            },
          },
        ],
      },
    ],
  },
];

export default dispatchPlan;
