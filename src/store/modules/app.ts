import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';

import { SYSTEM_CFG_KEY } from '/@/enums/cacheEnum';

import { resetRouter } from '/@/router';
import { SystemConfig } from '/#/config';
import { Persistent } from '/@/utils/cache/persistent';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { deepMerge } from '/@/utils';

let timeId: TimeoutHandle;
const NAME_SPACE = 'app';
hotModuleUnregisterModule(NAME_SPACE);
@Module({ dynamic: true, namespaced: true, store, name: NAME_SPACE })
class App extends VuexModule {
  // 页面加载控制变量
  private pageLoadingState = false;

  private systemConfigState: SystemConfig | null = Persistent.getLocal(SYSTEM_CFG_KEY);

  get getPageLoading() {
    return this.pageLoadingState;
  }

  get getSystemConfig() {
    return this.systemConfigState || ({} as SystemConfig);
  }

  @Mutation
  commitPageLoadingState(loading: boolean): void {
    this.pageLoadingState = loading;
  }

  @Mutation
  commitSystemConfigState(systemConfigState: SystemConfig): void {
    this.systemConfigState = deepMerge(this.systemConfigState || {}, systemConfigState);
    Persistent.setLocal(SYSTEM_CFG_KEY, this.systemConfigState);
  }

  @Action
  async resumeAllState() {
    resetRouter();
    Persistent.clearAll();
  }

  @Action
  public async setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // 防止加载图标出现闪烁
      timeId = setTimeout(() => {
        this.commitPageLoadingState(loading);
      }, 50);
    } else {
      this.commitPageLoadingState(loading);
      clearTimeout(timeId);
    }
  }
}

export const appStore = getModule<App>(App);
