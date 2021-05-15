import router from '/@/router';

import { createPageGuard } from './pageGuard';
import { createPermissionGuard } from './permissionGuard';
import { createStateGuard } from './stateGuard';
import { createPageUuidGuard } from './pageUuidGuard';

createPageUuidGuard(router);

createPageGuard(router);

createPermissionGuard(router);

createStateGuard(router);
