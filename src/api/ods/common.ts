import type { IDataSource, IODataStore } from './types';

import { defHttp } from '/@/utils/http/axios';

import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

import { tokenHeaderKey } from '/@/utils/http/axios/const';
import { useUserStoreWidthOut } from '/@/store/modules/user';

export const getOdsListUrlByCode = (code: string): string => {
  return `/ods/api/odata/${code}s`;
};

export const getList = (code: string): Promise<any> => {
  return defHttp.get({ url: `/ods/api/odata/${code}/scheme/list` });
};

export const getFilter = (code: string): Promise<any> => {
  return defHttp.get({ url: `/ods/api/odata/${code}/scheme/filter` });
};

export const getDataSource = (dataSource: IDataSource, oDataStore: IODataStore) => {
  const data = new DataSource({
    ...dataSource,
    store: new ODataStore({
      version: 4,
      beforeSend: (e) => {
        e.headers = {
          [tokenHeaderKey]: useUserStoreWidthOut().getToken,
        };
      },
      ...oDataStore,
    }),
  });
  return data;
};
