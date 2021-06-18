import { getColumnList } from './common';
import { columnItem } from './types';

export interface IHeader {
  BillCode: string;
  BillDate: string;
  DocumentStatus: string;
  IsCancelled: boolean;
  TotalPackage: number;
  TotalVolume: number;
  Id: number;
}

const customColumns: columnItem[] = [
  {
    key: 'BillCode',
    caption: '单据编码',
    cellTemplate: 'billCode',
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
    datatypekeies: 'enum',
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
    key: 'Id',
    caption: 'Id',
  },
];

export const getColumns = async (): Promise<columnItem[] | undefined> => {
  return await getColumnList('shipping-orders', customColumns);
};
