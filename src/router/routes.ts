import { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('/@/views/dashboard/index.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('/@/views/home/index.vue')
  }
]

export default routes;