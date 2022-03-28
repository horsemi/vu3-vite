import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const basicManagement: Array<AppRouteRecordRaw> = [
  {
    path: '/basic-management',
    name: 'BasicManagement',
    component: LAYOUT,
    meta: {
      title: '基础配置',
      icon: 'menu-setting',
      order: 7,
    },
    children: [
      {
        path: 'basic-data',
        name: 'BasicData',
        redirect: '/basic-management/basic-data/material/list',
        meta: {
          title: '基础数据',
        },
        children: [
          {
            path: 'material/list',
            name: 'MaterialList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '物料',
            },
          },
          {
            path: 'material-bill/list',
            name: 'MaterialBillList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '物料清单',
            },
          },
          {
            path: 'lock-single-line/list',
            name: 'LockSingleLineList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '锁单路线',
            },
          },
        ],
      },
      {
        path: 'system-configuration',
        name: 'SystemConfiguration',
        redirect: '/basic-management/system-configuration/clear-cache/list',
        meta: {
          title: '系统配置',
        },
        children: [
          {
            path: 'clear-cache/list',
            name: 'ClearCacheList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '清除缓存',
            },
          },
          {
            path: 'filter-plan/list',
            name: 'FilterPlan',
            component: () => import('/@/views/system-configuration/filter-plan/index.vue'),
            meta: {
              title: '过滤方案配置',
              permissions: ['FilterPlan'],
            },
          },
        ],
      },
      {
        path: 'export-configuration',
        name: 'ExportConfiguration',
        redirect: '/basic-management/export-configuration/export/list',
        meta: {
          title: '导出配置',
        },
        children: [
          {
            path: 'export/list',
            name: 'ExportList',
            component: () => import('/@/views/export/index.vue'),
            meta: {
              title: '导出列表',
              permissions: ['ExportList'],
            },
          },
        ],
      },
    ],
  },
];

export default basicManagement;