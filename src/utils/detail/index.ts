import type { EditorType, IDetailItem } from './types';
import type { IColumnItem } from '/@/model/types';

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
  list.forEach((b) => {
    getFormItem(b, temp, columnList);
  });
  return temp;
};
