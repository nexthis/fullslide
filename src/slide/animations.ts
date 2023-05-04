import { easeOutBounce } from '@/utils';
import { animate } from 'motion';


interface AnimateMakerProps {
    config: Config;
    pages: Array<HTMLElement>;
    currentPage: number;
}

export function animateMaker({config, pages, currentPage}: AnimateMakerProps ) {
    const animations: {[key in Config["animationType"] ]: (data: AnimateMakerProps) => void} = {
        base: animateBase,
        hidden: animateHidden,
    }

    animations[config.animationType]({config, pages, currentPage})
}


function animateBase ({ pages, currentPage}: AnimateMakerProps) { 
    animate(
        pages,
        { transform: `translate(0, -${window.innerHeight * currentPage}px)` },
        { easing: 'ease', duration: 0.3 },
      );
}

async function animateHidden ({ pages, currentPage}: AnimateMakerProps) { 

    await animate(
        pages,
        { opacity: 0 },
        { easing: "ease", duration: 0.4},
    ).finished;

    for (const page of pages) {
        page.style.transform = `translate(0, -${window.innerHeight * currentPage}px)`
    }
    animate(
        pages,
        { opacity: 1 },
        { easing: "ease", duration: 0.4},
    );
}