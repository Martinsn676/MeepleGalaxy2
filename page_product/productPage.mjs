
import { productPageTemplate,productPageTemplatePC } from "./template.mjs";
import { toggleList,updateTracker } from "../js/handling/lists.mjs";
import { addModalClick } from "../js/handling/modal.mjs";


async function infoPageRender(place,id){

  let element;
  let template;
  let speedLoadElement = []
  speedLoadElement = await JSON.parse(localStorage.getItem('speedLoad'))
  const container = document.querySelector(`#${place}`)
  
  if(speedLoadElement && id===speedLoadElement.id){
    console.log('speedLoad')
    element = speedLoadElement
  }else{
      element = await getApi(productsUrl+"/"+id);
  }
  if(element){
    document.title+=" - "+element.name
    if(window.innerWidth>900){
      template = productPageTemplatePC(element);
      container.classList.add("pc")
    }else{
      template = productPageTemplate(element);
      container.classList.add("mobile")
    }
    
    renderPage()

    function renderPage(){
      container.innerHTML = `${template}`;


      const buyButton = document.getElementById("addToCartButton");
      const favButton = document.getElementById("addToFavsButton"); 
      buyButton.addEventListener('click', () => toggleList(element.id,'cart',0));
      favButton.addEventListener('click', () => toggleList(element.id,'favs',0));
      updateTracker()
      if(window.innerWidth>900){
        const imagesAll = document.querySelectorAll(".image")
        addModalClick(imagesAll)
      }else{
        const galleryButton = document.querySelector(".gallery-button");
        const descriptionBlock = document.getElementById('block')
        const description = document.getElementById('description')
        if(galleryButton){
          createGallery(galleryButton,element.images)
        }
        if(description.offsetHeight>250){
          description.classList.add('hide')
          descriptionBlock.addEventListener('click',()=>toggleOverflow())
        }
      }
    }
  }
}
function toggleOverflow(){
  const descriptionBlock = document.getElementById('description')
  descriptionBlock.classList.toggle('hide')
}

function createGallery(galleryButton,images) {
  let compareY = 0
  let html = "";
  images.forEach(element => {
      html += `<image class="gallery-image" src="${element.src}">`;
  });

  const gallery = document.querySelector("#gallery-container");
  gallery.innerHTML = html;

  setTimeout(function() {
    const gallery = document.querySelector("#gallery-container");
    compareY  = gallery.offsetHeight+55;
    console.log("Gallery height:", compareY);
    gallery.classList.add("hide-gallery");
    galleryButton.addEventListener("click", () => {
      gallery.scrollIntoView({
          behavior: 'smooth'
      });
      gallery.classList.remove("hide-gallery");
      window.addEventListener('scroll', scrollListener);
    });
    const scrollListener = function() {
      var scrollY = window.scrollY;
      console.log(scrollY,compareY)
      if (scrollY > compareY) {
        gallery.classList.add("hide-gallery");
        removeScrollListener(scrollListener); 
      }
    };
    function removeScrollListener(scrollListener) {
        window.removeEventListener('scroll', scrollListener);
    }
  }, 0);
}


export {infoPageRender}