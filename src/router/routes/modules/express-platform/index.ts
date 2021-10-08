import type { AppRouteRecordRaw } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const expressPlatform: Array<AppRouteRecordRaw> = [
  {
    path: '/express-platform',
    name: 'ExpressPlatform',
    component: LAYOUT,
    meta: {
      title: '快递平台',
      icon: 'menu-express',
      order: 5,
    },
    children: [
      {
        path: 'order-management',
        name: 'ExpressOrderManagement',
        redirect: '/express-platform/order-management/expressbill/list',
        meta: {
          title: '订单管理',
        },
        children: [
          {
            path: 'expressbill/list',
            name: 'ExpressBillList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递订单',
              frameSrc: `${import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL}#/expressbill/list`,
              permissions: ['ExpressBillList'],
            },
          },
        ],
      },
      {
        path: 'billing-reconciliation',
        name: 'BillingReconciliation',
        redirect: '/express-platform/billing-reconciliation/freightbill/list',
        meta: {
          title: '计费对账',
        },
        children: [
          {
            path: 'freightbill/list',
            name: 'FreightBillList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '运费账单',
              frameSrc: `${import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL}#/freightbill/list`,
              permissions: ['FreightBillList'],
            },
          },
        ],
      },
      {
        path: 'statistical-analysis',
        name: 'StatisticalAnalysis',
        redirect: '/express-platform/express-platform/express-platform/list',
        meta: {
          title: '统计分析',
        },
        children: [
          {
            path: 'report/timelimit/list',
            name: 'ExpressReportTimeLimitList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '时效监控',
              frameSrc: `${
                import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL
              }#/report/timelimit/list`,
              permissions: ['ExpressReportTimeLimitList'],
            },
          },
          {
            path: 'search/list',
            name: 'ExpressSearchList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '订单轨迹',
              frameSrc: `${import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL}#/search/list`,
              permissions: ['ExpressSearchList'],
            },
          },
          {
            path: 'report/shipping-advice-express/list',
            name: 'ExpressPlatformReportShippingAdviceExpress',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '发货明细',
              frameSrc: `${
                import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL
              }#/report/shipping-advice-express/list`,
              permissions: ['ExpressPlatformReportShippingAdviceExpress'],
            },
          },
        ],
      },
      {
        path: 'basic-configuration',
        name: 'BasicConfiguration',
        redirect: '/express-platform/basic-configuration/expresscompany/list',
        meta: {
          title: '基础配置',
        },
        children: [
          {
            path: 'expresscompany/list',
            name: 'ExpressCompanyList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递公司',
              frameSrc: `${import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL}#/expresscompany/list`,
              permissions: ['ExpressCompanyList'],
            },
          },
          {
            path: 'expressaccount/list',
            name: 'ExpressAccountList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '账户配置',
              frameSrc: `${import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL}#/expressaccount/list`,
              permissions: ['ExpressAccountList'],
            },
          },
          {
            path: 'regiontransformation/list',
            name: 'RegionTransformationList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '地址映射',
              frameSrc: `${
                import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL
              }#/regiontransformation/list`,
              permissions: ['RegionTransformationList'],
            },
          },
          {
            path: 'estimated-feeprice/list',
            name: 'ExpressPlatformEstimatedFeepriceList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '运费价目',
              frameSrc: `${
                import.meta.env.VITE_ROUTER_EXPRESSES_SERVERS_URL
              }#/estimated-feeprice/list`,
              permissions: ['ExpressPlatformEstimatedFeepriceList'],
            },
          },
        ],
      },
    ],
  },
];

export default expressPlatform;
