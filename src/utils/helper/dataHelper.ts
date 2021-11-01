/**
 * @description 驼峰式转为连接符式
 * @param data
 * @returns
 */
export function camelCaseToHyphenCase(data: string): string {
  return data.replace(/(?!^[A-Z])[A-Z]/g, '-$&').toLowerCase();
}

/**
 * @description 连接符式转为驼峰式
 * @param data
 * @returns
 */
export function hyphenCaseToCamelCase(data: string): string {
  return data.replace('//-(/w)/g', (all, letter) => {
    return letter.toUpperCase();
  });
}
