import { createRouter, createWebHashHistory } from 'vue-router';
import type { App } from 'Vue';
import routes  from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export function setupRouter(App: App<Element>) {
  App.use(router);
}

export default router;