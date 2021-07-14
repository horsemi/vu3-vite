type allModeType = 'allPages' | 'page';

type checkBoxesModeType = 'none' | 'onClick' | 'onLongTap' | 'always';

export interface ISortItem {
  /**
   * @description 排序字段
   */
  selector: string;

  /**
   * @description 是否降序
   */
  desc?: boolean;
}

interface ISelection {
  /**
   * @description 全选方式
   */
  allMode: allModeType;

  /**
   * @description 多选模式
   */
  checkBoxesMode: checkBoxesModeType;
}

interface IPage {
  /**
   * @description 每页显示条数
   */
  size: number;

  /**
   * @description 当前显示页码
   */
  index?: number;
}

interface IODataOptions {
  /**
   * @description 请求地址
   */
  url: string;

  /**
   * @description 列表主键
   */
  key?: string;

  /**
   * @description 主键类型
   */
  keyType?: string;

  /**
   * @description oData版本号
   */
  version?: number;
}

interface IDataSourceOptions {
  /**
   * @description 排序字段
   */
  sort?: ISortItem[];

  /**
   * @description oData配置
   */
  oDataOptions: IODataOptions;

  /**
   * @description 是否分页
   */
  paginate?: boolean;
}

export interface ITableOptions {
  /**
   * @description dataSource配置
   */
  dataSourceOptions: IDataSourceOptions;

  /**
   * @description 表格高度
   */
  height: number | string | (() => void);

  /**
   * @description 是否使用滚动分页
   */
  useScrolling: boolean;

  /**
   * @description 是否显示列边框
   */
  showColumnLines: boolean;

  /**
   * @description 是否显示列边框
   */
  allowColumnResizing: boolean;

  /**
   * @description 是否列宽自适应
   */
  columnAutoWidth: boolean;

  /**
   * @description 是否显示列边框
   */
  hoverStateEnabled: boolean;

  /**
   * @description 是否显示行边框
   */
  showRowLines: boolean;

  /**
   * @description 是否显示整个表格的边框
   */
  showBorders: boolean;

  /**
   * @description 是否隔行换色
   */
  rowAlternationEnabled: boolean;

  /**
   * @description 多选列配置
   */
  selection: ISelection;

  /**
   * @description 分页配置
   */
  page: IPage;
}
