import { addImage } from "../reading/images.mjs";
import { getAttribute } from "../reading/attributes.mjs";

export const cartTemplate = {
  main({id,images,regular_price,name},quantity){
    return`
      <section id="product-${id}" class="flex-column cart-element">
        <div class="top-part flex-row">
          <div class="flex-column">
              <a href="/productPage.html?id=${id}">
                  ${addImage(images,0,"src")}
              </a>
          </div>
          <div class="flex-column">
            <span class="name">${name}</span>
<span class="quantity">${quantity} copy</span>
            <div class="flex-row">
              
              <span class="price">${regular_price}</span>
              <span class="currency">kr</span>
            </div>
          </div>
        </div>
        <div class="bottom-part flex-row">

        </div>
      </section>
    `
  },
  accessorie({id,images,regular_price,name}){return`
    <div id="product-${id}" class="small-list accessorie flex-column align-top cart-element shaded">
      <a class="image-container" href="../page_product/index.html?id=${id}">
        <div class="image contain-image" style="background-image: url('${images[0].src}')">
        </div>
      </a>
      <span class="name">${name}</span>
      <div class="flex-row">
        <span class="price">${regular_price}</span>
        <span class="currency">kr</span>
      </div>
      <button class="addToCart">Add to cart</button>
    </div>
  `
  },
  sleeves({id,name},quantity){
    return`
      <div id="product-${id}" class="small-list sleeve-list flex-column align">
       <a href="../page_product/index.html?id=${id}">
          <span class="name">${name}</span>
          <span class="quentityNeeded"></span>
        </a>

      </div>
    `
  },

}
function cartContentTemplate({images,regular_price,name,id},quantity){
  return`
    <section class="flex-column cart-element">
      <div class="flex-row">
        <div class="flex-column">
            <a href="../page_product.html?id=${id}">
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