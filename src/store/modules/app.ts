import type { GlobalEnumType } from '/@/store/types';

import { store } from '/@/store';

import { defineStore } from 'pinia';

import { SYSTEM_CFG_KEY, TOKEN_KEY } from '/@/enums/cacheEnum';
import { resetRouter } from '/@/router';
import { SystemConfig } from '/#/config';
import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';
import { removeCookie } from '/@/utils/cache/cookies';
import { useViewStore } from '/@/store/modules/view';
import { useUserStore } from '/@/store/modules/user';
import { usePermissionStore } from '/@/store/modules/permission';

interface AppState {
  showToastFn: () => void;
  toastData: Record<string, unknown>;
  menuOpenState: boolean;
  systemConfig: Nullable<SystemConfig>;
  globalEnumData: GlobalEnumType[];
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    showToastFn: () => undefined,
    toastData: {
      type: 'success',
      message: 'success',
      description: '',
    },
    // layout菜单展开状态
    menuOpenState: false,
    systemConfig: Persistent.getLocal(SYSTEM_CFG_KEY),
    globalEnumData: [],
  }),
  getters: {
    getshowToastFn() {
      return this.showToastFn;
    },
    getToastData() {
      return this.toastData;
    },
    getMenuOpenState() {
      return this.menuOpenState;
    },
    getSystemConfig() {
      return this.systemConfig || ({} as SystemConfig);
    },
    getGlobalEnumData() {
      return this.globalEnumData;
    },
  },
  actions: {
    initToast(fn: () => void) {
      this.showToastFn = fn;
    },
    showToast(type: string, message: string, description = '') {
      this.showToastFn();
      this.toastData = {
        type,
        message,
        description,
      };
    },
    setMenuOpenState(state: boolean) {
      this.menuOpenState = state;
    },
    async resumeAllState() {
      usePermissionStore().resetState();
      useViewStore().resetState();
      useUserStore().resetState();
      resetRouter();
      removeCookie(TOKEN_KEY);
      Persistent.clearAll();
    },
    setSystemConfig(systemConfig: SystemConfig): void {
      this.systemConfig = deepMerge(this.systemConfig || {}, systemConfig);
      Persistent.setLocal(SYSTEM_CFG_KEY, this.systemConfig);
    },
    setGlobalEnumData(globalEnumData: GlobalEnumType[]) {
      this.globalEnumData.push(...globalEnumData);
    },
    getGlobalEnumDataByCode(code: string) {
      const enumResult = this.globalEnumData.filter((item) => item.name === code);
      if (enumResult.length < 1) {
        return [];
      }
      return enumResult[0].options;
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWidthOut() {
  return useAppStore(store);
}
