import type { ITableOptions } from '/@/components/Table/types';

import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

export const getDetailDataSource = (
  code: string,
  select: string[],
  filter: unknown[]
): Promise<unknown[]> => {
  return new Promise((reslove, reject) => {
    const data = new DataSource({
      filter,
      paginate: false,
      pageSize: 1,
      store: new ODataStore({
        url: `/ods/api/odata/${code}`,
        key: 'Id',
        version: 4,
      }),
      select: [...select, 'Id'],
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
      url: `/ods/api/odata/${code}`,
      key: 'Id',
      keyType: 'int64',
      version: 4,
    }),
    select: [...select, 'Id'],
  });
  return data;
};
