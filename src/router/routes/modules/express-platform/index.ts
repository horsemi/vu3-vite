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
        path: 'express-platform',
        name: 'ExpressPlatforms',
        redirect: '/express-platform/express-platform/express-platform/list',
        meta: {
          title: '快递平台',
        },
        children: [
          {
            path: 'expressbill/list',
            name: 'ExpressBillList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递单列表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/expressbill/list',
              permissions: ['ExpressBillList'],
            },
          },
          {
            path: 'search/list',
            name: 'ExpressSearchList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递查询',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/search/list',
              permissions: ['ExpressSearchList'],
            },
          },
          {
            path: 'report/timelimit/list',
            name: 'ExpressReportTimeLimitList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递时效监控报表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/report/timelimit/list',
              permissions: ['ExpressReportTimeLimitList'],
            },
          },
          {
            path: 'expresscompany/list',
            name: 'ExpressCompanyList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递公司列表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/expresscompany/list',
              permissions: ['ExpressCompanyList'],
            },
          },
          {
            path: 'recommendrule/list',
            name: 'RecommendRuleList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '推荐规则列表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/recommendrule/list',
              permissions: ['RecommendRuleList'],
            },
          },
          {
            path: 'restrictive-rule/list',
            name: 'RestrictiveRuleList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '限制规则列表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/restrictive-rule/list',
              permissions: ['RestrictiveRuleList'],
            },
          },
          {
            path: 'regiontransformation/list',
            name: 'RegionTransformationList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '区域转换列表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/regiontransformation/list',
              permissions: ['RegionTransformationList'],
            },
          },
          {
            path: 'expressaccount/list',
            name: 'ExpressAccountList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递账号列表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/expressaccount/list',
              permissions: ['ExpressAccountList'],
            },
          },
          {
            path: 'estimated-feeprice/list',
            name: 'ExpressPlatformEstimatedFeepriceList',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '预估运费价目表',
              frameSrc: 'http://test.tms.4pl.linshimuye.com:8095/#/estimated-feeprice/list',
              permissions: ['ExpressPlatformEstimatedFeepriceList'],
            },
          },
          {
            path: 'report/shipping-advice-express/list',
            name: 'ExpressPlatformReportShippingAdviceExpress',
            component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
            meta: {
              title: '快递订单明细报表',
              frameSrc:
                'http://test.tms.4pl.linshimuye.com:8095/#/report/shipping-advice-express/list',
              permissions: ['ExpressPlatformReportShippingAdviceExpress'],
            },
          },
        ],
      },
    ],
  },
];

export default expressPlatform;
