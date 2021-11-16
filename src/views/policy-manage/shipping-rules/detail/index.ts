import type { IDetailItem } from '/@/utils/bill/types';

import { getDetailDataSource } from '/@/api/ods/detail';
import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    key: 'RuleCode',
    caption: '编号',
    disabled: true,
  },
  {
    key: 'ProvinceCode',
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

export const getDetailData = async (filter: any[], columnsData: any) => {
  if (!columnsData) return;
  const { columnList } = columnsData;
  const [baseList] = getFormList(columnList, [base]);

  const select: string[] = [];
  const expand: string[] = [];

  [baseList].forEach((list) => {
    list.forEach((item) => {
      if (isFoundationType(item)) {
        expand.push(item.expand as string);
      }
      select.push(item.key);
    });
  });

  const data = await getDetailDataSource('shipping-rules', select, expand, filter, 'policy-manage');

  return data[0];
};

export const getDetailColumn = (columnsData: any) => {
  if (!columnsData) return;
  const { columnList } = columnsData;
  const [baseList] = getFormList(columnList, [base]);

  return baseList;
};
