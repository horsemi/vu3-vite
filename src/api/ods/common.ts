import { defHttp } from '/@/utils/http/axios';

export const getOdsListUrlByCode = (code: string): string => {
  return `/ods/api/odata/${code}s`;
};

export const getList = (code: string): Promise<any> => {
  return defHttp.get({ url: `/ods/api/odata/${code}/scheme/list` });
};

export const getFilter = (code: string): Promise<any> => {
  return defHttp.get({ url: `/ods/api/odata/${code}/scheme/filter` });
};
