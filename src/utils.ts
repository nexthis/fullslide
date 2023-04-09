export function debounce<F extends (...params: any[]) => void>(
    fn: F,
    delay: number
  ) {
    let timeoutID: number = 0;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutID);
      timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
}

export function throttle(fn:Function, wait:number){
  let isCalled = false;

  return function(...args){
      if (!isCalled){
          fn(...args);
          isCalled = true;
          setTimeout(function(){
              isCalled = false;
          }, wait)
      }
  };
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}