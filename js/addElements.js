let clickFlag
let displaySize 
async function addElements(place,headline,itemType,displayQuantity,type,order) {   

    let apiUrl
    let urlOrder
    let orderName
    let addNumber
    let secondLoadNumber
    let allElements
    let products = false;
    let blogs = false;
    let wideBlogs = false;
    let slider = false;
    let loadMore = false;
    let selectedSort
    let additionalUrl = ""
    let amountPerLine
    if(itemType==="products"){products=true;}
    if(itemType==="blogs"){blogs=true;}
    if(itemType==="wide-blogs"){wideBlogs=true;}
    if(type[0]==="slider"){slider=true;}
    if(type[0]==="loadMore"){loadMore=true;}

    //missing info and errorhandling
    if(!type){type=["",999,999]}
    if(!order){order=["",""]}
  
    const functionLog = [place,headline,itemType,displayQuantity,type,order]
    const  mainContainer = document.querySelector(`#${place}`)
    mainContainer.innerHTML = `${cardSection(functionLog)}`;
    const container = mainContainer.querySelector("#elements-container")
    
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

    // handling template absed on product type
    if(products){
        mainTemplate = productMainClasses();
        apiUrl = productsUrl;
    }else{
        apiUrl = blogsUrl;
        additionalUrl = "_embed"
    }
    if(blogs){
        mainTemplate = blogMainClasses();
    }
    if(wideBlogs){
        mainTemplate = wideBlogMainClasses();
    }
    mainContainer.querySelector("#sortButtonsID").innerHTML+=`
        ${addSortButtonTemplate(functionLog,[['titleAsc','Title Az'],['titleDesc','Title Za'],['dateDesc','Newest'],['dateAsc','Oldest']])}
    `;
    if(!order[0]){
        order[0]=standardSort
    }
    selectedSort = mainContainer.querySelector(`#${order[0]}`)
    if(!selectedSort){
        orderName = standardSort
        selectedSort = mainContainer.querySelector(`#${orderName}`)
    }else{
        orderName=order[0]
    }
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
    if(order[1]==="hide"){
        mainContainer.querySelector(".sort-buttons").classList.add("hide")
    }
    if(displaySize==="pc"){
        if(slider){
            container.classList.add("slider")
        }
        if(loadMore){
            if(products){
                amountPerLine= Math.floor(document.body.clientWidth/productWidth)
                
            }else{
                amountPerLine= Math.floor(document.body.clientWidth/blogWidth)
            }
            displayQuantity = (Math.ceil(displayQuantity/amountPerLine)*amountPerLine)
        }
    }
    if(loadMore){
        secondLoadNumber = type[1];
    }

    //     slider=true;
    // }else{
    //     loadMore=true;
    //     displayQuantity=2
    // }
    
    for(let i = 0 ; i < displayQuantity ; i++){
            container.innerHTML+=`<div class="loading-card ${mainTemplate}"></div>`;
        }
    // api call what is first viewed
    const elements = await getApi(apiUrl,[perPage+displayQuantity,urlOrder,additionalUrl]);
    if(elements){
        // reset container ebfore adding the real data
        if(slider){
            container.innerHTML=`${sliderButtonsTemplate()}`;
        }else{
            container.innerHTML=""
        } 
        renderElements(elements,(elements.length),itemType)

        // add slider funcitons and load more button, including loading extra elements
        addFunctions()

        // mark container as fully loaded
        mainContainer.classList.add("fully-loaded")
    }
    
    async function renderElements(elements,quantity,itemType,search){
        let inSearch = false;
        let elementName
        const prevCount = container.querySelectorAll(".small-card").length
        addNumber=prevCount
        searchResultContainer = document.querySelector("#search-container")
        if(searchResultContainer){
            searchResultContainer.innerHTML=""
        }
        if(search){
            console.log("re")
            inSearch = true
            addNumber=0
            searchResultContainer = document.querySelector("#search-container")
        }
        if(slider){
            quantity=quantity+prevCount
        }        
        for (let i = addNumber; i < quantity   ; i++) {
            if(slider && addNumber===elements.length){
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
                if(products){
                        elementName = element.name
                    }else{
                        elementName = element.title.rendered
                    }
                
                if(searchSkipCheck(elementName,search)){
                    addNumber++
                    continue;
                }
            }
            const card = document.createElement('div');
            if(products){
                card.className = productMainClasses();
                card.innerHTML = productTemplate(element)
            }
            if(blogs){
                card.className = blogMainClasses();
                card.innerHTML = blogTemplate(element)
            }
            if(wideBlogs){
                card.className = wideBlogMainClasses();
                card.innerHTML = wideBlogTemplate(element);
                
            }
            // add mouse click function
            card.addEventListener('click',()=>goToPage(itemType,element))
            // add keyboard click
            card.setAttribute('tabindex', '0');

            card.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    goToPage(itemType,element)
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
            allElements = await getApi(apiUrl,[perPage+type[1],urlOrder]);
            renderElements(allElements,(allElements.length),itemType)
            checkSlider(mainContainer.id,displayQuantity,type[2])
        }
        if(loadMore){  
            const loadMoreContainer = mainContainer.querySelector("#loadMoreContainer")
            allElements = await getApi(apiUrl,[perPage+secondLoadNumber,urlOrder]);
            if(allElements.length>addNumber){
                const skipNumber = addNumber
                loadMoreContainer.innerHTML=""
                loadMoreContainer.innerHTML=`<button id="loadMoreButton" >load more</button> `
                mainContainer.querySelector("#loadMoreButton").addEventListener("click",()=>renderElements(allElements,addNumber*2,itemType))
            }
        }
        //To keep sort buttons disabled to after load
        allButons = mainContainer.querySelectorAll("button");
        allButons.forEach(element => {
            element.disabled=false;
        });
         
        if(searchField){
            function updateSearch(allElements,search){
                renderElements(allElements,allElements.length,itemType,search)
            }  
            document.querySelector("#search-input").addEventListener('keyup', function (){
                const scrollPosition = window.scrollY;
                updateSearch(allElements,this.value)
                window.scrollTo(0, scrollPosition);
            });
        }
    }

}
function goToPage(itemType,element){
    localStorage.setItem('speedLoad', JSON.stringify(element));
    if(itemType=="blogs" || itemType=="wide-blogs"){  
        location.href=`blogPage.html?id=${element.id}`;
    }else if(itemType=="products"){
        quickView(element)

    }
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

function addAttributes(type,element){
    let newHtml = "" 
    element.attributes.forEach(element => {
        if(element.name===type){
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
                console.log(element.terms)
                element.terms.forEach(element => {
                    DGname=element.name
                    
                    newHtml+=`<a href="#${DGname}">${DGname}</a> `
                });
            }
            if(type==="bgg"){
                newHtml=`<a href='${element.terms[0].name}' target='_blank'><img class="link-logo" src='https://prototype.meeplegalaxy.com/wp-content/uploads/2023/11/BoardGameGeek_Logo.svg_.png'></a>`
            }
            if((type==="otherImages")){
                element.terms.forEach(element=>{
                    newHtml+=`
                        <div class="contain-image blog-image image" style="background-image: url('${element.name}')"></div>  

                    `
                })
            }

        }
    });
    
    return newHtml;
}
// function addAttributePC(element){
//     let newHtml=""
//     if(!element.terms[1].name){
//         end = ` player`
//     }else{
//         end = `-${element.terms[1].name} players`
//     }
//     newHtml+=`${element.terms[0].name+end}`

//     return newHtml
// }
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