import type { ITableOptions } from './types';
import type {
  IOrderByItem,
  IRequirementItem,
  ISchemeColumnsItem,
  ISchemeItem,
} from '../QueryPopup/content/types';
import type { IColumnItem, IKeyType } from '/@/model/types';
import type { ISortItem } from '/@/api/ods/types';

import { isNil } from 'lodash-es';

import { getDataSource } from '/@/api/ods/common';

// 基础表格默认配置
export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    paginate: true,
    oDataOptions: {
      url: '',
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
export const getTableDataSource = (
  options: ITableOptions,
  scheme: ISchemeItem,
  allColumns: IColumnItem[],
  key: string[] = [],
  keyType: IKeyType[] = []
) => {
  const { select, expand } = getSelectAndExpand(allColumns, scheme.columns, key);

  const filter = getFilter(scheme.requirement);
  const sort = getSort(scheme.orderBy, options.dataSourceOptions.sort);
  const data = getDataSource(
    {
      sort: options.dataSourceOptions.sort ? options.dataSourceOptions.sort.concat(sort) : sort,
      filter: filter.length > 0 ? filter : '',
      paginate: options.dataSourceOptions.paginate,
      pageSize: options.page?.size,
      select: select,
      expand: expand,
    },
    {
      key,
      keyType: handleKeyType(keyType),
      ...options.dataSourceOptions.oDataOptions,
    }
  );
  return data;
};

// 处理KeyType的数据格式
const handleKeyType = (keyType: IKeyType[]) => {
  const type: { [key: string]: string } = {};
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

      if (item.relationKey) {
        filter.push([item.relationKey, item.operator, item.value]);
      } else {
        filter.push([item.requirement, item.operator, item.value]);
      }
      
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
          ...allCol[i],
          ...item,
        });
        break;
      }
    }
  });

  return columnList;
};
