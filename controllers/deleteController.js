const fetch                            = require('node-fetch');
const requestStructure                 = require('../utils/requestOptions/requestOptions');
const { getProduct, getProductByGUID } = require('../utils/graphqlRequests/queries');
const { updateProductStatus }                = require('../utils/graphqlRequests/mutations');
class DeleteController {
    async DeleteData(req, res) {
        try {
            // функція, яка формує запит до Shopify API на видалення продукту
            const fetchMutationDelete = async (args) => {
                // отримання id продукту з query, в який додається sku з JSON шаблона
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
                // отримання відповіді від Shopify API про видалений продукт
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
            if(req.body.sku)
                fetchMutationDelete(getProduct(req.body.sku));
            else
                fetchMutationDelete(getProductByGUID(req.body.guid));
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new DeleteController;