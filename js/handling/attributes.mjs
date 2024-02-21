import { sleeveTransform } from "./sleeves.mjs";

export function addAttributes(type, mainElement, action) {
    let reply = "";
    const element = mainElement.attributes.find(({name})=>name===type)
    if(element){
        if (type === "year" || type === "parent" || type==="bgg") {
            reply = element.options[0];
        }
        if (type === "child") {
            const children = element.options.map(childElement => parseInt(childElement.name, 10));
            reply=children
        }
        if (type === "sleeves") {
            reply=[]
            element.options.map(option => {
                const splitted = option.split(' ');
                const id = sleeveTransform(splitted[0])
                reply.push([id,splitted[0],parseInt(splitted[1],10)])
            });
        }
        if(type==="time" || type==="players" || type === "age"){

            reply = !element.options[1] ? `${element.options[0]}` : `${element.options[0]}-${element.options[1]}`;
            
        }
        if(type==="designers" || type==="publishers" || type==="artists"){
            element.options.forEach(option => {
                reply=`<a href="#${option}">${option}</a> `
            });
        }
        if(type==="otherImages"){
            element.options.forEach(option=>{
                reply+=`<img class="image" src='${option}'>`
            });         
        }
        if(type==="mechanics"){
            let customStyle=""
            element.options.forEach(option=>{
                reply+=`<li style='${customStyle}'>-${option}</li>`
            });
        }        
    }
    return reply;
}
