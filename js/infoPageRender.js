async function infoPageRender(place,type){
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  let element;
  let template;
  
  let speedLoadElement = []
  speedLoadElement = await JSON.parse(localStorage.getItem('speedLoad'))
  document.querySelector(`#${place}`).classList.add("info-page")
  if(speedLoadElement && id===JSON.stringify(speedLoadElement.id)){
    console.log('speedLoad')
    element = speedLoadElement
  }else{
    if(type==="blog"){
      element = await getApi(blogsUrl+"/"+id,["_embed"]);
    }else if(type==="product"){
      element = await getApi(productsUrl+"/"+id,["_embed"]);
    }
  }
  if(element){
    if(type==="blog"){
      template = blogPageTemplate(element)
    }else if(type==="product"){
      template = productPageTemplate(element);
    }
    
    renderPage(place,template)
    function renderPage(place,template){
    document.querySelector(`#${place}`).innerHTML=`${template}`;

    
    opacityBlur = document.querySelector(".opacityBlur")
      if(opacityBlur){opacityBlur.addEventListener("click",()=>toggleText())}
      addModalClick(document.querySelectorAll(".image"),"bgImg")
      addModalClick(document.querySelectorAll("img"),"img")
    }
    const imagesAll = document.querySelectorAll("img")
    imagesAll.forEach(element => {
element.onerror = function() {
    console.log("Error loading image:", element.src);
    element.style.display="none"
    // You can perform additional actions here, such as replacing the image with a placeholder
    // element.src = 'placeholder-image.jpg';
  };
    });
  }
}

// loadComments(id)
    // document.querySelector(`#${place}`).innerHTML+=`
    // <div id="new">
    //   <button onclick='newComment("new")'> New comment </button>
    // </div>`
async function loadComments(id){
  comments = await getApi(commentUrl+id)
  let html =""
  const commentContainer = document.querySelector(`#comments-container`)
  if(comments.length===0){
    commentContainer.innerHTML="No comments yet"
    return
  }
  comments.forEach(element => {
    if(element.parent===0){
      html+=`
        <div class="comment">
          <span>${cleanTime(element.date)} wrote ${element.author_name}  </span>
          <p>${cleanData(element.content.rendered)}</p>
          <span id='comment${element.id}'></span>
          <div id='newCommentContainer${element.id}' class="reply-container flex-column comment-reply">
            <button onclick='newComment(${element.id})'>Reply to ${element.author_name}</button>
          </div>
        </div>
      `;
      
    }
  });
  commentContainer.innerHTML+=html
  comments.forEach(element => {
  if(element.parent>0){
    hook = commentContainer.querySelector("#comment"+element.parent)
    hook.innerHTML+=`<div class="comment-reply">
      <span>${cleanTime(element.date)} replied ${element.author_name}  </span>
      <p>${cleanData(element.content.rendered)}</p>
      <span id='comment${element.id}'></span>
    </div>
`;
  }
  });
  
  
}
function newComment(id){
  if(id==="new"){
    hook = document.querySelector(`#new`)
    hook.innerHTML=`<div class="flex-column">
      <textarea type="text" class="input" name="message"></textarea>
      <button>Post comment</button>
    </div>
  `;
  }else{
    hook = document.querySelector('#newCommentContainer'+id)
    hook.innerHTML=`
    <textarea type="text" id="messageContainer${id}" class="input" name="message"></textarea>
    <button>Post reply</button>
  `;
  }
  
  hook.querySelector("button").addEventListener("click",() =>postComment(hook,id))
  
}
function postComment (hook,id){
  inputField = hook.querySelector("textarea")
  if(id==="new"){
    const commentContainer = document.querySelector(`#comments-container`)
    commentContainer.innerHTML+=`
        <div class="comment">
          <span>You commented  </span>
          <p>${inputField.value}</p>
          
        </div>
      `;
    inputField.value=""
  }else{
    if(inputField.value.length>0){
      replyPlace = document.querySelector("#comment"+id)
      replyPlace.innerHTML+=`<div class="comment-reply">
            <span>You replied</span>
            <p>${inputField.value}</p>
          </div>`
      hook.innerHTML=""
    }
  }
}