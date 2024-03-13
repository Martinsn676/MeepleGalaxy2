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