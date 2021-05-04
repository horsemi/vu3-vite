import type { AppRouteRecordRaw } from '/@/router/types';

import { toRaw } from 'vue';
import { VuexModule, Mutation, Module, getModule, Action } from 'vuex-module-decorators';

import { asyncRoutes } from '/@/router/routes';
import store from '/@/store';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { userStore } from '/@/store/modules/user';
import { appStore } from '/@/store/modules/app';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { filter } from '/@/utils/helper/treeHelper';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

const NAME = 'app-permission';
hotModuleUnregisterModule(NAME);

@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Permission extends VuexModule {
   // Permission code list
   private permCodeListState: string[] = [];

   // Whether the route has been dynamically added
   private isDynamicAddedRouteState = false;

   get getPermCodeListState() {
    return this.permCodeListState;
  }

  get getIsDynamicAddedRouteState() {
    return this.isDynamicAddedRouteState;
  }

  @Mutation
  commitPermCodeListState(codeList: string[]): void {
    this.permCodeListState = codeList;
  }

  @Mutation
  commitDynamicAddedRouteState(added: boolean): void {
    this.isDynamicAddedRouteState = added;
  }

  @Mutation
  commitResetState(): void {
    this.isDynamicAddedRouteState = false;
    this.permCodeListState = [];
  }

  @Action
  async changePermissionCode() {
    const { permissions } = userStore.getUserInfo;
    this.commitPermCodeListState(permissions);
  }

  @Action
  async buildRoutesAction() {
    let routes: AppRouteRecordRaw[] = [];
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
    return routes;
  }
}

export const permissionStore = getModule<Permission>(Permission);