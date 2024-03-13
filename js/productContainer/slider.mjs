let showNumber = 0;

export const sliderHandler ={
  checkSlider(){

  },
  template(){return`
    <button class="left-slider slider-buttons"></button>
    <button class="right-slider slider-buttons"></button>
  `
  },
  shift({mainContainer,initDisplay},move){
    const products = mainContainer.querySelectorAll('.product-card')
    const countBreak = move<0 ? move*-1 : move
    let count = 0
    let skipped = 0
    let waiting = true
    let lastHiddenIndex
    for(const product of products){
      if(waiting){
        if(!product.classList.contains(('hidden-product'))){
          waiting=false
          lastHiddenIndex = skipped
        }else{
          skipped++
          continue
        }
      }
      if(move>0 && product.classList.contains('hidden-product')){
        product.classList.remove('hidden-product')
        products[lastHiddenIndex+count].classList.add('hidden-product')        
        count++
      }
      if(move<0 && products[lastHiddenIndex-count-1]){
        products[lastHiddenIndex-count-1].classList.remove('hidden-product')
        products[lastHiddenIndex-count-1+initDisplay].classList.add('hidden-product')
        count++
      }
      if(count>=countBreak){
        break;
      }
    }
  }
}
