import router from '/@/router';

import { createLoadingGuard } from './loadingGuard';

import { createPermissionGuard } from './permissionGuard';

import { createPageUuidGuard } from './pageUuidGuard';

import { createPageGuard } from './pageGuard';

createLoadingGuard(router);

// TODO 单组件多页面模式存在性能问题，暂时关闭该功能
createPageUuidGuard(router);

createPermissionGuard(router);

createPageGuard(router);
