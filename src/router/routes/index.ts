import type { AppRouteModule } from '/@/router/types';

import {
  PAGE_NOT_FOUND_ROUTE,
  REDIRECT_ROUTE,
  LOGIN_ROUTE,
  ROOT_ROUTE,
} from '/@/router/routes/basic';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key: string) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const basicRoutes = [LOGIN_ROUTE, ROOT_ROUTE, REDIRECT_ROUTE];
