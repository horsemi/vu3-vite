import router from '/@/router';

import { createPageGuard } from './pageGuard';
import { createPermissionGuard } from './permissionGuard';

createPageGuard(router);

createPermissionGuard(router);