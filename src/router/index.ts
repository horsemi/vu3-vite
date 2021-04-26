import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'Vue';

import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';

const WHITE_NAME_LIST = [''];

const router = createRouter({
  history: createWebHashHistory(),
  routes: (routes as unknown) as RouteRecordRaw[],
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
