let clickFlag
let displaySize 

async function addBanner(id,target){
    let urlInfo
    if(target[0]==="category"){
        urlInfo="category="+target[1]
    }
    const mainContainer = document.querySelector(`#${id}`)
    const elements = await getApi(productsUrl,10,urlInfo)
    for(let i=0;i<10;i++){
        if(elements[i]){
        mainContainer.innerHTML+=bannerImageTemplate(elements[i],i)
        }
    }
}
function goToPage(element){
    localStorage.setItem('speedLoad', JSON.stringify(element));

        quickView(element)

}
function resizeCheck(changeFrom,width){
    if(changeFrom==="mobile" && width>900){
        displaySize="pc"
        location.reload();
    }
    if(changeFrom==="pc" && width<900){
        displaySize="mobile"
        location.reload();
    }
}
function addSleeves(sleeveSize,count){
    console.log(sleeveSize,count)
}
function addAttributes(type,element){
    let newHtml = "" 

    element.attributes.forEach(element => {
        if(element.name===type){
            if(type==="sleeves"){
                element.terms.forEach(element => {
                    const splitted = element.name.split(' ');
                    newHtml+=`<button onclick="addSleeves('${splitted[0]}','${splitted[1]}')">${splitted[0]} (${splitted[1]})</button>`
                });
              
            }
            if(type==="players"){
                if(!element.terms[1].name){
                    end = ` player`
                }else{
                    end = `-${element.terms[1].name} players`
                }
                newHtml+=`${element.terms[0].name+end}`
            }
            if(type==="time"){
                if(!element.terms[1]){
                    end = ` min`
                }else{
                    end = `-${element.terms[1].name} min`
                }
                newHtml+=`${element.terms[0].name+end}`
            }
            if(type==="designers"){
                newHtml="Designers: "
                element.terms.forEach(element => {
                    DGname=element.name
                    newHtml+=`<a href="#${DGname}">${DGname}</a> `
                });
            }
            if(type==="bgg"){
                newHtml= element.terms[0].name
            }
            if(type==="otherImages"){
                element.terms.forEach(element=>{
                    newHtml+=`
                        <img class="image" src='${element.name}'> 
                    `
                });         
            }
            if(type==="mechanics"){
                let customStyle=""
                // if(element.terms.length>9){
                //     customStyle='font-size: 10px;'
                // }
                element.terms.forEach(element=>{
                    newHtml+=`<li style='${customStyle}'>${element.name} </li>`
                });
            }
        }
    });
    
    return newHtml;
}
function quickView(element) {
    const quickViewContainer = document.querySelector(".quickView-container")
    if(quickViewContainer){
        
        quickViewContainer.innerHTML = `${quickViewTemplate(element)}`;
        quickViewContainer.scrollIntoView({
            behavior: 'smooth'
          });
        addModalClick(document.querySelectorAll(".big-card .image"))
    }else{
        location.href=`productPage.html?id=${element.id}`;
    }

}
function searchSkipCheck(elementName,search){
    if(elementName.toLowerCase().includes(search.trim().toLowerCase())){
        return false;
    }else{
        return true;
    }
}
async function addElements(place,headline,displayQuantity,type,addEndUrl) {
    let urlOrder
    let addNumber
    let secondLoadNumber= type[1];
    let allElements
    let slider = false;
    let loadMore = false;
    let selectedSort
    let additionalUrl = []
    let amountPerLine
    const sortOptions = [['titleAsc','Title Az'],['titleDesc','Title Za'],['dateDesc','Newest'],['dateAsc','Oldest']]
    if(type[0]==="slider"){slider=true;}
    if(type[0]==="loadMore"){loadMore=true;}

    //missing info and errorhandling
    if(!type){type=["",999,999]}
    if(!addEndUrl){addEndUrl=["",""]}
  
    const functionLog = [place,headline,displayQuantity,type,addEndUrl]
    console.log(functionLog)
    const  mainContainer = document.querySelector(`#${place}`)
    mainContainer.innerHTML = `${cardSection(functionLog)}`;
    const container = mainContainer.querySelector("#elements-container")
    mainContainer.querySelector("#sortButtonsID").innerHTML+=`
        ${addSortButtonTemplate(functionLog,sortOptions)}
    `;

    // alpha, mobile version instead
    if(window.innerWidth<900){
        if(slider){
            type = ["loadMore",12]
            slider = false;
            loadMore = true;
            displayQuantity = 6
        }
        displaySize = "mobile"
        window.addEventListener("resize", ()=> {
            resizeCheck(displaySize,window.innerWidth)
        }); 
        mainContainer.classList.add("display-section","mobile")
    }else{
        displaySize = "pc"
        window.addEventListener("resize", ()=>resizeCheck(displaySize,window.innerWidth)); 
        mainContainer.classList.add("display-section","pc")
    }

    let orderName = standardSort
    addEndUrl.forEach(element => {
        if(element[0]==="sort"){
            orderName = element[1]
            if(element[2] && element[2]==="hide"){
                mainContainer.querySelector(".sort-buttons").classList.add("hide")
            }
        }
    });
    selectedSort = mainContainer.querySelector(`#${orderName}`)
    selectedSort.classList.add("selected-sort")
    if(orderName === "titleAsc"){
        urlOrder = titleAsc
    }else if(orderName ==="titleDesc"){
        urlOrder = titleDesc
    }
    else if(orderName ==="dateAsc"){
        urlOrder = dateAsc
    }
    else if(orderName ==="dateDesc"){
        urlOrder = dateDesc
    }
    if(displaySize==="pc"){
        if(slider){
            container.classList.add("slider")
        }
        if(loadMore){

            amountPerLine= Math.floor(document.body.clientWidth/productWidth)

            displayQuantity = (Math.ceil(displayQuantity/amountPerLine)*amountPerLine)
        }
    }
   
    additionalUrl.push(urlOrder)
    if(addEndUrl[1]){
      additionalUrl.push(addEndUrl[1])  
    }

    for(let i = 0 ; i < displayQuantity ; i++){
            container.innerHTML+=`<div class="loading-card ${productMainClasses()}"></div>`;
        }
    // api call what is first viewed
    const elements = await getApi(productsUrl,displayQuantity,additionalUrl);
    if(elements){
        // reset container ebfore adding the real data
        if(slider){
            container.innerHTML=`${sliderButtonsTemplate()}`;
        }else{
            container.innerHTML=""
        } 
        renderElements(elements,(elements.length))

        // add slider funcitons and load more button, including loading extra elements
        addFunctions()

        // mark container as fully loaded
        mainContainer.classList.add("fully-loaded")
    }
    
    async function renderElements(elements,quantity,search){
        let inSearch = false;
        let elementName
        const prevCount = container.querySelectorAll(".small-card").length
        addNumber=prevCount
        searchResultContainer = document.querySelector("#search-container")
        if(searchResultContainer){
            searchResultContainer.innerHTML=""
        }
        if(search){
            inSearch = true
            addNumber=0
            searchResultContainer = document.querySelector("#search-container")
        }
        if(slider){
            quantity=quantity+prevCount
        }        
        for (let i = addNumber; i < quantity   ; i++) {
            if(!inSearch && slider && addNumber===elements.length){
                addNumber = 0;
            }
            const element = elements[addNumber];
            if(!element){
                break;
            }
            if(inSearch){
                if(search===""){
                    searchResultContainer.innerHTML=""
                    break;
                }
                
                        elementName = element.name
                
                
                if(searchSkipCheck(elementName,search)){
                    addNumber++
                    continue;
                }
            }
            const card = document.createElement('div');
           
                card.className = productMainClasses();
                card.innerHTML = productTemplate(element)
            

            // add mouse click function
            card.addEventListener('click',()=>goToPage(element))
            // add keyboard click
            card.setAttribute('tabindex', '0');

            card.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    goToPage(element)
                }
            });
            card.addEventListener('mousedown',()=>clickFlag=true);
            card.addEventListener('touchstart', () =>clickFlag = true);
            
            card.addEventListener('focus', function() {
                if (!clickFlag) {
                    quickView(element);
                    window.scrollTo(0, 0);
                }
                clickFlag = false;
            });   
            if(inSearch){
                searchResultContainer.appendChild(card);
            }else{
                container.appendChild(card);
            }
            addNumber++
            // hide load-more button if showing all
            if(loadMore){
                if(!elements[addNumber] && prevCount >0){
                    mainContainer.querySelector("#loadMoreContainer").innerHTML=""
                }
                //mainContainer.querySelector("#showingInfo").innerHTML=`Showing ${addNumber} of `
            }
        }
    }
    async function addFunctions(){
       
        if(slider){
            allElements = await getApi(productsUrl,secondLoadNumber,additionalUrl);
            renderElements(allElements,(allElements.length))
            checkSlider(mainContainer.id,displayQuantity,type[2])
        }
        if(loadMore){  
            const loadMoreContainer = mainContainer.querySelector("#loadMoreContainer")
            allElements = await getApi(productsUrl,secondLoadNumber,additionalUrl);
            if(allElements.length>addNumber){
                loadMoreContainer.innerHTML=""
                loadMoreContainer.innerHTML=`<button id="loadMoreButton" >load more</button> `
                mainContainer.querySelector("#loadMoreButton").addEventListener("click",()=>renderElements(allElements,addNumber*2))
            }
        }
        //To keep sort buttons disabled to after load
        allButons = mainContainer.querySelectorAll("button");
        allButons.forEach(element => {
            element.disabled=false;
        });
         
        if(searchField){
            function updateSearch(allElements,search){
                renderElements(allElements,allElements.length,search)
            }  
            document.querySelector("#search-input").addEventListener('keyup', function (){
                const scrollPosition = window.scrollY;
                updateSearch(allElements,this.value)
                window.scrollTo(0, scrollPosition);
            });
        }
    }

}
function checkList(id,elements){
    let inList = false
    const numericId = parseInt(id, 10);
    
    for(let i = 0; i<elements.length; i++){
        if(elements[i]===numericId){
            elements.splice(i,1)
            inList = true
            i--
        }

    }
    return inList
}
async function updateTracker(type){

    items = await JSON.parse(localStorage.getItem(type)) || []
    const counter = document.querySelector(`#${type}Number`)
    if(counter){
        counter.innerHTML=items.length
    }
    checkForButtons(items,type)

}
function checkForButtons(items,type){
    if(items){
        if(type==='cart'){
            const buyButton = document.querySelector("#addToCartButton")
            if(buyButton){
                if(checkList(getUrlId(),items)){
                    buyButton.innerHTML="In cart"
                }else{
                    buyButton.innerHTML="Add to cart"
                }
            }
        }
        if(type==='favs'){
            const favsButton = document.querySelector("#addToFavsButton")
            if(favsButton){
                if(checkList(getUrlId(),items)){
                    favsButton.innerHTML="In favorites"
                }else{
                    favsButton.innerHTML="Add to favorites"
                }
            }
        }        
    }
}
async function addListContent(type){
    const list = await JSON.parse(localStorage.getItem(type))
    const target = document.querySelector(`#list-container`)
    const html = await createListContent(list,type)
    target.innerHTML=html
}
async function createListContent(list,type){
    let newHtml = ""
    if(list && list.length>0){
        elements = await getApi(productsUrl)
        elements.forEach(element => {
            list.forEach(listContent => {
                if(element.id===listContent){
                    if(type==='cart'){
                        newHtml+=cartContentTemplate(element)
                    }
                    if(type==='favs'){
                        newHtml+=favsContentTemplate(element)
                    }

                }
            });
        });
    }
    if(newHtml===""){
        newHtml="nothing here"
    }
    
    return newHtml
}
async function toggleList(id,type){
    elements = await JSON.parse(localStorage.getItem(type))
    if(elements){
        if(!checkList(id,elements)){
            elements.push(id)
        }
    }else{
        elements = [id]
    }
    
    localStorage.setItem(type, JSON.stringify(elements));
    updateTracker(type)
    if(document.title==="Cart page"){
        addListContent('cart')
    }
}
