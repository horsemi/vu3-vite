import router from '/@/router';

import { createPermissionGuard } from './permissionGuard';

import { createPageUuidGuard } from './pageUuidGuard';

createPageUuidGuard(router);

createPermissionGuard(router);
