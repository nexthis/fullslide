export function debounce<F extends (...params: any[]) => void>(fn: F, delay: number) {
  let timeoutID: number = 0;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

export function throttle(fn: (...args: any) => void, wait: number) {
  let isCalled = false;

  return (...args: any[])  => {
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
