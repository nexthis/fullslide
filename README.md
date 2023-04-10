# FullSlide

FullSlide is a lightweight and easy-to-use JavaScript library that allows you to create full-screen scrolling websites with ease.
The library provides a simple and intuitive API that enables you to customize your website's scrolling behavior and create stunning effects,
such as parallax scrolling, horizontal and vertical scrolling, and more!

## Installation

It's nothing special just ⌨️ \
`npm install fullslide`

## Documentation

**example**: https://codesandbox.io/s/fullslide-ml7osr?file=/src/index.ts

FullSlide Config

```js
FullSlide({
  animated: true, // When true, animation not trigger. you can do your own 🔥
  triggerDistance: 30, // distance in % when changePage and animation trigger
  fixMobileBare: true, // Add class in html and body to helps support mobile device 
});
```

How to use

```js
import './styles/style.scss';
import FullSlide from '.';

const { onPaginate, onInteractionStart, onInteractionStop, onInteract, onPageChanged, changePage } = FullSlide();

onInteractionStart((e) => {
  e.current; // Current page (HTML Element)
  e.next; // Next page - in some case may be the same as current  (HTML Element)
  e.pages; // Array of all pages
  e.distance; // Distance from start position to current position
  e.percentage; // Distance in %

  // Every event has the same payload
  console.log('onInteractionStart', e); //Fired when user start "scrolling"
});

onInteractionStop((e) => {
  console.log('onInteractionStop', e); //Fired when user stop "scrolling"
});

onInteract((e) => {
  console.log('onInteract', e); //Fired when user in "scrolling"
});

onPageChanged((e) => {
  console.log('onPageChanged', e); //Fired when page finally changed
});

onPaginate((page) => {
  console.log('onPaginate', page); //Fired when user use pagination
});

changePage(2); // Manually change page, remember first page = 0

//destroy() // Remove all EventListener/variable -> Helpful when you need detach FullSlide
```
