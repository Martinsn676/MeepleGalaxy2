const sliderItemWidth = window.innerWidth/150;
const maxSliderElements  = 5
const productsUrl = "https://prototype.meeplegalaxy.com/wp-json/wc/store/products";
const perPage = "per_page="

const blogsUrl = "https://prototype.meeplegalaxy.com/wp-json/wp/v2/posts";
const commentUrl = "https://prototype.meeplegalaxy.com/wp-json/wp/v2/comments?post="

let titleAsc = 'orderby=title&order=asc'
let titleDesc = 'orderby=title&order=desc';
let dateAsc = 'orderby=date&order=asc';
let dateDesc = 'orderby=date&order=desc';
let standardSort = `titleAsc`;
let showNumber = 0;
const blogWidth = 150
const productWidth = 180

async function getApi(url, pageCount,endUrlInfo, maxRetries = 1) {
  let endUrl = ""
  console.log(pageCount,endUrlInfo)
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


  console.log(url,endUrl)
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
// chat gpt attempt at post (disabled)
async function postApi(){
  const apiUrl = 'https://prototype.meeplegalaxy.com/wp-json/wp/v2/posts';

const postData = {
  title: 'Your Post Title',
  content: 'Your post content goes here.',
  status: 'publish', // You can set the post status (publish, draft, etc.)
};

const requestOptions = {
  method: 'POST',
  headers: {

  },
  body: JSON.stringify(postData),
};

fetch(apiUrl, requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log('Post created successfully:', data);
    // You can handle the response data here
  })
  .catch(error => {
    console.error('Error creating post:', error);
    // Handle errors here
  });
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
  let maxShow = 4;
  console.log(maxShow)
  showNumber += adjust;
  if(showNumber<0){
    showNumber += realQuantiy
  }
  if(showNumber>=realQuantiy){
    showNumber-=realQuantiy;
  }
 console.log(showNumber)
  if(maxShow>=maxElements){
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add("hidden-slider");
      if(i > showNumber-1 && count<maxShow && count < maxElements){
          items[i].classList.remove("hidden-slider");
          
          count++
      }
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
function cleanData(data){
  
  const div = document.createElement('div');
  div.innerHTML=data;
  let cleanData
  const cleanDataSpans = div.querySelectorAll("span");
  const cleanDataDivs = div.querySelectorAll("p");
  let returnData = ""
  if(cleanDataSpans.length>cleanDataDivs.length){
      cleanData = cleanDataSpans
    }else{
      cleanData = cleanDataDivs
  }
cleanData.forEach(element => {
    if(element.innerText.length>3){
    returnData += `<p>${element.innerText}</p>`

    }
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
function sortButtonClick(param1, param2, param3, param4, param5, order) {
  const scrollPosition = window.scrollY;
  addElements(param1, param2, param3, param4, param5, [order]);
  showNumber=0
  window.scrollTo(0, scrollPosition);
}
function toggleText(){
  document.querySelector(".text-box").classList.toggle("overflow-hidden")
}