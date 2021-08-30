import type { Router } from 'vue-router';

import { TabRouterModeEnum } from '/@/enums/appEnum';
import { useAppStoreWidthOut } from '/@/store/modules/app';
import { getUuid } from '/@/utils/uuid';
import { isUuidRoute } from '/@/router/helper/routeHelper';
import expressPlatform from '/@/router/routes/modules/express-platform';

// 白名单, 不需要uuid的页面
const unIdPageList = ['/home/demo/index', '/home', '/'];

export function createPageUuidGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStoreWidthOut();
    const tabRouterMode = appStore.getSystemConfig.tabRouterMode;
    const expressWhite = await isUuidRoute(expressPlatform);
    unIdPageList.push(...expressWhite);
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
