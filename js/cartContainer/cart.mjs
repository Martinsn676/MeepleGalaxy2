import { lsList } from "../handling/lists.mjs"
import { api } from "../handling/api.mjs"
import { getAttribute} from "../reading/attributes.mjs"
import { cartTemplate } from "./templates.mjs"
import { removeCommonPrefix } from "../handling/global.mjs"
import { cartHandler } from "./cartHandler.mjs"

export default class Cart {
    constructor(place){
        this.details={
            'mainContainer': document.getElementById(place),
            'loadTotal':100,
        }
        this.details.mainContainer.innerHTML=`
            <section id="topLine"></section>
            <section id="mainContainer"></section>
            <section id="bottomLine">
                <div class="flex-row">
                    <span>Total price:</span>
                    <span class="total-price"></span>
                </div>
            </section>
            `
        
        this.details.topLine = this.details.mainContainer.querySelector('#topLine')
        this.details.container = this.details.mainContainer.querySelector('#mainContainer')
        this.details.bottomLine = this.details.mainContainer.querySelector('#bottomLine')
        this.details.totalPriceDispay = this.details.bottomLine.querySelector('.total-price')
        this.display(this.details)
    }
    async getItems(){
        const response = await lsList.get('cart')
        this.details.content = response
        return response
    }
    async display({container}){
        const cartContent = await this.getItems();
        const cartItems = await this.getCartExtras(cartContent)
        console.log(cartItems.main)
        cartItems.main.forEach((item)=>{
            container.innerHTML += cartTemplate.main(item,1)
        })
        for(const child of cartItems.children){
            const parentID = await getAttribute('parent',child)
            const parentContainer = container.querySelector(`#product-${parentID}`)
            const parent = parentContainer.querySelector('.bottom-part')
            const parentName = parentContainer.querySelector('.name')
            child.name = removeCommonPrefix(child.name,parentName.innerText)
            parent.innerHTML += cartTemplate.accessorie(child,1)
        }
        cartItems.sleeves.forEach((item)=>{
            this.details.container.innerHTML += cartTemplate.sleeves(item,1)
        })
        for(const child of cartItems.children){
            const parentContainer = container.querySelector(`#product-${child.id}`)
            const addToCartButton = parentContainer.querySelector('.addToCart')
            addToCartButton.addEventListener('click',async ()=>{
                await cartHandler.toggleCart(child)
                this.updateCart()
            })
        }
        this.updateCart()
    }
    async updateCart(){
        let totalPrice = 0
        const cartContent = await this.getItems()
        const allProducts = this.details.container.querySelectorAll('.cart-element')
        allProducts.forEach((product)=>product.classList.add('shaded'))
        for(const item of cartContent){
            const target = this.details.container.querySelector(`#product-${item[0]}`)
            if(target){
                const price = target.querySelector('.price').innerText
                totalPrice += Number(price)
                target.classList.remove('shaded')
            }else{
                console.log("not found target for "+item)
            }
        }
        this.details.totalPriceDispay.innerText=totalPrice
    }
    async getCartExtras(cartContent){
        const testSave = await lsList.get('cartTestSave')
        if(!testSave){
            const content = cartContent
            let apiCallItems = [];

            // Extracting ids from content
            for (const cartItem of content) {
                apiCallItems.push(cartItem[0]);
            }

            // Making API call based on extracted ids
            const response = await api.call(this.details, ["include=" + apiCallItems]);
            apiCallItems = [];

            let filteredContent = response;

            // Looping through each item in the response
            response.forEach(item => {
                const children = getAttribute('child', item);
                if (children) {
                    // Adding children to apiCallItems array
                    children.forEach(child => {
                        apiCallItems.push(child);
                    });
                    // Filtering filteredContent based on children
                    filteredContent = filteredContent.filter(item => {
                        return !children.includes(item.id.toString());
                    });
                }
            });      
            const response2 = await api.call(this.details,["include="+apiCallItems])
            apiCallItems = []
            response2.forEach(item => {
                const sleeves = getAttribute('sleeves',item)
                if(sleeves){
                    for(const sleeve of sleeves){
                        apiCallItems.push(sleeve[0])
                    }
                }
            });
            const response3 = await api.call(this.details,["include="+apiCallItems])
            const reply = {
                'main':filteredContent,
                'children':response2,
                'sleeves':response3,
            }
            lsList.save('cartTestSave',reply)
            return reply

        }else{
            return testSave
        }
    }   
}