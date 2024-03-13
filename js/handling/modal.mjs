export default class Modal {
  constructor(){
    this.container = document.querySelector("#modal-container");
    if(!this.container){
      console.warn("no modal")
      return
    }
    this.container.innerHTML = `        
      <div id="modal-background"></div>
      <div id="modal-image"></div>`
    console.log(this.container)
    this.productArea = document.getElementById('productArea')
    this.imageContainer = document.querySelector("#modal-image")
  }
  addModalClick(){ 
    const allImages = this.productArea.querySelectorAll('img')
    allImages.forEach(image => {
      image.addEventListener("click", (image)=>{ 
        this.displayModal(image,image.srcElement.naturalWidth)
      });
    });
  }
  displayModal(element,width){
    if(this.container){
      this.container.addEventListener("click",()=>this.container.classList.add("hide-modal"));
      this.imageContainer.innerHTML=`${element.target.outerHTML}`
      this.imageContainer.querySelector('img').style.width=`${width}px`
      this.container.classList.remove("hide-modal")
    }else{
          
      }
  }
}
