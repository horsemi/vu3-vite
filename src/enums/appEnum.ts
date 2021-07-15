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

/**
 * @description 是否强制修改密码
 */
export enum isChangePasswordEnum {
  CHANGE = '1',
  UNCHANGE = '0',
}
