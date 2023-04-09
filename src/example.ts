import './styles/style.scss';
import FullSlide from '.';

const { onPaginate, onInteractionStart, onInteractionStop, onInteract, onPageChanged, changePage } = FullSlide();



onInteractionStart((e) => {
 e.current // Current page (HTML Element)
 e.next // Next page - in some case may be the same as current  (HTML Element)
 e.pages // Array of all pages 
 e.distance // Distance from start position to current position
 e.percentage // Distance in %
 // Every event has the same payload
 console.log('onInteractionStart', e); //Fired when user start "scrolling"
});

onInteractionStop((e) => {
  console.log('onInteractionStop', e); //Fired when user stop "scrolling"
})

onInteract((e) => {
  console.log("onInteract", e); //Fired when user in "scrolling"
})

onPageChanged((e) => {
  console.log("onPageChanged",e); //Fired when page finally changed 
  
})

onPaginate((page) => {
  console.log("onPaginate", page); //Fired when user use pagination
});

changePage(2) // Manually change page, remember first page = 0

//destroy() // Remove all EventListener/variable -> Helpful when you need detach FullSlide