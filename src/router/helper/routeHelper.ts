import { cloneDeep } from 'lodash';
import type { AppRouteRecordRaw } from '/@/router/types';

// 生成不需要uuid的路由
export const isUuidRoute = async (routes: Array<AppRouteRecordRaw>) => {
  const result: string[] = [];
  const targetRoutes = cloneDeep(routes);
  const targetChildren = targetRoutes[0].children as Array<AppRouteRecordRaw>;
  for (let i = 0; i < targetChildren.length; i++) {
    const middlePath = targetChildren[i].path;
    const basicPath = targetRoutes[0].path + '/' + middlePath;
    targetChildren &&
      targetChildren[i].children?.forEach((routeItem) => {
        result.push(basicPath + '/' + routeItem.path);
      });
  }
  return result;
};
