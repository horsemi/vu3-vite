import type { Router } from 'vue-router';

export function createPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    return true;
  });
}
