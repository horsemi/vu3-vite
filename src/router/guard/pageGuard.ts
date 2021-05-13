import type { Router } from 'vue-router';

import { useViewWithOutStore } from '/@/store/modules/view';
import { unref } from 'vue';

export function createPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    const viewStore = useViewWithOutStore();
    viewStore.addView(unref(to));
    return true;
  });
}
