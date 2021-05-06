import router from '/@/router';

import { createPageGuard } from './pageGuard';
import { createPermissionGuard } from './permissionGuard';
import { createStateGuard } from './stateGuard';

createPageGuard(router);

createPermissionGuard(router);

createStateGuard(router);
