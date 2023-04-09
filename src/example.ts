import './styles/style.scss';
import FullSlide from '.';

const { onPaginate, onInteractionStart } = FullSlide();

onInteractionStart(() => {
  console.log('asdasd');
});

onPaginate((page) => {
  console.log(page);
});
