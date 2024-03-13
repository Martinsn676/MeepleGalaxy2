import { headerTemplate } from "./templates.mjs";
import { footerTemplate } from "./templates.mjs";
import { lsList } from "./handling/lists.mjs";
// import { testAddToCart } from "./handling/testButton.mjs";
// import { updateTracker } from "./handling/lists.mjs";
import { windowHandling } from "./handling/globalListeners.mjs";
document.querySelector("header").innerHTML=`${headerTemplate()}`
document.querySelector("footer").innerHTML=`${footerTemplate()}`

// const testButton = document.getElementById('testButton')
// testButton.addEventListener('click',()=>{
//   testAddToCart()
//   updateTracker()
// });

windowHandling.listenChange()
console.log("windowHandling.mobileMode",windowHandling.mobileMode)
// const navItems = document.getElementById('header').querySelectorAll('.headerLinks a');
// const currentPath = window.location.pathname.toLowerCase();
// for (let i = 0; i < navItems.length; i++) {
//   const link = navItems[i];
//   const href = "/"+link.getAttribute('href').toLowerCase();
//   if (href === currentPath) {
//     link.setAttribute('aria-current', 'page');
//     link.classList.add("active")
//   } else {
//     link.removeAttribute('aria-current');
//   }
// }
const searchField = document.querySelector('#search')
if(searchField){
    searchField.innerHTML= `
    <div class="flex-column">
        <input id="search-input"></input>
        <section id="search-container" class="flex-row flex-wrap"></section> 
    </div>
    `;
}
document.querySelector("#headerLinkButton").addEventListener("click",()=>{
    document.querySelector("#header .mobile").classList.toggle("hide")
    document.querySelector(".headerLinks.mobile").scrollIntoView({
          
          });
    });
window.addEventListener("scroll",()=>{
  if(window.scrollY>400){
    const mobileMenu =document.querySelector("#header .mobile")
    if(mobileMenu){
      mobileMenu.classList.add("hide")        
    }
  }
});
function sortButtonClick(param1, param2, param3, param4, order) {
  const scrollPosition = window.scrollY;
   addElements(param1,param2, param3, param4, [order]);
  showNumber=0
  window.scrollTo(0, scrollPosition);
}
async function toggleList(id,type,forced){
    const lsList = await getList(type)
    if(!forced){
      forced=0
    }
    let updatedList = []
    if(!lsList || lsList.length<1){
        if(Array.isArray(id)){
            updatedList.push(id)
        }else{
            updatedList.push([id,1])
        }
    }else{

        await updateList(id,lsList,forced)
        updatedList=lsList
    }
    localStorage.setItem(type, JSON.stringify(updatedList));
    updateTracker(type)  
}
// updateTracker()
lsList.remove('newCart')