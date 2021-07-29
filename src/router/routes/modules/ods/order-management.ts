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
      order: 2,
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
              permissions: ['OdsShippingOrderList'],
            },
          },
          {
            path: 'shipping-advice/list',
            name: 'OdsShippingAdviceList',
            component: () => import('/@/views/ods/shipping-advice/list/index.vue'),
            meta: {
              title: '发货通知单',
              permissions: ['OdsShippingAdviceList'],
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
          {
            path: 'shipping-advice/detail',
            name: 'OdsShippingAdviceDetail',
            component: () => import('/@/views/ods/shipping-advice/detail/index.vue'),
            meta: {
              title: '发货通知单详情',
              hideMenu: true,
            },
          },
        ],
      },
      {
        path: 'outbound-management',
        name: 'OdsOutboundOrder',
        redirect: '/order-management/outbound-management/outbound-order/list',
        meta: {
          title: '出库管理',
        },
        children: [
          {
            path: 'outbound-order/list',
            name: 'OdsOutboundOrderList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '出库单',
            },
          },
          {
            path: 'outbound-advice/list',
            name: 'OdsOutboundAdviceList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '出库通知单',
            },
          },
        ],
      },
      {
        path: 'inbound-management',
        name: 'OdsInboundOrder',
        redirect: '/order-management/inbound-management/inbound-order/list',
        meta: {
          title: '入库管理',
        },
        children: [
          {
            path: 'inbound-order/list',
            name: 'OdsInboundOrderList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '入库单',
            },
          },
          {
            path: 'inbound-advice/list',
            name: 'OdsInboundAdviceList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '入库通知单',
            },
          },
        ],
      },
      {
        path: 'library-management',
        name: 'OdslLibrary',
        redirect: '/order-management/library-management/direct-transfers-order/list',
        meta: {
          title: '库内管理',
        },
        children: [
          {
            path: 'direct-transfers-order/list',
            name: 'OdsDirectTransfersOrderList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '直接调拨单',
            },
          },
          {
            path: 'assembly-disassembly/list',
            name: 'OdsAssemblyDisassemblyList',
            component: () => import('/@/views/home/index.vue'),
            meta: {
              title: '组装拆卸单',
            },
          },
        ],
      },
    ],
  },
];

export default orderManagement;
