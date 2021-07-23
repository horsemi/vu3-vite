import type { ITableOptions } from '/@/components/Table/types';

import { getDataSource } from './common';

const prefixUrls = '/ods/api/odata/';

export const getDetailDataSource = (
  code: string,
  select: string[],
  expand: string[],
  filter: unknown[]
): Promise<unknown[]> => {
  return new Promise((reslove, reject) => {
    const data = getDataSource(
      {
        filter,
        paginate: false,
        pageSize: 1,
        select: [...select, 'Id'],
        expand: expand,
      },
      {
        url: `${prefixUrls}${code}`,
        key: 'Id',
      }
    );

    data.load().then(
      (res) => {
        reslove(res);
        data.dispose();
      },
      (err) => {
        reject(err);
        data.dispose();
      }
    );
  });
};

export const getDefiniteDataSource = (
  code: string,
  select: string[],
  filter: unknown[],
  options: ITableOptions,
  expand?: string[]
) => {
  return getDataSource(
    {
      filter,
      paginate: options.dataSourceOptions.paginate,
      pageSize: options.page?.size,
      select: [...select, 'Id'],
      expand: expand,
    },
    {
      url: `${prefixUrls}${code}`,
      key: 'Id',
      keyType: 'string',
    }
  );
};
