import { nextTick } from 'vue';
import { createLoadingComponent } from './createLoadingComponent';
import type { ILoadingGlobalConfig, ILoadingInstance, ILoadingOptions } from './loading.type';
import { viewStore } from '/@/store/modules/view';
import { addClass, getStyle, removeClass } from '/@/utils/dom';

const defaults: ILoadingOptions = {
	parent: null,
	background: '',
	spinner: false,
	text: null,
	fullscreen: true,
	body: false,
	lock: false,
	customClass: '',
};

const globalLoadingOption: ILoadingGlobalConfig = {
	fullscreenLoading: undefined,
};

const addStyle = async (options: ILoadingOptions, parent: HTMLElement, instance: ILoadingInstance) => {
	const maskStyle: Partial<CSSStyleDeclaration> = {};
	if (options.fullscreen && instance.originalPosition && instance.originalOverflow) {
		instance.originalPosition.value = getStyle(document.body, 'position');
		instance.originalOverflow.value = getStyle(document.body, 'overflow');
		// tofix unknow
		viewStore.commitNextLoadingZindex();
		maskStyle.zIndex = viewStore.getLoadingZindex.toString();
	} else if (options.body && instance.originalPosition) {
		instance.originalPosition.value = getStyle(document.body, 'position');
		/**
     * await dom render when visible is true in init,
     * because some component's height maybe 0.
     * e.g. el-table.
     */
		await nextTick();
		['top', 'left'].forEach(property => {
			const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
			maskStyle[property] = (options.target as HTMLElement).getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] -
        parseInt(getStyle(document.body, `margin-${ property }`), 10) +
        'px';
		});
		['height', 'width'].forEach(property => {
			maskStyle[property] = (options.target as HTMLElement).getBoundingClientRect()[property] + 'px';
		});
	} else if (instance.originalPosition) {
		instance.originalPosition.value = getStyle(parent, 'position');
	}
	Object.keys(maskStyle).forEach(property => {
		instance.$el.style[property] = maskStyle[property];
	});
};

const addClassList = (options: ILoadingOptions, parent: HTMLElement, instance: ILoadingInstance) => {
	if (instance.originalPosition && instance.originalPosition.value !== 'absolute' && instance.originalPosition.value !== 'fixed') {
		addClass(parent, 'v-loading-parent--relative');
	} else {
		removeClass(parent, 'v-loading-parent--relative');
	}
	if (options.fullscreen && options.lock) {
		addClass(parent, 'v-loading-parent--hidden');
	} else {
		removeClass(parent, 'v-loading-parent--hidden');
	}
};

const Loading = function (options: ILoadingOptions = {}): ILoadingInstance {
	options = {
		...defaults,
		...options,
	};

	if (typeof options.target === 'string') {
		options.target = document.querySelector(options.target) as HTMLElement;
	}
	options.target = options.target || document.body;
	if (options.target !== document.body) {
		options.fullscreen = false;
	} else {
		options.body = true;
	}

	if (options.fullscreen && globalLoadingOption.fullscreenLoading) {
		globalLoadingOption.fullscreenLoading.close();
	}

	const parent = options.body ? document.body : options.target;
	options.parent = parent;

	const instance = createLoadingComponent({
		options,
		globalLoadingOption,
	});

	addStyle(options, parent, instance);
	addClassList(options, parent, instance);

	options.parent.vLoadingAddClassList = () => {
		addClassList(options, parent, instance);
	};

	/**
   * add loading-number to parent.
   * because if a fullscreen loading is triggered when somewhere
   * a v-loading.body was triggered before and it's parent is
   * document.body which with a margin , the fullscreen loading's
   * destroySelf function will remove 'el-loading-parent--relative',
   * and then the position of v-loading.body will be error.
   */
	let loadingNumber: number | string | null = parent.getAttribute('loading-number');
	if (!loadingNumber) {
		loadingNumber = 1;
	} else {
		loadingNumber = Number.parseInt(loadingNumber) + 1;
	}
	parent.setAttribute('loading-number', loadingNumber.toString());

	parent.appendChild(instance.$el);

	// after instance render, then modify visible to trigger transition
	nextTick().then(() => {
		if (instance.visible) {
			instance.visible.value = Object.prototype.hasOwnProperty.call(options, 'visible') ? options.visible as boolean : true;
		}
	});

	if (options.fullscreen) {
		globalLoadingOption.fullscreenLoading = instance;
	}
	return instance;
};

export default Loading;
