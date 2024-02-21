import { list } from "./lists.mjs"
import { api } from "./api.mjs"
import { addAttributes } from "./attributes.mjs"
import { cartContentTemplate } from "../templates/cartContent.mjs"
import { compareByValue } from "./general.mjs"


async function getCartProducts(){
    const cartItems = await list.get('cart')
    let firstIDCheck = []
    let newItemList = []
    if(cartItems){
        cartItems.forEach(element => {
        firstIDCheck.push(element[0])
        newItemList.push(element)
    });
    const firstApi = await api.call(100,["include="+firstIDCheck],'','cart1')
    const orphans = firstApi.reduce((parents, element) => {
        const children = addAttributes("child", element, 'test');
        if (children.length > 0) {
            const orphanGroup = children.filter(child => !cartItems.some(item => item[0] === child));
            if (orphanGroup.length > 0) {
                orphanGroup.forEach(orphan => {
                    parents.push([orphan,0,element.id]);
                });
            }
        }
        return parents;
    }, []);

    let secondIDCheck = []
    orphans.forEach(element => {
        secondIDCheck.push(element[0])
    });

    const secondApi = await api.call(100,["include="+secondIDCheck],'','cart2')

    let cartAndOrhpans=[...firstApi, ...secondApi];
    const sleeves = cartAndOrhpans.reduce((parents, element) => {
        const sleeve = addAttributes("sleeves",element,"value")
        if (sleeve.length > 0) {
            const sleeveGroup = sleeve.filter(sleeve => !cartItems.some(item => item[0] === sleeve));
            if (sleeveGroup.length > 0) {
                sleeveGroup.forEach(sleeve => {
                    parents.push([sleeve[0],0,element.id,sleeve[2]]);
                });
            }
        }
        return parents;
    }, []);

    let thirdIDChech = []
    sleeves.forEach(element => {
        thirdIDChech.push(element[0])
    });

    const thirdApi = await api.call(100,["include="+thirdIDChech],'','cart3')

    let combinedArray = [...firstApi, ...secondApi, ...thirdApi];

    list.save('newCart',newItemList)
    list.save('tempCartLoad',combinedArray)
    list.save('newCartBackup',newItemList)

    }
} 
async function createListContent(type,target){
    let newHtml = ""
    let totalPrice = 0 
    let productCost
    let sleevesCollection = []
    let accessorieCollection = []   

    
    let newList = await list.get('newCart')
    let allProducts = await list.get ('tempCartLoad')
    if(!newList || !allProducts){
        await getCartProducts()
        newList = await list.get('newCart')
        allProducts = await list.get ('tempCartLoad')
    }
    allProducts.forEach(product => {
        newList.forEach(listContent => {
            if(product.id===listContent[0]){
                if(listContent[2]){
                    // is not a main element
                    if(listContent[3]){
                        // is sleeves
                        sleevesCollection.push([product,listContent])
                    }else{
                        // is expansion or other accessorie
                        accessorieCollection.push([product,listContent])
                    }
                }else{
                    // is a main item
                    if(listContent[1]>0){
                        productCost = parseInt(product.regular_price, 10)
                        totalPrice+=productCost*listContent[1]
                    }
                    newHtml+=cartContentTemplate(product,listContent[1])
                }  
            }
        }); 
    });   

    target.innerHTML=newHtml

    accessorieCollection=compressAccessories(accessorieCollection)
    accessorieCollection.sort(compareByValue)
    if(accessorieCollection.length>0){
        accessorieCollection.forEach(element => {

            totalPrice+=element[0].regular_price*element[1][1]
            let addToTarget = target.querySelector(`#productID${element[1][2]}`)
            if (addToTarget) {
                addToTarget.classList.add('accessorieExpanded')
                let container = addToTarget.querySelector(".accessories .container")
                if(element[1][1]===0){
                    container.innerHTML += accessorieContentTemplate(element[0],false)
                }else{
                    container.innerHTML += accessorieContentTemplate(element[0],true)
                }
            }else{
                target.innerHTML+= `<div>${cartContentTemplate(element[0],element[1][1])}</div>`
            }
        });
    }
    sleevesCollection.forEach(element => {
        let addToTarget = target.querySelector(`#productID${element[1][2]} .sleevesContainer`);
        if (addToTarget) {
            button = target.querySelector(`#productID${element[1][2]} #sleeveID${element[1][0]}`)
            addToTarget.innerHTML += sleeveContentTemplate(element[0], element[1][3] * element[1][1]);
        }else{
            if(element[1][1]>0){
                target.innerHTML+=cartContentTemplate(element[0], Math.ceil(element[1][3] * element[1][1] /55),element[1])

            }
        }
    });
    sleevesCollection=compressSleeves(sleevesCollection)
    sleevesCollection.forEach(element => {
        const price = element[0].regular_price
        const sleevesNeeded = element[1][3]
        const setsNeeded=Math.ceil(sleevesNeeded/55)
        const leftover = setsNeeded*55-sleevesNeeded
        let leftoverMessage      
        totalPrice+=price*setsNeeded
        if(leftover>0){
            leftoverMessage=leftover+" spare"
        }else{
            leftoverMessage=leftover+" missing"
        }
        if(element[1][1]>0){
            target.innerHTML+=`
            <div id="sleeve-list" class="flex-column">
                <span>${element[0].name}</span>
                <span> ${sleevesNeeded} sleeves (${leftoverMessage})</span>
                <span class="shift-right">
                    <span>${setsNeeded} x ${price} kr ${setsNeeded*price} kr</span>
                </span>
            </div>
            `
        }
    });
    target.innerHTML+=`
        <div class="flex-column shift-right">
            <span>Total cost: ${totalPrice}</span>
            <a class="checkoutLink" href="checkout.html">Checkout</a>
        </div>
    `
    target.innerHTML+=`
        <button id="saveCartID">save new cart!</button>
        <button id="resetCartID">Get it back!</button>
    `
    
    document.getElementById('saveCartID').addEventListener('click',()=>saveCart())
    document.getElementById('resetCartID').addEventListener('click',()=>resetCart());
    let finalCartCollection = []
    sleevesCollection.forEach(element => {
        finalCartCollection.push([element[1][0],element[1][1]])
    });
    accessorieCollection.forEach(element => {
        if(element[1][1]>0){
            finalCartCollection.push([element[1][0],element[1][1]])
        }
    });
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
    return newList
}

export{createListContent}