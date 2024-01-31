/* ==== Products ==== */
function productMainClasses(){return `
  card small-card product-card bordered flex-row`;}
function productTemplate(element){
return `
  <div class="left flex-row image-container">
    <div class="w-6 image-container">
      <image class="contain-image image" src="${element.images[0].src}">
    </div>
    <div class="w-6 image-container">
      ${checkForSecondaryImage(element)}
    </div>
    
  </div>

  <div class="right flex-column info-text">
    <h6 class="title">${element.name}</h6>
    <div class="details flex-row align-row">
      <img src="/icons/players.png">
      <span>${addAttributes("players",element)}</span>
    </div>
    <div class="details flex-row align-row">
      <img src="/icons/time.png">
      <span>${addAttributes("time",element)}</span>
    </div>
    <div class="details flex-row align-row">
      <img src="/icons/age.png">
      <span>${addAttributes("age",element)}</span>
    </div>
    <div class="details flex-row align-row">
      <img src="/icons/card.png">
      <span>${element.prices.price}</span>
    </div>
  </div>
    
`
;}
function quickViewTemplate (element){return `
    <div class="card big-card">
      <div class="top-part flex-row">
        <img class="contain-image image" src='${element.images[0].thumbnail}'> 

        <div class="imformation flex-column" >
          <h1>${element.name} ${addAttributes("year",element)}</h1>

          <span>${addAttributes("players",element)} </span>
          <span>${addAttributes("time",element)} </span>
          <span>${addAttributes("age",element)}</span>

          <span>${addAttributes("sleeves",element,element.id)} </span>
          <span>${addAttributes("designers",element)}</span>
          <span>${addAttributes("artists",element)}</span>
          <span>${addAttributes("publishers",element)}</span>
          <span>${element.prices.price} kr</span>
          
          <span>${addStockLevel(element)}</span>
        </div>
        <ul>
            Mechanics
          ${addAttributes("mechanics",element)}
        </ul>
      </div>
      <div class="flex-row">
          <button id="addToCartButton" onclick="toggleList(${element.id},'cart')">Add to cart</button>
          <button id="addToFavsButton" onclick="toggleList(${element.id},'favs')">Add to favorites</button>
          <a target="_blank" href='${addAttributes("bgg",element)};'"><button>BGG</button></a>
      </div>
    <div id="imageContainer" class="flex-row">
      ${addOtherImages(element)}
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
  <section class="top-section flex-col w-12">
  
    <div class="flex-row w-12">
      <div class="w-6 flex-column gallery-button">
        <image class="contain-image image" src="${element.images[0].src}">
        <div class="imageButton">Image gallery</div>
      </div>
      <div class="w-6 flex-column game-information">
        <h1>${element.name} ${addAttributes("year",element)}</h1>
        <span>${element.prices.price} kr</span>
        <span>Designers: ${addAttributes("designers",element)}</span>
        <span>Artists: ${addAttributes("artists",element)}</span>
        <span>Pubisher: ${addAttributes("publishers",element)}</span>
      </div>
    </div>
    <div class="game-specs flex-row">
      <div class="details flex-row align-row">
          <img src="/icons/players.png">
          <span>${addAttributes("players",element)}</span>
        </div>
        <div class="details flex-row align-row">
          <img src="/icons/time.png">
          <span>${addAttributes("time",element)}</span>
        </div>
        <div class="details flex-row align-row">
          <img src="/icons/age.png">
          <span>${addAttributes("age",element)}</span>
        </div>
      </div>
    </div>
  </section>
  <section class="w-12 middle-section flex-row">
    <div class="w-6 bordered">
      <ul>
        Mechanics
          ${addAttributes("mechanics",element)}
      </ul>
    </div>
    <div class="w-6 flex-column align-column">
      
      <button id="addToCartButton" class="bordered" onclick="toggleList([${element.id}],'cart',0)">Add to cart</button>
      <button id="addToFavsButton" class="bordered" onclick="toggleList(${element.id},'favs',0)">Add to favorites</button>

      <button class="bordered">Boardgamegeek</button>
    </div>
  </section>
  <div class="bordered">
    ${element.description}
  </div>


`


}
function productPageTemplate2(element){
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
        ${addSleeveButtons(addAttributes("sleeves",element),element.id)}
        <span>${addAttributes("designers",element)}</span>
        <span>${addAttributes("artists",element)}</span>
        <span>${addAttributes("publishers",element)}</span>
        <span>${element.prices.price} kr</span>
        
        <span>${addStockLevel(element)}</span>
      </div>
    <div">
  
    </section>
    <section class="flex-column middle-section">
      <div class="flex-row">
        <button id="addToCartButton" onclick="toggleList([${element.id}],'cart',0)">Add to cart</button>
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
function cartContentTemplate(element,quantity){
  let sleevesButton = ""
  let buttons = ""


  buttons=`${createCartButtons(element.id).join(' ')}`
  
return `
  <section id="productID${element.id}" class="cart-element flex-column">
    <div class="top-part flex-row">
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
function createCartButtons(id) {
console.log("button id",id)
  const minusButton = createCartButton('-',id,-1);
  const plusButton = createCartButton('+',id,1);
  const deleteButton = createCartButton('Delete',id,0);

  return [minusButton.outerHTML, plusButton.outerHTML, deleteButton.outerHTML];
}

function createCartButton(text, id,change) {
console.log("button id",id)
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('onclick', `cartChange([${id[0]},${id[2]}],${change})`);
  return button;
}
// function cartID(element){
//   let reply = [element.id,1]
//   const parent = addAttributes("parent",element)
//   if(parent){
//     reply=[element.id,1,parent]
//   }
//   return reply
// }
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
    <button onclick="cartChange(${element.id})">${buttonText}</button>
    <div>${addSleeveButtons(addAttributes("sleeves",element),element.id)}</div>
  </div>
`

}
function addSleeveButtons(element,id){
  let html=""
  if(element){
    element.forEach(slv => {
      html+=`
        <button id="sleeveID${slv[0]}" onclick="addSleeves(${slv[0]},'${slv[2]}',${id})">(${slv[1]})</button>
      `;
    });
  }
  return html
}
async function cartChange(id, change) {
  console.trace();
  const list = await getList('newCart');
  const [id1, id2] = Array.isArray(id) ? id : [id, undefined];

  list.forEach(item => {
    const isMatchingId = item[0] === id1;
    const isMatchingSecondId = id2 && id2 === item[2];

    if ((id2 && isMatchingId && isMatchingSecondId) || (!id2 && isMatchingId)) {
      item[1] = change ? item[1] + change : item[1] === 0 ? 1 : 0;
    }
  });

  saveList('newCart', list);
  createListContent();
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
