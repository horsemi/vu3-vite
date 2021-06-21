import { columnItem, IFieldType } from './types';
import { getList } from '/@/api/index';

// columns的dataType 接受的类型有 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
const handleType = (val: string): string => {
  if (val === 'decimal' || val === 'int32') {
    val = 'number';
  }
  return val;
};

export const getColumnList = async (code: string, customColumns: columnItem[]) => {
  try {
    const res = await getList(code);
    const columns: columnItem[] = [];
    res.store.odata.fieldTypes.forEach((fieldType: IFieldType) => {
      customColumns.forEach((column) => {
        if (fieldType.key === column.key) {
          columns.push({
            type: handleType(fieldType.type),
            ...column,
          });
        }
      });
    });
    return columns;
  } catch (err) {
    Promise.reject(err);
  }
};
