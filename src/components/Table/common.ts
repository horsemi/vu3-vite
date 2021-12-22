import type { IPropsSummary, ITableOptions } from './types';
import type { ISchemeColumnsItem } from '../QueryPopup/content/types';
import type { IColumnItem } from '/@/model/types';

import { sum, min, max, mean } from 'lodash-es';

const defaultPaginate = true;

const defaultPageSize = 50;

// 基础表格默认配置
export const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    paginate: defaultPaginate,
    oDataOptions: {
      url: '',
    },
    sort: [
      {
        selector: 'id',
        desc: true,
      },
    ],
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

export const handleAllCol = (allColumns: IColumnItem[]) => {
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

// 获取格式化后的表头数据
export const getCompleteColumns = (allColumns: IColumnItem[], columns: ISchemeColumnsItem[]) => {
  const columnList: IColumnItem[] = [];
  const allCol = handleAllCol(allColumns);
  columns.forEach((item) => {
    const col = allCol.find((col) => item.key === col.key);
    if (col) {
      const caption = col.caption.split('.');
      columnList.push({
        ...item,
        ...col,
        caption: caption.length === 2 ? caption[1] : caption[0],
      });
    }
  });

  return columnList;
};

const summaryTypeMap = {
  sum: '总和',
  min: '最小值',
  max: '最大值',
  avg: '平均值',
  count: '计数',
};

const isEnableValue = (val: any) => {
  return val !== '' && (typeof val === 'number' || typeof val === 'string');
};

export const clientSummary = ({
  summary,
  source,
  allColumns,
}: {
  summary: IPropsSummary;
  source: any[];
  allColumns: IColumnItem[];
}) => {
  const col = allColumns.find((item) => item.key === summary.columnName);
  let res: unknown = '';
  const valArr: unknown[] = [];
  source &&
    source.forEach((item) => {
      isEnableValue(item[summary.columnName]) &&
        valArr.push(
          col && col.type === 'decimal'
            ? parseInt(item[summary.columnName].toFixed(3).replace('.', ''))
            : item[summary.columnName]
        );
    });

  switch (summary.summaryType) {
    case 'sum':
      res = col && col.type === 'decimal' ? (sum(valArr) / 1000).toFixed(3) : sum(valArr);
      break;
    case 'min':
      res =
        col && col.type === 'decimal'
          ? valArr.length && ((min(valArr) as number) / 1000).toFixed(3)
          : max(valArr);
      break;
    case 'max':
      res =
        col && col.type === 'decimal'
          ? valArr.length && ((max(valArr) as number) / 1000).toFixed(3)
          : max(valArr);
      break;
    case 'avg':
      res = col && col.type === 'decimal' ? (mean(valArr) / 1000).toFixed(3) : mean(valArr);
      break;
    case 'count':
      res = valArr.length;
      break;
    default:
      console.error(`${summary.columnName}的汇总类型错误`);
  }

  return `${summaryTypeMap[summary.summaryType]}: ${res}`;
};
