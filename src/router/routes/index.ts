import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key: string) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

const viewRoutes: Array<AppRouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    redirect: '/dashboard',
    component: LAYOUT,
    meta: {
      title: '根页面',
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('/@/views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
        },
      },
    ],
  },
  {
    path: '/home',
    name: 'Home',
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

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/index.vue'),
  meta: {
    title: '登录',
  },
};

export const routes = [
  ...viewRoutes,
  ...routeModuleList,
  LoginRoute,
  PAGE_NOT_FOUND_ROUTE,
  REDIRECT_ROUTE,
];
