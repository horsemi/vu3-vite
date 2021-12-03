import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

export interface IQueryItem {
  requirement: string;
  operator: string;
  operatorList: string[];
  value: string | number | boolean | Date | undefined;
  type: string;
  info: string;
  relationKey: string;
  datatypekeies: string;
}

export interface ISchemeData {
  scheme: ISchemeItem[];
  checkedIndex: number;
}
