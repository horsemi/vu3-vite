import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getRecordColumns } from '/@/model/entity/operation-record';

export function useRecord(BillCode: string) {
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

  const recordLoading = ref(true);

  const recordScheme = ref<ISchemeItem>();
  const recordAllColumns = ref<IColumnItem[]>([]);
  const recordTableKey = ref<string[]>([]);

  getRecordColumns().then((res) => {
    if (res) {
      recordTableKey.value = [res.key];
      recordAllColumns.value = res.columnList;
      recordScheme.value = {
        id: '',
        title: '',
        requirement: [
          {
            key: 'BillCode',
            operator: '=',
            value: BillCode,
            operatorList: [],
            type: 'string',
            relationKey: '',
            datatypekeies: '',
            entityKey: '',
          },
        ],
        orderBy: [],
        relationShips: [],
        columns: recordCustomColumns,
        summary: [],
      };
    }
  });

  function refreshRecord() {
    recordLoading.value = true;
    recordScheme.value = {
      id: '',
      title: '',
      requirement: [
        {
          key: 'BillCode',
          operator: '=',
          value: BillCode,
          operatorList: [],
          type: 'string',
          relationKey: '',
          datatypekeies: '',
          entityKey: '',
        },
      ],
      orderBy: [],
      relationShips: [],
      columns: recordCustomColumns,
      summary: [],
    };
  }

  return {
    recordScheme,
    recordLoading,
    recordTableKey,
    recordAllColumns,
    refreshRecord,
  };
}