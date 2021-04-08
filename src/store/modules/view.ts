import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

import { toRaw, unref } from 'vue';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { cloneDeep } from 'lodash-es';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import router from '/@/router';
import store from '/@/store';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { getRawRoute } from '/@/utils';
import { PageEnum } from '/@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/modules/basic';

const NAME_SPACE = 'view';

hotModuleUnregisterModule(NAME_SPACE);

@Module({ namespaced: true, name: NAME_SPACE, dynamic: true, store })
class View extends VuexModule {
  cachedViewsState: Set<string> = new Set();

  // views list
  viewsState: RouteLocationNormalized[] = [];

  lastDragEndIndexState = 0;

  get getViewsState() {
    return this.viewsState;
  }

  get getCurrentView(): RouteLocationNormalized {
    const route = unref(router.currentRoute);
    return this.viewsState.find((item) => item.path === route.path)!;
  }

  get getCacheViewsState(): string[] {
    return Array.from(this.cachedViewsState);
  }

  get getLastDragEndIndexState(): number {
    return this.lastDragEndIndexState;
  }

  @Mutation
  commitClearCache(): void {
    this.cachedViewsState = new Set();
  }

  @Mutation
  goToPage() {
    const go = useGo();
    const len = this.viewsState.length;
    const { path } = unref(router.currentRoute);

    let toPath: PageEnum | string = PageEnum.BASE_HOME;
    if (len > 0) {
      const page = this.viewsState[len - 1];
      const p = page.fullPath || page.path;
      if (p) {
        toPath = p;
      }
    }

    // Jump to the current page and report an error
    path !== toPath && go(toPath as PageEnum, true);
  }

  @Mutation
  commitCachedMapState(): void {
    const cacheMap: Set<string> = new Set();

    this.viewsState.forEach((view) => {
      const item = getRawRoute(view);
      const needCache = !item.meta?.ignoreKeepAlive;
      if (!needCache) return;
      const name = item.name as string;
      cacheMap.add(name);
    });
    this.cachedViewsState = cacheMap;
  }

  /**
   * @description 跳转页面时添加路由
   * @param route 
   * @returns 
   */
  @Mutation
  commitViewRoutesState(route: RouteLocationNormalized) {
    const { path, fullPath, params, query } = route;

    let updateIndex = -1;
    // 若页面已存在，不添加至数组内
    const hasView = this.viewsState.some((view, index) => {
      updateIndex = index;
      return (view.fullPath || view.path) === (fullPath || path);
    });
    // @TOFIX 把路由参数重新添加至数组
    if (hasView) {
      const curView = toRaw(this.viewsState)[updateIndex];
      if (!curView) return;
      curView.params = params || curView.params;
      curView.query = query || curView.query;
      curView.fullPath = fullPath || curView.fullPath;
      this.viewsState.splice(updateIndex, 1, curView);
      return;
    }
    this.viewsState = cloneDeep([...this.viewsState, route]);
  }

  /**
   * @description: 关闭页面时在 viewsState 删除对应的路由
   */
   @Mutation
   commitCloseView(route: RouteLocationNormalized): void {
     const { fullPath, meta: { affix } = {} } = route;
     if (affix) return;
     const index = this.viewsState.findIndex((item) => item.fullPath === fullPath);
     index !== -1 && this.viewsState.splice(index, 1);
   }

  @Mutation
  commitCloseAllView(): void {
    this.viewsState = this.viewsState.filter((item) => {
      return item.meta && item.meta.affix;
    });
  }

  @Mutation
  commitResetState(): void {
    this.viewsState = [];
    this.cachedViewsState = new Set();
  }

  /**
   * @description 滑动页面标签，更改页面顺序
   * @param param0 
   */
  @Mutation
  commitSortViews({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
    const currentTab = this.viewsState[oldIndex];

    this.viewsState.splice(oldIndex, 1);
    this.viewsState.splice(newIndex, 0, currentTab);
    this.lastDragEndIndexState = this.lastDragEndIndexState + 1;
  }

  /**
   * @description 关闭多个页面
   * @param pathList 
   */
  @Mutation
  closeMultipleView({ pathList }: { pathList: string[] }): void {
    this.viewsState = toRaw(this.viewsState).filter((item) => !pathList.includes(item.fullPath));
  }

  @Mutation
  async commitRedoPage() {
    const route = router.currentRoute.value;
    const name = route.name;

    const findVal = Array.from(this.cachedViewsState).find((item) => item === name);
    if (findVal) {
      this.cachedViewsState.delete(findVal);
      // this.cachedViewsState.splice(index, 1);
    }
    const redo = useRedo();
    await redo();
  }

  @Action
  addViewAction(route: RouteLocationNormalized) {
    const { path, name } = route;
    // 404  The page does not need to add a tab
    if (
      path === PageEnum.ERROR_PAGE ||
      !name ||
      [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)
    ) {
      return;
    }
    this.commitViewRoutesState(getRawRoute(route));

    this.commitCachedMapState();
  }

  @Action
  closeAllViewAction() {
    this.commitCloseAllView();
    this.commitClearCache();
    this.goToPage();
  }

  @Action
  closeViewAction(view: RouteLocationNormalized) {
    function getObj(tabItem: RouteLocationNormalized) {
      const { params, path, query } = tabItem;
      return {
        params: params || {},
        path,
        query: query || {},
      };
    }

    const { currentRoute, replace } = router;

    const { path } = unref(currentRoute);
    // 关闭非当前页面
    if (path !== view.path) {
      this.commitCloseView(view);
      return;
    }

    // 关闭页面为当前页面时
    let toObj: RouteLocationRaw = {};

    const index = this.getViewsState.findIndex((item) => item.path === path);

    // 若当前页面为做左侧页面
    if (index === 0) {
      // 若目前只有一个页面，则默认打开首页
      if (this.getViewsState.length === 1) {
        toObj = PageEnum.BASE_HOME;
      } else {
        // 跳转到右方页面
        const page = this.getViewsState[index + 1];
        toObj = getObj(page);
      }
      this.commitCloseView(currentRoute.value);
      replace(toObj);
    }
  }

  @Action
  closeViewByKeyAction(key: string) {
    const index = this.viewsState.findIndex((item) => (item.fullPath || item.path) === key);
    index !== -1 && this.closeViewAction(this.viewsState[index]);
  }
}

export const viewStore = getModule<View>(View);
