import { listHandler } from "../js/cartContainer/cartHandler.mjs"
import { api } from "../js/handling/api.mjs"
import { getUrlParam } from "../js/handling/global.mjs"
import { lsList } from "../js/handling/lists.mjs"
import { productPageHtml } from "./template.mjs"
import Modal from "../js/handling/modal.mjs"
import { windowHandling } from "../js/handling/globalListeners.mjs"

export default class ProductPage {
  constructor(place){
    this.details = {
      'place': place,
      'mainContainer':document.getElementById(place)
    }
    this.modal = new Modal()
    this.update()
  }
  async update(){
    const save = await lsList.get('speedLoad')
    this.details.id = await getUrlParam('id')
    if(save && save.id === Number(this.details.id)){
      console.log('speedload found')
      this.details.product = save
    }else{
      this.details.product = await api.call(this.details,this.details.id)
    }
    this.details.mainContainer.innerHTML = await productPageHtml.getTemplate(this.details.product)
    this.addFunctions(this.details)
    listHandler.checkCTA()
  }
  addFunctions({mainContainer,product}){
    const buyButton = mainContainer.querySelector('#cart'+product.id)
    buyButton.addEventListener('click',()=>listHandler.toggleCart(product,'cart'))
    const favsButton = mainContainer.querySelector('#favs'+product.id)
    favsButton.addEventListener('click',()=>listHandler.toggleCart(product,'favs'))
    if(windowHandling.mobileMode){
      this.addMobileGallery(product)
    }else{
      this.modal.addModalClick()
    }
  }
  addMobileGallery(product){
      const galleryContainer = document.getElementById("gallery-container");
      const galleryButton = document.querySelector('.gallery-button')
      let html = ""
      product.images.forEach(image => {
        html+=  `<image class="gallery-image" src="${image.src}">`;
      });
      galleryContainer.innerHTML=html
      let compareY = 0
      console.group(galleryContainer.clientHeight)
      galleryContainer.classList.add("hide-gallery");
      galleryButton.addEventListener('click',()=>{
        galleryContainer.classList.remove("hide-gallery")
        galleryContainer.scrollIntoView({
          behavior: 'smooth'
        });
        compareY=galleryContainer.clientHeight
        window.addEventListener('scroll', scrollListener);
      });

      const scrollListener = function() {
      var scrollY = window.scrollY;
      if (scrollY > compareY+100) {
        galleryContainer.classList.add("hide-gallery");
        removeScrollListener(scrollListener); 
      }
    };
    function removeScrollListener(scrollListener) {
        window.removeEventListener('scroll', scrollListener);
    }
  }
}
