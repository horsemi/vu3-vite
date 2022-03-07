import type { EditorType, IDetailItem } from './types';
import type { IColumnItem } from '/@/model/types';

import { odsMessage } from '/@/components/Message';

const getEditorType = (type) => {
  let editorType: EditorType | undefined = undefined;
  if (type === 'string') {
    editorType = 'dxTextBox';
  } else if (type === 'number' || type === 'decimal') {
    editorType = 'dxNumberBox';
  } else if (type === 'boolean') {
    editorType = 'dxSwitch';
  } else if (type === 'datetime') {
    editorType = 'dxDateBox';
  }
  return editorType;
};

export const getFormList = (columnList: IColumnItem[], list: IDetailItem[][]) => {
  const temp: IDetailItem[][] = [];
  list.forEach((el) => {
    const newEl: IDetailItem[] = [];
    el.forEach((item) => {
      const col = columnList.find(
        (col) => item.key === col.key || (item.key === col.expand && col.relationKey)
      );
      if (col) {
        newEl.push({
          ...item,
          expand: col.expand,
          editorType: getEditorType(col.type),
          type: col.type,
          datatypekeies: col.datatypekeies,
          relationKey: col.relationKey,
        });
      }
    });
    temp.push(newEl);
  });
  return temp;
};

/**
 * @description 验证数组是否为空
 * @param array
 * @param msg
 * @returns
 */
export const isArrayEmpty = (array: any[], msg = '请选择操作项'): boolean => {
  if (Array.isArray(array) && array.length > 0) {
    return true;
  } else {
    odsMessage({
      type: 'warning',
      message: msg,
    });
    return false;
  }
};
