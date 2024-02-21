import { addImage } from "./images.mjs"
import { addAttributes } from "../handling/attributes.mjs";

/* ==== Products ==== */
export function productMainClasses(){return `
  card small-card product-card bordered flex-row `;}
export function productTemplate(element){
return `
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
      <span>${element.regular_price}</span>
    </div>
  </div>
    
`
;}