type editorType =
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
  label: string;

  /**
   * @description: 是否禁用
   */
  disabled?: boolean;

  /**
   * @description: 指定用于显示和编辑表单项值的编辑器UI组件
   */
  editorType?: editorType;
}
