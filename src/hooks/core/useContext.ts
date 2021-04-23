import {
	InjectionKey,
	provide,
	inject,
	reactive,
	readonly as defineReadonly,
	// defineComponent,
	UnwrapRef,
} from 'vue';

export interface CreateContextOptions {
  // 是否只读
  readonly?: boolean;
  // 是否写入 Provide 中
  createProvider?: boolean;
  // 是否返回原有对象
  native?: boolean;
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>;
};

export function createContext<T>(
	context: any,
	key: InjectionKey<T> = Symbol(),
	options: CreateContextOptions = {}
) {
	const { readonly = true, createProvider = false, native = false } = options;

	const state = reactive(context);
	const provideData = readonly ? defineReadonly(state) : state;
	!createProvider && provide(key, native ? context : provideData);

	return {
		state,
	};
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
export function useContext<T>(key: InjectionKey<T>, defaultValue?: any, native?: boolean): T;

export function useContext<T>(
	key: InjectionKey<T> = Symbol(),
	defaultValue?: any
): ShallowUnwrap<T> {
	return inject(key, defaultValue || {});
}
