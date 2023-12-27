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
    <a class="blogLink" href="blogs.html">Blogs</a>
    <a class="contactLink" href="contact.html">Contact</a>
  </div>
  <div class="headerLinks mobile hide flex-column align-column">
    <a class="homeLink" href="index.html">Home</a>
    <a class="storeLink" href="store.html">Store</a>
    <a class="blogLink" href="blogs.html">Blogs</a>
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
        <div class="grid3">
          ${addAttributes("bgg",element)}
        </div>
      
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
      <div class="contain-image blog-image image" style="background-image: url('${element.images[0].src}')">
      </div>  
      <div class="flex-column">
        <h1>${element.name}</h1>
        <span>${addAttributes("designers",element)}</span>
        <span>${addAttributes("players",element)} </span>
        <span>${addAttributes("time",element)} </span>
      </div>
    </section>
    <section id="imageContainer" class="flex-row middle-section">
        ${addAttributes("otherImages",element)}
    </section>
    <section class="flex-row bottom-section">
      <div class="mechanics">
        <ul>
          ${addAttributes("mechanics",element)}
        </ul>
      </div>
      <div>
        ${cleanData(element.description)}
      </div>
    </section>
  <section>
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

