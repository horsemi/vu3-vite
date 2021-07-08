import type { IColumnItem, IFieldType, IKeyType } from './types';

import { getList } from '/@/api/index';

// columns的dataType 接受的类型有 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
const handleType = (val: string): string => {
  if (val === 'decimal' || val === 'int32' || val === 'int64') {
    val = 'number';
  }
  return val;
};

export const baseDataPre = 'foundation_';

export const enumDataPre = 'enum_';

export const getColumnList = async (
  code: string,
  customColumns: IColumnItem[]
): Promise<{ columnList: IColumnItem[]; key: string[]; keyType: IKeyType[]; } | undefined> => {
  try {
    const res = await getList(code);
    const fieldTypes = res.store.odata.fieldTypes as IFieldType[];
    const key = res.store.odata.key as string[];
    const keyType = res.store.odata.keyType as IKeyType[];
    const columnList: IColumnItem[] = [];
    fieldTypes.forEach((fieldType: IFieldType) => {
      customColumns.forEach((column) => {
        if (fieldType.key === column.key) {
          columnList.push({
            type: handleType(fieldType.type),
            ...column,
          });
        }
      });
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
