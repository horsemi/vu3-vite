import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const orderManagement: Array<AppRouteRecordRaw> = [
  {
    path: '/order-management',
    name: 'OrderManagement',
    component: LAYOUT,
    meta: {
      title: '订单管理',
      icon: 'order',
    },
    children: [
      {
        path: 'shipping-management',
        name: 'OdsShippingOrder',
        redirect: '/order-management/shipping-management/shipping-order/list',
        meta: {
          title: '发货管理',
        },
        children: [
          {
            path: 'shipping-order/list',
            name: 'OdsShippingOrderList',
            component: () => import('/@/views/ods/shipping-order/list/index.vue'),
            meta: {
              title: '发货单',
            },
          },
          {
            path: 'shipping-advice/list',
            name: 'OdsShippingAdviceList',
            component: () => import('/@/views/ods/shipping-advice/list/index.vue'),
            meta: {
              title: '发货通知单',
            },
          },
          {
            path: 'shipping-order/detail',
            name: 'OdsShippingOrderDetail',
            component: () => import('/@/views/ods/shipping-order/detail/index.vue'),
            meta: {
              title: '发货单详情',
              hideMenu: true,
            },
          },
        ],
      },
    ],
  },
];

export default orderManagement;
