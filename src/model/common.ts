import { IColumnItem, IFieldType } from './types';
import { getList } from '/@/api/index';

// columns的dataType 接受的类型有 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
const handleType = (val: string): string => {
  let type: string = val.toLocaleLowerCase();
  if (type === 'decimal' || type === 'int32') {
    type = 'number';
  }
  return type;
};

export const getColumnList = async (code: string, customColumns: IColumnItem[]): Promise<IColumnItem[] | undefined> => {
  try {
    const res = await getList(code);
    const columns: IColumnItem[] = [];
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
