import { PermissionModeEnum, TabRouterModeEnum } from '/@/enums/appEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';

// 权限模式
export interface SystemConfig {
  permissionMode: PermissionModeEnum;
  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CacheTypeEnum;
  // 路由模式
  tabRouterMode: TabRouterModeEnum;
}
