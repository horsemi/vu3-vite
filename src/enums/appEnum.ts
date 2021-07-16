/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  ROLE = 'ROLE',
  // permission
  PERMISSION = 'PERMISSION',
  // black
  BACK = 'BACK',
}

export enum TabRouterModeEnum {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

/**
 * @description 密码校验
 */
export enum PasswordStateEnum {
  UNEXPIRED = 1,
  WARNING = 2,
  EXPIRED = 3,
  WEAKPASSWORD = 4,
}
