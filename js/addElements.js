let clickFlag
let displaySize 
async function testAddToCart(){

//[217,1],[214,1] [[225,1],[221,1],[214,1],[250,1,225,40],[248,1,225,50],[250,1,221,40],[248,1,221,50]]

    const cartTestingGames = [[225,1],[217,1],[214,1],[250,1,225,40],[319,1,318],[318,1]]
    const favsTestingGames = [[225,1],[217,1],[214,1]]
    localStorage.removeItem('tempCartLoad');
    localStorage.removeItem('finalCart');
    localStorage.setItem('cart', JSON.stringify(cartTestingGames));
    localStorage.setItem('favs', JSON.stringify(favsTestingGames));
    updateTracker()
}
function addOtherImages(element){
  const images = element.images
  let reply = ""
  for(let i = 1; i<images.length; i++){
      reply+=`
          <img class="image" src='${images[i].src}'> 
      `   
  }
  return reply
}
async function addChilds(place,children){
    let childrenInfo = []
    let reply = ""
    for (const childElement of children) {
        childrenInfo.push(await getApi(productsUrl+"/"+childElement))
    }
    const resolvedChildrenInfo = await Promise.all(childrenInfo); 
    for (const child of resolvedChildrenInfo) {
        reply+=`<div class="card small-card product-card flex-row">${productTemplate(child)}</div>`
    }
    const target = document.querySelector(`#${place} #childSection`)
    if(target){target.innerHTML=reply}
    return 
}
function addStockLevel(element){
    const stock = element.is_in_stock
    let reply = ""
    if(stock){
        reply="In stock"    
    }else{
        reply="No stock"
    }
    return reply
}
function addAttributes(type, mainElement, test) {
    let reply = "";

    for (const element of mainElement.attributes) {
console.log(mainElement.id,element.name,type)
        if (element.name===type) {

            if (element.terms[0]) {
                if (type === "year") {
                    reply = `(${element.terms[0].name})`;
                }
                if (type === "age") {
            console.log(type,element.terms)
                    reply = `${element.terms[0].name}+ years`;
                }
                if(type === "parent"){
                    if(element.terms[0]){
                        reply=element.terms[0].name
                    }
                }
                if (type === "child") {
                    const children = element.terms.map(childElement => parseInt(childElement.name, 10));
                    reply=children
                }
                if (type === "sleeves") {
                return element.terms.map(element => {
                    const splitted = element.name.split(' ');
                    return `<button id="${sleeveTransform(splitted[0])}" onclick="addSleeves('${splitted[0]}','${splitted[1]}',${mainElement.id})">${splitted[0]} (${splitted[1]})</button>`;
                    }).join('');
                }
                if(type==="players"){
                    const end = !element.terms[1] ? " player" : `-${element.terms[1].name} players`;
                    reply+=`${element.terms[0].name+end}`
                
                    
                }
                if(type==="time"){
                    if(!element.terms[1]){
                        end = ` min`
                    }else{
                        end = `-${element.terms[1].name} min`
                    }
                    reply+=`${element.terms[0].name+end}`
                }
                if(type==="designers"){
                    reply="Designers: "
                    element.terms.forEach(element => {
                        if(element.name!="David Digby"){
                            DGname=element.name
                            reply+=`<a href="#${DGname}">${DGname}</a> `
                        }
                        
                    });
                }
                if(type==="publisher"){
                    reply="Designers: "
                    element.terms.forEach(element => {
                        if(element.name!="David Digby"){
                            DGname=element.name
                            reply+=`<a href="#${DGname}">${DGname}</a> `
                        }
                        
                    });
                }
                if(type==="bgg"){
                    reply= element.terms[0].name
                }
                if(type==="otherImages"){
                    element.terms.forEach(element=>{
                        reply+=`
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
                        reply+=`<li style='${customStyle}'>${element.name} </li>`
                    });
                }
            }
        }
    }
    if(test===true){
        if(reply.length>0){
            reply=true;
        }else{
            reply=false;
        }
    }
    return reply;
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
            const minimumWidth = 200
            if(type[2]*minimumWidth>window.innerWidth){
                const newQuantity = Math.floor(window.innerWidth/minimumWidth)
                type[2] = newQuantity
                displayQuantity=newQuantity
            }
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
        if (loadMore) {  
    const loadMoreContainer = mainContainer.querySelector("#loadMoreContainer");
    allElements = await getApi(productsUrl, secondLoadNumber, additionalUrl);
    if (allElements.length > addNumber) {
        loadMoreContainer.innerHTML = "";
        loadMoreContainer.innerHTML = `<button id="loadMoreButton">load more</button>`;
        mainContainer.querySelector("#loadMoreButton").addEventListener("click", () => renderElements(allElements, addNumber * 2));
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
async function addListContent(type){
    const list = await JSON.parse(localStorage.getItem(type))
    const target = document.querySelector(`#list-container`)
    createListContent(list,type,target)
}
async function addCheckoutListContent(type){
    const list = await JSON.parse(localStorage.getItem('finalCart'))
    const target = document.querySelector(`#list-container`)
    createListContent(list,type,target,"simple")
}
async function createListContent(list,type,target,version){
    let newHtml = ""
    let totalPrice = 0
    let productCost
    let normalCollection = []
    let sleevesCollection = []
    let accessorieCollection = []
    if(!version){version=""}
    if(list && list.length>0){
        const tempList = await getList('tempCartLoad')
        if(!tempList){
            allProducts = await getApi(productsUrl,100)
            localStorage.setItem('tempCartLoad', JSON.stringify(allProducts));
        }else{
            allProducts = tempList
        }
        allProducts.forEach(element => {
            list.forEach(listContent => {
                if(element.id===listContent[0]){
                    if(type==='cart'){ 
                        if(version==="trace"){console.log("a",listContent[0])}
                        productCost = parseInt(element.prices.price, 10)
                        if(version==="simple"){
                             newHtml+=cartContentTemplate(element,listContent[1],"simple")
                            totalPrice+=productCost*listContent[1]
                        if(version==="trace"){console.log("b1")}

                        }else{
                        if(version==="trace"){console.log("b2")}

                            if(listContent[3]>0){
                                sleevesCollection.push([element,listContent])
                        if(version==="trace"){console.log("c1")}

                            }else{
                        if(version==="trace"){console.log("c2")}

                                totalPrice+=productCost*listContent[1]
                                if(listContent[2]){
                        if(version==="trace"){console.log("d1")}

                                    accessorieCollection.push([element,listContent])
                                }else{
                        if(version==="trace"){console.log("d2")}

                                    let children = addAttributes("child",element)
                                    if(children.length>0){
                                        children.forEach(child => {
                                            accessorieCollection.push(["",[child,0,element.id]])
                                        });
                                        
                                    }
                                    normalCollection.push(listContent)
                                    newHtml+=cartContentTemplate(element,listContent[1])
                                }
                            }

                        }
                        
                    }
                    if(type==='favs'){
                        newHtml+=favsContentTemplate(element)
           }   }   }); });
        accessorieCollection.forEach(listContent => {
            allProducts.forEach(elements => {
                if(listContent[0]===""){
                    if(elements.id===listContent[1][0]){
                        listContent[0]=elements
                    }
                }
            });
        });
    }
    if(newHtml===""){
        newHtml="nothing here, go away"
    }   
    
    target.innerHTML=newHtml


    accessorieCollection=compressAccessories(accessorieCollection)
    accessorieCollection.sort(compareByValue)
    if(accessorieCollection.length>0){
        accessorieCollection.forEach(element => {
            totalPrice+=element[0].prices.price*element[1][1]
            let addToTarget = target.querySelector(`#productID${element[1][2]}`)
            if (addToTarget) {
                addToTarget.classList.add('accessorieExpanded')
                let container = addToTarget.querySelector(".accessories .container")
                if(element[1][1]===0){
                    container.innerHTML += accessorieContentTemplate(element[0],false)
                }else{
                    container.innerHTML += accessorieContentTemplate(element[0],true)
                }
            }else{
                target.innerHTML+= `<div>${cartContentTemplate(element[0],element[1][1])}</div>`
            }
        });
    }
    sleevesCollection.forEach(element => {
        let addToTarget = target.querySelector(`#productID${element[1][2]} .sleevesContainer`);
        if (addToTarget) {
            addToTarget.innerHTML += sleeveContentTemplate(element[0], element[1][3] * element[1][1]);
        }else{
            target.innerHTML+=cartContentTemplate(element[0], Math.ceil(element[1][3] * element[1][1] /55))
        }
    });
    sleevesCollection=compressSleeves(sleevesCollection)
    let finalCartCollection = []
    sleevesCollection.forEach(element => {
        finalCartCollection.push([element[1][0],element[1][1]])
    });
    normalCollection.forEach(element => {
        finalCartCollection.push(element)

    });
    accessorieCollection.forEach(element => {
        if(element[1][1]>0){
            finalCartCollection.push([element[1][0],element[1][1]])
        }
    });
    if(!version){
        localStorage.setItem('finalCart', JSON.stringify(finalCartCollection));
    }
    bottomPartCart(sleevesCollection,target,totalPrice)
}
function bottomPartCart(sleevesCollection,target,totalPrice){
    sleevesCollection.forEach(element => {
        const sleevesNeeded = element[1][3]
        const setsWanted =element[1][1]
        const leftover=setsWanted*55-sleevesNeeded
        totalPrice+=element[0].prices.price*setsWanted
        if(leftover>0){
            leftoverMessage=leftover+" spare"
        }else{
            leftoverMessage=leftover+" missing"
        }
        target.innerHTML+=`
            <div id="sleeve-list" class="flex-column">
                <span>${element[0].name}</span>
                <span> ${sleevesNeeded} sleeves (${leftoverMessage})</span>
                <span class="shift-right">
                    ${priceDisplay(setsWanted,element[0])}
                </span>
            </div>
            `
    });
    target.innerHTML+=`
        <div class="flex-column shift-right">
            <span>Total cost: ${totalPrice}</span>
            <a class="checkoutLink" href="checkout.html">Checkout</a>
        </div>
    `

}
async function toggleList(id,type,forced){
    const list = await getList(type)
    if(!forced){
      forced=0
    }
    let updatedList = []
    if(!list || list.length<1){
        if(Array.isArray(id)){
            updatedList.push(id)
        }else{
            updatedList.push([id,1])
        }
    }else{
        await updateList(id,list,forced)
        updatedList=list
    }
    localStorage.setItem(type, JSON.stringify(updatedList));
    updateTracker(type)  
}
async function updateList(id, list,forced) {
    let modify = [];
    if (await inListCheck(id,list,modify)) {
        const listLength = list.length;
        for (let i = listLength - 1; i >= 0; i--) {
            if (modify.includes(i)) {
                if (forced) {
                    if (forced === 0) {

                        list[i][1] = 0;
                    } else {
                        list[i][1] += forced;
                }   }
                if (!forced || list[i][1] < 1) {
                    list.splice(i, 1);
        }   }   }
    } else {

        if (Array.isArray(id)){
            list.push(id);
        } else {
            list.push([id, 1]);
    }   }
    return
}
async function inListCheck(id,list,modify) {
    let found = false;
    let anArray = false
    let checkID = id
    let checkID2 = []  
    if(Array.isArray(checkID)){
        checkID=id[0]
        checkID2=id[2]
        anArray=true
    }
    for (let i = 0; i < list.length; i++) {
        if(anArray){
            if(list[i][2] && list[i][0]===checkID && list[i][2] === checkID2){
                found = true;
                if (modify) {
                    modify.push(i);
                }
            }
            if (!checkID2 && list[i][0] === checkID) {
                if (modify) {
                    modify.push(i);
                }
                found = true;
            }
            if(productTypeCheck(list[i][0],sleevesIDs) && !checkID2){
                if (list[i][2]===checkID) {
                    if (modify) {
                        modify.push(i);
                    }
                }
            }
            
        }else{
            if (list[i][0] === checkID) {
                if (modify) {
                    modify.push(i);
                }
                found = true;
            }
            if (list[i][2] && list[i][2] === checkID) {
                if (modify) {
                    modify.push(i);
                }
                found = true;
    }   }   }
    return found;
}
async function updateTracker(type){
    if(!type){
        updateTracker('cart')
        updateTracker('favs')
    }else{
        const items = await getList(type) || []
        const counter = document.querySelector(`#${type}Number`)
        if(counter){
            counter.innerHTML=items.length
        }
        checkForButtons(items,type)
        if(document.title!="Cart page"){

        }
        if(document.title==="Cart page" && type==='cart'){
           addListContent('cart',)
        }
        if(document.title==="Favorites page" && type==='favs'){

           addListContent('favs')
        }
    }
}
async function checkForButtons(list, type) {
    
    if (list) {
        if (type === 'cart') {
            const buyButton = document.querySelector("#addToCartButton");
            if (buyButton) {
                if (await inListCheck([getUrlId()], list)) {
                    buyButton.classList.add('posButton');
                    buyButton.innerHTML = "In cart";
                } else {
                    buyButton.classList.remove('posButton');
                    buyButton.innerHTML = "Add to cart";
                }
            }
            const addonButtons = document.querySelectorAll(".top-section button");
            addonButtons.forEach(async (element) => {

                const id = parseInt(element.id.replace(/\D/g, ''), 10);
                if(getUrlId()){
                    if (await inListCheck([id,1,getUrlId()], list)) {
                        element.classList.add('posButton');
                    } else {
                        element.classList.remove('posButton');
                    }
                }

            });

        }
        if (type === 'favs') {
            const favsButton = document.querySelector("#addToFavsButton");
            if (favsButton) {
                if (await inListCheck([getUrlId()], list)) {
                    favsButton.classList.add('posButton');
                    favsButton.innerHTML = "In favorites";
                } else {
                    favsButton.classList.remove('posButton');
                    favsButton.innerHTML = "Add to favorites";
                }
            }
        }
    }
}
