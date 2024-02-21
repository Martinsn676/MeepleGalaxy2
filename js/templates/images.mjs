export function addOtherImages(element){
  const images = element.images
  let reply = ""
  for(let i = 1; i<images.length; i++){
      reply+=`
          <img class="image" src='${images[i].src}'> 
      `   
  }
  return reply
}

export function addImage(src,number,end){
    let url = src[number]
    if(url){
        if(end==="src"){
            url = url.src
        }else{
            url = url.thumbnail
        }
        return `<image class="contain-image image" src="${url}"></image>`
    }else{
        return ''
    }
    
}