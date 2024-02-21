let showNumber = 0;
export function checkSlider(id,maxElements,slideJump) {

  if(!slideJump){slideJump=1;}
  let sliderItems;

  sliderItems = document.querySelectorAll(`#${id} .card`);
  document.querySelector(`#${id} .left-slider`).addEventListener("click", () => {
    event.target.disabled=true;
    updateSlider(-slideJump, sliderItems,maxElements)
    event.target.disabled=false;
  });
  document.querySelector(`#${id} .right-slider`).addEventListener("click", () => {
    event.target.disabled=true;
    updateSlider(slideJump, sliderItems,maxElements)
    event.target.disabled=false;
  });
  
  updateSlider(0, sliderItems,maxElements)
}
export function updateSlider(adjust, items,maxElements) {
  const realQuantiy = items.length-maxElements;
  let count = 0;

  let maxShow = maxElements;



  showNumber += adjust;
  if(showNumber<0){
    showNumber += realQuantiy
  }
  if(showNumber>=realQuantiy){
    showNumber-=realQuantiy;
  }


  for (let i = 0; i < items.length; i++) {
    items[i].classList.add("hidden-slider");
    if(i > showNumber-1 && count<maxShow){
        items[i].classList.remove("hidden-slider");
        
        count++
    }
  }   
  
}
