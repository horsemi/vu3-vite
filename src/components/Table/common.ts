import type { ITableOptions, ISortItem } from './types';
import type {
  IOrderByItem,
  IRequirementItem,
  ISchemeColumnsItem,
  ISchemeItem,
} from '../QueryPopup/content/types';
import type { IColumnItem, IKeyType } from '/@/model/types';

import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { isNil } from 'lodash-es';

import { useUserStoreWidthOut } from '/@/store/modules/user';
import { tokenHeaderKey } from '/@/utils/http/axios/const';

// 基础表格默认配置
export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    paginate: true,
    oDataOptions: {
      url: '',
      beforeSend: (e) => {
        e.headers = {
          [tokenHeaderKey]: useUserStoreWidthOut().getToken,
        };
      },
      version: 4,
    },
  },
  useScrolling: false,
  height: '100%',
  showColumnLines: true,
  allowColumnResizing: true,
  columnAutoWidth: true,
  hoverStateEnabled: true,
  showRowLines: true,
  showBorders: true,
  rowAlternationEnabled: true,
  selection: {
    allMode: 'page',
    checkBoxesMode: 'always',
  },
  page: {
    size: 50,
  },
};

// 过滤方案表格获取DataSource的通用方法
export const getDataSource = async (
  options: ITableOptions,
  scheme: ISchemeItem,
  allColumns: IColumnItem[],
  key: string[] = [],
  keyType: IKeyType[] = []
) => {
  const { select, expand } = getSelectAndExpand(allColumns, scheme.columns, key);

  const filter = getFilter(scheme.requirement);
  const sort = getSort(scheme.orderBy, options.dataSourceOptions.sort);
  const data = new DataSource({
    sort: options.dataSourceOptions.sort ? options.dataSourceOptions.sort.concat(sort) : sort,
    filter: filter.length > 0 ? filter : '',
    paginate: options.dataSourceOptions.paginate,
    pageSize: options.page?.size,
    store: new ODataStore({
      key,
      keyType: handleKeyType(keyType),
      ...options.dataSourceOptions.oDataOptions,
    }),
    select: select,
    expand: expand,
  });
  return data;
};

// 处理KeyType的数据格式
const handleKeyType = (keyType: IKeyType[]) => {
  const type = {};
  if (keyType.length > 0) {
    keyType.forEach((item) => {
      type[item.key] = item.type;
    });
  }
  return type;
};

// 获取格式化后的过滤条件
export const getFilter = (requirements: IRequirementItem[]) => {
  const filter: any[] = [];
  requirements.forEach((item) => {
    if (item.requirement && !isNil(item.value)) {
      filter.push([item.requirement, item.operator, item.value]);
      if (item.logic) {
        filter.push(item.logic);
      } else {
        filter.push('and');
      }
    }
  });
  return filter.length > 0 ? filter : '';
};

// 获取格式化后的排序
export const getSort = (orderBy: IOrderByItem[], tableSort: ISortItem[] = []) => {
  const sort: ISortItem[] = [];
  orderBy.forEach((item) => {
    sort.push({ selector: item.key, desc: item.desc });
  });
  return sort.concat(tableSort);
};

const handleAllCol = (allColumns: IColumnItem[]) => {
  const newArr: IColumnItem[] = [];
  allColumns.forEach((item) => {
    if (item.foundationList && item.foundationList.length > 0) {
      newArr.push(item);
      item.foundationList.forEach((field) => {
        newArr.push({
          ...item,
          ...field,
        });
      });
    } else {
      newArr.push(item);
    }
  });
  return newArr;
};

// 获取格式化后的表字段
export const getSelectAndExpand = (
  allColumns: IColumnItem[],
  columns: ISchemeColumnsItem[],
  key: string[] = []
) => {
  const select: string[] = [];
  const expand: string[] = [];

  const allCol = handleAllCol(allColumns);

  columns.forEach((item) => {
    for (let i = 0; i < allCol.length; i++) {
      if (item.key === allCol[i].key) {
        if (item.expand && item.relationKey) {
          if (!expand.includes(item.expand)) {
            expand.push(item.expand);
          }
          if (!select.includes(item.relationKey)) {
            select.push(item.relationKey);
          }
        } else {
          select.push(item.key);
        }
        break;
      }
    }
  });

  return {
    select: select.concat(key),
    expand: expand,
  };
};

// 获取格式化后的表头数据
export const getCompleteColumns = (allColumns: IColumnItem[], columns: ISchemeColumnsItem[]) => {
  const columnList: IColumnItem[] = [];
  const allCol = handleAllCol(allColumns);
  columns.forEach((item) => {
    for (let i = 0; i < allCol.length; i++) {
      if (item.key === allCol[i].key) {
        // 判断是否为基础数据类型
        columnList.push({
          // ...item,
          ...allCol[i],
        });
        break;
      }
    }
  });
  return columnList;
};
