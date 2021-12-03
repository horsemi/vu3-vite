import type { IQueryItem } from '../../QueryPlan/types';
import type { infoType } from '/@/model/types';

type logicType = 'and' | 'or';

export interface IRequirementItem extends IQueryItem {
  /**
   * @description 左括号数量
   */
  leftParenthesisCount?: number | undefined;

  /**
   * @description 右括号数量
   */
  rightParenthesisCount?: number | undefined;

  /**
   * @description 逻辑
   */
  logic?: string;
}

export interface IOrderByItem {
  /**
   * @description 字段
   */
  key: string;

  /**
   * @description 标题
   */
  caption: string;

  /**
   * @description 排序 true为降序, false为升序
   */
  desc: boolean;

  /**
   * @description 信息类型
   */
  info?: string;
}

export interface ISchemeColumnsItem {
  /**
   * @description 字段
   */
  key: string;

  /**
   * @description 标题
   */
  caption: string;

  /**
   * @description 基础数据的关联字段
   */
  expand?: string;

  /**
   * @description 基础数据的关联必要的字段
   */
  relationKey?: string;

  /**
   * @description 信息类型
   */
  info?: infoType;

  /**
   * @description 是否必要
   */
  mustKey?: boolean;
}

export interface IFieldItem extends ISchemeColumnsItem {
  /**
   * @description 是否选中
   */
  checked: boolean;
}

export interface ISchemeItem {
  /**
   * @description 唯一id
   */
  id: string;

  /**
   * @description 个人方案关联ID
   */
  businessQuerySchemeId?: string;

  /**
   * @description 标题
   */
  title: string;

  /**
   * @description 所属单据编码
   */
  businessCode?: string;

  /**
   * @description 创建人ID
   */
  creatorId?: string;

  /**
   * @description 是否为用户设定默认过滤方案
   */
  isUseScheme?: boolean;

  /**
   * @description 条件
   */
  requirement: IRequirementItem[];

  /**
   * @description 排序
   */
  orderBy: IOrderByItem[];

  /**
   * @description 显示隐藏列
   */
  columns: ISchemeColumnsItem[];

  /**
   * @description 快速过滤
   */
  fast?: IQueryItem[];

  /**
   * @description 是否共享
   */
  isShare?: boolean;
}

export interface ISortOptions {
  /**
   * @description 字段名
   */
  name: string;

  /**
   * @description 是否降序
   */
  desc: boolean;
}

export interface ILogicOptions {
  /**
   * @description 字段名
   */
  name: string;

  /**
   * @description 值
   */
  value: logicType;
}

export interface IMultiViewItem {
  /**
   * @description 标题
   */
  title: string;

  /**
   * @description 组件名称
   */
  component: string;
}
