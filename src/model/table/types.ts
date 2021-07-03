type alignmentType = 'center' | 'left' | 'right';

export interface IColumnItem {
  /**
   * @description: 列的字段
   */
  key: string;

  /**
   * @description: 列的标题
   */
  caption: string;

  /**
   * @description: 对齐方式
   */
  alignment?: alignmentType;

  /**
   * @description: 是否必要
   */
  mustKey?: boolean;

  /**
   * @description: 字段类型
   */
  type?: string;

  /**
   * @description: 自定义模板名称
   */
  cellTemplate?: string;

  /**
   * @description: 是否隐藏
   */
  hide?: boolean;

  /**
   * @description: 是否允许查询
   */
  allowQuery?: boolean;

  /**
   * @description: 是否允许排序
   */
  allowSort?: boolean;

  /**
   * @description: 过滤类型
   */
  datatypekeies?: string;

  /**
   * @description: 过滤
   */
  operations?: Array<string>;
}

export interface IFieldType {
  key: string;
  type: string;
}

export interface IKeyType {
  caption: string;
  key: string;
  type: string;
}
