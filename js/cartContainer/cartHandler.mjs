import { getUrlParam } from "../handling/global.mjs"
import { lsList } from "../handling/lists.mjs"
import { getAttribute } from "../reading/attributes.mjs"


export const listHandler = {
    async toggleCart(element,type){
        let newArray
        const oldCartItems = await lsList.get(type)
        if(oldCartItems){
            newArray = oldCartItems
            let inCart = this.checkForMatch(element.id,newArray)
            if(inCart){
                newArray.splice(inCart,1)
            }else{
                const parentID = await getAttribute('parent',element)
                newArray.push([element.id,1,Number(parentID)])
            }
        }else{
            const parentID = await getAttribute('parent',element)
            newArray = [[element.id,1,Number(parentID)]]
        }
        await lsList.save(type,newArray)
        this.updateCartSymbol(newArray.length,type)
        this.checkCTA()
    },
    updateCartSymbol(count,type){
        if(type === 'cart'){
            document.getElementById('cartNumber').innerText=count
        }else{
            document.getElementById('favsNumber').innerText=count
        }
    },
    async checkCTA(){
        const currentID = getUrlParam('id')
        const cart = await lsList.get('cart')
        const favs = await lsList.get('favs')
        if(this.checkForMatch(currentID,cart)){
            document.getElementById('cart'+currentID).classList.add('pos')
        }else{
            document.getElementById('cart'+currentID).classList.remove('pos')
        }
        if(this.checkForMatch(currentID,favs)){
            document.getElementById('favs'+currentID).classList.add('pos')
        }else{
            document.getElementById('favs'+currentID).classList.remove('pos')
        }
    },
    checkForMatch(find,array){
        let inCart = false
        for(let i = 0; i < array.length; i++){
            if(array[i][0]===Number(find)){
                inCart = i
            }
        }
        return inCart
    }
}