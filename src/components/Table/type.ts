type allModeType = 'allPages' | 'page';

type checkBoxesModeType = 'none' | 'onClick' | 'onLongTap' | 'always';

interface ISelection {
  /**
   * @description: 全选方式
   */
  allMode?: allModeType,

  /**
   * @description: 多选模式
   */
  checkBoxesMode?: checkBoxesModeType,
};

interface IPage {
  /**
   * @description: 每页显示条数
   */
  size: number,
  
  /**
   * @description: 当前显示页码
   */
  index?: number,
};

export interface IDefaultTableOptions {
  /**
   * @description: 表格高度
   */
  height: number | string | (() => void),

  /**
   * @description: 是否显示列边框
   */
  showColumnLines: boolean,

  /**
   * @description: 是否显示行边框
   */
  showRowLines: boolean,

  /**
   * @description: 是否显示整个表格的边框
   */
  showBorders: boolean,

  /**
   * @description: 是否隔行换色
   */
  rowAlternationEnabled: boolean,

  /**
   * @description: 多选列配置
   */
  selection: ISelection,

  /**
   * @description: 分页配置
   */
  page: IPage,
};

type sortOrderType = 'asc' | 'desc';

export interface ITableColumnsItem {
  /**
   * @description: 列的字段
   */
  dataField: string,

  /**
   * @description: 列的标题 指定列值的排序顺序
   */
  caption: string,

  /**
   * @description: 列的排序顺序 asc(升) | desc(降)
   */
  sortOrder: sortOrderType
}