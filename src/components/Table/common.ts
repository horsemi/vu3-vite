import type { ITableOptions, ISortItem } from './types';
import type { IOrderByItem, IRequirementItem, ISchemeItem } from '../QueryPopup/content/types';
import type { IColumnItem, IKeyType } from '/@/model/types';

import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { isNil } from 'lodash-es';

import { useUserStoreWidthOut } from '/@/store/modules/user';
import { tokenHeaderKey } from '/@/utils/http/axios/const';
import { isFoundationType } from '/@/model/common';

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
  const { select, expand } = getSelect(allColumns, scheme.columns, key);

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

// 获取格式化后的表字段
export const getSelect = (allColumns: IColumnItem[], columns: string[], key: string[] = []) => {
  const select: string[] = [];
  const expands: string[] = [];

  columns.forEach((key) => {
    if (allColumns.some((allCol) => allCol.key === key) && select.indexOf(key)) {
      const columns = allColumns.filter((allCol) => allCol.key === key)[0];
      // 判断是否为基础数据类型
      if (isFoundationType(columns)) {
        expands.push(columns.expand as string);
      }
      select.push(key);
    }
  });
  allColumns
    .filter((item) => item.mustKey)
    .forEach((item) => {
      if (select.indexOf(item.key)) {
        select.push(item.key);
      }
    });

  return {
    select: select.concat(key),
    expand: expands,
  };
};

// 获取格式化后的表头数据
export const getCompleteColumns = (allColumns: IColumnItem[], select: string[]) => {
  const columns: IColumnItem[] = [];
  select.forEach((item) => {
    if (item === 'Id') return;
    for (let i = 0; i < allColumns.length; i++) {
      const col = allColumns[i];
      if (item === col.key) {
        // 判断是否为基础数据类型
        if (isFoundationType(col)) {
          columns.push({
            ...col,
            caption: `${col.caption}编码`,
          });

          columns.push({
            ...col,
            key: col.expand as string,
            type: 'foundation',
          });
        } else {
          columns.push(col);
        }
        break;
      }
    }
  });
  return columns;
};
