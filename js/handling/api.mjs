// type	string	Products by type. eg: simple or variable.
// category	string	Products by category.
// tag	string	Products by tag.
// shipping_class	string	Products by shipping class.
// pa_*	string	Products by attributes. eg: filter[pa_color]=black
// sku	string	Filter a product by SKU.
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
async call(pageCount, endUrlInfo, logID,url) {
    try {
console.time(logID)
        logID = logID ? logID : "";
        let endUrl = "";
        url = url ? url : this.productsUrl;
        pageCount = pageCount ? pageCount : 100;
        if (url === this.productsUrl) {
            endUrlInfo = endUrlInfo ? endUrlInfo : [];
            endUrl += "?per_page=" + pageCount;
            endUrlInfo.forEach(filter => {
                endUrl += `&${filter}`;
            });
        }
        const apiUrl = this.baseUrl + url + endUrl;

        const body = {
            method: api.getApi,
            headers: {
                'Authorization': 'Basic ' + btoa(api.key + ':' + api.secret),
                'Content-Type': 'application/json',
            },
        }

        url += endUrl;
        const response = await fetch(apiUrl, body);

        console.groupCollapsed('API call '+logID);
        console.log(url)
        console.log()
        console.trace();
        console.timeEnd(logID)
        if (!response.ok) {
            const json = await response.json();
            console.log(json);
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
            const data = await response.json();
            console.log(data);
            return data;
        }
    } catch (error) {
        console.error('Error in API call:', error);
        throw error; // Re-throw the error to propagate it further if needed
    } finally {
        console.groupEnd();
    }
}
}
// api.call("","",'',api.productsUrl+"?"
