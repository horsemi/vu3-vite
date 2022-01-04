import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
import type { IColumnItemBase } from '/@/model/types';
export interface IQueryItem extends IColumnItemBase {
  operator: string;
  operatorList: { key: string; value: string; name: string }[];
  value: string | number | boolean | Date | undefined;
  type: string;
  relationKey: string;
  datatypekeies: string;
}

export interface ISchemeData {
  scheme: ISchemeItem[];
  checkedIndex: number;
}
