import { addImage } from "./images.mjs"
import { addAttributes } from "../handling/attributes.mjs";

function cartContentTemplate({images,regular_price,name,id},quantity){
  return`
    <section class="flex-column cart-element">
      <div class="flex-row">
        <div class="flex-column">
            <a href="/productPage.html?id=${id}">
                ${addImage(images,0,"src")}
            </a>
        </div>
        <div class="flex-column">
          <span class="name">${name}</span>
          <span class="price">${quantity} x ${regular_price}kr</span>
        </div>
      </div>
    </section>
  `
}
function sleeveContentTemplate(element,quantity){return`
  <div class="small-list sleeve-list flex-column align">
    <a href="productPage.html?id=${element.id}">
        <div class="image contain-image" style="background-image: url('${element.images[0].src}')">
        </div>
    </a>
    <span class="name">${element.name}</span>
    <span class="name">${quantity} cards</span>
  </div>
`
}
function accessorieContentTemplate(element,cartStatus){
  if(cartStatus){
    classes=""
    buttonText="Remove"
  }else{
    classes="notInCart"
    buttonText="Add"
  }
  return`
  <div class="small-list accessorie-list flex-column align-top">
    <a class="${classes}" href="productPage.html?id=${element.id}">
      <div class="image contain-image" style="background-image: url('${element.images[0].src}')">
      </div>
    </a>

    <span class="name">${element.name}</span>
    <span class="name">${element.regular_price} kr</span>
    <button onclick="cartChange(${element.id})">${buttonText}</button>
    <div>${addSleeveButtons(addAttributes("sleeves",element),element.id)}</div>
  </div>
`
}

export {sleeveContentTemplate,accessorieContentTemplate,cartContentTemplate}