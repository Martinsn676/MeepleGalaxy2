import { addElements,renderElements,addFunctions } from "./js/handling/addElemenst.mjs";
import { sortObject } from "./js/templates/cardSection.mjs";
import { api } from "./js/handling/api.mjs";
import { banner } from "./js/templates/banner.mjs";
import { list } from "./js/handling/lists.mjs";



//addElements("pc2","Hot Titles",7,["slider",15,7],["sort",sortObject.dateAsc,"hide"])
//addElements("pc3","All games",12,["loadMore",50,8],[["sort","titleDesc"]])
//addElements("pc3","Homes for your games",6,["loadMore",6,6],["sort",sortObject.titleAsc],[api.categories.inserts])
async function loadPage() {
    console.time('total load time index');
    console.time('initial load');
    const addFunctionsTo = [];

    async function initialLoad() {
       // banner.addBanner("testBanner", ["category", "24"], 10);
        //addFunctionsTo.push(await addElements("pc", "Latest Titles", 3, ["slider", 15, 3], ["sort",  sortObject.dateAsc, "hide"]));
        addFunctionsTo.push(await addElements("pc4", "Even more games", 6, ["loadMore", 50, 6], ["sort", sortObject.dateDesc], [api.categories.boardgames]));
    }

    await initialLoad();
        
    // Execute addFunctions for each element in addFunctionsTo
    await Promise.all(addFunctionsTo.map(element =>addFunctions(element)))
    console.timeEnd('total load time index');
}

loadPage();

const search = {
    'input':document.getElementById('search-input'),
    'container':document.getElementById('search-container'),
    setup(){
        this.input.addEventListener('keyup',(event)=>this.searching(event))
        this.input.value=""
    },
    async searching(event){
        console.log('serching')
        const search = this.input.value
        if(search.length<3){
            this.container.innerHTML=""
            return
        }
        if (search.length===3){
            const response = await api.call(100,[api.categories.boardgames,'search='+search])
            list.save('quickSearch',response)
        }
        const searchList = await list.get('quickSearch')
        let validSearchs = []
        searchList.forEach(item => {
            if(item.name.toLowerCase().includes(search.toLowerCase())){
                validSearchs.push(item)
            }
        });
        if (event.keyCode === 13) {
            console.log("enter search")
            renderElements(validSearchs,2,document.getElementById('pc4'),'search')
        }else{
            renderElements(validSearchs,2,this.container,'search')
        }
    }
}
search.setup()
