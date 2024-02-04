async function infoPageRender(place){
  const id=getUrlId()
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
    //addChilds(place,addAttributes("child",element))
    function renderPage(){
      container.innerHTML=`${template}`;
      updateTracker()
      if(window.innerWidth>900){
        const imagesAll = document.querySelectorAll(".image")
        addModalClick(imagesAll)
      }else{
        const galleryButton = document.querySelector(".gallery-button");
        const descriptionBlock = document.getElementById('block')
        if(galleryButton){
          createGallery(galleryButton,element.images)
        }
        descriptionBlock.addEventListener('click',()=>toggleOverflow())
      }
    }    
  }
}
function toggleOverflow(){
  const descriptionBlock = document.getElementById('description')
  descriptionBlock.classList.toggle('hide')
}
// Define scrollListener outside of createGallery
function scrollListener(compareY, gallery) {
    return function() {
        var scrollY = window.scrollY;
        console.log(scrollY, compareY);
        if (scrollY > compareY) {
            gallery.classList.add("hide-gallery");
            removeScrollListener(scrollListener);
        }
    }
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
