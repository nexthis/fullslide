declare type InteractionStopEvent = (event: EventPayload) => void;
declare type InteractionStartEvent = (event: EventPayload) => void;
declare type InteractEvent = (event: EventPayload) => void;
declare type PageChangeEvent = (event: EventPayload) => void;

declare type InteractEvents = InteractionStopEvent | InteractionStartEvent | InteractEvent | PageChangeEvent

declare interface Point {
  x: number;
  y: number;
}

declare interface EventEmitter {
  interact: Array<InteractionStopEvent>;
  start: Array<InteractionStartEvent>;
  stop: Array<InteractEvent>;
  change: Array<PageChangeEvent>;
}

declare interface EventPayload {
  current: Element;
  next: Element;
  pages: Element[];
  page: number;
  distance: number;
  percentage: number;
}

declare interface Config {
  animated: boolean;
  horizontal: boolean,
  triggerDistance: number;
  fixMobileBare: boolean;
  animationType: "base" | "hidden",
}

declare interface State extends Config{
  block: boolean;
  currentPage: number;
  maxPage: number;
  startPoint: Point;
  lastPoint: Point;
  eventEmitter: EventEmitter ;
}