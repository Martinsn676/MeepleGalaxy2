const sliderItemWidth = window.innerWidth/150;
const maxSliderElements  = 5
const productsUrl = "https://prototype.meeplegalaxy.com/wp-json/wc/store/products";
const perPage = "per_page="


let titleAsc = 'orderby=title&order=asc'
let titleDesc = 'orderby=title&order=desc';
let dateAsc = 'orderby=date&order=asc';
let dateDesc = 'orderby=date&order=desc';
let standardSort = `titleAsc`;
let showNumber = 0;


const productWidth = 180
async function getApi(url, pageCount,endUrlInfo, maxRetries = 1) {
  let endUrl = ""

  if(pageCount){
 
    endUrl += "?per_page="+pageCount;
    if (endUrlInfo) {
      for (let i = 0; i < endUrlInfo.length; i++) {
        if(endUrlInfo[i]===""){
          continue;
        }
        endUrl += "&" + endUrlInfo[i];
      }
    }
  
  }


  // Create an AbortController and an AbortSignal.
  const controller = new AbortController();
  const signal = controller.signal;
  // Add an event listener to handle the page unload.
  window.addEventListener('beforeunload', () => {
    controller.abort();
  });
  let retryCount = 0;
  while (retryCount <= maxRetries) {
    try {
      // Make the fetch request with the signal option.
      const result = await fetch(url + endUrl, { signal });

      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      } else {
        const json = await result.json();
        const data = await json;
        return data;
      }
    } catch (err) {
      // Log the full error for further investigation.
      console.error('getApi error:', err, 'when trying to load:', url + endUrl);

      // Retry only for ERR_EMPTY_RESPONSE and within the specified retry count
      if (err.message.includes('ERR_EMPTY_RESPONSE') && retryCount < maxRetries) {
        console.log('Retrying...');

        // Increment the retry count
        retryCount++;
      } else {
        // If it's not ERR_EMPTY_RESPONSE or reached max retries, throw the error
        throw err;
      }
    }
  } 

  // Remove the event listener when the fetch is complete or has failed.
  window.removeEventListener('beforeunload', () => {
    controller.abort();
  });
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
async function addSleeves(id,count,originID){
    const numericCount = parseInt(count, 10);
    if(document.title==='Cart page'){
cartChange([id,originID])
    }else{
      toggleList([id,1,originID,numericCount],'cart',0)

    }
}
export function sleeveTransform(size){
    let id = 0

    if(size==="41x63"){
        id=331
    }
    if(size==="59x91"){
        id=329
    }
    if(size==="57x87"){
        id=248
    }
    if(size==="63.5x88"){
        id=407
    }
    if(size==="44x68" || size==="44x67"){
        id=250
    }
    if(id===0){
      console.log("Sleeve size "+size+" not found, using recplacement")
      id=250
    }

    return id
}
function compressAccessories(list){
    let newList = []
    list.forEach(list => {
        let inList=false
        newList.forEach(newList => {
            if(newList[1][0]===list[1][0]){
                inList=true
                newList[1][1]+=list[1][1]
            }
        });
        if(!inList){
            newList.push(list)
        }
    });
    return newList
}
function compressSleeves(list){
console.log("list",list)
    let newList = []
    list.forEach(list => {
        let inList=false
        newList.forEach(newList => {
            if(newList[1][0]===list[1][0]){
                inList=true
                newList[1][3]+=list[1][3]*list[1][1]
                //newList[1][1]=Math.ceil(newList[1][3]/55)
            }
        });
        if(!inList){
            list[1][3]=list[1][3]*list[1][1]
            //list[1][1]=Math.ceil(list[1][3]/55)
            newList.push(list)
        }
    });
console.log("newList",newList)
    return newList
}
function productTypeCheck(testObject,testCollection){
    let reply = false
    if(testObject){
        testCollection.forEach(element => {
            let testObject2=element
            if(Array.isArray(element)){
                testObject2=element[0]
            }
            if(testObject===testObject2){
                reply=true
            }
        });
    }
    return reply
}
function checkSlider(id,maxElements,slideJump) {

  if(!slideJump){slideJump=1;}
  let sliderItems;

  sliderItems = document.querySelectorAll(`#${id} .card`);
  document.querySelector(`#${id} .left-slider`).addEventListener("click", () => {
    event.target.disabled=true;
    updateSlider(-slideJump, sliderItems,maxElements)
    event.target.disabled=false;
  });
  document.querySelector(`#${id} .right-slider`).addEventListener("click", () => {
    event.target.disabled=true;
    updateSlider(slideJump, sliderItems,maxElements)
    event.target.disabled=false;
  });
  updateSlider(0, sliderItems,maxElements)
}
function updateSlider(adjust, items,maxElements) {
  const realQuantiy = items.length-maxElements;
  let count = 0;

  let maxShow = maxElements;



  showNumber += adjust;
  if(showNumber<0){
    showNumber += realQuantiy
  }
  if(showNumber>=realQuantiy){
    showNumber-=realQuantiy;
  }


  for (let i = 0; i < items.length; i++) {
    items[i].classList.add("hidden-slider");
    if(i > showNumber-1 && count<maxShow){
        items[i].classList.remove("hidden-slider");
        
        count++
    }
  }   
  
}
function addModalClick(item){ 
  item.forEach(element => {
    element.addEventListener("click", (element)=>{
      displayModal(element)
    });
  });
}
function displayModal(element){
    const modal = document.querySelector("#modal")
  if(modal){
    modal.addEventListener("click",()=>modal.classList.add("hide-modal"));
    document.querySelector("#modal-image").innerHTML=`${element.target.outerHTML}`
    modal.classList.remove("hide-modal")
    
  }
}
function cleanData(data) {
  const div = document.createElement('div');
  div.innerHTML = data;

  const cleanDataSpans = div.querySelectorAll("span");
  const cleanDataDivs = div.querySelectorAll("p");
  const cleanDataBreaks = div.querySelectorAll("br");

  let returnData = "";

  // Concatenate the inner text of <span> and <p> elements
  cleanDataSpans.forEach(span => {
    const innerText = span.innerText.trim();
    if (innerText.length > 3) {
      returnData += `<p>${innerText}</p>`;
    }
  });

  cleanDataDivs.forEach(p => {
    const innerText = p.innerText.trim();
    if (innerText.length > 3) {
      returnData += `<p>${innerText}</p>`;
    }
  });

  // Append breaks to the result
  cleanDataBreaks.forEach(br => {
    returnData += "<br>";
  });

  return returnData;
}
function cleanTime(date){
  const parsedDate = moment(date, 'YYYY-MM-DD');
  const formattedDate = parsedDate.format('DD-MM-YYYY')
  return formattedDate
}
function handleFocus(element) {
      quickView(element);
      // You can do additional actions or apply styles here
}
function sortButtonClick(param1, param2, param3, param4, order) {
  const scrollPosition = window.scrollY;
   addElements(param1,param2, param3, param4, [order]);
  showNumber=0
  window.scrollTo(0, scrollPosition);
}
function toggleText(){
  document.querySelector(".text-box").classList.toggle("overflow-hidden")
}
function getUrlId(){
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  const numberID = parseInt(id, 10);
  return numberID
}
async function getList(type){
    list = await JSON.parse(localStorage.getItem(type))
    return list
}
async function saveList(name,items){
  localStorage.setItem(name, JSON.stringify(items));

}
async function removeList(name){
  localStorage.removeItem(name);
}
function quickView(element) {
    const quickViewContainer = document.querySelector(".quickView-container")
    const scrollTop  = document.querySelector("#search")
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
      scrollTop.scrollIntoView({
          behavior: 'smooth'
        });
      addModalClick(document.querySelectorAll(".big-card .image"))
    }else{
      localStorage.setItem('speedLoad', JSON.stringify(element));
      location.href=`productPage.html?id=${element.id}`;
    }

}
async function addBanner(id,target){
    let urlInfo
    const displayQuantity = 20
    if(target[0]==="category"){
        urlInfo="category="+target[1]
    }
    const mainContainer = document.querySelector(`#${id}`)
    const elements = await getApi(productsUrl,displayQuantity,[urlInfo])
    for(let i=0;i<displayQuantity;i++){
        if(elements[i]){
        mainContainer.innerHTML+=bannerImageTemplate(elements[i],i)
        }
    }
}
function goToPage(element){

    
    quickView(element)
    
}
function compareByValue(a,b){
      // Convert the values to numbers for comparison
  const valueA = Number(a[1][0]);
  const valueB = Number(b[1][0]);
  // Compare the numeric values
  if (valueA < valueB) {
    return -1;
  }
  if (valueA > valueB) {
    return 1;
  }
  // If values are equal, no change in order
  return 0;
}
