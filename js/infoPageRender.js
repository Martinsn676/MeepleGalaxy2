async function infoPageRender(place){
  const id=getUrlId()
  let element;
  let template;
  let speedLoadElement = []
  speedLoadElement = await JSON.parse(localStorage.getItem('speedLoad'))
  document.querySelector(`#${place}`).classList.add("info-page")
  console.log(speedLoadElement.id,id)
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



    function renderPage(place,template){
      document.querySelector(`#${place}`).innerHTML=`${template}`;
      updateTracker()
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

