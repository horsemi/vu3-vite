import type { UserInfo } from '../types';

import { defineStore } from 'pinia';

import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';

import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import router from '/@/router';

interface UserState {
  token?: string;
  userInfo: Nullable<UserInfo>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: undefined,
    userInfo: null,
  }),
  getters: {
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
  },
  actions: {
    setToken(value: string): void {
      this.token = value;
      setAuthCache(TOKEN_KEY, value);
    },
    setUserInfo(info: UserInfo): void {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    resetState(): void {
      this.userInfo = null;
      this.token = '';
    },
    logout(goLogin = false): void {
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    async login(): Promise<void> {
      this.setUserInfo({ userId: 1, userName: 'TEST', roles: [], permissions: ['TEST'] });
      this.setToken('TEST');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
