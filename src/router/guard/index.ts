import router from '/@/router';

import { createPermissionGuard } from './permissionGuard';

import { createPageUuidGuard } from './pageUuidGuard';

import { createPageGuard } from './pageGuard';

createPageUuidGuard(router);

createPermissionGuard(router);

createPageGuard(router);
