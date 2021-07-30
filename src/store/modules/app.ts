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

let timeId: TimeoutHandle;

interface AppState {
  pageLoading: boolean;
  toastVisible: boolean;
  toastData: Record<string, unknown>;
  systemConfig: Nullable<SystemConfig>;
  globalEnumData: GlobalEnumType[];
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    pageLoading: false,
    toastVisible: false,
    toastData: {
      type: 'success',
      message: 'success',
      description: '',
    },
    systemConfig: Persistent.getLocal(SYSTEM_CFG_KEY),
    globalEnumData: [],
  }),
  getters: {
    getPageLoading() {
      return this.pageLoading;
    },
    getToastVisible() {
      return this.toastVisible;
    },
    getToastData() {
      return this.toastData;
    },
    getSystemConfig() {
      return this.systemConfig || ({} as SystemConfig);
    },
    getGlobalEnumData() {
      return this.globalEnumData;
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      if (loading) {
        clearTimeout(timeId);
        // 防止加载图标出现闪烁
        timeId = setTimeout(() => {
          this.pageLoading = loading;
        }, 50);
      } else {
        this.pageLoading = loading;
        clearTimeout(timeId);
      }
    },
    showToast(type: string, message: string, description = '') {
      this.toastVisible = true;
      this.toastData = {
        type,
        message,
        description,
      };
    },
    closeToast() {
      this.toastVisible = false;
      this.toastData = {
        type: '',
        message: '',
        description: '',
      };
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
