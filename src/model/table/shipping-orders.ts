import type { IColumnItem } from './types';

import { getColumnList } from './common';

export interface IHeader {
  BillCode: string;
  BillDate: string;
  DocumentStatus: string;
  IsCancelled: boolean;
  TotalPackage: number;
  TotalVolume: number;
  Id: number;
}

export const customColumns: IColumnItem[] = [
  {
    key: 'BillCode',
    caption: '单据编码',
    cellTemplate: 'billCode',
    mustKey: true,
  },
  {
    key: 'GatheringParentCode',
    caption: '父单号',
    mustKey: true,
    hide: true,
  },
  {
    key: 'BillDate',
    caption: '单据日期',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
    datatypekeies: 'enum',
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '仓库',
  },
  {
    key: 'Nickname',
    caption: '买家昵称',
  },
  {
    key: 'DeliveryPointCode',
    caption: '提货点',
  },
  {
    key: 'ThreeServicePointCode',
    caption: '三包点',
  },
  {
    key: 'TotalVolume',
    caption: '总体积',
  },
  {
    key: 'TotalPackage',
    caption: '总包件数',
  },
];

export const getColumns = async () => {
  return await getColumnList('shipping-orders', customColumns);
};
