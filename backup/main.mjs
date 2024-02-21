


function addOtherImages2({images}){
  const reply = images.reduce((output,{src})=>{
        output+=`<img class="image" src='${src}'>`   
        return output
    },"")
     

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



function searchSkipCheck(elementName,search){
    if(elementName.toLowerCase().includes(search.trim().toLowerCase())){
        return false;
    }else{
        return true;
    }
}




/* ==================global==============*/

async function addSleeves(id,count,originID){
    const numericCount = parseInt(count, 10);
    if(document.title==='Cart page'){
cartChange([id,originID])
    }else{
      toggleList([id,1,originID,numericCount],'cart',0)

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

function createCartButtons(id) {
console.log("button id",id)
  const minusButton = createCartButton('-',id,-1);
  const plusButton = createCartButton('+',id,1);
  const deleteButton = createCartButton('Delete',id,0);

  return [minusButton.outerHTML, plusButton.outerHTML, deleteButton.outerHTML];
}

function createCartButton(text, id,change) {
console.log("button id",id)
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('onclick', `cartChange([${id[0]},${id[2]}],${change})`);
  return button;
}

async function cartChange(id, change) {
  const list = await getList('newCart');
  const [id1, id2] = Array.isArray(id) ? id : [id, undefined];
  list.forEach(item => {
    const isMatchingId = item[0] === id1;
    const isMatchingSecondId = id2 && id2 === item[2];

    if ((id2 && isMatchingId && isMatchingSecondId) || (!id2 && isMatchingId)) {
      item[1] = change ? item[1] + change : item[1] === 0 ? 1 : 0;
    }
  });

  saveList('newCart', list);
  createListContent();
}


/* ==================other templates==============*/
/* ==== Header ==== */



