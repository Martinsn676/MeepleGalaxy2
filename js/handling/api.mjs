import { lsList } from "./lists.mjs";



export const api = {

  'baseUrl':'https://prototype.meeplegalaxy.com/wp-json/',
  'productsUrl': "wc/v3/products",
  'getApi': 'GET',
  'categories':{
    'boardgames':'category=24',
    'inserts':'category=31',
  },
  'key': 'ck_fb9ce92ccd10ed1afac0c33f17083d0863222030',
  'secret': 'cs_d54f6bcc76681b254b8e8cc80879ee7737eece11',
  /**
   * 
   * @param {number} pageCount how many to request
   * @param {array} endUrlInfo containing extra url strings
   * @param {string} logID optional, id to recognice call
   * @param {string} url optional, only needed if not default product
   * @returns Array of products
   * @example const elements = await api.call(displayQuantity,endURl);
   *
   */
    async call({loadTotal,place}, endUrlInfo) {
    console.log(endUrlInfo)
        loadTotal = loadTotal ? loadTotal : 1
        //Look for save
        let endUrl = "";

        endUrl += "?per_page=" + loadTotal;
        if(typeof endUrlInfo === 'string'){
            endUrl = "/"+endUrlInfo
        }else{
            endUrlInfo.forEach(filter => {
                endUrl += `&${filter}`;
            });
        }
        const apiUrl = this.baseUrl+this.productsUrl + endUrl;
        const save = await lsList.get(place+endUrl)
        console.log("save",save)
        if(save){
            return save
        }else{
            try {
                const body = {
                    method: api.getApi,
                    headers: {
                        'Authorization': 'Basic ' + btoa(api.key + ':' + api.secret),
                        'Content-Type': 'application/json',
                    },
                }
                const response = await fetch(apiUrl, body);
                console.groupCollapsed('API call '+place);
                    console.log(apiUrl)
                    console.log(body)
                    console.trace();
                if (!response.ok) {
                    const json = await response.json();
                    console.log(json);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                    const data = await response.json();
                    await lsList.save(place+endUrl,data)
                    return data;
                }
            } catch (error) {
                console.error('Error in API call:', error);
                throw error; 
            } finally {
                console.groupEnd();
            }
        }
    }
}
