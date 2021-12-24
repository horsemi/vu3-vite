import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

export interface IQueryItem {
  key: string;
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
