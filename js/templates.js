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
  `;}
function footerTemplate(){return `
  <div id="footer" class="links-passive flex-column align-column">
    <div>
    <a href="about.html">About us</a>
    <a href="contact.html">Contact</a>
    </div>
  </div>
`
}
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
}
/* ==== Products ==== */
function productMainClasses(){return `
  card small-card product-card flex-row`;}
function productTemplate(element){return `
    <div class="contain-image" style="background-image: url('${element.images[0].src}')"></div>
    <div class="flex-column info-text">
      <div>${element.name}</div>
      <span>${addAttributes("pc",element)} </span>
      <span>${addAttributes("pt",element)} </span>
      
    </div>
  `;}
function quickViewTemplate (element){return `
    <div class="card big-card">
      <div class="top-part">
        <div class="contain-image image grid1" style="background-image: url('${element.images[0].src}')">
        </div>
        <div class="grid2">
          <h6>${element.name}</h6>
          <h6>${addAttributes("dg",element)}</h6>
          <h6>${addAttributes("pc",element)} </h6>
          <h6>${addAttributes("pt",element)} </h6>
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
function quickViewTemplateBackup (element){return `
    <div class="card big-card">
        <div class="contain-image image grid1" style="background-image: url('${element.images[0].src}')">
        </div>
        <div class="grid2">
          <h6>${element.name}</h6>
          <h6>${addAttributes("dg",element)}</h6>
          <h6>${addAttributes("pc",element)} </h6>
          <h6>${addAttributes("pt",element)} </h6>
          
        </div>
        <div class="grid3">
          ${addAttributes("bgg",element)}
        </div>
        <div class="scroll grid4">
          ${element.description}  
        </div>
    </div>
    `;}

function productPageTemplate(element){return `
    <div class="flex-row">
      <div class="contain-image blog-image image" style="background-image: url('${element.images[0].src}')"></div>  
      <h1>${element.name}</h1>
    </div>
    <p>
      ${cleanData(element.description)}
    </p>
  `;}

/* ==== Blogs ==== */
function blogMainClasses(){return`
  card small-card blog-card flex-column`;}
function blogTemplate(element){return `
    <div>
      <h6>${cleanTime(element.date)}</h6>
      <h6>${element.title.rendered}</h6>
    </div>
      <div class="contain-image" style="background-image: url('${element.jetpack_featured_media_url}')">
    </div>
  `;}

function wideBlogMainClasses(){return`
  card wide-blog-card flex-column`;}
function wideBlogTemplate(element){return`
    <div class="title flex-row">
      <h6>${element.title.rendered}</h6><h6>(${cleanTime(element.date)})</h6>
    </div>
    <div class="content">
      <div class="contain-image image" style="background-image: url('${element.jetpack_featured_media_url}')"></div>
      <div class="overflow-hidden">
        <div class="text"> 
          ${cleanData(element.content.rendered)}
          <div class="opacityBlur"></div>
        </div>
      </div>   
    </div>
  `;}

function blogPageTemplate(element){return `
    <div class="top-line">
      <div class="contain-image blog-image image" style="background-image: url('${element.jetpack_featured_media_url}')"></div>  
      <div class="flex-colum">
        <h2>Posted: ${cleanTime(element.date)}</h2>
        <h2>Written by: ${element._embedded.author[0].name}</h2>
        <h1>${element.title.rendered}</h1>
      </div>
    </div>
    <div class="text-box overflow-hidden flex-column align-column">
      <div class="text">
        ${cleanData(element.content.rendered)}
        <div class="opacityBlur"></div>
      </div>
      <button id="show-button" onclick="toggleText()">Show more</button>
      <button id="hide-button" onclick="toggleText()">Show less</button>
    </div>
    <section>
      <h2>Comments</h2>
      <div id="comments-container"></div>
    </section>
    
  `;}
function sliderButtonsTemplate(){return`
    <button class="left-slider slider-buttons"></button>
    <button class="right-slider slider-buttons"></button>
  `;}

function modalTemplate(){return`
    <div id="modal" class="hide-modal">
    <div id="modal-background"></div>
    <div id="modal-image"></div>
    </div>
  `}
function addSortButtonTemplate(log, order) {
    let output = ""
    order.forEach(element => {
     output+=`<button type="button" disabled="true" id='${element[0]}' onclick="sortButtonClick('${log[0]}', '${log[1]}', '${log[2]}', ${log[3]}, ['${log[4][0]}', ${log[4][1]}, ${log[4][2]}], '${element[0]}')">${element[1]}</button>`
    });
    return output
}

