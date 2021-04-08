import type { RouteRecordRaw } from 'vue-router'

export const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: () => import('/@/views/error/index.vue')
};

export const REDIRECT_ROUTE: RouteRecordRaw = {
  path: '/redirect/:path(.*)',
  name: 'Redirect',
  component: () => import('/@/views/redirect/index.vue')
}
