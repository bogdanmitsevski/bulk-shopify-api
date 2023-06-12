const fs = require('fs');
const fsPromises = require('fs/promises');
const { getProductByHandle } = require('../graphqlRequests/queries');
const { updateMetafields, stagedUploads, updateProducts } = require('../graphqlRequests/mutations');
const requestStructure = require('../requestOptions/requestOptions');
const fetchMutationProductMetafieldsUpdate = async (args, args1) => {
    try {
        const uploadsResponse = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
            .then(res => res.json())

        console.log(JSON.stringify(uploadsResponse.data));

        const formData = new FormData();
        formData.append('key', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[3].value);
        formData.append('x-goog-credential', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[5].value);
        formData.append('x-goog-algorithm', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[6].value);
        formData.append('x-goog-date', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[4].value);
        formData.append('acl', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[2].value);
        formData.append('x-goog-signature', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[7].value);
        formData.append('policy', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[8].value);
        formData.append('Content-Type', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[0].value);
        formData.append('success_action_status', uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[1].value);
        formData.append('file', await fsPromises.readFile('./resultData/PRODUCT-METAFIELDS.jsonl'));

        const file = await fsPromises.readFile('./resultData/PRODUCT-METAFIELDS.jsonl', { encoding: 'utf8' });
        if (file.length === 0) {
            console.log('File with products is empty');
        }
        else {
            const sendFileResponse = await fetch('https://shopify-staged-uploads.storage.googleapis.com/', {
                method: 'POST',
                body: formData
            });

            console.log(sendFileResponse);

            await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args1(uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[3].value)))
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    } catch (e) {
        console.log(`Check the correctness of the data and input format. Error - ${JSON.stringify(e)}`)
    }
}
const FetchProductByHandle = async (args) => {
    try {
        const FindProductId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
            .then(res => res.json())
        return FindProductId.data.products.edges[0].node.id;
    }
    catch (e) {
        console.log(`Check the correctness of the data and input format. Error - ${JSON.stringify(e.message)}, Product doesn't exist`)
    }
}
async function convertProductMetafields() {
    const productString = await fsPromises.readFile('/Users/Bogdan/Desktop/writeFile/resultData/METAFIELDS.jsonl', 'utf-8');
    let jsonString = `[ ${productString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`;
    let parsedString = JSON.parse(jsonString);
    let currentProductId;
    let productMetafieldsArray = [];
    for (let i = 0; i < parsedString.length; i++) {
        if (Object.keys(parsedString[i]).length === 3 || Object.keys(parsedString[i]).length === 6) { //here
            continue;
        }
        else {
            if (Object.keys(parsedString[i]).length === 2) {
                currentProductId = await FetchProductByHandle(getProductByHandle(parsedString[i]['handle']));
            }
            else {
                for (let productObjValue in parsedString[i]) {
                    switch (productObjValue) {
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
                const followObj = parsedString[i + 1];
                if (!followObj || Object.keys(followObj).length === 2 || Object.keys(followObj).length === 3 || productMetafieldsArray.length > 0) {
                    const getProductMetafieldData = () => ({
                        id: currentProductId,
                        metafields: productMetafieldsArray
                    });

                    let data = updateMetafields(getProductMetafieldData());
                    await fsPromises.appendFile('resultData/PRODUCT-METAFIELDS.jsonl', data.toString() + '\n')
                    console.log('Product was added');
                    productMetafieldsArray = [];
                }
            }
        }
    }
    //await fetchMutationProductMetafieldsUpdate(stagedUploads(), updateProducts);
    //await fsPromises.writeFile('resultData/PRODUCT-METAFIELDS.jsonl', '')

}

module.exports = { convertProductMetafields };