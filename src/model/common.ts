import type { IColumnItem, IFieldType, IKeyType } from './types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getList } from '/@/api/ods/common';

// columns的dataType 接受的类型有 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'

export const getColumnList = async ({
  code,
  customColumns,
  systemCode = 'ods',
}: {
  code: string;
  customColumns: IColumnItem[];
  systemCode?: string;
}): Promise<{ columnList: IColumnItem[]; key: string[]; keyType: IKeyType[] } | undefined> => {
  try {
    const res = await getList(code, systemCode);
    const fieldTypes = res.store.odata.fieldTypes as IFieldType[];
    const key = res.store.odata.key as string[];
    const keyType = res.store.odata.keyType as IKeyType[];
    const columnList: IColumnItem[] = [];
    customColumns.forEach((column) => {
      const fieldType = fieldTypes.find(
        (field) => field.key === column.key || (field.expand === column.key && column.relationKey)
      );
      if (fieldType) {
        columnList.push({
          type: fieldType.type,
          expand: fieldType.expand,
          ...column,
        });
      }
    });
    return {
      columnList,
      key,
      keyType,
    };
  } catch (err) {
    Promise.reject(err);
  }
};

export const isFoundationType = (columnItem: IDetailItem | IColumnItem) => {
  return columnItem.type !== 'enum' && columnItem.expand;
};
