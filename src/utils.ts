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



export function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  
  if (x < 1 / d1) {
      return n1 * x * x;
  } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
  }