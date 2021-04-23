import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

let timeId: TimeoutHandle;
const NAME_SPACE = 'app';
hotModuleUnregisterModule(NAME_SPACE);
@Module({ dynamic: true, namespaced: true, store, name: NAME_SPACE })
class App extends VuexModule {
	// 页面加载控制变量
	private pageLoadingState = false;

	get getPageLoading() {
		return this.pageLoadingState;
	}

	@Mutation
	commitPageLoadingState(loading: boolean): void {
		this.pageLoadingState = loading;
	}

	@Action
	public async setPageLoadingAction(loading: boolean): Promise<void> {
		if (loading) {
			clearTimeout(timeId);
			// 防止加载图标出现闪烁
			timeId = setTimeout(() => {
				this.commitPageLoadingState(loading);
			}, 50);
		} else {
			this.commitPageLoadingState(loading);
			clearTimeout(timeId);
		}
	}
}

export const appStore = getModule<App>(App);