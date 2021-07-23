import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

export interface IQueryItem {
  requirement: string;
  operator: string;
  operatorList: string[];
  value: string | number | boolean | Date | undefined;
  type: string;
  relationKey: string;
  datatypekeies: string;
}

export interface ISchemeData {
  scheme: ISchemeItem[];
  fast: IQueryItem[];
  checkedIndex: number;
}
