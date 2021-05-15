import type { SystemConfig } from '/#/config';
import { PermissionModeEnum, TabRouterModeEnum } from '/@/enums/appEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';

const setting: SystemConfig = {
  permissionMode: PermissionModeEnum.ROLE,
  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CacheTypeEnum.LOCAL,

  tabRouterMode: TabRouterModeEnum.MULTIPLE,
};

export default setting;
