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
    caption: 'BillCode',
    cellTemplate: 'billCode',
  },
  {
    key: 'BillDate',
    caption: 'BillDate',
  },
  {
    key: 'DocumentStatus',
    caption: 'DocumentStatus',
  },
  {
    key: 'IsCancelled',
    caption: 'IsCancelled',
  },
  {
    key: 'TotalPackage',
    caption: 'TotalPackage',
  },
  {
    key: 'TotalVolume',
    caption: 'TotalVolume',
  },
  {
    key: 'Id',
    caption: 'Id',
  },
];

export const getColumns = async (): Promise<columnItem[] | undefined> => {
  return await getColumnList('shipping-orders', customColumns);
};
