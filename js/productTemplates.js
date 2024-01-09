/* ==== Products ==== */
function productMainClasses(){return `
  card small-card product-card flex-row`;}
function productTemplate(element){return `
    <div class="contain-image" style="background-image: url('${element.images[0].src}')"></div>
    <div class="flex-column info-text">
      <span class="title">${element.name}</span>
      <span>${addAttributes("players",element)} </span>
      <span>${addAttributes("time",element)} </span>
    </div>
`
;}
function quickViewTemplate (element){return `
    <div class="card big-card">
        <div class="top-part">
            <div class="contain-image image grid1" style="background-image: url('${element.images[0].src}')">
            </div>
            <div class="grid2 flex-column" >
              <h6>${element.name}</h6>

            </div>
        </div>
        <div class="flex-row">
            <button id="addToCartButton" onclick="toggleList(${element.id},'cart')">Add to cart</button>
            <button id="addToFavsButton" onclick="toggleList(${element.id},'favs')">Add to favorites</button>
            <a target="_blank" href='${addAttributes("bgg",element)};'"><button>BGG</button></a>
        </div>
        <div class="bottom-part">
            <div class="scroll">
            ${element.description}  
            </div>
        </div>
    </div>
    `;}


function productPageTemplate(element){
return `
  <section class="flex-column">
    <section class="flex-row top-section">
      <div class="contain-image main-image image" style="background-image: url('${element.images[0].src}')">
      </div>  
      <div class="flex-column">
        <h1>${element.name} ${addAttributes("year",element)}</h1>
        
        <div class="flex-row">
          <span>${addAttributes("players",element)} </span>
          <span>${addAttributes("time",element)} </span>
          <span>${addAttributes("age",element)}</span>
        </div>
        <span>${addAttributes("sleeves",element,element.id)} </span>
        <span>${addAttributes("designers",element)}</span>
        <span>${element.prices.price} kr</span>
        
        <span>${addStockLevel(element)}</span>
      </div>
    <div">
  
    </section>
    <section class="flex-column middle-section">
      <div class="flex-row">
        <button id="addToCartButton" onclick="toggleList([${cartID(element)}],'cart',0)">Add to cart</button>
        <button id="addToFavsButton" onclick="toggleList(${element.id},'favs',0)">Add to favorites</button>
        <a target="_blank" href='${addAttributes("bgg",element)};'"><button>Boardgamegeek</button></a>
      </div>  
      <div id="imageContainer" class="flex-row">
        ${addOtherImages(element)}
      </div>
  </section>
    <section class="flex-row bottom-section">
      <div class="mechanics">
        <ul>
            Mechanics
          ${addAttributes("mechanics",element)}
        </ul>
      </div>
      <div class="text">
        ${element.description}
      </div>
    </section>
  <section id="childSection" class="flex-row">
  </section>
  <section>
`
;}
function cartContentTemplate(element,quantity,version){
  let sleevesButton = ""
  let buttons = ""
  if(!version){
    sleevesButton = `<span class="cart-sleeves-button">${addAttributes("sleeves",element,element.id)} </span>`
    buttons=`${createCartButtons(element).join(' ')}`
  }
return `
  <section id="productID${element.id}" class="cart-element flex-column">
    <div class=" flex-row">
    <a href="productPage.html?id=${element.id}">
        <div class="image contain-image" style="background-image: url('${element.images[0].src}')"></div>
    </a>  
      <div class="flex-column">
        <div class="flex-row top-section">
          <span class="name">${element.name}</span>
        </div>
          ${sleevesButton}
          <div class="sleevesContainer flex-row"></div>

      </div>
      <div class="shift-right flex-column">
          <div>
              ${priceDisplay(quantity,element)}
          </div>
          <div>
              ${buttons}
          </div>
      </div>
    </div>
    <div class="accessories flex-column">
      <span> Accessories for this item:</span>
      <div class="container flex-row">
      </div>
    </div>
        </section>

        
  
  `
}
function createCartButtons(element) {
  const minusButton = createCartButton('-',element,-1);
  const plusButton = createCartButton('+',element,1);
  const deleteButton = createCartButton('Delete',element,0);

  return [minusButton.outerHTML, plusButton.outerHTML, deleteButton.outerHTML];
}

function createCartButton(text, element,change) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('onclick', `toggleList([${cartID(element)}], 'cart', ${change});`);
  return button;
}
function cartID(element){
  let reply = [element.id,1]
  const parent = addAttributes("parent",element)
  if(parent){
    reply=[element.id,1,parent]
  }
  return reply
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
    <span class="name">${element.prices.price} kr</span>
    <button onclick="toggleList([${cartID(element)}],'cart',0)">${buttonText}</button>

  </div>
`

}
function priceDisplay(quantity,product){
    const price = product.prices.price
    return`
        <span>${quantity} x ${price} kr ${quantity*price} kr</span>
`

}
function favsContentTemplate(element){return `
    <div class="flex-column">
        <a href="productPage.html?id=${element.id}">
        <div class="image contain-image" style="background-image: url('${element.images[0].src}')">
            </div>
        </a>
        <button onclick="toggleList(${element.id},'favs')">Del</button>
    </div>
  `
}
