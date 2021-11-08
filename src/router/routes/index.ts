import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, ROOT_ROUTE } from '/@/router/routes/basic';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key: string) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

const afterSortRouteList: AppRouteModule[] = routeModuleList.sort(
  (a: AppRouteRecordRaw, b: AppRouteRecordRaw) => {
    if (!a.meta.order || !b.meta.order) {
      return 0;
    } else {
      return a.meta.order - b.meta.order;
    }
  }
);

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...afterSortRouteList];

export const basicRoutes = [ROOT_ROUTE, REDIRECT_ROUTE];
