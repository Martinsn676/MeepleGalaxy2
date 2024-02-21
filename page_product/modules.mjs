import { infoPageRender } from "./productPage.mjs";
import { getUrlId } from "../js/handling/url.mjs";
  const id=getUrlId()
// history.pushState(null, null, id);
infoPageRender("productArea",id)

//addElements("products-container","Games in our store",20,["loadMore",20,1])
//addElements("products-container","Games in our store","products",20,["slider",3,1])