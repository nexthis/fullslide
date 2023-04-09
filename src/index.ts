import { gsap } from 'gsap';
import Paginate from './paginate';
import { clamp, debounce, throttle } from './utils';

type InteractionStopEvent = (event: EventPayload) => void;
type InteractionStartEvent = (event: EventPayload) => void;
type InteractEvent = (event: EventPayload) => void;
type PageChangeEvent = (event: EventPayload) => void;

interface Point {
  x: number;
  y: number;
}

interface EventEmitter {
  interact: Array<InteractionStopEvent>;
  start: Array<InteractionStartEvent>;
  stop: Array<InteractEvent>;
  change: Array<PageChangeEvent>
}

interface EventPayload {
  current: Element,
  next: Element,
  pages: Element[],
  page: number,
  distance: number,
  percentage: number,
}

interface Config {
  animated: boolean,
  triggerDistance: number,
}


const defaultConfig: Config = {
  animated: true,
  triggerDistance: 30
}


export default function (config: Config = defaultConfig) {
  const { onPaginate, paginate, destroy: destroyPaginate } = Paginate();


  const fullslide = document.querySelector<HTMLDialogElement>('.fullslide')!;
  const pages = document.querySelectorAll<HTMLDialogElement>('.fullslide__page')!;

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

  const onWheelInternal = debounce((e: WheelEvent) => {
    onInteractionStart.call(null, eventEmitter.start[0]);

    const delta = Math.sign(e.deltaY);
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
  document.addEventListener('wheel', onWheelInternal);
  onResizeInternal();

  function calculate(point: Point) {
    if (block) {
      return;
    }

    const distance = point.y - startPoint.y;

    gsap.set(pages, {
      transform: `translate(0, ${distance + -(window.innerHeight * currentPage)}px)`,
    });

    if (Math.round((Math.abs(distance) / window.innerHeight) * 100) >= config.triggerDistance) {
      changePage(distance > 0 ? -1 : 1, true);
      block = true;
    }

    onInteract.call(null, eventEmitter.interact[0]);
    lastPoint.x = point.x;
    lastPoint.y = point.y;
  }


  function makeEventPayload(): EventPayload{
    const delta = Math.sign(lastPoint.y - startPoint.y);
    
    return {
      pages: Array.from(pages) ,
      current: pages[currentPage],
      next: pages[clamp(currentPage - delta, 0, maxPage)],
      page: currentPage,
      distance: lastPoint.y - startPoint.y,
      percentage: Math.round((Math.abs(lastPoint.y) / window.innerHeight) * 100)
    }
  }

  onPaginate((page) => {
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

    if(config.animated){
      gsap.to(pages, {
        transform: `translate(0, -${window.innerHeight * currentPage}px)`
      });
    }

    if(!isSame){
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
    document.removeEventListener('wheel', onWheelInternal);
    destroyPaginate();
  }

  function onInteractionStart(fn: InteractionStartEvent) {
    if (eventEmitter.start) {
      for (const event of eventEmitter.start) {
        event(makeEventPayload());
      }
    }

    if (fn && !eventEmitter.start.includes(fn)) {
      eventEmitter.start.push(fn);
    }
  }

  function onInteractionStop(fn: InteractionStopEvent) {

    if (eventEmitter.stop) {
      for (const event of eventEmitter.stop) {
        event(makeEventPayload());
      }
    }

    if (fn && !eventEmitter.stop.includes(fn)) {
      eventEmitter.stop.push(fn);
    }
  }

  function onInteract(fn: InteractEvent) {
    if (eventEmitter.interact) {
      for (const event of eventEmitter.interact) {
        event(makeEventPayload());
      }
    }

    if (fn &&  !eventEmitter.interact.includes(fn)) {
      eventEmitter.interact.push(fn);
    }
  }

  function onPageChanged(fn: PageChangeEvent) {
    if (eventEmitter.change) {
      for (const event of eventEmitter.change) {
        event(makeEventPayload());
      }
    }

    if (fn && !eventEmitter.change.includes(fn)) {
      eventEmitter.change.push(fn);
    }
  }

  return { changePage, destroy, onPaginate, onInteractionStart, onInteractionStop, onInteract, onPageChanged };
}
