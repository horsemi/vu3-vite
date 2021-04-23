export function is(val: unknown, type: string): boolean {
	return toString.call(val) === `[object ${type}]`;
}
/* eslint-disable */
export function isFunction(val: unknown): val is Function {
	/* eslint-enable */
	return typeof val === 'function';
}

export function isString(val: unknown): val is string {
	return is(val, 'String');
}

export function isObject(val: unknown): val is Record<any, any> {
	return val !== null && is(val, 'Object');
}