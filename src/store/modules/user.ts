import type { UserInfo } from '../types';

import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';

import store from '/@/store/index';
import { PageEnum } from '/@/enums/pageEnum';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import router from '/@/router';

const NAME_SPACE = 'user';
hotModuleUnregisterModule(NAME_SPACE);

@Module({ namespaced: true, name: NAME_SPACE, dynamic: true, store })
class User extends VuexModule {
  private token = '';

  private userInfoState: UserInfo | null = null;

  get getToken(): string {
    return this.token || getAuthCache<string>(TOKEN_KEY);
  }

  get getUserInfo(): UserInfo {
    return this.userInfoState || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
  }

  /**
   * @description 设定Token
   */
  @Mutation
  setToken(value: string): void {
    this.token = value;
    setAuthCache(TOKEN_KEY, value);
  }

  @Mutation
  setUserInfo(info: UserInfo): void {
    this.userInfoState = info;
    setAuthCache(USER_INFO_KEY, info);
  }

  @Mutation
  commitResetState(): void {
    this.userInfoState = null;
    this.token = '';
  }

  /**
   * @description 重置用户信息
   */
  @Action
  logout(goLogin = false): void {
    goLogin && router.push(PageEnum.BASE_LOGIN);
  }

  @Action
  login() {
    this.setUserInfo({ userId: 1, userName: 'TEST', roles: [], permissions: ['TEST'] });
    this.setToken('TEST');
  }
}
export const userStore = getModule<User>(User);
