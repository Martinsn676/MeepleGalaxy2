function addModalClick(item){ 
  item.forEach(element => {
    element.addEventListener("click", (element)=>{
      displayModal(element)
    });
  });
}
function displayModal(element){

const modal = document.querySelector("#modal-container");

  if(modal){
    modal.addEventListener("click",()=>modal.classList.add("hide-modal"));
    document.querySelector("#modal-image").innerHTML=`${element.target.outerHTML}`
    modal.classList.remove("hide-modal")
    
  }else{
        console.warn("no modal")
    }
}

export{addModalClick,displayModal}