import { store } from '/@/store';
import { defineStore } from 'pinia';

import { formatToDateTime } from '/@/utils/date';
import { ErrorTypeEnum } from '/@/enums/exceptionEnum';

export interface ErrorLogInfo {
  type: ErrorTypeEnum;
  file: string;
  name?: string;
  message: string;
  stack?: string;
  detail: string;
  url: string;
  time?: string;
}

export interface ErrorLogState {
  // error log list
  errorInfo: ErrorLogInfo[] | null;
  // error log count
  errorListCount: number;
}

export const useErrorLogStore = defineStore({
  id: 'app-error-log',
  state: (): ErrorLogState => ({
    errorInfo: [],
    errorListCount: 0,
  }),
  getters: {
    getErrorInfo() {
      return this.errorInfo;
    },
    getErrorListCount() {
      return this.errorListCount;
    },
  },
  actions: {
    addErrorInfo(info: ErrorLogInfo): void {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      };
      this.errorInfo = [item, ...(this.errorInfo || [])];
      this.errorListCount += 1;
    },
    setErrorListCount(count: number): void {
      this.errorListCount = count;
    },
    /**
     * Triggered after ajax request error
     * @param error
     * @returns
     */
    addAjaxErrorInfo(error: any) {
      const errInfo: Partial<ErrorLogInfo> = {
        message: error.message,
        type: ErrorTypeEnum.AJAX,
      };
      if (error.response) {
        const {
          config: { url = '', data: params = '', method = 'get', headers = {} } = {},
          data = {},
        } = error.response;
        errInfo.url = url;
        errInfo.name = 'Ajax Error!';
        errInfo.file = '-';
        errInfo.stack = JSON.stringify(data);
        errInfo.detail = JSON.stringify({ params, method, headers });
      }
      this.addErrorInfo(errInfo as ErrorLogInfo);
    },
  },
});

// Need to be used outside the setup
export function useErrorLogStoreWithOut() {
  return useErrorLogStore(store);
}
