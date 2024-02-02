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
      }
      
      const galleryButton = document.querySelector(".gallery-button");
      if(galleryButton){
        createGallery(galleryButton,element.images)
      }
    

    }    
  }


      // opacityBlur = document.querySelector(".opacityBlur")
      //   if(opacityBlur){opacityBlur.addEventListener("click",()=>toggleText())}
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
    let html = "";
    images.forEach(element => {
        html += `<image class="gallery-image" src="${element.src}">`;
    });

    const gallery = document.querySelector("#gallery-container");

    gallery.innerHTML = html;

  const rect = galleryButton.getBoundingClientRect();
  const compareY = rect.top 
    // Define the scrollListener function
    const scrollListener = function() {
      var scrollY = window.scrollY;
      console.log(scrollY, compareY);
      if (scrollY > compareY) {
        //const scrollPosition = window.scrollY;
        gallery.classList.add("hide-gallery");
        //window.scrollTo(0, scrollPosition);
        removeScrollListener(scrollListener); // Pass the function reference
      }
    };
    gallery.classList.add("hide-gallery");

    galleryButton.addEventListener("click", () => {
        gallery.scrollIntoView({
            behavior: 'smooth'
        });
        gallery.classList.remove("hide-gallery");
        window.addEventListener('scroll', scrollListener); // Add the scroll listener
    });

    // Function to remove the event listener
    function removeScrollListener(scrollListener) {
        window.removeEventListener('scroll', scrollListener); // Remove the scroll listener
    }
}
