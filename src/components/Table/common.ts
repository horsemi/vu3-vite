import type { IPropsSummary, ITableOptions } from './types';
import type { ISchemeColumnsItem } from '../QueryPopup/content/types';
import type { IColumnItem } from '/@/model/types';
import type { Moment } from 'moment';

import { sum, min, max, mean } from 'lodash-es';
import moment from 'moment';

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
      const caption = col.caption.split('_');
      columnList.push({
        ...item,
        ...col,
        caption: caption[caption.length - 1],
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

  if (col) {
    const { type } = col;
    const { columnName, summaryType } = summary;
    let res: unknown = '';

    if (type === 'decimal') {
      const valArr: number[] = [];
      let temp: number | undefined = 0;
      source &&
        source.forEach((item) => {
          typeof item[columnName] === 'number' &&
            valArr.push(parseInt(item[columnName].toFixed(3).replace('.', '')));
        });
      switch (summaryType) {
        case 'sum':
          res = (sum(valArr) / 1000).toFixed(3);
          break;
        case 'min':
          temp = min(valArr);
          if (typeof temp === 'number') {
            res = (temp / 1000).toFixed(3);
          } else {
            res = 0;
          }
          break;
        case 'max':
          temp = max(valArr);
          if (typeof temp === 'number') {
            res = (temp / 1000).toFixed(3);
          } else {
            res = 0;
          }
          break;
        case 'avg':
          res = (mean(valArr) / 1000).toFixed(3);
          break;
        case 'count':
          res = valArr.length;
          break;
        default:
          console.error(`${columnName}的汇总类型错误`);
      }
    } else if (type === 'int32' || type === 'int64') {
      const valArr: number[] = [];
      source &&
        source.forEach((item) => {
          typeof item[columnName] === 'number' && valArr.push(item[columnName]);
        });
      switch (summaryType) {
        case 'sum':
          res = sum(valArr);
          break;
        case 'min':
          res = min(valArr) ?? 0;
          break;
        case 'max':
          res = max(valArr) ?? 0;
          break;
        case 'avg':
          res = mean(valArr);
          break;
        case 'count':
          res = valArr.length;
          break;
        default:
          console.error(`${columnName}的汇总类型错误`);
      }
    } else if (type === 'date' || type === 'datetime') {
      const format = type === 'date' ? 'YYYY/MM/DD' : 'YYYY/MM/DD Ah:mm';
      const valArr: Moment[] = [];
      source &&
        source.forEach((item) => {
          item[columnName] && valArr.push(moment(item[columnName]));
        });
      switch (summaryType) {
        case 'min':
          res = moment.min(valArr).format(format);
          break;
        case 'max':
          res = moment.max(valArr).format(format);
          break;
        case 'count':
          res = valArr.length;
          break;
        default:
          console.error(`${columnName}的汇总类型错误`);
      }
    }

    return `${summaryTypeMap[summaryType]}: ${res}`;
  } else {
    return '';
  }
};
