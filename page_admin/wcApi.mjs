export const apiImport = {

    'baseUrl':'https://prototype.meeplegalaxy.com/wp-json/',
    'productsUrl': "wc/v3/products/",
    'getApi': 'GET',
    'putApi':'PUT',
    'postApi':'POST',
    'key': 'ck_5f58b0a934fd6475ce46e060c1a7ecc18422c4c8',
    'secret': 'cs_bb65ea4982b9262a5ba5aa53a1955542d3fa3a3b',

    async call(wcID,method,attributes) {
        try {
            let apiUrl
            const body = {
                method: method,
                headers: {
                    'Authorization': 'Basic ' + btoa(this.key + ':' + this.secret),
                    'Content-Type': 'application/json',
                },
            }
            if(method!=this.getApi){
                body.attributes = JSON.stringify(attributes);
            }
            apiUrl = this.baseUrl + this.productsUrl +wcID
            

            

            console.log(apiUrl, body)
            const response = await fetch(apiUrl, body);
            console.log(response)
                const json = await response.json();
                
            if (!response.ok) {

                return false
            } else {

                return json;
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

export const apiExport = {
    baseUrl: 'https://prototype.meeplegalaxy.com/wp-json/',
    productsUrl: 'wc/v3/products/',
    putApi: 'PUT',
    key: 'ck_ffd53e1c482a3b5c338010dfed7ce5189ab96762',
    secret: 'cs_d6f62c656f1b5718805c667bd259c810a84ada65',

    async call(id, exportBody) {

            const apiUrl = 'https://prototype.meeplegalaxy.com/wp-json/wc/v3/products/' + id; // Replace '1383' with the ID of your product
            const body = {
                method: this.putApi,
                headers: {
                    'Authorization': 'Basic ' + btoa(this.key + ':' + this.secret),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exportBody),
                
            };
            const response = await fetch(apiUrl, body);
            console.log(response)
            const json = await response.json();

            if (!response.ok) {
                console.log(json)
            }

            return json;

    }
};

                // body: JSON.stringify({
                //     attributes: attribute,
                //     description:  textContent,
                // }),
export async function importProducts(displayFrom) {
    const baseUrl = 'https://prototype.meeplegalaxy.com/wp-json/wc/v3/';
    const key = 'ck_5f58b0a934fd6475ce46e060c1a7ecc18422c4c8';
    const secret = 'cs_bb65ea4982b9262a5ba5aa53a1955542d3fa3a3b';
    const startPage = displayFrom; // Calculate the page number based on the start ID and batch size
    const batchSize = 30; // Adjust the batch size as needed
    console.log(`${baseUrl}products?per_page=${batchSize}&page=${startPage}`)
    try {
        const response = await fetch(`${baseUrl}products?per_page=${batchSize}&page=${startPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(key + ':' + secret),
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log('Fetched products:', products);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
