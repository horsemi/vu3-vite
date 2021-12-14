import { toRawType } from '@vue/shared';

export function is(val: unknown, type: string): boolean {
  return toString.call(val) === `[object ${type}]`;
}
/* eslint-disable-next-line */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML');
