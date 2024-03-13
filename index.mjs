
import { api } from "./js/handling/api.mjs";
import { sortObject } from "./js/productContainer/sorting.mjs";
import ProductDisplayImport from "../js/productContainer/display.mjs"
import { windowHandling } from "./js/handling/globalListeners.mjs";

windowHandling.listenChange()
const section2 = new ProductDisplayImport("pc2", "Exciting games!", ["banner", 20, 20], [sortObject.dateDesc,true], [api.categories.boardgames])
const section3 = new ProductDisplayImport("pc3", "Even more games", ["loadMore", 2, 20], [sortObject.dateDesc], [api.categories.boardgames])
const section4 = new ProductDisplayImport("pc4", "Even more games", ["slider", 4, 8], [sortObject.dateDesc], [api.categories.boardgames])


