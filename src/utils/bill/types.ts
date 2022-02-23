export type EditorType =
  | 'dxAutocomplete'
  | 'dxCalendar'
  | 'dxCheckBox'
  | 'dxColorBox'
  | 'dxDateBox'
  | 'dxDropDownBox'
  | 'dxHtmlEditor'
  | 'dxLookup'
  | 'dxNumberBox'
  | 'dxRadioGroup'
  | 'dxRangeSlider'
  | 'dxSelectBox'
  | 'dxSlider'
  | 'dxSwitch'
  | 'dxTagBox'
  | 'dxTextArea'
  | 'dxTextBox';

export interface IDetailItem {
  /**
   * @description 字段名
   */
  key: string;

  /**
   * @description 标题
   */
  caption: string;

  /**
   * @description 是否禁用
   */
  disabled?: boolean;

  /**
   * @description 校验规则
   */
  validate?: unknown[];

  /**
   * @description 是否隐藏
   */
  hide?: boolean;

  /**
   * @description 字段类型
   */
  type?: string;

  /**
   * @description 指定用于显示和编辑表单项值的编辑器UI组件
   */
  editorType?: EditorType;

  /**
   * @description 关联数据
   */
  expand?: string;

  /**
   * @description 表单关联ID
   */
  keyProperty?: string;

  /**
   * @description 表单显示关联属性
   */
  showProperty?: string;

  /**
   * @description 关联字段必要的key （基础数据必要的字段，用于查询时使用的key）
   */
  relationKey?: string;

  /**
   * @description 过滤类型
   */
  datatypekeies?: string;

  /**
   * @description 指定使用自定义组件的名称
   */
  template?: string;

  /**
   * @description 占多少列（全部分为8列）
   */
  colSpan?: number;
}
