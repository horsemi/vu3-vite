import type { Router } from 'vue-router';

import { TabRouterModeEnum } from '/@/enums/appEnum';
import { useAppStoreWidthOut } from '/@/store/modules/app';
import { getUuid } from '/@/utils/uuid';

// 白名单, 不需要uuid的页面
const unIdPageList = ['/home/demo/index', '/home', '/'];

export function createPageUuidGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const appStore = useAppStoreWidthOut();
    const tabRouterMode = appStore.getSystemConfig.tabRouterMode;

    if (tabRouterMode === TabRouterModeEnum.MULTIPLE) {
      if (to.query && to.query.uuid) {
        next();
      } else {
        if (unIdPageList.includes(to.path)) {
          next();
        } else {
          const queryData = Object.assign(to.query, { uuid: getUuid() });
          next({ path: to.path, query: queryData });
        }
      }
    } else {
      next();
    }
  });
}
