import type { AxiosResponse } from 'axios';
import type { RequestOptions, Result } from './types';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';

import { Request } from './request';
import { createNow, formatRequestDate } from './helper';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { errorResult, tokenHeaderKey } from './const';
import { useUserStoreWidthOut } from '/@/store/modules/user';
import { useViewWithOutStore } from '/@/store/modules/view';
import { useErrorLogStoreWithOut } from '/@/store/modules/error';
import { odsMessage } from '/@/components/Message';
import { checkStatus } from './checkStatues';

/**
 * @description 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description 处理请求数据
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformRequestResult } = options;
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformRequestResult) {
      return res.data;
    }
    // 错误的时候返回

    const { data: resData } = res;
    if (!resData) {
      // return '[HTTP] Request has no return value';
      return errorResult;
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { result, data, message } = resData;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = result === ResultEnum.SUCCESS; // data && Reflect.has(data, 'code') && result === ResultEnum.SUCCESS
    if (!hasSuccess) {
      if (message) {
        odsMessage({
          type: 'error',
          message,
        });
      }
      Promise.reject(new Error(message));
      return errorResult;
    }

    // 接口请求成功，直接返回结果
    if (result === ResultEnum.SUCCESS) {
      message &&
        odsMessage({
          type: 'success',
          message,
        });
      return data;
    }
    // 接口请求错误，统一提示错误信息
    if (result === ResultEnum.ERROR || result === ResultEnum.ERR) {
      if (message) {
        odsMessage({
          type: 'error',
          message,
        });
        Promise.reject(new Error(message));
      } else {
        const msg = '后台系统错误';
        odsMessage({
          type: 'error',
          message: msg,
        });
        Promise.reject(new Error(msg));
      }
      return errorResult;
    }
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { joinParamsToUrl, formatDate, joinTime = true } = options;

    const params = config.params || {};
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, createNow(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${createNow(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        config.data = params;
        config.params = undefined;
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.data);
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description 请求拦截器处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const userStore = useUserStoreWidthOut();
    const token = userStore.getToken;
    if (token) {
      // jwt token
      // config.headers.Authorization = token;
      config.headers[tokenHeaderKey] = token;
    }
    return config;
  },

  responseInterceptors: (res: AxiosResponse<any>) => {
    const { data: resData } = res;
    if (!resData) {
      // return '[HTTP] Request has no return value';
      return Promise.reject(new Error());
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { result, data, message } = resData;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = result === ResultEnum.SUCCESS; // data && Reflect.has(data, 'code') && result === ResultEnum.SUCCESS
    // 接口请求错误，统一提示错误信息
    if (!hasSuccess) {
      return Promise.reject(new Error(message));
    }

    // 接口请求成功，直接返回结果
    if (result === ResultEnum.SUCCESS) {
      message &&
        odsMessage({
          type: 'success',
          message,
        });
      return data;
    }
  },

  /**
   * @description 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    useViewWithOutStore().setLoading(false);
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { message } = error || {};

    checkStatus(error?.response?.status, message);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new Request(
    deepMerge(
      {
        // timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
        },
      },
      opt || {}
    )
  );
}

export const defHttp = createAxios();
