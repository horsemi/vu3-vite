import type { AppRouteRecordRaw } from '/@/router/types';

import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { asyncRoutes } from '/@/router/routes';

import { useUserStore } from './user';
import { useAppStoreWidthOut } from './app';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { filter, treeToList } from '/@/utils/helper/treeHelper';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import _ from 'lodash';

interface PermissionState {
  // Permission code list
  permCodeList: string[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // Three level routing used by menu
  menuList: any[];
}

export const usePermissionStore = defineStore({
  id: 'permission-app',
  state: (): PermissionState => ({
    permCodeList: [],
    isDynamicAddedRoute: false,
    menuList: [],
  }),
  getters: {
    getPermCodeList() {
      return this.permCodeList;
    },
    getIsDynamicAddedRoute() {
      return this.isDynamicAddedRoute;
    },
    getMenuList() {
      return this.menuList;
    },
  },
  actions: {
    setDynamicAddedRoute(added: boolean): void {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.menuList = [];
    },
    async changePermissionCode() {
      const userStore = useUserStore();
      const { permissions } = userStore.getUserInfo;
      this.permCodeList = permissions;
    },
    async buildRoutesAction() {
      let routes: AppRouteRecordRaw[] = [];
      const userStore = useUserStore();
      const appStore = useAppStoreWidthOut();
      const { permissionMode } = appStore.getSystemConfig;
      const roleList = toRaw(userStore.getUserInfo).roles;
      const permissionList = toRaw(userStore.getUserInfo).permissions;
      // role mode
      if (permissionMode === PermissionModeEnum.ROLE) {
        const routeFilter = (route: AppRouteRecordRaw) => {
          const { meta } = route;
          const { roles } = meta || {};
          if (!roles) return true;
          return roleList.some((role) => roles.includes(role));
        };
        routes = filter(asyncRoutes, routeFilter);
        routes = routes.filter(routeFilter);
        // permission mode
      } else if (permissionMode === PermissionModeEnum.PERMISSION) {
        const routeFilter = (route: AppRouteRecordRaw) => {
          const { meta } = route;
          const { permissions } = meta || {};
          if (!permissions) return true;
          return permissionList.some((permission) => permissions.includes(permission));
        };
        routes = filter(asyncRoutes, routeFilter);
        routes = routes.filter(routeFilter);
      }
      routes.push(PAGE_NOT_FOUND_ROUTE);
      this.menuList = _.cloneDeep(routes);
      routes.forEach((item) => {
        item.children =
          item.children &&
          treeToList<AppRouteRecordRaw[]>(
            item.children,
            {},
            (result: any, children: string | undefined) => {
              result[children!].forEach((item) => {
                item.path = `${result.path}/${item.path}`;
              });
            }
          );
      });
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWidthOut() {
  return usePermissionStore(store);
}
