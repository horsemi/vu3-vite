import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { ITableOptions } from './type';
import { IOrderByItem, ISchemeColumnsItem, ISchemeItem } from '../QueryPopup/content/types';
import { IColumnItem, IKeyType } from '/@/model/table/types';

export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    paginate: true,
    oDataOptions: {
      url: '',
      version: 4,
    },
  },
  useScrolling: false,
  height: '100%',
  showColumnLines: false,
  showRowLines: true,
  showBorders: false,
  rowAlternationEnabled: true,
  selection: {
    allMode: 'page',
    checkBoxesMode: 'always',
  },
  page: {
    size: 20,
  },
};
export const getDataSource = async (
  options: ITableOptions,
  scheme: ISchemeItem,
  key: string[] = [],
  keyType: IKeyType[] = []
) => {
  const select = getSelect(scheme.columns, key);
  const filter = getFilter(scheme.requirement);
  const sort = getSort(scheme.orderBy, options.dataSourceOptions.sort);
  const data = new DataSource({
    sort: options.dataSourceOptions.sort
      ? [...options.dataSourceOptions.sort, ...sort]
      : sort,
    filter: filter.length > 0 ? filter : '',
    paginate: options.dataSourceOptions.paginate,
    pageSize: options.page?.size,
    store: new ODataStore({
      key,
      keyType: handleKeyType(keyType),
      ...options.dataSourceOptions.oDataOptions,
    }),
    select: select,
  });
  return data;
};

const handleKeyType = (keyType: IKeyType[]) => {
  const type = {};
  if (keyType.length > 0) {
    keyType.forEach((item) => {
      type[item.key] = item.type;
    });
  }
  return type;
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
export const getSort = (orderBy: IOrderByItem[], tableSort: any[] | undefined) => {
  const sort: any[] = [];
  orderBy.forEach((item) => {
    sort.push({ selector: item.key, desc: item.desc });
  });
  return tableSort ? [...tableSort, ...sort] : sort;
};
export const getSelect = (columns: ISchemeColumnsItem[], key: string[] = []) => {
  const select: string[] = [];
  columns.forEach((item) => {
    if (item.show) {
      select.push(item.key);
    }
  });
  return select.concat(key);
};

export const getCompleteColumns = (allColumns: IColumnItem[], select: string[]) => {
  const columns: IColumnItem[] = [];
  select.forEach((item) => {
    allColumns.forEach((col) => {
      if (item === col.key) {
        columns.push(col);
      }
    });
  });
  return columns;
};
