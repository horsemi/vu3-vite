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
import { formatToDate, formatToDateTime, getBeginTime, getEndTime } from '/@/utils/date';

const defaultPaginate = true;

const defaultPageSize = 50;

// 基础表格默认配置
export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    paginate: defaultPaginate,
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
    size: defaultPageSize,
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
      paginate:
        options.dataSourceOptions.paginate !== undefined
          ? options.dataSourceOptions.paginate
          : defaultPaginate,
      pageSize: options.page.size ? options.page.size : defaultPageSize,
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
  let result = '';

  for (let i = 0; i < requirements.length; i++) {
    if (requirements[i].requirement && !isNil(requirements[i].value)) {
      const requirement = requirements[i].relationKey
        ? requirements[i].relationKey
        : requirements[i].requirement;

      if (requirements[i].leftParenthesisCount && requirements[i].leftParenthesisCount! > 0) {
        for (let j = 0; j < requirements[i].leftParenthesisCount!; j++) {
          result += '[';
        }
      }
      result += initValueData(requirements[i], requirement);
      if (requirements[i].rightParenthesisCount && requirements[i].rightParenthesisCount! > 0) {
        for (let j = 0; j < requirements[i].rightParenthesisCount!; j++) {
          result += ']';
        }
      }
      if (i !== requirements.length - 1) {
        result += `,"${requirements[i].logic}",`;
      }
    }
  }
  const filter = JSON.parse(`[${result}]`);
  // 获取解析后的搜索条件
  // console.log(filter);
  return filter;
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
    const col = allCol.find((col) => item.key === col.key);
    if (col) {
      columnList.push({
        ...col,
        ...item,
      });
    }
  });

  return columnList;
};

const initValueData = (item: IRequirementItem, requirement) => {
  let result = '';
  result += `["${requirement}"`;

  switch (item.type) {
    case 'number': {
      result += `,"${item.operator}",${item.value}]`;
      break;
    }
    case 'boolean': {
      result += `,"${item.operator}",${item.value}]`;
      break;
    }
    case 'date': {
      if (item.operator === '=') {
        result += `,">=","${getBeginTime(
          item.value as Date
        )}"],"and",["${requirement}","<=","${getEndTime(item.value as Date)}"]`;
      } else {
        result += `,"${item.operator}","${formatToDate(item.value as Date)}"]`;
      }
      break;
    }
    case 'datetime': {
      if (item.operator === '=') {
        result += `,">=","${getBeginTime(
          item.value as Date
        )}"],"and",["${requirement}","<=","${getEndTime(item.value as Date)}"]`;
      } else {
        result += `,"${item.operator}","${formatToDateTime(item.value as Date)}"]`;
      }
      break;
    }
    default: {
      result += `,"${item.operator}","${item.value}"]`;
    }
  }
  return result;
};
