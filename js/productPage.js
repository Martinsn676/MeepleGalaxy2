async function infoPageRender(place){
  const id=getUrlId()
  let element;
  let template;
  let speedLoadElement = []
  speedLoadElement = await JSON.parse(localStorage.getItem('speedLoad'))
  document.querySelector(`#${place}`).classList.add("info-page")
  if(speedLoadElement && id===speedLoadElement.id){
    console.log('speedLoad')
    element = speedLoadElement
  }else{
      element = await getApi(productsUrl+"/"+id);
  }
  if(element){
    document.title+=" - "+element.name
    template = productPageTemplate(element);
    renderPage(place,template)
    //addChilds(place,addAttributes("child",element))
    function renderPage(place,template){
      document.querySelector(`#${place}`).innerHTML=`${template}`;
      updateTracker()
      const imagesAll = document.querySelectorAll(".image")
      createGallery(element.images)

    }    
  }


      // opacityBlur = document.querySelector(".opacityBlur")
      //   if(opacityBlur){opacityBlur.addEventListener("click",()=>toggleText())}
}

function createGallery(images){
  let html = ""
  images.forEach(element => {
    html += `<image src="${element.src}">`
  });
  const modal = document.querySelector("#modal-container")

  const galleryButton = document.querySelector(".gallery-button")
  let checkHeight = getElementYPosition(galleryButton);
  
  modal.innerHTML=html
  modal.classList.add("hide-gallery")

  galleryButton.addEventListener("click",()=>{
    modal.scrollIntoView({
          behavior: 'smooth'
        });
    modal.classList.remove("hide-gallery")
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;
      if(scrollY>checkHeight+window.innerHeight*2){
        modal.classList.add("hide-gallery")
      }
    });
  });
}
