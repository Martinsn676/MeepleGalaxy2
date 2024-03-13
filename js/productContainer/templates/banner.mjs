export const bannerHtml =  {

    async create(elements,{container}){
        for(let i=0;i<elements.length;i++){
          container.innerHTML+=this.bannerImageTemplate(elements[i],i)
      }

    },
  async addBanner(id,target,displayQuantity){
      let urlInfo
      displayQuantity =  displayQuantity ? displayQuantity : 20
      if(target[0]==="category"){
          urlInfo="category="+target[1]
      }
      const mainContainer = document.querySelector(`#${id}`)
      const elements = await api.call(displayQuantity,[urlInfo],'banner')
      for(let i=0;i<displayQuantity;i++){
          if(elements[i]){
          mainContainer.innerHTML+=this.bannerImageTemplate(elements[i],i)
          }
      }
  },
  bannerImageTemplate(element,number){
  return  `
  <a class="banner-image number${number}" href='productPage.html?id=${element.id}'>
    <img  src='${element.images[0].src}' alt='${element.name}'>
    <span class='hover-box'>${element.name}</span>
  </a> `
  ;}
}