import type { GlobalEnumType } from '/@/store/types';

import { store } from '/@/store';

import { defineStore } from 'pinia';

import { SYSTEM_CFG_KEY } from '/@/enums/cacheEnum';
import { resetRouter } from '/@/router';
import { SystemConfig } from '/#/config';
import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';

let timeId: TimeoutHandle;

interface AppState {
  pageLoading: boolean;
  systemConfig: Nullable<SystemConfig>;
  globalEnumData: GlobalEnumType[];
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    pageLoading: false,
    systemConfig: Persistent.getLocal(SYSTEM_CFG_KEY),
    globalEnumData: [],
  }),
  getters: {
    getPageLoading() {
      return this.pageLoading;
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
    async resumeAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    setSystemConfig(systemConfig: SystemConfig): void {
      this.systemConfig = deepMerge(this.systemConfig || {}, systemConfig);
      Persistent.setLocal(SYSTEM_CFG_KEY, this.systemConfig);
    },
    setGlobalEnumData(globalEnumData: GlobalEnumType[]) {
      this.globalEnumData = globalEnumData;
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
