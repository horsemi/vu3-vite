type OperatorType = 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'foundation';

export const dateOperator = {
  today: {
    key: 'today',
    name: 'today',
    value: '今天',
  },
  thisMonth: {
    key: 'thisMonth',
    name: 'thisMonth',
    value: '本月',
  },
};

export const isNullOperator = {
  isNull: {
    key: 'isNull',
    name: 'isNull',
    value: '为空',
  },
  isNotNull: {
    key: 'isNotNull',
    name: 'isNotNull',
    value: '不为空',
  },
};

export const operatorMap = {
  equal: {
    key: '=',
    name: 'equal',
    value: '等于',
  },
  notEqual: {
    key: '<>',
    name: 'notEqual',
    value: '不等于',
  },
  // contains: {
  //   key: 'contains',
  //   name: 'contains',
  //   value: '包含',
  // },
  // notcontains: {
  //   key: 'notcontains',
  //   name: 'notcontains',
  //   value: '不包含',
  // },
  greater: {
    key: '>',
    name: 'greater',
    value: '大于',
  },
  greaterEqual: {
    key: '>=',
    name: 'greaterEqual',
    value: '大于等于',
  },
  less: {
    key: '<',
    name: 'less',
    value: '小于',
  },
  lessEqual: {
    key: '<=',
    name: 'lessEqual',
    value: '小于等于',
  },
  // startswith: {
  //   key: 'startswith',
  //   name: 'startswith',
  //   value: '开始于',
  // },
  // endswith: {
  //   key: 'endswith',
  //   name: 'endswith',
  //   value: '结束于',
  // },
  today: dateOperator.today,
  thisMonth: dateOperator.thisMonth,
  isNull: isNullOperator.isNull,
  isNotNull: isNullOperator.isNotNull,
};

export const globalOperator = {
  stringOperators: [
    operatorMap.equal.name,
    operatorMap.notEqual.name,
    // operatorMap.contains.name,
    // operatorMap.notcontains.name,
    // operatorMap.startswith.name,
    // operatorMap.endswith.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
  ],
  numberOperators: [
    operatorMap.equal.name,
    operatorMap.notEqual.name,
    operatorMap.greater.name,
    operatorMap.greaterEqual.name,
    operatorMap.less.name,
    operatorMap.lessEqual.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
  ],
  datetimeOperators: [
    operatorMap.equal.name,
    operatorMap.greater.name,
    operatorMap.greaterEqual.name,
    operatorMap.less.name,
    operatorMap.lessEqual.name,
    operatorMap.today.name,
    operatorMap.thisMonth.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
  ],
  dateOperators: [
    operatorMap.equal.name,
    operatorMap.greater.name,
    operatorMap.greaterEqual.name,
    operatorMap.less.name,
    operatorMap.lessEqual.name,
    operatorMap.today.name,
    operatorMap.thisMonth.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
  ],
  booleanOperators: [operatorMap.equal.name, operatorMap.notEqual.name],
  enumOperators: [
    operatorMap.equal.name,
    operatorMap.notEqual.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
  ],
  foundationOperators: [
    operatorMap.equal.name,
    operatorMap.notEqual.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
  ],
  allOperators: [
    operatorMap.equal.name,
    operatorMap.notEqual.name,
    operatorMap.greater.name,
    operatorMap.greaterEqual.name,
    operatorMap.less.name,
    operatorMap.lessEqual.name,
    // operatorMap.contains.name,
    // operatorMap.notcontains.name,
    // operatorMap.startswith.name,
    // operatorMap.endswith.name,
    operatorMap.greater.name,
    operatorMap.greaterEqual.name,
    operatorMap.less.name,
    operatorMap.lessEqual.name,
    operatorMap.isNull.name,
    operatorMap.isNotNull.name,
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
    operation === operatorMap.isNull.name ||
    operation === operatorMap.isNotNull.name ||
    operation === operatorMap.today.name ||
    operation === operatorMap.thisMonth.name
  ) {
    return true;
  } else {
    return false;
  }
}
