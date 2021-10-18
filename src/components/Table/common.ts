import type { ITableOptions } from './types';
import type {
  IOrderByItem,
  IRequirementItem,
  ISchemeColumnsItem,
  ISchemeItem,
} from '../QueryPopup/content/types';
import type { IColumnItem, IKeyType } from '/@/model/types';
import type { ISortItem } from '/@/api/ods/types';

import { getDataSource } from '/@/api/ods/common';
import {
  formatToDate,
  formatToDateTime,
  getBeginTime,
  getEndTime,
  getCurrentDate,
} from '/@/utils/date';
import { useMessage } from '/@/hooks/web/useMessage';

import { isNullOrUnDef } from '/@/utils/is';

import { operatorMap, isDisabedSelect } from '/@/model/global-operator';

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
  const sort = scheme.orderBy ? getSort(scheme.orderBy, options.dataSourceOptions.sort) : [];
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

  const requireData = requirements.filter((item) => {
    return item.requirement;
  });

  for (let i = 0; i < requireData.length; i++) {
    // 判断是否为第一条搜索条件 参数是否不为null与undef
    if (i !== 0 && !isValueNullOrUndef(requireData[i])) {
      result += `,"${requireData[i - 1].logic}",`;
    }

    const requirement = requireData[i].relationKey
      ? requireData[i].relationKey
      : requireData[i].requirement;

    if (requireData[i].leftParenthesisCount && requireData[i].leftParenthesisCount! > 0) {
      for (let j = 0; j < requireData[i].leftParenthesisCount!; j++) {
        result += '[';
      }
    }
    result += initValueData(requireData[i], requirement);
    if (requireData[i].rightParenthesisCount && requireData[i].rightParenthesisCount! > 0) {
      for (let j = 0; j < requireData[i].rightParenthesisCount!; j++) {
        result += ']';
      }
    }
  }
  let filter = [];
  try {
    filter = JSON.parse(`[${result}]`);
  } catch (e) {
    useMessage(`请检查是否格式有误，如左右括号是否对等 \n ${result}`, 'error', '搜索条件无法解析');
  }
  // 获取解析后的搜索条件
  // console.info(
  //   '转换为字符串的结果:',
  //   result,
  //   '原数据:',
  //   requireData,
  //   '转为为数组后的结果:',
  //   filter
  // );
  return filter;
};

// 获取格式化后的排序
export const getSort = (orderBy: IOrderByItem[], tableSort: ISortItem[] = []) => {
  const sort: ISortItem[] = [];
  orderBy &&
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

  const value = item.value;
  result += `["${requirement}"`;

  switch (item.type) {
    case 'int32':
    case 'int64':
    case 'decimal': {
      if (item.operator === operatorMap.isNull.key) {
        result += ',"=",null]';
      } else if (item.operator === operatorMap.isNotNull.key) {
        result += ',"<>",null]';
      } else if (!value) {
        result = '';
      } else {
        result += `,"${item.operator}",${value}]`;
      }
      break;
    }
    case 'boolean': {
      if (item.operator === operatorMap.isNull.key) {
        result += ',"=",null]';
      } else if (item.operator === operatorMap.isNotNull.key) {
        result += ',"<>",null]';
      } else if (isNullOrUnDef(value)) {
        result = '';
      } else {
        result += `,"${item.operator}",${value}]`;
      }
      break;
    }
    case 'date': {
      if (item.operator === operatorMap.isNull.key) {
        result += ',"=",null]';
      } else if (item.operator === operatorMap.isNotNull.key) {
        result += ',"<>",null]';
      } else if (item.operator === operatorMap.today.key) {
        result += rangeFormat(
          getBeginTime(getCurrentDate()),
          requirement,
          getEndTime(getCurrentDate())
        );
      } else if (item.operator === operatorMap.thisMonth.key) {
        result += rangeFormat(
          getBeginTime(getCurrentDate(), 'month'),
          requirement,
          getEndTime(getCurrentDate(), 'month')
        );
      } else if (!value) {
        result = '';
      } else if (item.operator === '=') {
        result += rangeFormat(getBeginTime(value as Date), requirement, getEndTime(value as Date));
      } else if (item.operator === '<>') {
        result += `,"<","${getBeginTime(value as Date)}"],"or",["${requirement}",">=","${getEndTime(
          value as Date
        )}"]`;
      } else {
        result += `,"${item.operator}","${formatToDate(value as Date)}"]`;
      }
      break;
    }
    case 'datetime': {
      if (item.operator === operatorMap.isNull.key) {
        result += ',"=",null]';
      } else if (item.operator === operatorMap.isNotNull.key) {
        result += ',"<>",null]';
      } else if (item.operator === operatorMap.today.key) {
        result += rangeFormat(
          getBeginTime(getCurrentDate()),
          requirement,
          getEndTime(getCurrentDate())
        );
      } else if (item.operator === operatorMap.thisMonth.key) {
        result += rangeFormat(
          getBeginTime(getCurrentDate(), 'month'),
          requirement,
          getEndTime(getCurrentDate(), 'month')
        );
      } else if (!value) {
        result = '';
      } else if (item.operator === operatorMap.equal.key) {
        result += rangeFormat(getBeginTime(value as Date), requirement, getEndTime(value as Date));
      } else if (item.operator === operatorMap.notEqual.key) {
        result += `,"<","${getBeginTime(
          value as Date
        )}"],"and",["${requirement}",">=","${getEndTime(value as Date)}"]`;
      } else {
        result += `,"${item.operator}","${formatToDateTime(value as Date)}"]`;
      }
      break;
    }
    default: {
      if (item.operator === operatorMap.isNull.key) {
        result += ',"=",null]';
      } else if (item.operator === operatorMap.isNotNull.key) {
        result += ',"<>",null]';
      } else if (!value) {
        result = '';
      } else {
        result += `,"${item.operator}","${value}"]`;
      }
    }
  }
  return result;
};

const rangeFormat = (startTime: string, requirement, endTime: string): string => {
  return `,">=","${startTime}"],"and",["${requirement}","<=","${endTime}"]`;
};

/**
 * 判断搜索条件value是否为空
 * @param {IRequirementItem} data
 * @returns {boolean}
 */
const isValueNullOrUndef = (data: IRequirementItem): boolean => {
  if (isDisabedSelect(data.operator)) {
    return false;
  } else if (isNullOrUnDef(data.value)) {
    return true;
  } else {
    // 考虑布尔型的false
    return false;
  }
};
