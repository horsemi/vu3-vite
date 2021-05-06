import { PermissionModeEnum } from '/@/enums/appEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';

export interface SystemConfig {
  // 权限模式
  permissionMode: PermissionModeEnum;
  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CacheTypeEnum;
}
