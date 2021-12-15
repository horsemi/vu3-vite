import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getRecordColumns } from '/@/model/operation-record';

export function useRecord(billCode: string) {
  const recordCustomColumns: IColumnItem[] = [
    {
      key: 'BillId',
      caption: '单据ID',
    },
    {
      key: 'BillCode',
      caption: '单据编码',
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
      key: 'Operator_AccountName',
      caption: '操作人',
      expand: 'Operator',
      relationKey: 'OperatorId',
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

  const recordScheme = ref<ISchemeItem>();
  const recordAllColumns = ref<IColumnItem[]>([]);

  getRecordColumns().then((res) => {
    if (res) {
      recordAllColumns.value = res.columnList;
      recordScheme.value = {
        id: '',
        title: '',
        requirement: [
          {
            requirement: 'BillCode',
            operator: '=',
            value: billCode,
            operatorList: [],
            type: 'string',
            relationKey: '',
            datatypekeies: '',
          },
        ],
        orderBy: [],
        columns: recordCustomColumns,
      };
    }
  });

  function refreshRecord() {
    recordScheme.value = {
      id: '',
      title: '',
      requirement: [
        {
          requirement: 'BillCode',
          operator: '=',
          value: billCode,
          operatorList: [],
          type: 'string',
          relationKey: '',
          datatypekeies: '',
        },
      ],
      orderBy: [],
      columns: recordCustomColumns,
    };
  }

  return {
    recordScheme,
    recordAllColumns,
    refreshRecord,
  };
}
