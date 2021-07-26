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
        data.dispose();
        reslove(res);
      },
      (err) => {
        data.dispose();
        reject(err);
      }
    );
  });
};
