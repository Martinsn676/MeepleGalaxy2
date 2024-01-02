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
async function addSleeves(size,count,originID){
    const numericCount = parseInt(count, 10);
    toggleList([sleeveTransform(size),1,originID,numericCount],'cart')
}
function sleeveTransform(size){
    let id
    if(size==="57x87"){
        id=248
    }
    if(size==="44x68"){
        id=250
    }
    return id
}
function addAttributes(type,element,id){

    let newHtml = "" 

    element.attributes.forEach(element => {
        if(element.name===type){
            if(type==="sleeves"){
                element.terms.forEach(element => {
                    const splitted = element.name.split(' ');
                    newHtml+=`<button id="sleeve${sleeveTransform(splitted[0])}" onclick="addSleeves('${splitted[0]}','${splitted[1]}',${id})">${splitted[0]} (${splitted[1]})</button>`
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
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    // Set the 'id' parameter to 222
    params.set('id', element.id);

    // Replace the entire query string with the new parameters
    url.search = params.toString();
    updateTracker()
    // Update the URL without triggering a page reload
    history.pushState({}, '', url.toString());
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
function checkList(id,list,forced){  
    let child=false
    let inList=false
    let modify = []
    if (Array.isArray(id)) {
        checkID = id[0]
        child=true;
    }else{
        checkID = parseInt(id, 10);
    }
    for(let i = 0; i<list.length; i++){
        if(list[i][0]===checkID){

            modify.push([i])
            inList=true
        }
        if(list[i][2] && list[i][2]===checkID){
            modify.push([i])
            inList=true
        }
    }
    console.log(modify)
    if(inList){
        for(let i = 0; i<list.length; i++){
            console.log(i)
            modify.forEach(element => {
                console.log(element,element[i])
                if(element[i]===element){
                    if(forced==='add'){                
                        list[i][1]+=1
                    }else if(forced==='subtract' && list[i][1]>1){
                        list[i][1]-=1
                    }else{
                        list.splice(i,1)  
                    }
                }
            });

        }  
    }else{
        if(child){
            list.push(id)
        }else{
            list.push([id,1])
    }
}
return list
}
async function updateTracker(type){
    if(!type){
        updateTracker('cart')
        updateTracker('favs')
    }
    items = await JSON.parse(localStorage.getItem(type)) || []
    const counter = document.querySelector(`#${type}Number`)
    if(counter){
        counter.innerHTML=items.length
    }
    //checkForButtons(items,type)
    if(document.title==="Cart page"){
        addListContent('cart')
    }
    if(document.title==="Favorites page"){
        addListContent('favs')
    }

}
function getUrlId(){
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  return id
}
function checkForButtons(items,type){
    if(items){
        if(type==='cart'){
            const buyButton = document.querySelector("#addToCartButton")
            if(buyButton){
                if(checkList(getUrlId(),items)){
                    buyButton.classList.add('posButton')
                    buyButton.innerHTML="In cart"
                }else{
                    buyButton.classList.remove('posButton')
                    buyButton.innerHTML="Add to cart"
                }
            }
            const sleeveButtons = document.querySelector(".sleeveButton")
            if(sleeveButtons){
                sleeveButtons.forEach(element => {
                    element.classList
                });
            }
        }
        if(type==='favs'){
            const favsButton = document.querySelector("#addToFavsButton")
            if(favsButton){
                if(checkList(getUrlId(),items)){
                    favsButton.classList.add('posButton')
                    favsButton.innerHTML="In favorites"
                }else{
                    favsButton.classList.remove('posButton')
                    favsButton.innerHTML="Add to favorites"
                }
            }
        }        
    }
}
async function addListContent(type){
    const list = await JSON.parse(localStorage.getItem(type))
    const target = document.querySelector(`#list-container`)
    createListContent(list,type,target)
    
}
async function createListContent(list,type,target){
    let newHtml = ""
    let totalPrice = 0
    let productCost
    let secondAdd = []
    if(list && list.length>0){
        elements = await getApi(productsUrl)
        elements.forEach(element => {
            list.forEach(listContent => {
                if(element.id===listContent[0]){
                    if(type==='cart'){ 
                        productCost = parseInt(element.prices.price, 10);
                        totalPrice+=productCost*listContent[1]
                        if(listContent[2]){
                            secondAdd.push([element,listContent])
                        }else{
                            newHtml+=cartContentTemplate(element,listContent[1])

                        }

                    }
                    if(type==='favs'){
                        newHtml+=favsContentTemplate(element)
                    }

                }
            });
        });
    }
    if(newHtml===""){
        newHtml="nothing here, go away"
    }

    target.innerHTML=newHtml
    let collectedSleeves = []
    secondAdd.forEach(element => {
        addToTarget = target.querySelector(`#productID${element[1][2]} .container`)
        if(addToTarget){
            addToTarget.innerHTML+=smallCartContentTemplate(element[0],element[1][3])
            collectArray(element[0],element[1],collectedSleeves)

        }
    });
    collectedSleeves.forEach(element => {
        const sleevesNeeded = element[0][3]
        const setsWanted = element[0][1]
        const totalNeeded = sleevesNeeded*setsWanted
        const packsNeeded = Math.ceil(totalNeeded/55)

        target.innerHTML+=`
          
            <div id="sleeve-list" class="flex-column">
                <span>${element[1].name}</span>
                <span class="shift-rigth">
                ${priceDisplay(packsNeeded,element[1])}
            </span>
                <span> ${totalNeeded} sleeves (${packsNeeded*55-totalNeeded} spare)</span>
            </div>
  
            `
    });
    //target.innerHTML+=`<span class="shift-rigth">Total cost: ${totalPrice}</span>`
    

}
function collectArray(details,item,collection){
    let inCollection = false
    for(let i = 0; i < collection.length; i++){
        if(collection[i][0]===item[0]){
            collection[i][1]+=item[1]
            inCollection=true
        }
    }
    if(!inCollection){
        collection.push([item,details])
    }
    return collection
}
async function toggleList(id,type,forced){
    list = await JSON.parse(localStorage.getItem(type))

    let updatedList
    if(!list || list.length<1){
        updatedList = [[id,1]]
    }else{
        updatedList=checkList(id,list,forced)
    }
    localStorage.setItem(type, JSON.stringify(updatedList));
    updateTracker(type)

    
}
async function testAddToCart(type){

    testingGames = [[225,1],[221,1],[223,1],[217,1],[214,1]]
    elements=testingGames
    localStorage.setItem(type, JSON.stringify(elements));
    updateTracker(type)
}
