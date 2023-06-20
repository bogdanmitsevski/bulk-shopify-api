const fs = require('fs');
const fsPromises = require('fs/promises');
const { getProductVariantBySKU } = require('../graphqlRequests/queries');
const { updateMetafields } = require('../graphqlRequests/mutations');
const requestStructure = require('../requestOptions/requestOptions');

const FetchProductVariantBySKU = async (args) => {
    try {
        const FindVariantId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args)) //get variant id
            .then(res => res.json())
        return FindVariantId.data.productVariants.edges[0].node.id;
    }
    catch (e) {
        console.log(`Check the correctness of the data and input format. Error - ${JSON.stringify(e.message)}, Product doesn't exist`)
    }
}

async function convertVariantMetafields() {
    const variantString = await fsPromises.readFile('resultData/METAFIELDS.jsonl', 'utf-8'); //read jsonl file with metafields
    let jsonString = `[ ${variantString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`;
    let parsedString = JSON.parse(jsonString); //convert to json
    let currentVariantId;
    let variantMetafieldsArray = [];
    for (let i = 0; i < parsedString.length; i++) { //main cycle for all objects in array
        if (Object.keys(parsedString[i]).length === 2 || Object.keys(parsedString[i]).length === 5) { //check if it's variant metafields
            continue;
        }
        else {
            if (Object.keys(parsedString[i]).length === 3) {
                currentVariantId = await FetchProductVariantBySKU(getProductVariantBySKU(parsedString[i]['sku'])); //get variant by sku
            }
            else {
                for (let variantObjValue in parsedString[i]) { //second cycle for each key in each object
                    switch (variantObjValue) {                  // adding data to array
                        case 'id':
                            variantMetafieldsArray.push(`{"id":"${parsedString[i]['id']}"`);
                            break;
                        case 'key':
                            variantMetafieldsArray.push(`"key":"${parsedString[i]['key']}"`);
                            break;
                        case 'namespace':
                            variantMetafieldsArray.push(`"namespace":"${parsedString[i]['namespace']}"`);
                            break;
                        case 'value':
                            variantMetafieldsArray.push(`"value":"${parsedString[i]['value']}"}`);
                            break;
                    }

                }
                const followObjVariant = parsedString[i + 1]; //check if next object is another variant
                if (!followObjVariant || Object.keys(followObjVariant).length === 2 || Object.keys(followObjVariant).length === 3 || variantMetafieldsArray.length > 0) {
                    const getVariantMetafieldData = () => ({
                        id: currentVariantId,
                        metafields: variantMetafieldsArray
                    });

                    let data = updateMetafields(getVariantMetafieldData());
                    await fsPromises.appendFile('resultData/VARIANT-METAFIELDS.jsonl', data.toString() + '\n') //add converted data to new jsonl file
                    console.log('Variant Metafield was added');
                    variantMetafieldsArray = []; //clear data array
                }
            }
        }
    }

}

module.exports = { convertVariantMetafields }
