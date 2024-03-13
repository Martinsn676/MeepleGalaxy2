import { addOtherImages,addImage } from "../js/templates/images.mjs";
import { getAttribute } from "../js/reading/attributes.mjs";
import { addSleeveButtons } from "../js/handling/sleeves.mjs";
import { windowHandling } from "../js/handling/globalListeners.mjs";

function formatDescription(description) {
    return description.replace(/&#010;/g, '<br>');
}
// Example usage
export const productPageHtml = {
    getTemplate(element) {
        let html;
console.log(windowHandling.mobileMode)
        if (windowHandling.mobileMode) {
console.log("mobiletemplate")
            html = this.mobileTemplate(element);
        } else {
            html = this.pcTemplate(element);
        }
        // Decode HTML entities in the description
        const descriptionHTML = formatDescription(element.description);
        return html;
    },
  mobileTemplate(element){return `
    <div id="mobile-product-page">
    <section id="gallery-container">
    </section>
      <section class="top-section flex-col w-12">
        <div class="flex-row w-12">
          <div class="w-6 flex-column info1">
            <h1>${element.name} (${getAttribute("year",element)})</h1>
            <span>${element.regular_price} kr</span>
            <ul id="mechanics">
              ${getAttribute("mechanics",element)}
            </ul>
          </div>
          <div class="w-6 flex-column">
            <div id="main-image" class="flex-column gallery-button">
              ${addImage(element.images,0,"src")}
              <div class="imageButton">
                Image gallery
              </div>
            </div>
            <div class="info2 w-12 flex-column align-column buttons">
              <button id="cart${element.id}" class="button">Add to cart</button>
              <button id="favs${element.id}" class="button">Add to favorites</button>
              <a class="button" href='${getAttribute("publishers",element)}'>
                  <div>Boardgamegeek</div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section class="w-12 middle-section flex-column">
        <div class="info3 w-12 flex-column ">
            <span>Designers: ${getAttribute("designers",element)}</span>
            <span>Artists: ${getAttribute("artists",element)}</span>
            <span>Pubisher: ${getAttribute("publishers",element)}</span>
        </div>
      </section>
      <div id="description">
        <div id="text">
          ${formatDescription(element.description)}
        </div>
      <div id="block">
      </div>
    </div>
    `
  },
  pcTemplate(element){
      const { regular_price ,name,images,id} = element;
  return `
  <div id="pc-product-page">
    <!-- Gallery for mobile -->
    <div id="gallery-container">
    </div>
    <div class="top-section flex-row">
        <!-- Main image container -->
        <div id="main-image" class="w-4">
            ${addImage(images,0,"src")}
        </div>
        <!-- Section for details about item -->
        <div class="w-8">
            <h1>${name} (${getAttribute("year",element)})</h1>
            <span>${regular_price} kr</span>
            <div class="info2 flex-row align-row">
                <div class="details flex-row align">
                    <img src="/icons/players.png">
                    <span>${getAttribute("players",element)}</span>
                </div>
                <div class="details flex-row align">
                    <img src="/icons/time.png">
                    <span>${getAttribute("time",element)}</span>
                </div>
                <div class="details flex-row align">
                    <img src="/icons/age.png">
                    <span>${getAttribute("age",element)}</span>
                </div>
            </div>
            <!-- Section for crator details -->
            <div class="info3 w-12 flex-column ">
                <span>Designers: ${getAttribute("designers",element)}</span>
                <span>Artists: ${getAttribute("artists",element)}</span>
                <span>Pubisher: ${getAttribute("publishers",element)}</span>
            </div>
            <!-- Section for sleeves -->
            <div>
                ${addSleeveButtons(getAttribute("sleeves",element),id)}
            </div>
        </div>
    </div>
    <!-- Section for buttons -->
    <div class="w-12 flex-row align-row buttons">
        <button id="cart${element.id}" class="button">Add to cart</button>
        <button id="favs${element.id}" class="button">Add to favorites</button>
        <a class="button" href='${getAttribute("publishers",element)}'>
            <div>Boardgamegeek</div>
        </a>
    </div>
    <!-- Section for other images -->
    <div id="imageContainer" class="flex-row">
        ${addOtherImages(element)}
    </div>
    <div class="flex-row">
        <div class="w-3 mechanics bordered">
            <ul id="mechanics">
                Mechanics
                ${getAttribute("mechanics",element)}
            </ul>
        </div>
        <div class="description w-9 bordered">
            ${element.description}
        </div>
    </div>
  </div>
</div>
  `
  }
}

export function productPageTemplate(element){
return `
<section id="gallery-container">
</section>
  <section class="top-section flex-col w-12">
    <div class="flex-row w-12">
      <div class="w-6 flex-column info1">
        <h1>${element.name} ${addAttributes("year",element)}</h1>
        <span>${element.regular_price} kr</span>
        <ul id="mechanics">
          Mechanics
            ${addAttributes("mechanics",element)}
        </ul>
      </div>
      <div class="w-6 flex-column">
        <div id="main-image" class="flex-column gallery-button">
          ${addImage(element.images,0,"src")}
          <div class="imageButton">
            Image gallery
          </div>
        </div>
        <div class="info2 w-12 flex-column align-column buttons">
          <button id="addToCartButton">Add to cart</button>
          <button id="addToFavsButton">Add to favorites</button>
          <button>Boardgamegeek</button>
        </div>
      </div>
    </div>
  </section>
  <section class="w-12 middle-section flex-column">
    <div class="info3 w-12 flex-column ">
        <span>Designers: ${addAttributes("designers",element)}</span>
        <span>Artists: ${addAttributes("artists",element)}</span>
        <span>Pubisher: ${addAttributes("publishers",element)}</span>
    </div>
  </section>
  <div id="description">
    <div id="text">

    ${element.description}
  </div>
  <div id="block">
  </div>
`
}
export function productPageTemplatePC(element){

}