import type { AppRouteRecordRaw } from '/@/router/types';
import { PageEnum } from '/@/enums/pageEnum';

export const ROOT_ROUTE: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: () => import('/@/views/error/index.vue'),
  meta: {
    hideMenu: true,
    title: '错误页面',
  },
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect/:path(.*)',
  name: 'Redirect',
  component: () => import('/@/views/redirect/index.vue'),
  meta: {
    hideMenu: true,
    title: '跳转',
  },
};

export const LOGIN_ROUTE: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/index.vue'),
  meta: {
    title: '登录',
  },
};
