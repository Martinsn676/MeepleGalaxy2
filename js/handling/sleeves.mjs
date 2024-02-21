export function addSleeveButtons(element,id){
  let html=""
  if(typeof element==='array'){
    element.forEach(slv => {
      html+=`
        <button 
          id="sleeveID${slv[0]}" 
          class="bordered" 
          onclick="addSleeves(${slv[0]},'${slv[2]}',${id})">${slv[2]} x (${slv[1]})
        </button>
      `;
    });
  }
  return html
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
