import { gsap } from 'gsap';

type Position = 'horizontal' | 'vertical';
type PaginateEvent = (value: number) => void;

export default function () {
  const items = document.querySelectorAll('.indicator__item')!;
  const cursor = document.querySelector('.indicator__cursor')!;
  const indicator = document.querySelector('.indicator')!;
  const pagination = document.querySelector('.pagination')!;
  const currentCounter = document.querySelector('.pagination__current')!;
  const totalCounter = document.querySelector('.pagination__total')!;

  let index = 0;
  const onPaginateEvent: Array<PaginateEvent> = [];
  const total = items.length;

  const config = {
    horizontalClass: 'pagination--horizontal',
  };

  const onClick = (e: Event) => {
    const target = e.target as HTMLUListElement;
    const value = parseInt(target.dataset.index!, 10);
    paginate(value);
    onPaginate.call(null, onPaginateEvent[0]);
  };

  updateCounter();
  indicator.addEventListener('click', onClick);

  function paginate(value: number) {
    const firstItem = items[0];
    const defaultCursorSize = firstItem.clientHeight * 1.5;
    const itemSize = firstItem.clientHeight + firstItem.clientHeight / 1.8;
    const space = Math.abs(index - value) + 1;
    const direction = value - index;
    const mode = pagination.classList.contains(config.horizontalClass);
    const cursorSize = itemSize * space;
    const tl = gsap.timeline();

    // Avoiding bug when user click in the same position
    if (index === value) {
      return;
    }

    if (direction > 0) {
      tl.to(cursor, 0.2, {
        [mode ? 'width' : 'height']: cursorSize,
        borderRadius: `${cursorSize / 2}px`,
      }).to(cursor, 0.2, {
        [mode ? 'x' : 'y']: value * itemSize,
        [mode ? 'width' : 'height']: defaultCursorSize,
      });
    } else {
      tl.to(cursor, 0.2, {
        [mode ? 'x' : 'y']: value * itemSize,
        [mode ? 'width' : 'height']: cursorSize,
        borderRadius: `${cursorSize / 2}px`,
      }).to(cursor, 0.2, {
        [mode ? 'x' : 'y']: value * itemSize,
        [mode ? 'width' : 'height']: defaultCursorSize,
      });
    }

    index = value;
    updateCounter();
  }

  function onPaginate(fn: PaginateEvent) {
    if (onPaginateEvent) {
      for (const event of onPaginateEvent) {
        event(index);
      }
    }

    if (!onPaginateEvent.includes(fn)) {
      onPaginateEvent.push(fn);
    }
  }

  function changePosition(position: Position) {
    if (position === 'vertical') {
      pagination.classList.remove(config.horizontalClass);
      return;
    }

    pagination.classList.add(config.horizontalClass);
  }

  function updateCounter() {
    currentCounter.innerHTML = (index + 1).toString();
    totalCounter.innerHTML = total.toString();
  }

  function destroy() {
    indicator.removeEventListener('click', onClick);
  }

  return { paginate, onPaginate, changePosition, destroy };
}
