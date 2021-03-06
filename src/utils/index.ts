import { isObject } from '/@/utils/is';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import { cloneDeep } from 'lodash-es';
/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: Record<any, any>): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * @description 对象深度合并
 * @param src
 * @param target
 * @returns
 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * @description 获取原生路由对象
 * @param route
 * @returns
 */
export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, redirectedFrom, ...opt } = route;
  return {
    ...opt,
    redirectedFrom: redirectedFrom ? getRawRoute(redirectedFrom) : undefined,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

/**
 * @description 数组元素换位
 * @param arr 原数组
 * @param fromIndex 换位元素下标
 * @param toIndex 移动到具体位置的下标
 * @returns 新数组
 */
export function handleArrayTransposition<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const temp = cloneDeep(arr);
  temp[fromIndex] = temp.splice(toIndex, 1, temp[fromIndex])[0];
  return temp;
}
