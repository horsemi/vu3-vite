import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'Vue';

import { createRouter, createWebHashHistory } from 'vue-router';
import { basicRoutes } from './routes';
import { REDIRECT_ROUTE, LOGIN_ROUTE, ROOT_ROUTE } from '/@/router/routes/basic';

const WHITE_NAME_LIST = [LOGIN_ROUTE.name, REDIRECT_ROUTE.name, ROOT_ROUTE.name];

const router = createRouter({
  history: createWebHashHistory(),
  routes: (basicRoutes as unknown) as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export function setupRouter(App: App<Element>) {
  App.use(router);
}

export default router;
