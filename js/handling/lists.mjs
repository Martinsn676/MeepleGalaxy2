import { getUrlParam } from "./global.mjs";

async function saveCart(){
    const newCart = await list.get('newCart')
    let override = []
    newCart.forEach(element => {
        if(element[1]>0){
            override.push(element)
        }
    });
    list.save('cart',override)
    updateTracker()
}
async function resetCart(){
    const backupList = await list.get('newCartBackup')
    list.save('newCart',backupList)
    updateTracker()
}

async function updateList(id, list,forced) {
    let modify = [];
    if (await inListCheck(id,list,modify)) {
        const listLength = list.length;
        for (let i = listLength - 1; i >= 0; i--) {
            if (modify.includes(i)) {
                if (forced) {
                    if (forced === 0) {
                        list[i][1] = 0;
                    } else {
                        list[i][1] += forced;
                }   }
                if (!forced || list[i][1] < 1) {
                    list.splice(i, 1);
        }   }   }
    } else {
        if (Array.isArray(id)){
            list.push(id);
        } else {
            list.push([id, 1]);
    }   }
    return
}

async function inListCheck(id,list,modify) {
    let found = false;
    let anArray = false
    let checkID = id
    let checkID2 = []  
    if(Array.isArray(checkID)){
        checkID=id[0]
        checkID2=id[2]
        anArray=true
    }
    for (let i = 0; i < list.length; i++) {
        if(anArray){
            if(list[i][2] && list[i][0]===checkID && list[i][2] === checkID2){
                found = true;
                if (modify) {
                    modify.push(i);
                }
            }
            if (!checkID2 && list[i][0] === checkID) {
                if (modify) {
                    modify.push(i);
                }
                found = true;
            }
            if(list[i][0] && !checkID){
                if (list[i][2]===checkID2) {
                    if (modify) {
                        modify.push(i);
                    }
                }
            }
            
        }else{
            if (list[i][0] === checkID) {
                if (modify) {
                    modify.push(i);
                }
                found = true;
            }
            if (list[i][2] && list[i][2] === checkID) {
                if (modify) {
                    modify.push(i);
                }
                found = true;
    }   }   }
    return found;
}
async function updateTracker(type){
    if(!type){
        updateTracker('cart')
        updateTracker('favs')
    }else{
        const items = await lsList.get(type) || []
        const counter = document.querySelector(`#${type}Number`)
        if(counter){
            counter.innerHTML=items.length
        }
        checkForButtons(items,type)

        // if(document.title==="Cart page" && type==='cart'){
        //    addListContent('cart',)
        // }
        // if(document.title==="Favorites page" && type==='favs'){

        //    addListContent('favs')
        // }
    }
}
async function checkForButtons(list, type) {
    
    if (list) {
        if (type === 'cart') {
            const buyButton = document.querySelector("#addToCartButton");
            if (buyButton) {
                if (await inListCheck([getUrlParam('id')], list)) {
                    buyButton.classList.add('posButton');
                    buyButton.innerHTML = "In cart";
                } else {
                    buyButton.classList.remove('posButton');
                    buyButton.innerHTML = "Add to cart";
                }
            }
            const addonButtons = document.querySelectorAll(".top-section button");
            addonButtons.forEach(async (element) => {

                const id = parseInt(element.id.replace(/\D/g, ''), 10);
                if(getUrlParam('id')){
                    if (await inListCheck([id,1,getUrlParam('id')], list)) {
                        element.classList.add('posButton');
                    } else {
                        element.classList.remove('posButton');
                    }
                }
            });
        }
        if (type === 'favs') {
            const favsButton = document.querySelector("#addToFavsButton");
            if (favsButton) {
                if (await inListCheck([getUrlParam('id')], list)) {
                    favsButton.classList.add('posButton');
                    favsButton.innerHTML = "In favorites";
                } else {
                    favsButton.classList.remove('posButton');
                    favsButton.innerHTML = "Add to favorites";
                }
            }
        }
    }
}
export const lsList = {
    /**
    * Load from local
    * @param {string} name The name of local 
    */
    async get(name){
        const list = await JSON.parse(localStorage.getItem(name))
        return list
    },
    /**
    * Save to local using this name
    * @param {string} name The name of local 
    * @param {any} items the element to stringify into local save
    */
    async save(name,items){
console.log(items)
        localStorage.setItem(name, JSON.stringify(items));
    },
    /**
    * Delete local with this name
    * @param {string} name The name of local 
    */
    async remove(name){
    localStorage.removeItem(name);
    },
    /**
     * To check for saves before doing api.call, will update every 5 min
     * @param {string} name written like this: place+sort[1][1]
     * @param {function} apiCall api.call function
     * @returns List of items for render
     */
    async cacheCheck(name,apiCall){
        let list = await this.get(name)
        let minutes
        let age
        if(list){
            const now = new Date().getTime();
            age = now - lsList.timestamp;
            minutes = age / (1000 * 60);
            console.log(name+' is <'+Math.round(minutes)+" minutes old")
        }
        if(!list || minutes>5){
            if(minutes>5){console.log("updating list...")}
            if(!list){console.log("loading list for the first time")}
            const save = {
                data: await apiCall,
                timestamp: new Date().getTime() // Current time in milliseconds
            };
            list=save
            this.save(name,save)
        }
        return list.data
    }
}

/**
 * Toggle list item for cart/favs, also work to force a change
 * Forced: 0 toggles, +x adds any number, -x subtract and remove if 0 or less
 * @param {number} id of item
 * @param {string} type either cart/favs
 * @param {number} forced optional, used to force a quantity
 * @example toggleList([id,1,originID,numericCount],'cart',0)
 */
async function toggleList(id,type,forced){
    console.log("list toggle")
    const list = await lsList.get(type)
    if(!forced){
      forced=0
    }
    let updatedList = []
    if(!list || list.length<1){
        if(Array.isArray(id)){
            updatedList.push(id)
        }else{
            updatedList.push([id,1])
        }
    }else{

        await updateList(id,list,forced)
        updatedList=list
    }
    localStorage.setItem(type, JSON.stringify(updatedList));
    updateTracker(type)  
}
export { updateTracker,toggleList,saveCart,resetCart};
