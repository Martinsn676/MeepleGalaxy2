async function infoPageRender(place){
  const id=getUrlId()
  let element;
  let template;
  
  let speedLoadElement = []
  speedLoadElement = await JSON.parse(localStorage.getItem('speedLoad'))
  document.querySelector(`#${place}`).classList.add("info-page")
  if(speedLoadElement && id===JSON.stringify(speedLoadElement.id)){
    console.log('speedLoad')
    element = speedLoadElement
  }else{
      element = await getApi(productsUrl+"/"+id);
  }
  if(element){
    template = productPageTemplate(element);
    renderPage(place,template)

    function renderPage(place,template){
      document.querySelector(`#${place}`).innerHTML=`${template}`;
      updateTracker('cart')
      updateTracker('favs')

      addModalClick(document.querySelectorAll(".image"))

      const imagesAll = document.querySelectorAll("img")
      if(imagesAll){
        addModalClick(imagesAll,"img")
        imagesAll.forEach(element => {
          element.onerror = function() {
            console.log("Error loading image:", element.src);
            element.style.display="none"
          };
        });
      }
    }    
  }


      // opacityBlur = document.querySelector(".opacityBlur")
      //   if(opacityBlur){opacityBlur.addEventListener("click",()=>toggleText())}
}

function getUrlId(){
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  return id
}