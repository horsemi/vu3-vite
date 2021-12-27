export type SummaryType = 'sum' | 'min' | 'max' | 'avg' | 'count';

type alignmentType = 'center' | 'left' | 'right';

interface IFoundationItem {
  /**
   * @description 基础数据属性的列的字段 格式： 基础数据的expand_基础数据中的属性 例子： DeliveryWarehouse_Name
   */
  key: string;

  /**
   * @description 列的标题
   */
  caption: string;
}

export interface IColumnItem {
  /**
   * @description 列的字段 （如果是基础数据，这个key要和后端返回的expand字段一致，用于和后端字段匹配）
   */
  key: string;

  /**
   * @description 列的标题
   */
  caption: string;

  /**
   * @description 对齐方式
   */
  alignment?: alignmentType;

  /**
   * @description 是否必要
   */
  mustKey?: boolean;

  /**
   * @description 字段类型
   */
  type?: string;

  /**
   * @description 关联字段
   */
  expand?: string;

  /**
   * @description 关联字段必要的key （基础数据必要的字段，用于查询时使用的key）
   */
  relationKey?: string;

  /**
   * @description 指定基础数据中的字段 （基础数据可选的字段，用于指定使用基础数据中的哪些属性）
   */
  foundationList?: IFoundationItem[];

  /**
   * @description 自定义模板名称
   */
  cellTemplate?: string;

  /**
   * @description 是否隐藏
   */
  hide?: boolean;

  /**
   * @description 是否不允许查询
   */
  notAllowQuery?: boolean;

  /**
   * @description 是否允许排序
   */
  allowSort?: boolean;

  /**
   * @description 允许哪些类型的汇总
   */
  summaryList?: SummaryType[];

  /**
   * @description 过滤类型 (基础数据必要的字段，用于指定请求哪个接口)
   */
  datatypekeies?: string;

  /**
   * @description 过滤
   */
  operations?: Array<string>;

  /**
   * @description 用于基础资料字段默认筛选条件
   */
  filter?: Array<Record<string, unknown>>;
}

export interface IFieldType {
  key: string;
  type: string;
  expand: string;
}
