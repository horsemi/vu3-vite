import type { SystemConfig } from '/#/config';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';

const setting: SystemConfig = {
  permissionMode: PermissionModeEnum.ROLE,
  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CacheTypeEnum.LOCAL,
};

export default setting;
