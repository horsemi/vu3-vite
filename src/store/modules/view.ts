import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { cloneDeep } from 'lodash-es';

import router from '/@/router';
import { store } from '/@/store';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { getRawRoute } from '/@/utils';
import { PageEnum } from '/@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, LOGIN_ROUTE } from '/@/router/routes/basic';

let timeId: TimeoutHandle;

export interface ViewState {
  cacheList: Set<string>;
  viewList: RouteLocationNormalized[];
  lastDragEndIndexState: number;
  loadingZindex: number;
  loadingTimes: number;
}

export const useViewStore = defineStore({
  id: 'app-view',
  state: (): ViewState => ({
    cacheList: new Set(),
    viewList: [],
    lastDragEndIndexState: 0,
    loadingZindex: 2000,
    loadingTimes: 0,
  }),
  getters: {
    getViewList() {
      return this.viewList;
    },
    getCurrentView(): RouteLocationNormalized {
      const route = unref(router.currentRoute);
      /* eslint-disable */
      return this.viewList.find((item) => item.path === route.path)!;
      /* eslint-disable */
    },
    getCacheList(): string[] {
      return Array.from(this.cacheList);
    },
    getLastDragEndIndexState(): number {
      return this.lastDragEndIndexState;
    },
    getLoadingZindex() {
      return this.loadingZindex;
    },
    getLoadingTimes(): number {
      return this.loadingTimes;
    },
  },
  actions: {
    goToPage() {
      const go = useGo();
      const len = this.viewList.length;
      const { path } = unref(router.currentRoute);

      let toPath: PageEnum | string = PageEnum.BASE_HOME;
      if (len > 0) {
        const page = this.viewList[len - 1];
        const p = page.fullPath || page.path;
        if (p) {
          toPath = p;
        }
      }

      // Jump to the current page and report an error
      path !== toPath && go(toPath as PageEnum, true);
    },
    setLoading(value: boolean) {
      let count = this.loadingTimes;
      if (value) {
        count += 1;
        this.loadingTimes = count;
      } else {
        count = count - 1;
        count = count < 0 ? 0 : count;
        this.loadingTimes = count;
      }
    },
    updateCacheList(): void {
      const cacheMap: Set<string> = new Set();

      this.viewList.forEach((view) => {
        const item = getRawRoute(view);
        const needCache = !item.meta?.ignoreKeepAlive;
        if (!needCache) {
          return;
        }
        const name = item.name as string;
        cacheMap.add(name);
      });
      this.cacheList = cacheMap;
    },
    /**
     * @description 跳转页面时添加路由
     * @param route
     * @returns
     */
    setViewRoutes(route: RouteLocationNormalized) {
      const { path, fullPath, params, query } = route;

      let updateIndex = -1;
      // 若页面已存在，不添加至数组内
      const hasView = this.viewList.some((view, index) => {
        updateIndex = index;
        return (view.fullPath || view.path) === (fullPath || path);
      });
      // @TOFIX 把路由参数重新添加至数组
      if (hasView) {
        const curView = toRaw(this.viewList)[updateIndex];
        if (!curView) return;
        curView.params = params || curView.params;
        curView.query = query || curView.query;
        curView.fullPath = fullPath || curView.fullPath;
        this.viewList.splice(updateIndex, 1, curView);
        return;
      }
      this.viewList = cloneDeep([...this.viewList, route]);
    },
    clearCacheList(): void {
      this.cacheList = new Set();
    },
    resetState(): void {
      this.viewList = [];
      this.clearCacheList();
    },
    /**
     * @description 滑动页面标签，更改页面顺序
     * @param param0
     */
    async sortViews({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
      const currentTab = this.viewList[oldIndex];

      this.viewList.splice(oldIndex, 1);
      this.viewList.splice(newIndex, 0, currentTab);
      this.lastDragEndIndexState = this.lastDragEndIndexState + 1;
    },
    async closeMultipleView({ pathList }: { pathList: string[] }) {
      this.viewList = toRaw(this.viewList).filter((item) => !pathList.includes(item.fullPath));
    },
    async redoPage() {
      const route = router.currentRoute.value;
      const name = route.name;

      const findVal = Array.from(this.cacheList).find((item) => item === name);
      if (findVal) {
        this.cacheList.delete(findVal);
        // this.cacheViewsState.splice(index, 1);
      }
      const redo = useRedo();
      await redo();
    },
    nextLoadingZindex() {
      ++this.loadingZindex;
    },
    async addView(route: RouteLocationNormalized) {
      const { path, name } = route;
      // 404  The page does not need to add a tab
      if (
        path === PageEnum.ERROR_PAGE ||
        !name ||
        [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name, LOGIN_ROUTE.name].includes(name as string)
      ) {
        return;
      }
      this.setViewRoutes(getRawRoute(route));

      this.updateCacheList();
    },
    async closeAllView() {
      this.viewList = this.viewList.filter((item) => {
        return item.meta && item.meta.affix;
      });
      this.clearCacheList();
      this.goToPage();
    },
    async closeView(view: RouteLocationNormalized, router: Router) {
      function getToTarget(tabItem: RouteLocationNormalized) {
        const { params, path, query } = tabItem;
        return {
          params: params || {},
          path,
          query: query || {},
        };
      }

      /**
       * @description 关闭页面时在 viewsState 删除对应的路由
       */
      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix) {
          return;
        }

        const index = this.viewList.findIndex((item) => item.fullPath === fullPath);
        if (index !== -1) {
          this.viewList.splice(index, 1);
        }
      };

      const { currentRoute, replace } = router;

      const { fullPath } = unref(currentRoute);
      // 关闭非当前页面
      if (fullPath !== view.fullPath) {
        close(view);
        return;
      }

      // 关闭页面为当前页面时
      let toTarget: RouteLocationRaw = {};

      const index = this.getViewList.findIndex((item) => item.fullPath === fullPath);

      // 若当前页面为做左侧页面
      if (index === 0) {
        // 若目前只有一个页面，则默认打开首页
        if (this.getViewList.length === 1) {
          toTarget = PageEnum.BASE_HOME;
        } else {
          // 跳转到右方页面
          const page = this.getViewList[index + 1];
          toTarget = getToTarget(page);
        }
      } else {
        // Close the current tab
        const page = this.viewList[index - 1];
        toTarget = getToTarget(page);
      }
      close(currentRoute.value);
      replace(toTarget);
    },
    async closeViewByKey(key: string, router: Router) {
      const index = this.viewList.findIndex((item) => (item.fullPath || item.path) === key);
      index !== -1 && this.closeView(this.viewList[index], router);
    },
  },
});

// Need to be used outside the setup
export function useViewWithOutStore() {
  return useViewStore(store);
}
