const fetch                                  = require('node-fetch');
const requestStructure                       = require('../utils/requestOptions/requestOptions');
const { getProduct, getProductByGUID }       = require('../utils/graphqlRequests/queries');
const { updateProductStatus }                = require('../utils/graphqlRequests/mutations');
class DeleteController {
    async DeleteData(req, res) {
        try {
            // function that sends to shopfiy query for set DRAFT status for product
            const fetchMutationDelete = async (args) => {
                // get product id from bulk operation query
                let globalData = fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
                    .then(res => res.json())
                    .then(response => {
                        try {
                            return JSON.stringify(response.data.products.edges[0].node.id);
                        }
                        catch (e) {
                            res.status(300).json(`Check the correctness of the data and input format. Error - ${JSON.stringify(response)}`);
                        }
                    });
                // get response from product and edited status
                fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(updateProductStatus(await globalData)))
                    .then(res => res.json())
                    .then(response => {
                        try {
                            res.json(`Product with ID: ${JSON.stringify(response.data.productUpdate.product.id)} was set as DRAFT`);
                        }
                        catch (e) {
                            if(!globalData)
                            res.status(300).json(`Check the correctness of the data and input format. Error - ${JSON.stringify(response)}`);
                        }
                    });
            };
            if(req.body.sku)  //get product by sku
                fetchMutationDelete(getProduct(req.body.sku));  
            else              //get product by sku
                fetchMutationDelete(getProductByGUID(req.body.guid));
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new DeleteController;