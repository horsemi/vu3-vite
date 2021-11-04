import { getDataSource } from './common';

const prefixUrls = '/api/odata/';

export const getDetailDataSource = (
  code: string,
  select: string[],
  expand: string[],
  filter: unknown[],
  systemCode = 'ods'
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
        url: `/${systemCode}${prefixUrls}${code}`,
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
