import type { IColumnItem } from '/@/model/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { Ref, ref } from 'vue';
import { cloneDeep } from 'lodash-es';

import { getFormList } from '/@/utils/bill';
import { isUnDef } from '/@/utils/is';
import { getColumns } from '/@/model/entity/shipping-rules';

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
    callback && callback();
    formLoading.value = false;
  };

  /**
   * @description 格式化表单数据，用于表单提交数据时使用
   * @param formDataArray
   * @returns
   */
  function initFormDataHandle(formDataArray: any[]) {
    let _resultDataSum = {};

    formDataArray.forEach((item) => {
      const _resultFormData = cloneDeep(item.formData);

      item.information.forEach((element) => {
        // 在表单对象中添加基础资料的关联字段并为其赋值，置空基础资料组件的关联字段
        if (element.relationKey) {
          const _keyProperty = element.keyProperty ? element.keyProperty : 'Code';
          const _showProperty = element.showProperty ? element.showProperty : 'Name';

          if (!isUnDef(item.formData[`${element.key}_${_keyProperty}`])) {
            _resultFormData[element.relationKey] = item.formData[`${element.key}_${_keyProperty}`];

            _resultFormData[`${element.key}_${_keyProperty}`] = undefined;
            _resultFormData[`${element.key}_${_showProperty}`] = undefined;
          }
        }
      });
      item.formData = _resultFormData;
      _resultDataSum = Object.assign(_resultDataSum, _resultFormData);
    });

    return _resultDataSum;
  }

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
    initFormDataHandle,
  };
}
