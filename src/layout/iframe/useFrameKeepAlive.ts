import type { AppRouteRecordRaw } from '/@/router/types';

import { computed, toRaw, unref } from 'vue';

import { viewStore } from '/@/store/modules/view';

import { uniqBy } from 'lodash-es';

import { useRouter } from 'vue-router';

export function useFrameKeepAlive() {
	const router = useRouter();
	const { currentRoute } = router;
	const getFramePages = computed(() => {
		const ret =
      getAllFramePages((toRaw(router.getRoutes()) as unknown) as AppRouteRecordRaw[]) || [];
		return ret;
	});

	const getOpenTabList = computed((): string[] => {
		return viewStore.getViewsState.reduce((prev: string[], next) => {
			if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
				prev.push(next.name as string);
			}
			return prev;
		}, []);
	});

	function getAllFramePages(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
		let res: AppRouteRecordRaw[] = [];
		for (const route of routes) {
			const { meta: { frameSrc } = {}, children } = route;
			if (frameSrc) {
				res.push(route);
			}
			if (children && children.length) {
				res.push(...getAllFramePages(children));
			}
		}
		res = uniqBy(res, 'name');
		return res;
	}

	function showIframe(item: AppRouteRecordRaw) {
		return item.name === unref(currentRoute).name;
	}

	function hasRenderFrame(name: string) {
		return unref(getOpenTabList).includes(name);
	}

	return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}
