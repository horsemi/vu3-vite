interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * @description 路由数据过滤方法 用于嵌套式数据过滤
 * @param tree 过滤数据
 * @param func 过滤方法
 * @param config
 * @returns
 */
export function filter<T = any>(
  tree: T[],
  func: (n: T, index: number) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const children = config.children as string;

  /**
   * @description 递归方法 用于数据过滤
   * @param list
   * @param index 递归次数
   * @returns
   */
  function listFilter(list: T[], index = 0) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children], index + 1);
        return func(node, index) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}

export function treeToList<T = any>(
  tree: any,
  config: Partial<TreeHelperConfig> = {},
  formatterFn?: (result: any, children: string | undefined) => void
): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    formatterFn?.(result[i], children);

    result.splice(i + 1, 0, ...result[i][children!]);
    delete result[i][children!];
  }
  return result;
}
