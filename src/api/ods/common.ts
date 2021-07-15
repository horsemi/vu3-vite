import { defHttp } from '/@/utils/http/axios';

export const getList = (code: string): Promise<any> => {
  return defHttp.get({ url: `/ods/api/odata/${code}/scheme/list` });
};

export const getFilter = (code: string): Promise<any> => {
  return defHttp.get({ url: `/ods/api/odata/${code}/scheme/filter` });
};
