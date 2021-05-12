import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: Array<AppRouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/analysis',
    component: LAYOUT,
    meta: {
      title: '根页面',
    },
    children: [
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('/@/views/dashboard/analysis/index.vue'),
        meta: {
          title: '仪表盘',
        },
      },
    ],
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/index',
    component: LAYOUT,
    meta: {
      title: '首页',
    },
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('/@/views/home/index.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: ':id',
        name: 'Home',
        component: () => import('/@/views/home/index.vue'),
        meta: {
          title: '带ID主页',
        },
      },
    ],
  },
];

export default dashboard;
