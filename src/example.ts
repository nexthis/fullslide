import "./styles/style.scss";
import FullSlide from "./main"


const { changePage, onPaginate, destroy, onInteractionStart } = FullSlide()


onInteractionStart(() => {
    console.log("asdasd");
    
})


onPaginate((page) => {
    console.log(page);
    
})