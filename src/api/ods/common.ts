import { defHttp } from '/@/utils/http/axios';

export const getOdsListUrlByCode = (code: string, systemCode = 'ods'): string => {
  return `/${systemCode}/api/odata/${code}`;
};

export const getList = (code: string, systemCode = 'ods'): Promise<any> => {
  return defHttp.get({ url: `/${systemCode}/api/scheme/metadata?entity=${code}` });
};

export const getFilter = (code: string, systemCode = 'ods'): Promise<any> => {
  return defHttp.get({ url: `/${systemCode}/api/odata/${code}/scheme/filter` });
};
// 统一OdsTable接口
export const getOdataList = (code: string, QueryParameters, systemCode = 'ods'): Promise<any> => {
  if (systemCode === 'ods') {
    return defHttp.post({
      url: `/${systemCode}/api/${code}/search?flat=1&upper=1`,
      params: { ...QueryParameters },
    });
  }

  return defHttp.post({
    url: `/${systemCode}/api/search/${code}?flat=1&upper=1`,
    params: { ...QueryParameters },
  });
};
