import type { EditorType, IDetailItem } from './types';
import type { IColumnItem } from '/@/model/types';

import { warningMessage } from '/@/hooks/web/useMessage';

const getEditorType = (type) => {
  let editorType: EditorType | undefined = undefined;
  if (type === 'string') {
    editorType = 'dxTextBox';
  } else if (type === 'number') {
    editorType = 'dxNumberBox';
  } else if (type === 'boolean') {
    editorType = 'dxSwitch';
  } else if (type === 'datetime') {
    editorType = 'dxDateBox';
  }
  return editorType;
};

const getFormItem = (info, arr, columnList) => {
  columnList.some((col) => {
    if (info.dataField === col.key) {
      arr.push({
        ...info,
        label: col.caption,
        expand: col.expand,
        editorType: getEditorType(col.type),
        type: col.type,
        datatypekeies: col.datatypekeies,
      });
      return;
    }
  });
};

export const getFormList = (list: IDetailItem[], columnList: IColumnItem[]) => {
  const temp: IDetailItem[] = [];
  list.forEach((item) => {
    getFormItem(item, temp, columnList);
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
    warningMessage(msg);
    return false;
  }
};
