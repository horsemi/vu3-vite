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
        url: `/api/odata/${code}`,
        key: 'Id',
        version: 4,
      }),
      select,
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
  filter: unknown[]
) => {
  const data = new DataSource({
    filter,
    paginate: true,
    pageSize: 20,
    store: new ODataStore({
      url: `/api/odata/${code}`,
      key: 'Id',
      version: 4,
    }),
    select,
  });
  return data;
};
