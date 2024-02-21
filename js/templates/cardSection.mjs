import { selectSort, renderElements } from "../handling/addElemenst.mjs"
import { list } from "../handling/lists.mjs"
import { api } from "../handling/api.mjs"

export function cardSection(functionLog){
  return `
    <div id="topLine">
      <div class="flex-cloumn"> 
          <h2>${functionLog[1]}</h2>
      </div>
      <div id="sortButtonsID" class="sort-buttons">
      </div>
    </div>
    <section id='elements-container' class='flex-row flex-wrap'>
    </section>
    <div id="bottomLine">
        <div id="showingInfo">
        </div>
        <div id="loadMoreContainer" class="full-width align-column flex-column">
        </div>  
    </div>
  `
}

export function sliderButtonsTemplate(){return`
    <button class="left-slider slider-buttons"></button>
    <button class="right-slider slider-buttons"></button>
  `
}
export const sortObject = {
  'titleAsc':['orderby=title&order=asc','title-az','Title Az'],
  'titleDesc':['orderby=title&order=desc','title-za','Title Za'],
  'dateAsc':['orderby=date&order=asc','title-oldest','Oldest'],
  'dateDesc':['orderby=date&order=desc','title-newest','Newest'],
  setup(){
    this.standardSort=this.titleAsc
    this.sortOptions = [this.titleAsc,this.titleDesc,this.dateAsc,this.dateDesc]
  },
  addButtons(container, log){
    const sortDetails = this.sortOptions
    sortDetails.forEach(sort => {
      const button = document.createElement('button');
      button.type = "button";
      button.classList.add("bordered","sort-button");
      button.textContent = sort[2];
      button.id = sort[1];
      button.disabled = true;
      button.addEventListener('click', () => sortObject.changeSort(log,sort));
      container.querySelector("#sortButtonsID").appendChild(button);
    })
  },
  async changeSort({displayQuantity,endURl,headline,place,container,mainContainer},newSort){
    endURl.push(newSort[0])
console.log(newSort)
    const scrollPosition = window.scrollY;
      const oldCall = await list.get(place+newSort[1])
selectSort(mainContainer,newSort[1])
    let elements = []
    if(oldCall){
        elements = oldCall
    }else{
        elements = await api.call(displayQuantity,endURl,headline);
    }
    list.save(place+newSort[1],elements)
    container.innerHTML = ""
    renderElements(elements,displayQuantity,container)
    window.scrollTo(0, scrollPosition);
  }
}
sortObject.setup()