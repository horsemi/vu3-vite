import type { Router } from 'vue-router';
import { appStore } from '/@/store/modules/app';
import { viewStore } from '/@/store/modules/view';
import { userStore } from '/@/store/modules/user';
import { permissionStore } from '/@/store/modules/permission';
import { PageEnum } from '/@/enums/pageEnum';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      appStore.resumeAllState();
      permissionStore.commitResetState();
      viewStore.commitResetState();
      userStore.commitResetState();
    }
  });
}
