import type { Router } from 'vue-router';

import { viewStore } from '/@/store/modules/view';
import { unref } from 'vue';

export function createPageGuard(router: Router) {

  router.beforeEach(async (to) => {
    viewStore.addViewAction(unref(to));
    return true;
  });
}