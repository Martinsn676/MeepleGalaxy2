import { lsList } from "../../handling/lists.mjs"
import { api } from "../../handling/api.mjs"

export const cardSectionHtml = {
  template({headline}){  return `
    <div id="topLine">
      <div class="flex-cloumn"> 
          <h2>${headline}</h2>
      </div>
      <div class="sort-buttons">
      </div>
    </div>
    <section class='content-container flex-row flex-wrap'>
    </section>
    <div id="bottomLine">
        <div id="showingInfo">
        </div>
        <div class="loadMoreContainer full-width flex-column align d-none">
              <button class="loadMoreButton">load more</button>
        </div>  
    </div>

  `

  }

}
