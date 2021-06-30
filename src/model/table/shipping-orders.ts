import { getColumnList } from './common';
import { IColumnItem } from './types';

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
  },
  {
    key: 'BillDate',
    caption: '单据日期',
  },
  {
    key: 'DocumentStatus',
    caption: '业务状态',
    datatypekeies: 'enum',
  },
  {
    key: 'IsCancelled',
    caption: '取消状态',
  },
  {
    key: 'TotalPackage',
    caption: '包件总数',
  },
  {
    key: 'TotalVolume',
    caption: '总体积',
  },
  {
    key: 'GatheringPointCode',
    caption: '集货点',
    datatypekeies: 'foundation_gathering-points',
  },
];

export const getColumnsOpitons = async () => {
  return await getColumnList('shipping-orders', customColumns);
};
