import { animateMaker } from './animations' 
import Paginate from '@/paginate';
import { clamp, debounce, throttle } from '@/utils';


const defaultConfig: Config = {
  animated: true,
  horizontal: false,
  triggerDistance: 30,
  fixMobileBare: true,
  animationType: "base"
};

export default function (props: Partial<Config> = {}) {
  const config: Config = { ...defaultConfig, ...props };
  const { onPaginate: onPaginateInternal, paginate, destroy: destroyPaginate } = Paginate();

  const fullslide = document.querySelector<HTMLDialogElement>('.fullslide')!;
  const pages = Array.from(document.querySelectorAll<HTMLDialogElement>('.fullslide__page')!);

  let block = false;
  let currentPage = 0;
  const maxPage = pages.length - 1;
  const startPoint: Point = { x: 0, y: 0 };
  const lastPoint: Point = { x: 0, y: 0 };
  const eventEmitter: EventEmitter = { interact: [], start: [], stop: [], change: [] };

  const onInteractionStartInternal = (e: MouseEvent | TouchEvent) => {
    const [x, y] = e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY];

    const point: Point = { x, y };

    startPoint.x = point.x;
    startPoint.y = point.y;

    lastPoint.x = point.x;
    lastPoint.y = point.y;

    onInteractionStart.call(null, eventEmitter.start[0]);
  };

  const onInteractInternal = throttle((e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.buttons !== 1) {
      return;
    }

    const [x, y] = e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY];
    const point: Point = { x, y };
    calculate(point);
  }, 10);

  const onInteractionStopInternal = () => {
    block = false;
    changePage(currentPage);

    onInteractionStop.call(null, eventEmitter.stop[0]);
  };

  const onInputInternal = debounce((e: WheelEvent | KeyboardEvent) => {
    onInteractionStart.call(null, eventEmitter.start[0]);
    const keyMap = { ArrowUp: -1, ArrowDown: 1 };

    const delta = e instanceof WheelEvent ? Math.sign(e.deltaY) : keyMap[e.key as keyof typeof keyMap] ?? 0;

    if (e instanceof KeyboardEvent && delta === 0) {
      return;
    }

    changePage(delta, true);

    onInteractionStop.call(0, eventEmitter.stop[0]);
  }, 50);

  const onResizeInternal = debounce(() => {
    fullslide.style.height = `${window.innerHeight}px`;
    fullslide.style.width = `${window.innerWidth}px`;
    changePage(currentPage);
  }, 100);

  window.addEventListener('touchend', onInteractionStopInternal);
  window.addEventListener('touchmove', onInteractInternal);
  window.addEventListener('touchstart', onInteractionStartInternal);

  window.addEventListener('mousedown', onInteractionStartInternal);
  window.addEventListener('mouseup', onInteractionStopInternal);
  window.addEventListener('mousemove', onInteractInternal);

  window.addEventListener('resize', onResizeInternal);
  document.addEventListener('wheel', onInputInternal);
  document.addEventListener('keydown', onInputInternal);
  onResizeInternal();
  makeSupportCssClass()

  function calculate(point: Point) {
    if (block) {
      return;
    }

    const distance = point.y - startPoint.y;

    for (const item of pages) {
      item.style.transform = `translate(0, ${distance + -(window.innerHeight * currentPage)}px)`;
    }

    if (Math.round((Math.abs(distance) / window.innerHeight) * 100) >= config.triggerDistance) {
      changePage(distance > 0 ? -1 : 1, true);
      block = true;
    }

    onInteract.call(null, eventEmitter.interact[0]);
    lastPoint.x = point.x;
    lastPoint.y = point.y;
  }


  
  function makeSupportCssClass() {
    console.log(config.fixMobileBare);
    
    if(config.fixMobileBare){
      document.body.classList.add("fullslide-body")
      document.querySelector("html")!.classList.add("fullslide-html")
    }
  }

  function makeEventPayload(): EventPayload {
    const delta = Math.sign(lastPoint.y - startPoint.y);

    return {
      pages: pages,
      current: pages[currentPage],
      next: pages[clamp(currentPage - delta, 0, maxPage)],
      page: currentPage,
      distance: lastPoint.y - startPoint.y,
      percentage: Math.round((Math.abs(lastPoint.y) / window.innerHeight) * 100),
    };
  }

  onPaginateInternal((page) => {
    changePage(page);
  });

  // ****************
  //    Public API
  // ****************

  /**
   * Change slide to another one
   * @param page - number of the page
   * @param relative - if true page value will be added from the current page, so you can use eg: -1 or 1 in page value
   */
  function changePage(page: number, relative = false) {
    const isSame = currentPage === page;

    if (relative) {
      currentPage = clamp(currentPage + page, 0, maxPage);
    } else {
      currentPage = clamp(page, 0, maxPage);
    }

    if (config.animated) {
      animateMaker({ config , pages, currentPage})
    }

    if (!isSame) {
      onPageChanged.call(0, eventEmitter.change[0]);
    }

    paginate(currentPage);
  }

  /**
   * Remove all exist event listener
   */
  function destroy() {
    window.removeEventListener('touchend', onInteractionStopInternal);
    window.removeEventListener('touchmove', onInteractInternal);
    window.removeEventListener('touchstart', onInteractionStartInternal);

    window.removeEventListener('mousedown', onInteractionStartInternal);
    window.removeEventListener('mouseup', onInteractionStopInternal);
    window.removeEventListener('mousemove', onInteractInternal);

    window.removeEventListener('resize', onResizeInternal);
    document.removeEventListener('wheel', onInputInternal);
    document.removeEventListener('keydown', onInputInternal);
    destroyPaginate();
  }

  function onInteractionBase(fn: InteractEvents, emitter: Array<InteractEvents> ) {
    if (emitter) {
      for (const event of emitter) {
        event(makeEventPayload());
      }
    }

    if (fn && !emitter.includes(fn)) {
      emitter.push(fn);
    }
  }

  function onInteractionStart(fn: InteractionStartEvent) {
    onInteractionBase(fn, eventEmitter.start);
  }

  function onInteractionStop(fn: InteractionStopEvent) {
    onInteractionBase(fn, eventEmitter.stop);
  }

  function onInteract(fn: InteractEvent) {
    onInteractionBase(fn, eventEmitter.interact);
  }

  function onPageChanged(fn: PageChangeEvent) {
    onInteractionBase(fn, eventEmitter.change);
  }

  return { changePage, destroy, onPaginate: onPaginateInternal, onInteractionStart, onInteractionStop, onInteract, onPageChanged };
}

