import type { IQueryItem } from '../../QueryPlan/types';

type logicType = 'and' | 'or';

export interface IRequirementItem extends IQueryItem {
  /**
   * @description: 逻辑
   */
  logic?: string;
}

export interface IFieldItem {
  /**
   * @description: 字段
   */
  key: string;

  /**
   * @description: 标题
   */
  caption: string;

  /**
   * @description: 是否选中
   */
  checked: boolean;
}

export interface IOrderByItem {
  /**
   * @description: 字段
   */
  key: string;

  /**
   * @description: 标题
   */
  caption: string;

  /**
   * @description: 排序 true为降序, false为升序
   */
  desc: boolean;
}

export interface ISchemeColumnsItem {
  /**
   * @description: 字段
   */
  key: string;

  /**
   * @description: 标题
   */
  caption: string;

  /**
   * @description: 是否显示
   */
  show: boolean;

  /**
   * @description: 是否必要
   */
  mustKey?: boolean;
}

export interface ISchemeItem {
  /**
   * @description: 唯一id
   */
  uuid: string;

  /**
   * @description: 标题
   */
  title: string;

  /**
   * @description: 条件
   */
  requirement: IRequirementItem[];

  /**
   * @description: 排序
   */
  orderBy: IOrderByItem[];

  /**
   * @description: 显示隐藏列
   */
  columns: string[];
}

export interface ISortOptions {
  /**
   * @description: 字段名
   */
  name: string;

  /**
   * @description: 是否降序
   */
  desc: boolean;
}

export interface ILogicOptions {
  /**
   * @description: 字段名
   */
  name: string;

  /**
   * @description: 值
   */
  value: logicType;
}

export interface IMultiViewItem {
  /**
   * @description: 标题
   */
  title: string;

  /**
   * @description: 组件名称
   */
  component: string;
}
