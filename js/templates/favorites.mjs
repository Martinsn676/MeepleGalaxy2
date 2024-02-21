function favsContentTemplate(element){return `
    <div class="flex-column">
        <a href="productPage.html?id=${element.id}">
        <div class="image contain-image" style="background-image: url('${element.images[0].src}')">
            </div>
        </a>
        <button onclick="toggleList(${element.id},'favs')">Del</button>
    </div>
  `
}