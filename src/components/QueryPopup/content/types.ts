import type { IColumnItemBase, SummaryType } from '/@/model/types';
import type { IQueryItem } from '/@/components/QueryPlan/types';
import type { IRelationShipItem } from '/@/model/types';

type LogicType = 'and' | 'or';

export type SummaryMode = 'page' | 'all';

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

export interface IOrderByItem extends IColumnItemBase {
  /**
   * @description 标题
   */
  caption: string;

  /**
   * @description 排序 true为降序, false为升序
   */
  desc: boolean;
}

export interface ISchemeColumnsItem extends IColumnItemBase {
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
   * @description 是否必要
   */
  mustKey?: boolean;
}

export interface ISummaryItem extends IColumnItemBase {
  /**
   * @description 标题
   */
  caption: string;

  /**
   * @description 汇总方式
   */
  mode: SummaryMode;

  /**
   * @description 汇总类型
   */
  type: SummaryType;

  /**
   * @description 汇总配置
   */
  options: { name: string; type: SummaryType }[];
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
   * @description 汇总
   */
  summary: ISummaryItem[];

  /**
   * @description 快速过滤
   */
  fast?: IQueryItem[];

  /**
   * @description 是否共享
   */
  isShare?: boolean;

  /**
   * @description 关联关系
   */
  relationShips: IRelationShip[];
}

export interface IRelationShip extends IRelationShipItem {
  /**
   * @description 值
   */
  value?: boolean;
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
  value: LogicType;
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
