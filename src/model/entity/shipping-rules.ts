import type { IColumnItem, IRelationShipItem } from '../types';

import { getColumnList } from '../common';

export const relationShips: IRelationShipItem[] = [
  {
    key: '',
    entityCode: 'shipping-rules',
    caption: '基本',
    isMainEntity: true,
  },
];

export const customColumns: IColumnItem[] = [
  {
    key: 'RuleCode',
    caption: '编号',
    cellTemplate: 'billCode',
    mustKey: true,
  },
  {
    key: 'CreatedTime',
    caption: '创建日期',
    type: 'datetime',
    summaryList: ['max', 'min'],
  },
  {
    key: 'UpdatedTime',
    caption: '更新日期',
    type: 'datetime',
    summaryList: ['max', 'min'],
  },
  {
    key: 'ShippingType',
    caption: '发运方式',
  },
  {
    key: 'Province',
    caption: '省',
    relationKey: 'ProvinceCode',
    foundationList: [
      {
        key: 'Province_Name',
        caption: '省',
      },
    ],
    datatypekeies: 'provinces',
  },
  {
    key: 'ProvinceCode',
    caption: '省编码',
    datatypekeies: 'provinces',
  },
  {
    key: 'MinWeight',
    caption: '重量下限',
    summaryList: ['max', 'min', 'avg', 'sum'],
  },
  {
    key: 'MaxWeight',
    caption: '重量上限',
    summaryList: ['max', 'min', 'avg', 'sum'],
  },
  {
    key: 'IsEnabled',
    caption: '状态',
    customOption: [
      {
        key: true,
        value: '生效',
      },
      {
        key: false,
        value: '失效',
      },
    ],
  },
];

export const getColumns = async () => {
  return await getColumnList({
    code: 'shipping-rules',
    customColumns,
    systemCode: 'policy-manage',
  });
};

export default getColumns;
