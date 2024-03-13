import { addImage } from "../../reading/images.mjs"
import { getAttribute } from "../../reading/attributes.mjs";

/* ==== Products ==== */
export const productHtml = {
  'mainClasss':'card small-card product-card bordered flex-row',
  template(element){return `
    <div class="left flex-row image-container">
      <div class="main-image-container">
        ${addImage(element.images,0,"src")}
      </div>
      <div class="secondary-image-container">
        ${addImage(element.images,1,"src")}
      </div>
    </div>
    <div class="right flex-column info-text">
      <h6 class="title">${element.name}</h6>
      <div class="details flex-row align-row">
        <img src="/icons/players.png">
        <span>${getAttribute("players",element)}</span>
      </div>
      <div class="details flex-row align-row">
        <img src="/icons/time.png">
        <span>${getAttribute("time",element)}</span>
      </div>
      <div class="details flex-row align-row">
        <img src="/icons/age.png">
        <span>${getAttribute("age",element)}</span>
      </div>
      <div class="details flex-row align-row">
        <img src="/icons/card.png">
        <span>${element.regular_price}</span>
      </div>
    </div>
    `
  }
}
