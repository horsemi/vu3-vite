import type { IColumnItem } from '/@/model/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getFormList } from '/@/utils/bill';
import { getColumns } from '/@/model/entity/shipping-rules';
import { Ref, ref } from 'vue';
import { getOdataList } from '/@/api/ods/common';

export function useDetailForm(
  Id: string,
  multiViewItems: Ref<
    {
      title: string;
      key: string;
      rowCount: number;
    }[]
  >,
  callback: () => void
) {
  const base: IDetailItem[] = [
    {
      key: 'RuleCode',
      caption: '编号',
      disabled: true,
    },
    {
      key: 'Province',
      caption: '省',
    },
    {
      key: 'MinWeight',
      caption: '重量下限',
    },
    {
      key: 'MaxWeight',
      caption: '重量上限',
    },
    {
      key: 'ShippingType',
      caption: '发运方式',
      validate: [{ type: 'required', message: '请输入发运方式' }],
    },
    {
      key: 'CreatedTime',
      caption: '创建日期',
      disabled: true,
    },
    {
      key: 'UpdatedTime',
      caption: '更新日期',
      disabled: true,
    },
    {
      key: 'IsEnabled',
      caption: '状态',
      disabled: true,
    },
  ];

  const formData = ref();

  const formLoading = ref(true);

  const formEditStatus = ref<'Edit' | 'Add'>('Add');

  const baseFormData = ref<Record<string, unknown>>({});

  const baseInformation = ref<IDetailItem[]>([]);

  let columnList: IColumnItem[] = [];

  function getRowCount(data: IDetailItem[]) {
    const rowSpan = 8;
    let len = 0;
    data.forEach((item) => {
      if (!item.hide) {
        if (item.colSpan) {
          len += item.colSpan;
        } else if (item.editorType === 'dxSwitch') {
          len += 1;
        } else {
          len += 2;
        }
      }
    });
    return Math.ceil(len / rowSpan);
  }

  const refreshDetailForm = async (callback?) => {
    if (!columnList || columnList.length === 0) return;
    formLoading.value = true;
    const [baseList] = getFormList(columnList, [base]);

    const select: string[] = [];
    const expand: string[] = [];

    [baseList].forEach((list) => {
      list.forEach((item) => {
        if (item.expand && item.expand === item.key) {
          const { key, keyProperty, showProperty } = item;
          const _keyProperty = keyProperty ?? 'Code';
          const _showProperty = showProperty ?? 'Name';
          expand.push(key);
          select.push(`${key}.${_keyProperty}`);
          select.push(`${key}.${_showProperty}`);
        } else {
          select.push(item.key);
        }
      });
    });

    formEditStatus.value = Id ? 'Edit' : 'Add';

    if (formEditStatus.value === 'Edit') {
      const detailRes = await getOdataList(
        'shipping-rules',
        {
          $select: select.join(','),
          $expand: expand.join(','),
          $filter: `Id eq '${Id}'`,
        },
        'policy-manage'
      );

      const data = detailRes[0];
      /** 实验性功能 */
      [{ list: baseList, refData: baseFormData }].forEach(({ list, refData }) => {
        list.forEach((item) => {
          if (item.expand && item.expand === item.key) {
            const { key, keyProperty, showProperty } = item;
            const _keyProperty = keyProperty ?? 'Code';
            const _showProperty = showProperty ?? 'Name';
            refData.value[`${key}_${_keyProperty}`] = (data as Record<string, unknown>)[
              `${key}_${_keyProperty}`
            ];
            refData.value[`${key}_${_showProperty}`] = (data as Record<string, unknown>)[
              `${key}_${_showProperty}`
            ];
          } else {
            refData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
          }
        });
      });
    }

    baseInformation.value = baseList;

    [baseInformation.value].forEach((data, index) => {
      multiViewItems.value[index].rowCount = getRowCount(data);
    });
    callback();
    formLoading.value = false;
  };

  getColumns().then((res) => {
    if (res) {
      columnList = res.columnList;
      refreshDetailForm(callback);
    }
  });

  return {
    formData,
    formLoading,
    formEditStatus,
    baseFormData,
    baseInformation,
    refreshDetailForm,
  };
}
