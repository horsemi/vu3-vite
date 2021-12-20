import type {
  IOrderByItem,
  IRequirementItem,
  ISchemeColumnsItem,
  ISchemeItem,
} from '/@/components/QueryPopup/content/types';
import type { IColumnItem } from '/@/model/types';
import type { ISortItem } from '/@/api/ods/types';

import {
  formatToDateTime,
  getBeginTime,
  getEndTime,
  getNextDayBeginTime,
  getCurrentDate,
} from '/@/utils/date';
import { useMessage } from '/@/hooks/web/useMessage';
import { isNullOrUnDef } from '/@/utils/is';
import { operatorMap, isDisabedSelect } from '/@/model/global-operator';
import { handleAllCol } from '/@/components/Table/common';

// 获取格式化后的过滤条件
const getFilter = (requirements: IRequirementItem[]) => {
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
const getSort = (orderBy: IOrderByItem[]) => {
  const sort: string[] = [];
  orderBy?.forEach((item) => {
    if (item.desc) {
      sort.push(item.key + ' ' + 'desc');
    } else {
      sort.push(item.key);
    }
  });
  return sort;
};

// 获取格式化后的表字段
const getSelectAndExpand = (
  allColumns: IColumnItem[],
  columns: ISchemeColumnsItem[],
  key: string[] = []
) => {
  const select: string[] = [];
  const expand: string[] = [];

  const allCol = handleAllCol(allColumns);

  columns?.forEach((item) => {
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
    case 'date':
    case 'datetime': {
      if (item.operator === operatorMap.isNull.key) {
        result += ',"=",null]';
      } else if (item.operator === operatorMap.isNotNull.key) {
        result += ',"<>",null]';
      } else if (item.operator === operatorMap.today.key) {
        result += rangeFormat(
          getBeginTime(getCurrentDate()),
          requirement,
          getNextDayBeginTime(getCurrentDate())
        );
      } else if (item.operator === operatorMap.thisMonth.key) {
        result += rangeFormat(
          getBeginTime(getCurrentDate(), 'month'),
          requirement,
          getNextDayBeginTime(getCurrentDate(), 'month')
        );
      } else if (!value) {
        result = '';
      } else if (item.operator === operatorMap.equal.key) {
        result += rangeFormat(
          getBeginTime(value as Date),
          requirement,
          getNextDayBeginTime(value as Date)
        );
      } else if (item.operator === operatorMap.greater.key) {
        result += `,"${item.operator}","${getEndTime(value as Date)}"]`;
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
  } else if (isNullOrUnDef(data.value) || data.value === '') {
    return true;
  } else {
    // 考虑布尔型的false
    return false;
  }
};

// 获得odata请求参数
export const getOdataQuery = ({
  scheme,
  allColumns,
  tableSort,
}: {
  scheme: ISchemeItem;
  allColumns: IColumnItem[];
  tableSort: ISortItem[];
}) => {
  let orderBy: IOrderByItem[] = [];
  if (tableSort) {
    const sort = tableSort[0];
    const column = allColumns.find((item) => item.key === sort.selector);
    if (column) {
      orderBy = [{ key: column.key, caption: column.caption, desc: sort.desc ?? false }];
    }
  } else {
    orderBy = scheme.orderBy;
  }
  const { columns, requirement } = scheme;

  const { select, expand } = getSelectAndExpand(allColumns, columns, ['Id']);
  const filter = requirement?.length ? getFilter(requirement) : [];
  const orderby = orderBy?.length ? getSort(orderBy) : [];
  const $select = select.length ? select.join(',') : '';
  const $expand = expand.length ? expand.join(',') : '';
  const $filter = filter.length ? getOdataFilter(filter) : '';
  const $orderby = select.length ? orderby.join(',') : '';

  const params = {};
  $select && (params['$select'] = $select);
  $filter && (params['$filter'] = $filter);
  $orderby && (params['$orderby'] = $orderby);
  $expand && (params['$expand'] = $expand);
  return params;
};

// 转换后的filter转换成odata格式
export const getOdataFilter = (filter: any[]) => {
  return compileCore(filter);
};

const createBinaryOperationFormatter = (op: string) => {
  return function (prop: string, val: any) {
    return ''
      .concat(prop, ' ')
      .concat(op, ' ')
      .concat(typeof val === 'string' ? `'${val}'` : val);
  };
};
const createStringFuncFormatter = (op: string) => {
  return function (prop: string, val: any) {
    const bag = [op, '('];
    prop = -1 === prop.indexOf('tolower(') ? 'tolower('.concat(prop, ')') : prop;
    val = val.toLowerCase();
    bag.push(prop, ',', typeof val === 'string' ? `'${val}'` : val);
    bag.push(')');
    return bag.join('');
  };
};
const formatters = {
  '=': createBinaryOperationFormatter('eq'),
  '<>': createBinaryOperationFormatter('ne'),
  '>': createBinaryOperationFormatter('gt'),
  '>=': createBinaryOperationFormatter('ge'),
  '<': createBinaryOperationFormatter('lt'),
  '<=': createBinaryOperationFormatter('le'),
  startswith: createStringFuncFormatter('startswith'),
  endswith: createStringFuncFormatter('endswith'),
  contains: createStringFuncFormatter('contains'),
  notcontains: createStringFuncFormatter('not contains'),
};
const normalizeBinaryCriterion = (crit) => {
  return [
    crit[0],
    crit.length < 3 ? '=' : String(crit[1]).toLowerCase(),
    crit.length < 2 ? true : crit[crit.length - 1],
  ];
};
const compileBinary = (criteria) => {
  criteria = normalizeBinaryCriterion(criteria);
  const op = criteria[1];
  const fieldName = criteria[0];
  const formatter = formatters[op.toLowerCase()];
  const value = criteria[2];
  return formatter(serializePropName(fieldName), serializeValue(value));
};
const compileUnary = (criteria) => {
  const op = criteria[0];
  const crit = compileCore(criteria[1]);
  if ('!' === op) {
    return 'not ('.concat(crit, ')');
  }
};
const serializePropName = (propName) => {
  return propName && propName.valueOf();
};
const pad = (text: string, length: number) => {
  text = String(text);
  while (text.length < length) {
    text = ''.concat(text, '0');
  }
  return text;
};
const formatISO8601 = (date: any, skipZeroTime: boolean, skipTimezone: boolean) => {
  const bag: any = [];
  const padLeft2 = (text) => {
    return pad(text, 2);
  };
  bag.push(date.getFullYear());
  bag.push('-');
  bag.push(padLeft2(date.getMonth() + 1));
  bag.push('-');
  bag.push(padLeft2(date.getDate()));
  if (
    !(
      skipZeroTime &&
      date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1
    )
  ) {
    bag.push('T');
    bag.push(padLeft2(date.getHours()));
    bag.push(':');
    bag.push(padLeft2(date.getMinutes()));
    bag.push(':');
    bag.push(padLeft2(date.getSeconds()));
    if (date.getMilliseconds()) {
      bag.push('.');
      bag.push(pad(date.getMilliseconds(), 3));
    }
    if (!skipTimezone) {
      bag.push('Z');
    }
  }
  return bag.join('');
};
const serializeValue = function serializeValue(value) {
  if (value instanceof Date) {
    return formatISO8601(value, false, false);
  }
  if (Array.isArray(value)) {
    return '['.concat(
      value
        .map((item) => {
          return serializeValue(item);
        })
        .join(','),
      ']'
    );
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  return value && value.toString();
};
const each = (values, callback) => {
  if (!values) {
    return;
  }
  if ('length' in values) {
    for (let i = 0; i < values.length; i++) {
      if (false === callback.call(values[i], i, values[i])) {
        break;
      }
    }
  } else {
    for (const key in values) {
      if (false === callback.call(values[key], key, values[key])) {
        break;
      }
    }
  }
  return values;
};
const compileGroup = (criteria) => {
  const bag: any = [];
  let groupOperator;
  let nextGroupOperator;
  each(criteria, (index, criterion) => {
    if (Array.isArray(criterion)) {
      bag.push('('.concat(compileCore(criterion), ')'));
      groupOperator = nextGroupOperator;
      nextGroupOperator = 'and';
    } else {
      nextGroupOperator = criterion;
    }
  });
  return bag.join(' '.concat(groupOperator, ' '));
};
const isUnaryOperation = (crit) => {
  return '!' === crit[0] && Array.isArray(crit[1]);
};
const compileCore = (criteria) => {
  if (Array.isArray(criteria[0])) {
    return compileGroup(criteria);
  }
  if (isUnaryOperation(criteria)) {
    return compileUnary(criteria);
  }
  return compileBinary(criteria);
};
