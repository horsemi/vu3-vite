import type { UserInfo } from '../types';
import type { ISumbitPassword } from '/@/api/user';

import { defineStore } from 'pinia';

import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import { usePermissionStore } from '/@/store/modules/permission';
import { useAppStore } from '/@/store/modules/app';
import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import router from '/@/router';
import { UserApi, IUserData } from '/@/api/user';
import { setCookie } from '/@/utils/cache/cookies';
import { getToken } from '/@/utils/auth';

interface UserState {
  token?: string;
  userInfo: Nullable<UserInfo>;
}
interface MenuType {
  code: string;
  name: string;
  url: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: undefined,
    userInfo: null,
  }),
  getters: {
    getToken(): string {
      return this.token || getToken();
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
  },
  actions: {
    setToken(value: string): void {
      this.token = value;
      setCookie(TOKEN_KEY, value);
    },
    setUserInfo(info: UserInfo): void {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    resetState(): void {
      this.userInfo = null;
      this.token = '';
    },
    getMenus(): Promise<MenuType[]> {
      return new Promise((resolve, reject) => {
        UserApi.getMenus()
          .then((res) => {
            resolve(res.menus);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getPermission(): Promise<{ behaviors: string[]; userName: string }> {
      return new Promise((resolve, reject) => {
        UserApi.getPermission()
          .then((res) => {
            const permissionStore = usePermissionStore();
            this.setUserInfo({
              accountId: res.accountId,
              accountName: res.accountName,
              applicationId: res.applicationId,
              userName: res.userName,
              roles: [],
              permissions: res.behaviors,
            });
            permissionStore.changePermissionCode();
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getPasswordPolicy(): Promise<{ regexp: string; regexpTips: string }> {
      return new Promise((resolve, reject) => {
        UserApi.queryPasswordPolicy()
          .then((res) => {
            resolve({ regexp: res[0].regexp, regexpTips: res[0].regexpTips });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    checkPassword(userInfo: IUserData): Promise<{ warningType: number }> {
      return new Promise((resolve) => {
        UserApi.checkPassword(userInfo).then((data) => {
          resolve(data);
        });
      });
    },
    changePassword(data: ISumbitPassword): Promise<void> {
      return new Promise((resolve, reject) => {
        UserApi.changePassword(data)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout(): Promise<void> {
      return new Promise((resolve, reject) => {
        UserApi.logout()
          .then(() => {
            useAppStore().resumeAllState();
            router.push(PageEnum.BASE_LOGIN);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async login(userData: IUserData): Promise<{ token: string }> {
      return new Promise((resolve, reject) => {
        UserApi.login(userData)
          .then(async (res) => {
            this.setToken(res.token);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
