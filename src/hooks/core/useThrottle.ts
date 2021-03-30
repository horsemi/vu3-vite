import { isFunction } from '/@/utils/is';

export interface DebounceAndThrottleOptions {
  // 是否立刻执行
  immediate?: boolean;
  // 是否为debounce
  debounce?: boolean;
  // 是否只执行一次
  once?: boolean;
}

export type CancelFn = () => void;

export type DebounceAndThrottleProcedure<T extends unknown[]> = (...args: T) => unknown;

export type DebounceAndThrottleProcedureResult<T extends unknown[]> = [
  DebounceAndThrottleProcedure<T>,
  CancelFn
];

export function throttle<T extends unknown[]>(
  handler: DebounceAndThrottleProcedure<T>,
  wait: number,
  options: DebounceAndThrottleOptions = {}
): DebounceAndThrottleProcedureResult<T> {
  if (!isFunction(handler)) {
    throw new Error('handle is not Function!');
  }
  let { immediate = false } = options;
  const { once = false, debounce = false } = options;
  let timeoutId: Nullable<TimeoutHandle>;
  // 取消定时器ID
  let cancelled: boolean | null = false;
  /**
   * @description 清除定时器 clear timer
   */
  function clearTimer() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  /**
   * @description 取消执行 cancel exec
   */
  function cancel() {
    clearTimer();
    cancelled = true;
  }
  /**
   * @description 如果 once 为 true, 就只执行一次
   */
  function cancelExec(): void {
    once && cancel();
  }
  function fn(this: unknown, ...args: T) {
    if (cancelled) {
      return;
    }
    const exec = () => {
      !debounce && clearTimer();
      handler.apply(this, args);
      cancelExec();
    }

    if (immediate) {
      immediate = false;
      const callNow = !immediate;
      if (callNow) {
        exec();
        timeoutId = null;
      }
    } else {
      debounce && clearTimer();
      if (!timeoutId || debounce) {
        timeoutId = setTimeout(exec, wait);
      }
    }
  }
  return [fn, cancel];
}

export function useThrottle<T extends unknown[]>(
  handle: DebounceAndThrottleProcedure<T>,
  wait: number,
  options: DebounceAndThrottleOptions = {}
): DebounceAndThrottleProcedureResult<T> {
  return throttle(handle, wait, options);
}