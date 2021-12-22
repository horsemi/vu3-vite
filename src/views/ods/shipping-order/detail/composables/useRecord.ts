import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getRecordColumns } from '/@/model/operation-record';

export function useRecord(billCode: string) {
  const recordCustomColumns: IColumnItem[] = [
    {
      key: 'billId',
      caption: '单据ID',
    },
    {
      key: 'billCode',
      caption: '单据编码',
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
      key: 'operator_accountName',
      caption: '操作人',
      expand: 'operator',
      relationKey: 'operatorId',
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
            requirement: 'billCode',
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
        summary: [],
      };
    }
  });

  function refreshRecord() {
    recordScheme.value = {
      id: '',
      title: '',
      requirement: [
        {
          requirement: 'billCode',
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
      summary: [],
    };
  }

  return {
    recordScheme,
    recordAllColumns,
    refreshRecord,
  };
}
