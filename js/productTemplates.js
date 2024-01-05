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
            <span>${addAttributes("designers",element)}</span>
            <span>${addAttributes("players",element)} </span>
            <span>${addAttributes("time",element)} </span>
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
        <span>${addAttributes("designers",element)}</span>
        <span>${addAttributes("players",element)} </span>
        <span>${addAttributes("time",element)} </span>
        <span>${element.prices.price} kr</span>
        <span>${addAttributes("Age",element)}</span>
        
        
      </div>
    <div">
  <span>${addAttributes("sleeves",element,element.id)} </span>
    </section>
    <section class="flex-column middle-section">
      <div class="flex-row">
        <button id="addToCartButton" onclick="toggleList([${cartID(element)}],'cart',0)">Add to cart</button>
        <button id="addToFavsButton" onclick="toggleList(${element.id},'favs',0)">Add to favorites</button>
        <a target="_blank" href='${addAttributes("bgg",element)};'"><button>Boardgamegeek</button></a>
      </div>  
      <div id="imageContainer" class="flex-row">
        ${addAttributes("otherImages",element)}
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
        ${cleanData(element.description)}
      </div>
    </section>
  <section>
`
;}
function cartContentTemplate(element,quantity){return `
  <section id="productID${element.id}" class="cart-element flex-column">
    <div class=" flex-row">
    <a href="productPage.html?id=${element.id}">
        <div class="image contain-image" style="background-image: url('${element.images[0].src}')"></div>
    </a>  
      <div class="flex-column">
          <span class="name">${element.name}</span>
          <div class="sleevesContainer flex-row"></div>

      </div>
      <div class="shift-rigth flex-column">
          <div>
              ${priceDisplay(quantity,element)}
          </div>
          <div>
              ${createCartButtons(element).join(' ')}
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
  <a href="productPage.html?id=${element.id}" class="small-list sleeve-list flex-column align-column">
      <div class="image contain-image" style="background-image: url('${element.images[0].src}')">
      </div>
      <span class="name">${element.name}</span>
      <span class="name">${quantity} cards</span>
  </a>
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
  <div class="small-list accessorie-list flex-column align-column">
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
