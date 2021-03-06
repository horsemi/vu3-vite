import type { Router, RouteRecordRaw } from 'vue-router';

import { PageEnum } from '/@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { useUserStoreWidthOut } from '/@/store/modules/user';
import { usePermissionStoreWidthOut } from '/@/store/modules/permission';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: PageEnum[] = [LOGIN_PATH];
const blackPathList: string[] = [];

const permissionStrictState = true;

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStoreWidthOut();
    const permissionStore = usePermissionStoreWidthOut();
    // Jump to the 404 page after processing the login
    if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name) {
      next(PageEnum.BASE_HOME);
      return;
    }

    if (permissionStrictState) {
      // Whitelist can be directly entered
      if (whitePathList.includes(to.path as PageEnum)) {
        next();
        return;
      }
    } else {
      // Blacklist can be directly entered
      if (!blackPathList.includes(to.path)) {
        next();
        return;
      }
    }

    const token = userStore.getToken;

    // token does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (
        to.meta.ignoreAuth
        // || to.name === FULL_PAGE_NOT_FOUND_ROUTE.name
      ) {
        next();
        return;
      }
      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    // 构建路由
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => {
      router.addRoute((route as unknown) as RouteRecordRaw);
    });

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    permissionStore.setDynamicAddedRoute(true);
    next(nextData);
  });
}
