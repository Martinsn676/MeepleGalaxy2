/* ==== Header ==== */
function headerTemplate(){return `
<div id="header" class="links-passive flex-row align-row">    
  <div class="flex-row">
    <a href="index.html">
      <img class="link-logo" src="https://prototype.meeplegalaxy.com/wp-content/uploads/2023/11/logo_wide_b73121fc-20a9-4cbc-b723-f7f21b51c4ee.png">
    </a>
    <button id="headerLinkButton">Menu</button>
  </div>
  <div class="headerLinks pc flex-row">
    <a class="homeLink" href="index.html">Home</a>
    <a class="storeLink" href="store.html">Store</a>
    <a class="contactLink" href="contact.html">Contact</a>
    <a class="checkoutLink" href="checkout.html">Checkout</a>
  </div>
  <a href='cartPage.html'>
    <span>Cart</cart>
    <span id='cartNumber'>0</span>
  </a>
  <a href='favsPage.html'>
    <span>Favorites</cart>
    <span id='favsNumber'>0</span>
  </a>
  <button onclick="testAddToCart('cart')">Cart</button>
  <button onclick="testAddToCart('favs')">Favs</button>
  <div class="headerLinks mobile hide flex-column align-column">
    <a class="homeLink" href="index.html">Home</a>
    <a class="storeLink" href="store.html">Store</a>

    <a class="contactLink" href="contact.html">Contact</a>
  </div>
</div>
  `
;}
function footerTemplate(){return `
  <div id="footer" class="links-passive flex-column align-column">
    <div>
    <a href="about.html">About us</a>
    <a href="contact.html">Contact</a>
    </div>
  </div>
`
;}
function bannerImageTemplate(element,number){return `
  <a class="banner-image number${number}" href='productPage.html?id=${element.id}'>
    <img  src='${element.images[0].src}' alt='${element.name}'>
    <span class='hover-box'>${element.name}</span>
  </a>
`
;}
function cardSection(functionLog){
  return `
    <div id="topLine">
      <div class="flex-cloumn"> 
          <h2>${functionLog[1]}</h2>
      </div>
      <div id="sortButtonsID" class="sort-buttons">
      </div>
    </div>
    <section id='elements-container' class='flex-row flex-wrap'>
    </section>
    <div id="bottomLine">
        <div id="showingInfo">
        </div>
        <div id="loadMoreContainer" class="full-width align-column flex-column">
        </div>  
    </div>
  `
;}

function sliderButtonsTemplate(){return`
    <button class="left-slider slider-buttons"></button>
    <button class="right-slider slider-buttons"></button>
  `
;}

function modalTemplate(){return`
    <div id="modal" class="hide-modal">
    <div id="modal-background"></div>
    <div id="modal-image"></div>
    </div>
  `
;}
function addSortButtonTemplate(log, order) {
    let output = "";
    order.forEach(element => {
        output += `<button type="button" disabled="true" id='${element[0]}' onclick="sortButtonClick('${log[0]}', '${log[1]}', ${log[2]}, ['${log[3][0]}',${log[3][1]},${log[3][2]}], ['sort','${element[0]}'])">${element[1]}</button>`;
    });
    return output;
;}

