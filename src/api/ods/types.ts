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

export interface IDataSource {
  sort?: ISortItem[];
  filter?: unknown[] | string;
  paginate?: boolean;
  pageSize?: number;
  select: string[];
  expand?: string[];
}

export interface IODataStore {
  /**
   * @description 请求地址
   */
  url: string;

  /**
   * @description 列表主键
   */
  key?: string | string[];

  /**
   * @description 主键类型
   */
  keyType?: string | { [key: string]: string };

  /**
   * @description oData版本号
   */
  version?: number;

  /**
   * @description 请求前钩子函数
   */
  beforeSend?: (options: {
    url?: string;
    async?: boolean;
    method?: string;
    timeout?: number;
    params?: any;
    payload?: any;
    headers?: any;
  }) => void;
}
