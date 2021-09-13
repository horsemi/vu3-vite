import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const stockCenter: Array<AppRouteRecordRaw> = [
  {
    path: '/stock-center',
    name: 'StockCenter',
    component: LAYOUT,
    meta: {
      title: '库存中心',
      icon: 'menu-stock',
      order: 4,
    },
    children: [
      {
        path: 'stock-query',
        name: 'StockQuery',
        redirect: '/stock-center/stock-query/stock-search/list',
        meta: {
          title: '库存查询',
        },
        children: [
          {
            path: 'stock-search/list',
            name: 'StockSearchList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '库存查询',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8094/#/querystock',
              permissions: ['StockSearchList'],
            },
          },
          {
            path: 'stock-receiving-receiving-details/list',
            name: 'StockReceivingReceivingDetailsList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '库存收发明细',
              permissions: ['StockReceivingReceivingDetailsList'],
            },
          },
        ],
      },
      {
        path: 'stock-carrying',
        name: 'StockCarrying',
        redirect: '/stock-center/stock-carrying/querying-occupied-logs/list',
        meta: {
          title: '库存占用',
        },
        children: [
          {
            path: 'querying-occupied-logs/list',
            name: 'QueryAcquireLog',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '占用日志查询',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8094/#/queryacquirelog',
              permissions: ['QueryAcquireLog'],
            },
          },
        ],
      },
      {
        path: 'other-configuration',
        name: 'OtherConfiguration',
        redirect: '/stock-center/other-configuration/warehouse-assigns-priority/list',
        meta: {
          title: '其他配置',
        },
        children: [
          {
            path: 'warehouse-assigns-priority/list',
            name: 'WarehouseAssignsPriorityList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '仓库分配优先级',
              permissions: ['WarehouseAssignsPriorityList'],
            },
          },
        ],
      },
    ],
  },
];

export default stockCenter;
