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
   * @description: 字段名
   */
  dataField: string;

  /**
   * @description: 标题
   */
  label?: string;

  /**
   * @description: 是否禁用
   */
  disabled?: boolean;

  /**
   * @description: 是否隐藏
   */
  hide?: boolean;

  /**
   * @description: 字段类型
   */
  type?: string;

  /**
   * @description: 指定用于显示和编辑表单项值的编辑器UI组件
   */
  editorType?: EditorType;

  /**
   * @description: 过滤类型
   */
  datatypekeies?: string;
}

export interface IDefiniteItem {
  /**
   * @description: 列的字段
   */
  key: string;

  /**
   * @description: 列的标题
   */
  caption: string;

  /**
   * @description: 是否隐藏
   */
  hide?: boolean;
}