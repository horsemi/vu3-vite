import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';

export const getDetailDataSource = (code: string, key: string, select: string, filter: any[]): Promise<any[]> => {
  return new Promise((reslove, reject) => {
    const data = new DataSource({
      sort: `${key} desc`,
      filter,
      paginate: false,
      pageSize: 1,
      store: new ODataStore({
        url: `/api/odata/${code}`,
        key,
        version: 4,
      }),
      select
    });
    
    data.load().then((res) => {
      reslove(res);
    }, (err) => {
      reject(err);
    });
  });
};