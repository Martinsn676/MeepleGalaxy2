import { quickViewTemplate } from "../templates/quickView.mjs";
import { modal } from "./modal.mjs";

export function goToPage(element) {
    const quickViewContainer = document.querySelector(".quickView-container")
    const scrollTop  = document.querySelector("#search")
    if(quickViewContainer){
      const url = new URL(window.location.href);
      const params = new URLSearchParams();

      // Set the 'id' parameter to 222
      params.set('id', element.id);

      // Replace the entire query string with the new parameters
      url.search = params.toString();
      // Update the URL without triggering a page reload
      history.pushState({}, '', url.toString());
      quickViewContainer.innerHTML = `${quickViewTemplate(element)}`;
      scrollTop.scrollIntoView({
          behavior: 'smooth'
        });
      addModalClick(document.querySelectorAll(".big-card .image"))
    }else{
      localStorage.setItem('speedLoad', JSON.stringify(element));
        console.log("gotopage")
      location.href=`../page_product/index.html?id=${element.id}`;
    }

}