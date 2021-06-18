import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { deepMerge } from '/@/utils/index';
import { ITableOptions } from './type';
import { IColumnItem } from '/@/model/types';
import { cloneDeep } from 'lodash-es';

export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    sort: '',
    paginate: true,
    oDataOptions: {
      url: '',
      version: 4,
    },
  },
  height: '100%',
  showColumnLines: false,
  showRowLines: true,
  showBorders: false,
  rowAlternationEnabled: true,
  selection: {
    allMode: 'allPages',
    checkBoxesMode: 'always',
  },
  page: {
    size: 10,
  },
};
export const getDataSource = async (options: ITableOptions, getFilterValue: () => Promise<IColumnItem[] | undefined>) => {
  const defaultOptions: ITableOptions = cloneDeep(defaultTableOptions);
  const customOptions: ITableOptions = deepMerge(defaultOptions, options);
  const customColumns: IColumnItem[] | undefined = await getFilterValue();
  // const customColumns = filter.columns;
  const data = new DataSource({
    sort: customOptions.dataSourceOptions.sort,
    paginate: true,
    pageSize: customOptions.page?.size,
    // filter: filter,
    store: new ODataStore({
      ...customOptions.dataSourceOptions.oDataOptions,
    }),
    select: customColumns?.map((item) => {
      return (item as IColumnItem).key;
    }),
  });
  return {
    data,
    customColumns,
    customOptions
  };
};