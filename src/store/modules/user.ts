import type { UserInfo } from '../types';
import type { ISumbitPassword } from '/@/api/user';

import { defineStore } from 'pinia';

import { store } from '/@/store';

import { usePermissionStore } from '/@/store/modules/permission';
import { useAppStore } from '/@/store/modules/app';
import { TOKEN_KEY, USER_INFO_KEY, SHOW_NOTICE_BADGE_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';

import { UserApi, IUserData } from '/@/api/user';
import { setCookie } from '/@/utils/cache/cookies';
import { getToken } from '/@/utils/auth';
import { Persistent } from '/@/utils/cache/persistent';
import websocketService from '/@/utils/websocket/index';
import odsMessage from '/@/components/Message';

interface UserState {
  token?: string;
  userInfo: Nullable<UserInfo>;
  showNoticeBadge: boolean;
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
    showNoticeBadge: !!Persistent.getLocal(SHOW_NOTICE_BADGE_KEY),
  }),
  getters: {
    getToken(): string {
      return this.token || getToken();
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getShowNoticeBadge(): boolean {
      return this.showNoticeBadge;
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
    setShowNoticeBadge(value: boolean): void {
      this.showNoticeBadge = value;
      Persistent.setLocal(SHOW_NOTICE_BADGE_KEY, value);
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
            permissionStore.setPermissionCodeList(res.behaviors);
            permissionStore.changePermissionCode();

            try {
              websocketService.openConnect();
              websocketService.startConnect();
            } catch (error) {
              odsMessage({
                type: 'error',
                dangerouslyUseHTMLString: true,
                message:
                  '<div>您的浏览器版本，未支持WebSocket，<a style="color: #1197b7;padding: 0 2px" href="http://tms.4pl.linshimuye.com:8533/upload-browser.html">请点击将浏览器至最新版本！</a><div>',
              });
            } finally {
              resolve(res);
            }
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
            window.location.href = `${import.meta.env.VITE_APP_SSO_SERVERS_URL}#/login?tag=ods`;
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
