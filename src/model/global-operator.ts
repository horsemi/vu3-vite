type OperatorType = 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'foundation';

export const operatorMap = {
  equal: {
    key: '=',
    value: '等于',
  },
  notEqual: {
    key: '<>',
    value: '不等于',
  },
  contains: {
    key: 'contains',
    value: '包含',
  },
  notcontains: {
    key: 'notcontains',
    value: '不包含',
  },
  greater: {
    key: '>',
    value: '大于',
  },
  greaterEqual: {
    key: '>=',
    value: '大于等于',
  },
  less: {
    key: '<',
    value: '小于',
  },
  lessEqual: {
    key: '<=',
    value: '小于等于',
  },
  startswith: {
    key: 'startswith',
    value: '开始于',
  },
  endswith: {
    key: 'endswith',
    value: '结束于',
  },
  today: {
    key: 'today',
    value: '今天',
  },
  thisMonth: {
    key: 'thisMonth',
    value: '本月',
  },
  isNull: {
    key: 'isNull',
    value: '为空',
  },
  isNotNull: {
    key: 'isNotNull',
    value: '不为空',
  },
};

export const globalOperator = {
  stringOperators: [
    'equal',
    'notEqual',
    'contains',
    'notcontains',
    'startswith',
    'endswith',
    'isNull',
    'isNotNull',
  ],
  numberOperators: [
    'equal',
    'notEqual',
    'greater',
    'greaterEqual',
    'less',
    'lessEqual',
    'isNull',
    'isNotNull',
  ],
  datetimeOperators: [
    'equal',
    'notEqual',
    'greater',
    'greaterEqual',
    'less',
    'lessEqual',
    'today',
    'thisMonth',
    'isNull',
    'isNotNull',
  ],
  dateOperators: [
    'equal',
    'notEqual',
    'greater',
    'greaterEqual',
    'less',
    'lessEqual',
    'today',
    'thisMonth',
    'isNull',
    'isNotNull',
  ],
  booleanOperators: ['equal', 'notEqual'],
  enumOperators: ['equal', 'notEqual', 'isNull', 'isNotNull'],
  foundationOperators: ['equal', 'notEqual', 'isNull', 'isNotNull'],
  allOperators: [
    'equal',
    'notEqual',
    'contains',
    'notcontains',
    'startswith',
    'endswith',
    'greater',
    'greaterEqual',
    'less',
    'lessEqual',
    'isNull',
    'isNotNull',
  ],
};

export function getOperatorByType(operatorCode: OperatorType | string) {
  let operator: string[];
  if (operatorCode === 'int32' || operatorCode === 'int64' || operatorCode === 'decimal') {
    operator = operatorCode && globalOperator['numberOperators'];
  } else {
    operator = operatorCode && globalOperator[`${operatorCode}Operators`];
  }
  return initOperatorMap(operator);
}

export function initOperatorMap(operators: string[]) {
  const result: { key: string; value: string }[] = [];

  if (operators && Array.isArray(operators)) {
    operators.forEach((item) => {
      result.push(operatorMap[item]);
    });
  } else {
    globalOperator.allOperators.forEach((item) => {
      result.push(operatorMap[item]);
    });
  }

  return result;
}

export function isDisabedSelect(operation: string): boolean {
  if (
    operation === 'isNull' ||
    operation === 'isNotNull' ||
    operation === 'today' ||
    operation === 'thisMonth'
  ) {
    return true;
  } else {
    return false;
  }
}
