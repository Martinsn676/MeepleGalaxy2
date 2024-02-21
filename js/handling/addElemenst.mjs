import { cardSection,sortObject,sliderButtonsTemplate } from "../templates/cardSection.mjs";
import { productMainClasses,productTemplate } from "../templates/card.mjs";
import { api } from "./api.mjs";
import { checkSlider } from "./slider.mjs";
import { goToPage } from "./navigation.mjs";
import { resizeCheck } from "./listeners.mjs";
import { list } from "./lists.mjs";

/**
 * 
 * @param {string} place ID of the target to add elements
 * @param {string} headline Headline above the module
 * @param {[string,number,number]} displayQuantity 1: slider/loadMore 2: Load in total 3: Display 
 * @param {[string,string,string]} type 1: sort 2: dateDesc/dateAsc/titleDesc/titleAsc 3: hide/""
 * @param {Array} sort extra apiCall information
 * @example  addElements("pc2","Hot Titles",7,["slider",15,7],[["sort","dateAsc","hide"]])
 * @example  addElements("pc4","Even more games",12,["loadMore",50,8])
 * ```js
 * ```
 */
export async function addElements(place,headline,displayQuantity,type,sort,endURl) {
console.log(place,endURl)
    let slider = false;
    let loadMore = false;
    let selectedSort
    let displaySize = "pc"

    
    const  mainContainer = document.querySelector(`#${place}`)


    if(type[0]==="slider"){slider=true;}
    if(type[0]==="loadMore"){loadMore=true;}

    //missing info and errorhandling
    type = type ? type : ["",999,999];
    sort = sort ? sort : ""
    endURl = endURl ? endURl : []
    const functionLog = {
        'place':place,
        'headline':headline,
        'displayQuantity':displayQuantity,
        'type':type,
        'sort':sort,
        'endURl':[...endURl],
        'mainContainer':mainContainer,
    } 
    
    mainContainer.classList.remove("fully-loaded")
    mainContainer.innerHTML = `${cardSection(functionLog)}`;
    const container = mainContainer.querySelector("#elements-container")
    const loadMoreContainer = mainContainer.querySelector("#loadMoreContainer");
    // alpha, mobile version instead
    if(window.innerWidth<900){
        if(slider){
            type = ["loadMore",12]
            slider = false;
            loadMore = true;
            displayQuantity = 6
        }
        displaySize = "mobile"
    }
    mainContainer.classList.add(displaySize)
    window.addEventListener("resize", ()=>resizeCheck(displaySize,window.innerWidth)); 
    let orderName = sortObject.standardSort[1]
    if(sort[0]==='sort'){
        sortObject.addButtons(mainContainer,functionLog)
        orderName = sort[1][1]
console.log(orderName)
        selectSort(mainContainer,orderName)
        endURl.push(sort[1][0])
    }else{
        endURl.push(sortObject.standardSort[1][0])
    }
    

    if(displaySize==="pc"){
        if(slider){
            const minimumWidth = 200
            if(type[2]*minimumWidth>window.innerWidth){
                const newQuantity = Math.floor(window.innerWidth/minimumWidth)
                type[2] = newQuantity
                displayQuantity=newQuantity
            }
            container.classList.add("slider")
        }
        if(loadMore){
            //Overwriting the displayquantity to amke it look better
            // amountPerLine= Math.floor(document.body.clientWidth/productWidth)
            // displayQuantity = (Math.ceil(displayQuantity/amountPerLine)*amountPerLine)
        }
    }
   
    //Add ghost cards
    for(let i = 0 ; i < displayQuantity ; i++){
        container.innerHTML+=`<div class="loading-card ${productMainClasses()}"></div>`;
    }
    // api call what is first viewed
    const elements = await list.cacheCheck(place+sort[1][1],api.call(displayQuantity,endURl,headline))
    if(loadMore){
        loadMoreContainer.innerHTML = `<button id="loadMoreButton">load more</button>`;
    }
console.log("elements",elements)
    if(elements){
        // reset container before adding the real data
        container.innerHTML = slider ? `${sliderButtonsTemplate()}` : ""
        await renderElements(elements,elements.length,container,type)
        // add slider funcitons and load more button, including loading extra elements
        functionLog.container=container
        functionLog.loadMoreContainer=loadMoreContainer
        return functionLog    
    }
    return false
}

export async function addFunctions({headline,displayQuantity,type,sort,endURl,mainContainer,container,loadMoreContainer,place}){
        let secondLoadNumber= type[1];
        let renderStatus
        const allElements = await list.cacheCheck(place+sort[1][1]+secondLoadNumber,api.call(secondLoadNumber,endURl,headline+"2"))
        if(type[0]==='slider'){
            renderElements(allElements,allElements.length,container)
            checkSlider(mainContainer.id,displayQuantity,type[2])
        }
        if (type[0]==='loadMore') {  
            loadMoreContainer.addEventListener("click", async () =>{
                renderStatus = await renderElements(allElements,type[2]*2,container,'loadMore');
                console.log(renderStatus)
                if(!renderStatus){
console.log(loadMoreContainer)
                    loadMoreContainer.innerHTML=""
                }
            });
        }

    //To keep sort buttons disabled to after load
    const allButons = document.querySelectorAll("button");
    allButons.forEach(element => {
        element.disabled=false;
    });
    
    // if(searchField){
    //     searchResultContainer = searchField.querySelector("#search-container")
    //     searchAllElements = await getApi(productsUrl, 100, additionalUrl);
    //     function updateSearch(searchAllElements,search){
    //         if(search.length>1){
    //             renderElements(searchAllElements,searchAllElements.length,search)
    //         }else{
    //             searchResultContainer.innerHTML=""
    //         }
    //     }  
    //     document.querySelector("#search-input").addEventListener('keyup', function (){
    //         const scrollPosition = window.scrollY;
    //         updateSearch(searchAllElements,this.value)
    //         window.scrollTo(0, scrollPosition);
    //     });
    // }
// mark container as fully loaded
    mainContainer.classList.add("fully-loaded")
}
export async function renderElements(elements,quantity,container,type){    
    // calculate how many products already displayed
console.log(container,elements)
    const prevCount = container.querySelectorAll(".small-card").length
    let addNumber=prevCount
    if(type==='search'){
        console.log("rendering",elements.length)
        container.innerHTML=""
        addNumber=0
    }else{
        quantity=quantity+prevCount
    }
    if(type==='slider'){
        
    }
    for (let i = addNumber; i < quantity   ; i++) {

        if(!elements[i]){
                return false
            }
        if(type==='search'){
            console.log(elements[i])
        }
        const card = document.createElement('div');
        card.className = productMainClasses();
        card.innerHTML = productTemplate(elements[i])

        // add mouse click function
        card.addEventListener('click',()=>goToPage(elements[i]))

        container.appendChild(card);
        addNumber++
    }
    return true
}   
/**
 * Reset selected sort option and select the new one
 * @param {Object} mainContainer container that has the sort options
 * @param {string} sort sort shorthand
 */
export function selectSort (mainContainer,sort){
    const allSorts = mainContainer.querySelectorAll('.sort-button')
    allSorts.forEach((button)=>button.classList.remove('selected-sort'))
    const selectedSort = mainContainer.querySelector(`#${sort}`)
    selectedSort.classList.add("selected-sort")
}
        // // add keyboard click
        // card.setAttribute('tabindex', '0');

        // card.addEventListener('keydown', function (event) {
        //     if (event.keyCode === 13) {
        //         goToPage(element)
        //     }
        // });
        // card.addEventListener('mousedown',()=>clickFlag=true);
        // card.addEventListener('touchstart', () =>clickFlag = true);
        // card.addEventListener('focus', function() {
        //     if (!clickFlag) {
        //         quickView(element);
        //         window.scrollTo(0, 0);
        //     }
        //     clickFlag = false;
        // });   
        // if(inSearch){
        //     searchResultContainer.appendChild(card);
        // }else{
            
        // }