import type { Router } from 'vue-router';

import { useViewWithOutStore } from '/@/store/modules/view';
import maskLoading from '/@/utils/maskLoading/index';
import '/@/utils/maskLoading/maskLoading.css';

export function createLoadingGuard(router: Router) {
  router.beforeEach((to) => {
    const viewStore = useViewWithOutStore();
    // 跳转页面
    if (viewStore.getCacheList?.length > 0 && !viewStore.getCacheList?.includes(to.path)) {
      maskLoading.showLoading('page');
    }
    // 刚初始化
    if (viewStore.getViewList.length === 0) {
      maskLoading.showLoading('fullScreen');
    }
  });
  router.afterEach((to) => {
    maskLoading.hideLoading();
  });
}
