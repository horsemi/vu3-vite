import type { ITableOptions } from '/@/components/Table/types';

import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

import { tokenHeaderKey } from '/@/utils/http/axios/const';
import { useUserStoreWidthOut } from '/@/store/modules/user';

const prefixUrls = '/ods/api/odata/';

export const getDetailDataSource = (
  code: string,
  select: string[],
  expand: string[],
  filter: unknown[]
): Promise<unknown[]> => {
  return new Promise((reslove, reject) => {
    const data = new DataSource({
      filter,
      paginate: false,
      pageSize: 1,
      store: new ODataStore({
        url: `${prefixUrls}${code}`,
        key: 'Id',
        version: 4,
        beforeSend: (e) => {
          e.headers = {
            [tokenHeaderKey]: useUserStoreWidthOut().getToken,
          };
        },
      }),
      select: [...select, 'Id'],
      expand: expand,
    });

    data.load().then(
      (res) => {
        reslove(res);
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const getDefiniteDataSource = (
  code: string,
  select: string[],
  filter: unknown[],
  options: ITableOptions
) => {
  const data = new DataSource({
    filter,
    paginate: options.dataSourceOptions.paginate,
    pageSize: options.page?.size,
    store: new ODataStore({
      url: `${prefixUrls}${code}`,
      key: 'Id',
      keyType: 'string',
      version: 4,
      beforeSend: (e) => {
        e.headers = {
          [tokenHeaderKey]: useUserStoreWidthOut().getToken,
        };
      },
    }),
    select: [...select, 'Id'],
  });
  return data;
};
