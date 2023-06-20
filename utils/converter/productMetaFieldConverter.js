const fs                     = require('fs');
const fsPromises             = require('fs/promises');
const { getProductByHandle } = require('../graphqlRequests/queries');
const { updateMetafields }   = require('../graphqlRequests/mutations');
const requestStructure       = require('../requestOptions/requestOptions');
const FetchProductByHandle   = async (args) => {
    try {
        const FindProductId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args)) //get product id
            .then(res => res.json())
        return FindProductId.data.products.edges[0].node.id;
    }
    catch (e) {
        console.log(`Check the correctness of the data and input format. Error - ${JSON.stringify(e.message)}, Product doesn't exist`)
    }
}
async function convertProductMetafields() {
    const productString = await fsPromises.readFile('resultData/METAFIELDS.jsonl', 'utf-8'); //read jsonl file with metafields
    let jsonString = `[ ${productString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`;
    let parsedString = JSON.parse(jsonString); //convert to json
    let currentProductId;
    let productMetafieldsArray = [];
    for (let i = 0; i < parsedString.length; i++) { //main cycle for all objects in array
        if (Object.keys(parsedString[i]).length === 3 || Object.keys(parsedString[i]).length === 6) { //check if it's product metafields
            continue;
        }
        else {
            if (Object.keys(parsedString[i]).length === 2) {
                currentProductId = await FetchProductByHandle(getProductByHandle(parsedString[i]['handle'])); //get product by handle
            }
            else {
                for (let productObjValue in parsedString[i]) { //second cycle for each key in each object
                    switch (productObjValue) { //adding data to array
                        case 'id':
                            productMetafieldsArray.push(`{"id":"${parsedString[i]['id']}"`);
                            break;
                        case 'key':
                            productMetafieldsArray.push(`"key":"${parsedString[i]['key']}"`);
                            break;
                        case 'namespace':
                            productMetafieldsArray.push(`"namespace":"${parsedString[i]['namespace']}"`);
                            break;
                        case 'value':
                            productMetafieldsArray.push(`"value":"${parsedString[i]['value']}"}`);
                            break;
                    }

                }
                const followObj = parsedString[i + 1]; //check if next object is another product
                if (!followObj || Object.keys(followObj).length === 2 || Object.keys(followObj).length === 3 || productMetafieldsArray.length > 0) {
                    const getProductMetafieldData = () => ({
                        id: currentProductId,
                        metafields: productMetafieldsArray
                    });

                    let data = updateMetafields(getProductMetafieldData());
                    await fsPromises.appendFile('resultData/PRODUCT-METAFIELDS.jsonl', data.toString() + '\n') //add converted data to new jsonl file
                    console.log('Product was added');
                    productMetafieldsArray = []; //clear array
                }
            }
        }
    }

}

module.exports = { convertProductMetafields };