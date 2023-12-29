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

<div class="flex-row">
        <button onclick="toggleList(${element.id},'cart')">Add to cart</button>
        <button onclick="toggleList(${element.id},'favs')">Add to favorites</button>
        <a target="_blank" href='${addAttributes("bgg",element)};'"><button>BGG</button></a>
      </div>
      <div class="bottom-part">
        <div class="scroll">
          ${element.description}  
        </div>
      </div>
    </div>
    `;}


function productPageTemplate(element){return `
  <section class="flex-column">
    <section class="flex-row top-section">
      <div class="contain-image main-image image" style="background-image: url('${element.images[0].src}')">
      </div>  
      <div class="flex-column">
        <h1>${element.name}</h1>
        <span>${addAttributes("designers",element)}</span>
        <span>${addAttributes("players",element)} </span>
        <span>${addAttributes("time",element)} </span>
        <span>${addAttributes("sleeves",element)} </span>
      </div>
    </section>
    <section class="flex-column middle-section">
      <div class="flex-row">
        <button id="addToCartButton" onclick="toggleList(${element.id},'cart',this)">Add to cart</button>
        <button id="addToFavsButton" onclick="toggleList(${element.id},'favs')">Add to favorites</button>
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
function cartContentTemplate(element){return `
  <div class="cart-element flex-row">
      <div class="image contain-image" style="background-image: url('${element.images[0].src}')"></div>
      <div class="flex-column">
        <span class="name">${element.name}</span>
        <button onclick="toggleList(${element.id},'cart')">Remove</button>
      </div>
      <span class="price">${element.prices.price} kr</span>
      
  </div>
  `
}

function favsContentTemplate(element){return `
    <a href="productPage.html?id=${element.id}">
       <div class="image contain-image" style="background-image: url('${element.images[0].src}')">
        </div>
    </a>
  `
}