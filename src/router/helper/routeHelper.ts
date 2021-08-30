import { cloneDeep } from 'lodash';
import type { AppRouteRecordRaw } from '/@/router/types';

// 生成不需要uuid的路由
export const isUuidRoute = async (routes: Array<AppRouteRecordRaw>) => {
  const result: string[] = [];
  const targetRoutes = cloneDeep(routes);
  const middlePath = targetRoutes[0].children && targetRoutes[0].children[0].path;
  const basicPath = targetRoutes[0].path + '/' + middlePath;
  targetRoutes[0].children &&
    targetRoutes[0].children[0].children?.forEach((routeItem) => {
      result.push(basicPath + '/' + routeItem.path);
    });
  return result;
};
