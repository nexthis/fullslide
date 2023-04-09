
import { gsap } from "gsap";
import Paginate from "./paginate";
import { clamp, debounce, throttle } from "./utils";



type InteractionStopEvent = () => void
type InteractionStartEvent = () => void
type InteractEvent = () => void

interface Point {
  x: number;
  y: number;
}

interface EventEmitter {
  interact: InteractionStopEvent | null, 
  start: InteractionStartEvent | null, 
  stop: InteractEvent | null, 
}


export default function () {

  const { onPaginate, paginate, destroy: destroyPaginate } = Paginate();

  const fullslide = document.querySelector<HTMLDialogElement>(".fullslide")!;
  const pages = document.querySelectorAll<HTMLDialogElement>(".fullslide__page")!;

  let block = false;
  let currentPage = 0;
  let maxPage = pages.length - 1;
  const startPoint: Point = { x: 0, y: 0 };
  const lastPoint: Point = { x: 0, y: 0 };
  const eventEmitter: EventEmitter = {interact: null, start: null, stop: null};

  const onInteractionStopInternal = (e: MouseEvent | TouchEvent) => {
    const [x, y] =
      e instanceof MouseEvent
        ? [e.clientX, e.clientY]
        : [e.touches[0].clientX, e.touches[0].clientY];

    const point: Point = { x, y };

    startPoint.x = point.x;
    startPoint.y = point.y;

    lastPoint.x = point.x;
    lastPoint.y = point.y;
  };

  const onInteractionStartInternal = () => {
    block = false;
    changePage(currentPage);

    onInteractionStart.call(null, eventEmitter.start)
  };

  const onInteractInternal = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.buttons !== 1) {
      return;
    }

    const [x, y] =
      e instanceof MouseEvent
        ? [e.clientX, e.clientY]
        : [e.touches[0].clientX, e.touches[0].clientY];
    const point: Point = { x, y };
    calculate(point);
  };

  const onWheelInternal = debounce((e: WheelEvent) => {
    const delta = Math.sign(e.deltaY);
    changePage(delta, true);
  }, 50);

  const onResizeInternal = debounce(() => {
    fullslide.style.height = `${window.innerHeight}px`;
    fullslide.style.width = `${window.innerWidth}px`;
  }, 100);

  window.addEventListener("touchend", onInteractionStartInternal);
  window.addEventListener("touchmove", onInteractInternal);
  window.addEventListener("touchstart", onInteractionStopInternal);

  window.addEventListener("mousedown", onInteractionStopInternal);
  window.addEventListener("mouseup", onInteractionStartInternal);
  window.addEventListener("mousemove", onInteractInternal);

  window.addEventListener("resize", onResizeInternal);
  document.addEventListener("wheel", onWheelInternal);
  onResizeInternal()

  function calculate(point: Point) {
    if (block) {
      return;
    }

    const distance = point.y - startPoint.y;

    gsap.set(pages, {
      transform: `translate(0, ${
        distance + -(window.innerHeight * currentPage)
      }px)`,
    });

    if (Math.round((Math.abs(distance) / window.innerHeight) * 100) >= 30) {
      changePage(distance > 0 ? -1 : 1, true);
      block = true;
    }

    lastPoint.x = point.x;
    lastPoint.y = point.y;
  }

  function changePage(page: number, relative: boolean = false) {
    if (relative) {
      currentPage = clamp(currentPage + page, 0, maxPage);
    } else {
      currentPage = clamp(page, 0, maxPage);
    }

    gsap.to(pages, {
      transform: `translate(0, -${window.innerHeight * currentPage}px)`,
    });
    paginate(currentPage);
  }

  function destroy() {
    window.removeEventListener("touchend", onInteractionStartInternal);
    window.removeEventListener("touchmove", onInteractInternal);
    window.removeEventListener("touchstart", onInteractionStopInternal);

    window.removeEventListener("mousedown", onInteractionStopInternal);
    window.removeEventListener("mouseup", onInteractionStartInternal);
    window.removeEventListener("mousemove", onInteractInternal);

    window.removeEventListener("resize", onResizeInternal);
    document.removeEventListener("wheel", onWheelInternal);
    destroyPaginate()
  }

  onPaginate((page) => {
    changePage(page)
    console.log(page);
    
  });


  function onInteractionStart(fn: InteractionStartEvent | null) {
    if(eventEmitter.start){
      eventEmitter.start()
    }

    eventEmitter.start = fn;
  }

  return {onPaginate, changePage, destroy, onInteractionStart}
}
