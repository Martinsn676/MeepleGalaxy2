import { apiBgg,bggAttributes,getAtt } from "./bgg.mjs";
import { apiImport,apiExport,importProducts } from "./wcApi.mjs";
import { headerTemplate } from "../js/templates/header.mjs";
import { lsList } from "../js/handling/lists.mjs";


document.querySelector("header").innerHTML=`${headerTemplate()}`


export const adminMenu = {
    'checkFilterSetting':{
        'checkBgg':true,
        'checkImagesLength':false,
        'checkForHtmlError':false,
    },

    'productIndex':0,
    'shortCutArray':['GMT games','Devir','Pegasus Spiele','Board&Dice','Stonemaier Games'],
    async setup(){


        this.importName = document.getElementById('importName')
        this.nextButton = document.getElementById('nextButton')
        this.prevButton = document.getElementById('prevButton')
        this.bggInput = document.getElementById('bggInput')
        this.publisherInput = document.getElementById('publisherInput')
        this.eanInput = document.getElementById('eanInput')
        this.productsContainer = document.getElementById('productsContainer')
        this.imageContainer = document.getElementById('imageContainer')
        this.batchInput = document.getElementById('batchInput')
        this.checkFilterContainer = document.getElementById('checkFilter')
        this.scriptButton = document.getElementById('scriptButton')
        this.completedCount = document.getElementById('completedCount')
        this.completedCount.innerText = await lsList.get('finishedCount')
        this.checkFilterContainer.innerHTML=`
        <div>
            <input type="checkbox" checked="true" id="option1" name="options[]" value="option1">
            <label for="option1">Bgg links</label><br>
        </div>
        <div>
            <input type="checkbox" id="option2" name="options[]" value="option2">
            <label for="option2">Min 3 images</label><br>
        </div>
        <div>
            <input type="checkbox" id="option3" name="options[]" value="option3">
            <label for="option3">Description check</label><br>
        </div>`
        const filterInputs = this.checkFilterContainer.querySelectorAll('input')
        filterInputs.forEach((input)=>{
            input.addEventListener('change',(event)=>{
                if(event.target.id === 'option1'){
                    if(event.target.checked){
                        this.checkFilterSetting.checkBgg = true
                    }else{
                        this.checkFilterSetting.checkBgg = false
                    }
                }
                if(event.target.id === 'option2'){
                    if(event.target.checked){
                        this.checkFilterSetting.checkImagesLength = true
                    }else{
                        this.checkFilterSetting.checkImagesLength = false
                    }
                }
                if(event.target.id === 'option3'){
                    if(event.target.checked){
                        this.checkFilterSetting.checkForHtmlError = true
                    }else{
                        this.checkFilterSetting.checkForHtmlError = false
                    }
                }
                this.checkProducts()
            })
        })
        prevButton.addEventListener('click',()=>{
            this.changeProduct(-1)
        })
        nextButton.addEventListener('click',()=>{
            this.changeProduct(1)
        })
        this.addImageFields()
        importName.addEventListener("click", (event) => {
            copyTextToClipboard(event.target.innerText);
        });

        batchInput.addEventListener('change',(event)=>{
            this.changeBatch(event.target.value)
        })
        const lastBatch = await lsList.get('currentBatch')
        if(lastBatch){
            this.changeBatch(lastBatch)
            document.getElementById('batchInput').value=lastBatch
        }
        this.scriptButton.addEventListener('click',()=>this.runScript(this.productIndex))
        this.shortcutPublishers = document.getElementById('shortcutPublishers')
        this.updateShortcuts()

    },
    addImageFields(){
        this.imageContainer.innerHTML = imageTemplate(10)
        this.allInputGroupImage = imageContainer.querySelectorAll('.inputGroupImage')
        this.allImagesInput = imageContainer.querySelectorAll('.inputUrl')
        this.allPreviewImages = imageContainer.querySelectorAll('img')

        this.allImagesInput.forEach((input)=>{
            input.addEventListener('keyup',(event)=>{
                const img = event.target.parentElement.querySelector('.previewImg')
                img.src=event.target.value
            })
        })
        for (let i = 0; i < this.allInputGroupImage.length; i++) {
            this.allInputGroupImage[i].classList.add('placement' + i);
            this.allInputGroupImage[i].querySelector('.upButton').addEventListener('click', () => {
                
                const group = this.allInputGroupImage[i]
                const number = this.getPlacementNumber(group)
                const newNumber = number -1
                const otherGroup = this.imageContainer.querySelector('.placement'+newNumber)
                group.classList.remove('placement'+number)
                group.classList.add('placement'+newNumber)
                otherGroup.classList.add('placement'+number)
                otherGroup.classList.remove('placement'+newNumber)
            });
            this.allInputGroupImage[i].querySelector('.trashButton').addEventListener('click', () => {
                this.allInputGroupImage[i].querySelector('input').value=""
                const img = this.allInputGroupImage[i].querySelector('.previewImg')
                img.src=""
            })
        }
    },
    getPlacementNumber(group) {
        const regex = /(\d+)/;
        const classNames = group.classList;
        for (const className of classNames) {
            if (className.match(regex)) {
                const number = parseInt(className.match(regex)[0]);
                return number; // Return the number if found
            }
        }
        return false; // Return false if no matching class found
    },

    async loadProducts(value){
        this.clearInput()
        this.products = await importProducts(value)

        this.productsContainer.innerHTML=productsTemplate(this.products)
        this.allPqv = this.productsContainer.querySelectorAll('.productQuickView');
        this.allPqv.forEach((pqv) => {
            pqv.addEventListener('click', () => {
                const productId = pqv.querySelector('.id').textContent;
                const productname = pqv.querySelector('.name').textContent;
                copyTextToClipboard(productname);
                this.changeProduct(productId)
            });
        });
        this.selectedIndex = 0
        this.changeProduct(0)
    },
    checkProducts(){
         this.allPqv.forEach((item)=>{
            item.querySelector('.productStatus').innerText='Not good'
            item.classList.remove('updated')
        })
        this.products.forEach((product)=>{
            if(this.checkFilter(product)){
                const index = this.products.findIndex(item => item.id === Number(product.id));
                this.allPqv[index].querySelector('.productStatus').innerText='Good'
                this.allPqv[index].classList.add('updated')
            }
        })
    },
    changeProduct(change){
        
        this.clearInput()
        this.addImageFields()
        this.scriptButton.classList.remove('complete')
        this.productIndex+=change 
        if(change>1){
            this.productIndex = this.products.findIndex(product => product.id === Number(change));
        }
        if(change===0){
            this.productIndex=0
        }
        if(this.productIndex===0){
            this.prevButton.disabled=true
            this.prevButton.classList.add('disabled')
        }else{
            this.prevButton.disabled=false
            this.prevButton.classList.remove('disabled')
        }
        if(this.productIndex===29){
            this.nextButton.disabled=true
            this.nextButton.classList.add('disabled')
        }else{
            this.nextButton.disabled=false
            this.nextButton.classList.remove('disabled')
        }
        this.allPqv.forEach((product)=>product.classList.remove('selected'))
        this.allPqv[this.productIndex].classList.add('selected')
        this.checkProducts()
        this.showProduct=this.products[this.productIndex]
        console.log(this.showProduct)
        this.importName.innerText = `${this.showProduct.name} ${getAtt('language',this.showProduct)}`
        this.bggInput.value = getAtt('bgg',this.showProduct)
        this.publisherInput.value = getAtt('publishers',this.showProduct)
        this.eanInput.value = getAtt('ean',this.showProduct)
        
        // const currentNumberDisplay = document.querySelector('#batchFeedback #currentNumber')
        // if(currentNumberDisplay){
        //     currentNumberDisplay.innerText=this.showProduct.id
        // }
        for(let i = 0; i < this.showProduct.images.length; i++){
            this.allImagesInput[i].value=this.showProduct.images[i].src
            const img = this.allImagesInput[i].parentElement.querySelector('img')
            img.src = this.showProduct.images[i].src
        }
    },
    async changeBatch (batch){ 
        if(batch>0){
            lsList.save('currentBatch',batch)
            await this.loadProducts(batch)
            const IDRange = this.findIDRange(this.products)
            document.getElementById('batchFeedback').innerHTML=`Showing product <span id="currentNumber">${IDRange[0]}</span> to ${IDRange[1]}`
            this.changeProduct(0)
        }
    },
    findIDRange(products){
        let lowestID = 99999
        let highestID = 0
        products.forEach((product)=>{
            if(product.id>highestID){
                highestID=product.id
            }
            if(product.id<lowestID){
                lowestID=product.id
            }
        })
        return [lowestID,highestID]
    },
    clearInput(){
        this.allImagesInput.forEach((input)=>input.value="")
        this.allPreviewImages.forEach((image)=>image.src="")
        this.bggInput.value=""
        this.publisherInput.value=""
        this.eanInput.value=""
    },
    updateShortcuts(){
        this.shortcutPublishers.innerHTML=publisherTemplate()
        const allShortcutbuttons = this.shortcutPublishers.querySelectorAll('button')
        allShortcutbuttons.forEach((button)=>{
            button.addEventListener('click',(event)=>{
                this.publisherInput.value = event.target.innerText
            })

        })
    },
    async runScript(index){
        let updatedImages = []
        const elementsArray = Array.from(this.allInputGroupImage);
        // Sort the array based on placement number extracted from any class containing a number
        elementsArray.sort((a, b) => {
            const regex = /(\d+)/;
            const aClasses = Array.from(a.classList).find(className => regex.test(className));
            const aNumber = aClasses ? parseInt(aClasses.match(regex)[0]) : Infinity;
            const bClasses = Array.from(b.classList).find(className => regex.test(className));
            const bNumber = bClasses ? parseInt(bClasses.match(regex)[0]) : Infinity;
            return aNumber - bNumber;
        });
        elementsArray.forEach((group)=>{
            const groupInputField = group.querySelector('input')
            if(groupInputField.value.length>0){
                updatedImages.push({
                    alt: "",
                    src: groupInputField.value,
                })
            }
        })
        this.products[index].images=updatedImages
        this.products[index].attributes =[
            {
                id: 0,
                name: 'ean',
                slug: 'ean',
                position: 0,
                visible: true,
                variation: false,
                options: [adminMenu.eanInput.value],
            },
            {
                id: 0,
                name: 'bgg',
                slug: 'bgg',
                position: 0,
                visible: true,
                variation: false,
                options: [adminMenu.bggInput.value],
            }
        ]
        const publ = publisherInput.value
        if(publ!=""){
            let addPubl = true
            this.shortCutArray.forEach((publisher)=>{
                if(publ===publisher){
                    addPubl = false
                }
            })
            if(addPubl){
                this.shortCutArray.push(publisherInput.value)
                this.updateShortcuts()
            }
        }

        const product = this.products[index]


 this.products[index].images=updatedImages

        const url = bggInput.value;
        const match = url.match(/\/(\d+)\//); // Extracts the number between slashes
        const bggID = match ? parseInt(match[1], 10) : null; // Parses the extracted number
        console.log("loading and adding infromation from bgg id: "+bggID)
    
        const bggImport = await apiBgg.call(bggID);
        const attributes = bggAttributes (bggImport,product)
        const bggDescription = bggImport.querySelector('description').textContent
        const body = {
            attributes: attributes,
            description:  bggDescription,
            images:updatedImages,
        }
        const id = this.products[index].id
        const response = await apiExport.call(id,body);
        if(!response.id){
            console.error('upload failed')
        }else{
            let amountFinished = await lsList.get('finishedCount')
            amountFinished = amountFinished ? amountFinished+1 : 1
            lsList.save('finishedCount',amountFinished)
            this.completedCount.innerText = amountFinished
            console.log('upload succesfull')
        }
        this.products[index].images=updatedImages
        this.products[index].attributes=attributes
        this.checkProducts()
        //this.scriptButton.classList.add('complete')
        
    },
    checkFilter(product){
        let pass = true 
        const check = this.checkFilterSetting

        if(check.checkBgg){
            const link = getAtt('bgg',product)
            if(link===""){
                pass = false
            }
        }
        if(check.checkImagesLength){
            if(product.images.length<3){
                pass = false
            }
        }
        if(check.checkForHtmlError){
            if(product.description.includes('&#010;&#010;')){
                pass=false
            }
        }
        return pass
    }
}
adminMenu.setup()

function productsTemplate(products){
    let productsHtml = ""
    products.forEach((product)=>{
        productsHtml += `
        <div id="pqv${product.id}" class="productQuickView flex-row">
            <i class="bi bi-arrow-right-circle-fill"></i>
            <span class="id">${product.id}</span>
            <span class="name">${product.name}</span>
            <div class="productStatus">Not updated</div>
        </div>`
    })
    return productsHtml
}
function publisherTemplate (){
    const publishers = adminMenu.shortCutArray
    let newHtml = ""
    publishers.forEach((publisher)=>{
        newHtml+=`<button class="button">${publisher}</button>`

    })
    return newHtml
}
function imageTemplate(quantity){
    let imageHtml = ""
    for(let i = 0; i<quantity; i++){
        imageHtml += `
            <div class="flex-row inputGroupImage align">
                <div class="imageDiv">
                    <img class="previewImg" src="">
                </div>
                <input class="inputUrl" type="text">
                <div class="buttonContainer">
                    <button class="upButton">
                        <i class="bi bi-arrow-bar-up"></i>
                    </button>
                </div>
                <div class="buttonContainer">
                    <button class="trashButton">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </div>
            </div>  `
    }
    return imageHtml
}


export function allowDrop(event) {
  event.preventDefault();
}

export function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var imageUrl = data;
    let found = false


    adminMenu.allImagesInput.forEach((input)=>{
        if(input.value.length<5 && !found){
            input.value=imageUrl
            found=true
            const img = input.parentElement.querySelector('.previewImg')
            img.src=imageUrl

        }
    })
    if(!found){
        console.warn('No free space for image')
    }
}
function copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

// Example usage:
    document.addEventListener('drop', function(e) {
           event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var imageUrl = data;
    let found = false


    adminMenu.allImagesInput.forEach((input)=>{
        if(input.value.length<5 && !found){
            input.value=imageUrl
            found=true
            const img = input.parentElement.querySelector('.previewImg')
            img.src=imageUrl

        }
    })
    if(!found){
        console.warn('No free space for image')
    }
    });

    document.addEventListener('dragover', function(e) {
        e.preventDefault(); // Prevent default behavior to allow drop
    });