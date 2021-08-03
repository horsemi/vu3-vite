import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'BillId',
    caption: '单据ID',
    hide: true,
  },
  {
    key: 'BillCode',
    caption: '单据编码',
    hide: true,
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
  },
  {
    key: 'DocumentStatus',
    caption: '操作类型',
  },
  {
    key: 'OperatedTime',
    caption: '操作时间',
  },
  {
    key: 'OperatorId',
    caption: '操作人',
  },
  {
    key: 'IpAddress',
    caption: '操作IP',
  },
  {
    key: 'Description',
    caption: '操作描述',
  },
];

export const getRecordColumns = async () => {
  return await getColumnList('operation-records', customColumns);
};
