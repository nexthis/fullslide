export function debounce<F extends (...params: Array<any>) => void>(fn: F, delay: number) {
  let timeoutID = 0;
  return function (this: ThisType<any>, ...args: Array<any>) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

export function throttle<T>(fn: (...args: Array<T>) => void, wait: number) {
  let isCalled = false;

  return (...args: Array<T>)  => {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
      setTimeout( () => {
        isCalled = false;
      }, wait);
    }
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}
