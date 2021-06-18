import type { SystemConfig } from '/#/config';

import systemSetting from '/@/settings/systemSetting';
import { SYSTEM_CFG_KEY } from '/@/enums/cacheEnum';
import { useAppStore } from '/@/store/modules/app';
import { Persistent } from '/@/utils/cache/persistent';
import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env';
import { deepMerge } from '/@/utils';

import * as appConfigApi from '/@/api/app';

// Initial project configuration
export function initAppConfigStore() {
  let systemCfg = Persistent.getLocal(SYSTEM_CFG_KEY) as SystemConfig;
  systemCfg = deepMerge(systemSetting, systemCfg || {});
  const appStore = useAppStore();
  appStore.setSystemConfig(systemCfg);

  setTimeout(() => {
    clearObsoleteStorage();
  }, 16);
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  [localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key);
      }
    });
  });
}

export function initGlobalEnumData() {
  const appStore = useAppStore();
  appConfigApi.appConfigApi.getGlobalEnum().then((resolve) => {
    appStore.setGlobalEnumData(resolve);
  });
}
