
import { addAttributes } from "../handling/attributes.mjs";
import { addSleeveButtons } from "../handling/sleeves.mjs";
import { addOtherImages,addImage } from "./images.mjs";

export function quickViewTemplate(element){
  const { prices: { price } ,name,images,id} = element;
  return `
  <section id="gallery-container">
  </section>
  <section class="top-section flex-row">
    <div id="main-image" class="w-4">
      ${addImage(images, 0, "src")}
    </div>
    <div class="w-8">
      <h1>${name} (${addAttributes("year", element)})</h1>
      <span>${price} kr</span>
      <div class="info2 flex-row align-row">
        <div class="details flex-row align">
          <img src="/icons/players.png">
          <span>${addAttributes("players", element)}</span>
        </div>
        <div class="details flex-row align">
          <img src="/icons/time.png">
          <span>${addAttributes("time", element)}</span>
        </div>
        <div class="details flex-row align">
          <img src="/icons/age.png">
          <span>${addAttributes("age", element)}</span>
        </div>
      </div>
      <div class="info3 w-12 flex-column ">
        <span>Designers: ${addAttributes("designers", element)}</span>
        <span>Artists: ${addAttributes("artists", element)}</span>
        <span>Pubisher: ${addAttributes("publishers", element)}</span>
      </div>
      <div>
        ${addSleeveButtons(addAttributes("sleeves", element), id)}
      </div>
    </div>
  </section>
  <section
    <div class="w-12 flex-row align-row buttons">
        <button id="addToCartButton">Add to cart</button>
        <button id="addToFavsButton">Add to favorites</button>
        <button>Boardgamegeek</button>
      </div>
  </section>
  <section id="imageContainer" class="flex-row">
    ${addOtherImages(element)}
  </section>
  <section class="flex-row">
    <div class="w-3 mechanics bordered">
      <ul id="mechanics">
          Mechanics
        ${addAttributes("mechanics", element)}
      </ul>
    </div>
    <div class="description w-9 bordered">
      ${element.description}
    </div>
  </section>
  </section>
`;
}
