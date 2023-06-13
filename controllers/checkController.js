const fetch                            = require('node-fetch');
const { getProduct, getProductByGUID } = require('../utils/graphqlRequests/queries');
const requestStructure                 = require('../utils/requestOptions/requestOptions');
class CheckController {
    async CheckProduct(req, res) {
        try {
            const FetchProductId = async (args) => { //get product id
                try {
                    const FindProductId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
                        .then(res => res.json())
                    res.json(FindProductId.data.products.edges[0].node.id);
                }
                catch (e) {
                    res.json(`Check the correctness of the data and input format. Error - ${JSON.stringify(e)}, Product doesn't exist`)
                }
            }
            if (req.body.sku) { //check product by sku
                await FetchProductId(getProduct(req.body.sku)); 
            }
            else { //check product by guid
                await FetchProductId(getProductByGUID(req.body.guid)); 
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new CheckController;