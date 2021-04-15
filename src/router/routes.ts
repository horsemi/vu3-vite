import { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from './constant';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from './modules/basic';

const viewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    redirect: '/dashboard',
    component: LAYOUT,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('/@/views/dashboard/index.vue')
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: LAYOUT,
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('/@/views/home/index.vue')
      },
      {
        path: ':id',
        name: 'Home',
        component: () => import('/@/views/home/index.vue')
      }
    ]
  }
]

export const routes = [...viewRoutes, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE];