import store from '/@/store/index';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { UserInfo } from '../types';

const NAME_SPACE = "user";
hotModuleUnregisterModule(NAME_SPACE);

@Module({ namespaced: true, name: NAME_SPACE, dynamic: true, store })
class User extends VuexModule {
  private token: string = '';

  private userInfoState: UserInfo | null = null;

  get getToken(): string {
    return this.token;
  }

  get getUserInfo(): UserInfo {
    return this.userInfoState || {
      userId: 0,
      userName: ""
    };
  }

  /**
   * @description 设定Token
   */
  @Mutation
  setToken(value: string): void {
    this.token = value;
  }

  @Mutation
  setUserInfo(info: UserInfo): void {
    this.userInfoState = info;
  }

  /**
   * @description 重置用户信息
   */
  @Action
  resetUserInfo(): void {
    this.setToken('');
    this.setUserInfo({ userId: 0, userName: ''});
  }

  @Action
  login() {
    this.setUserInfo({ userId: 1, userName: 'TEST'});
    this.setToken('TEST');
  }
}
export const userStore = getModule<User>(User);