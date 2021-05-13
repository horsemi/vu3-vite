import type { Router } from 'vue-router';
import { useAppStore } from '/@/store/modules/app';
import { useViewStore } from '/@/store/modules/view';
import { useUserStore } from '/@/store/modules/user';
import { usePermissionStore } from '/@/store/modules/permission';
import { PageEnum } from '/@/enums/pageEnum';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    const viewStore = useViewStore();
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      appStore.resumeAllState();
      permissionStore.resetState();
      viewStore.resetState();
      userStore.resetState();
    }
  });
}
