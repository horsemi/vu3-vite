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
    key: 'greater',
    value: '大于',
  },
  greaterEqual: {
    key: 'greaterEqual',
    value: '大于等于',
  },
  less: {
    key: 'less',
    value: '小于',
  },
  lessEqual: {
    key: 'lessEqual',
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
};

export const globalOperator = {
  stringOperators: ['equal', 'notEqual', 'contains', 'notcontains', 'startswith', 'endswith'],
  numberOperators: ['equal', 'notEqual', 'greater', 'greaterEqual', 'less', 'lessEqual'],
  datetimeOperators: ['equal', 'notEqual', 'greater', 'greaterEqual', 'less', 'lessEqual'],
  enumOperators: ['equal', 'notEqual'],
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
  ],
};

export function getOperatorByType(operatorCode: OperatorType | string) {
  const operator = operatorCode && globalOperator[`${operatorCode}Operators`];
  const result: { key: string; value: string }[] = [];

  if (operator && Array.isArray(operator)) {
    operator.forEach((item) => {
      result.push(operatorMap[item]);
    });
  } else {
    globalOperator.allOperators.forEach((item) => {
      result.push(operatorMap[item]);
    });
  }

  return result;
}
