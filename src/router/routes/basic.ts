import type { AppRouteRecordRaw } from '/@/router/types';

export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: () => import('/@/views/error/index.vue'),
  meta: {
    title: '错误页面',
  },
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect/:path(.*)',
  name: 'Redirect',
  component: () => import('/@/views/redirect/index.vue'),
  meta: {
    title: '跳转',
  },
};
