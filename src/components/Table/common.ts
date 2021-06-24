import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { deepMerge } from '/@/utils/index';
import { ITableOptions } from './type';
import { cloneDeep } from 'lodash-es';
import { ISchemeItem } from '../QueryPopup/content/types';

export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    sort: [],
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
export const getDataSource = async (
  options: ITableOptions,
  scheme: ISchemeItem
) => {
  const defaultOptions: ITableOptions = cloneDeep(defaultTableOptions);
  const customOptions: ITableOptions = deepMerge(defaultOptions, options);
  const select = getSelect(scheme.columns);
  const filter = getFilter(scheme.requirement);
  const sort = getSort(scheme.orderBy);
  // const customColumns = filter.columns;
  const data = new DataSource({
    sort: [...customOptions.dataSourceOptions.sort, ...sort],
    filter: filter.length > 0 ? filter : '',
    paginate: true,
    pageSize: customOptions.page?.size,
    // filter: filter,
    store: new ODataStore({
      ...customOptions.dataSourceOptions.oDataOptions,
    }),
    select: select,
  });
  return {
    data,
    customOptions,
  };
};

export const getFilter = (requirements) => {
  const filter: any[] = [];
  requirements.forEach((item) => {
    if (item.requirement && item.value) {
      filter.push([item.requirement, item.operator, item.value]);
      if (item.logic) {
        filter.push(item.logic);
      } else {
        filter.push('and');
      }
    }
  });
  return filter;
};
export const getSort = (orderBy) => {
  const sort: any[] = [];
  orderBy.forEach((item) => {
    sort.push({ selector: item.key, desc: item.desc });
  });
  return sort;
};
export const getSelect = (columns) => {
  const select: string[] = [];
  columns.forEach((item) => {
    if (item.show) {
      select.push(item.key);
    }
  });
  return select;
};
