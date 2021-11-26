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
  menuList: AppRouteRecordRaw[];
  permissionRoutes: AppRouteRecordRaw[];
}

export const usePermissionStore = defineStore({
  id: 'permission-app',
  state: (): PermissionState => ({
    permCodeList: [],
    isDynamicAddedRoute: false,
    menuList: [],
    permissionRoutes: [],
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
    getPermissionRoutes() {
      return this.permissionRoutes;
    },
  },
  actions: {
    setDynamicAddedRoute(added: boolean): void {
      this.isDynamicAddedRoute = added;
    },
    setPermissionCodeList(permissionList: string[]) {
      this.permCodeList = [...permissionList];
    },
    setMenuList(menuList: AppRouteRecordRaw[]): void {
      const menuFilter = (menu: AppRouteRecordRaw, index: number) => {
        const { meta, children } = menu;
        const { hideMenu } = meta || {};

        // 判断只会对一、二级菜单项生效 第三级菜单只校验是否为隐藏项
        if ((!hideMenu && children && children.length > 0) || (index === 2 && !hideMenu))
          return true;
        return false;
      };

      this.menuList = filter(menuList, menuFilter);
    },
    setPermissionRoutes(permissionRoutes: AppRouteRecordRaw[]): void {
      this.permissionRoutes = permissionRoutes;
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
      const roleList = toRaw(userStore.getUserInfo).roles || [];
      const menuPermissionList = await userStore.getMenus();
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
          return menuPermissionList.some((permission) => permissions.includes(permission.code));
        };
        routes = filter(asyncRoutes, routeFilter);
        routes = routes.filter(routeFilter);
      }
      routes.push(PAGE_NOT_FOUND_ROUTE);

      this.setMenuList(_.cloneDeep(routes));

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

      this.setPermissionRoutes(routes);

      return routes;
    },
    hasPermission(permission: string): boolean {
      return this.permCodeList.includes(permission);
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWidthOut() {
  return usePermissionStore(store);
}
