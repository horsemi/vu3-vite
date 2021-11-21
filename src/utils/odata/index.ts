import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
import type { ITableOptions } from '/@/components/Table/types';
import type { IColumnItem } from '/@/model/types';
import { getSelectAndExpand, getFilter, getSort } from '/@/components/Table/common';

interface Isort {
  selector: string;
  desc: boolean;
}
// 获得odata请求参数
export const getOdataQuery = (
  options: ITableOptions,
  scheme: ISchemeItem,
  allColumns: IColumnItem[],
  key: string[] = [],
  top = 50,
  skip = 0,
  tableSort: Isort[] = [],
  count = 'true'
) => {
  const { select, expand } = getSelectAndExpand(allColumns, scheme.columns, key);
  const filter = getFilter(scheme.requirement);
  const sort = scheme.orderBy ? getSort(scheme.orderBy, options.dataSourceOptions.sort) : [];
  const orderBy: any[] = [];
  if (tableSort) {
    sort.forEach((sortItem) => {
      if (sortItem.selector != tableSort[0].selector && sortItem.desc != tableSort[0].desc) {
        sort.push(tableSort[0]);
      } else if (
        sortItem.selector === tableSort[0].selector &&
        sortItem.desc != tableSort[0].desc
      ) {
        sortItem.desc = tableSort[0].desc;
      }
    });
  }
  sort.forEach((item) => {
    if (item.desc) {
      orderBy.push(item.selector + ' ' + 'desc');
    } else {
      orderBy.push(item.selector);
    }
  });
  const queryParams = {
    $count: count,
    $orderby: orderBy.length ? orderBy.join(',') : '',
    $select: select.join(','),
    $expand: expand.join(','),
    $filter: filter.length ? getOdataFilter(filter) : '',
    $skip: skip === 0 ? '' : skip * top,
    $top: top,
  };
  Object.keys(queryParams).forEach((item) => {
    if (queryParams[item] === '') {
      delete queryParams[item];
    }
  });
  return queryParams;
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
