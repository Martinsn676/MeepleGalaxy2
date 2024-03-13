import { cardSectionHtml } from "./templates/cardSection.mjs";
import { sortObject } from "./sorting.mjs";
import { productHtml } from "./templates/product.mjs";
import { api } from "../handling/api.mjs";
import { lsList } from "../handling/lists.mjs";
import { sliderHandler } from "./slider.mjs";
import { windowHandling } from "../handling/globalListeners.mjs";
import { bannerHtml } from "./templates/banner.mjs";


const mobileMaxSize = 900
export default class ProductDisplay{
    constructor(place,headline,[type,loadDisplay,loadTotal],[sorting,hidden],endURl){
        if(windowHandling.mobileMode){
            type = 'loadMore'
            loadDisplay = 2
        }
        this.details = {
            'slider':type==="slider" ? true : false,
            'loadMore':type==="loadMore" ? true : false,
            'banner':type==="banner" ? true : false,
            'place':place,
            'headline':headline,
            'sort': sorting || false,
            'loadLines':loadDisplay || 100,
            'loadTotal':loadTotal || 100,
            'sortHidden':hidden || false,
            'endURl':endURl ? [...endURl] : [],
            'mainContainer':"",
            'displayQuantity':"",
        }        
        this.details.mobile = window.innerWidth < mobileMaxSize ? true: false
        const mainContainer = document.getElementById(place)
        this.details.mainContainer = mainContainer
        mainContainer.innerHTML = `${cardSectionHtml.template(this.details)}`;

        this.details.perLine = Math.floor(mainContainer.clientWidth / 270)
        const lines = this.details.slider ? 1 : this.details.loadLines
        this.details.initDisplay = lines * this.details.perLine
        this.details.container = mainContainer.querySelector(".content-container");
        this.details.loadMoreButton = mainContainer.querySelector(".loadMoreContainer");
        if(this.details.slider){this.details.container.classList.add("slider")}

        this.render(this.details,false)
    }
    async render({mainContainer,slider,container,sort,endURl,banner,sortHidden},reload){
        this.details.mainContainer.classList.remove('fully-loaded')
        if(!reload){
            if(!sortHidden){this.addSortOptions(mainContainer)}
            await this.prepLoadProducts()
        }
        endURl.push(sort[0])
        const elements = await api.call(this.details,endURl)
        if(elements){
            container.innerHTML = slider ? `${sliderHandler.template()}` : ""
            if(banner){
                container.classList.add("banner")
                console.log("this.details",this.details)
                await bannerHtml.create(elements,this.details)
            }else{
                await this.renderElements(elements,this.details)
            }
            await this.addFunctons(this.details)
            return true
        }
        this.details.mainContainer.classList.add('fully-loaded')
    }
    async addSortOptions(mainContainer){
        await sortObject.addButtons(this.details)
        const allSortButtons = mainContainer.querySelectorAll('.sort-buttons button')
        allSortButtons.forEach((button)=>{
            button.addEventListener('click',async (event)=>{
                const newSort = sortObject.changeSort(event,this.details)
                this.details.sort=newSort
                this.render(this.details,true).then(sortObject.findActive(this.details))
            })
        })

        
    }
    prepLoadProducts(){
        for(let i = 0 ; i < this.details.displayQuantity ; i++){
            this.details.container.innerHTML+=`<div class="loading-card ${productHtml.mainClasss()}"></div>`;
        }
    }
    async apiCall({place,sort,headline,loadTotal,endURl}){
        const cachedElements = await lsList.cacheCheck(place+sort)
        const elements = cachedElements || await api.call(loadTotal,endURl,headline)
        return elements
    }
    renderElements(elements,{container,initDisplay}){
        for(let i = 0; i < elements.length; i++){
            const product = elements[i]
            const card = document.createElement('div');
            card.className = productHtml.mainClasss;
            if(i>=initDisplay){
                card.className+=' hidden-product'
            }
            card.innerHTML = productHtml.template(product)
            card.addEventListener('click',()=>this.goToProduct(product))
            container.appendChild(card);
        }
    }
    addFunctons({mainContainer,slider,loadMore,perLine,loadMoreButton}){
        if(slider){
            sliderHandler.checkSlider(mainContainer)
            // checkSlider(mainContainer.id,displayQuantity,type[2])
            mainContainer.querySelector(`.left-slider`).addEventListener("click", () => {
                sliderHandler.shift(this.details,-2)
            })
            mainContainer.querySelector(`.right-slider`).addEventListener("click", () => {
                sliderHandler.shift(this.details,2)
            })
        }
        if(loadMore){
            loadMoreButton.classList.remove('d-none')
            loadMoreButton.addEventListener('click',()=>{
                const hiddenProducts = mainContainer.querySelectorAll('.hidden-product')
                for(let i = 0; i < perLine; i ++){
                    if(hiddenProducts[i]){
                        hiddenProducts[i].classList.remove('hidden-product')
                    }else{
                        loadMoreButton.disabled=true
                    }
                }
            })
        }
        const allButons = mainContainer.querySelectorAll("button");
        allButons.forEach(element => {
            element.disabled=false;
        });

    }
    goToProduct(product){
      localStorage.setItem('speedLoad', JSON.stringify(product));
      location.href=`../page_product/index.html?id=${product.id}`;
    }
}