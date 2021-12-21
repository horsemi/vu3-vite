import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'billId',
    caption: '单据ID',
    hide: true,
  },
  {
    key: 'billCode',
    caption: '单据编码',
    hide: true,
  },
  {
    key: 'billTypeCode',
    caption: '单据类型',
  },
  {
    key: 'documentStatus',
    caption: '操作类型',
  },
  {
    key: 'operatedTime',
    caption: '操作时间',
  },
  {
    key: 'operatorId',
    caption: '操作人ID',
  },
  {
    key: 'operator',
    caption: '操作人ID',
    relationKey: 'operatorId',
    notAllowQuery: true,
    foundationList: [
      {
        key: 'operator_accountName',
        caption: '操作人',
      },
    ],
  },
  {
    key: 'ipAddress',
    caption: '操作IP',
  },
  {
    key: 'description',
    caption: '操作描述',
  },
];

export const getRecordColumns = async () => {
  return await getColumnList('operation-records', customColumns);
};
