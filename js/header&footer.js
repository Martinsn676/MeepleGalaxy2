document.querySelector("header").innerHTML=`${headerTemplate()}`
document.querySelector("footer").innerHTML=`${footerTemplate()}${modalTemplate()}`


const navItems = document.getElementById('header').querySelectorAll('.headerLinks a');
const currentPath = window.location.pathname.toLowerCase();
for (let i = 0; i < navItems.length; i++) {
  const link = navItems[i];
  const href = "/"+link.getAttribute('href').toLowerCase();
  if (href === currentPath) {
    link.setAttribute('aria-current', 'page');
    link.classList.add("active")
  } else {
    link.removeAttribute('aria-current');
  }
}
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
    mobileMenu =document.querySelector("#header .mobile")
    if(mobileMenu){
      mobileMenu.classList.add("hide")        
    }
  }
});

updateTracker()
removeList('newCart')