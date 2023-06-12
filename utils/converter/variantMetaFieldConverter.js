const fs = require('fs');
const fsPromises = require('fs/promises');
const { getProductVariantBySKU } = require('../graphqlRequests/queries');
const { updateMetafields, stagedUploads, updateProducts } = require('../graphqlRequests/mutations');
const requestStructure = require('../requestOptions/requestOptions');
const fetchMutationVariantMetafieldsUpdate = async (args, args1) => {
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
        formData.append('file', await fsPromises.readFile('.resultData/VARIANT-METAFIELDS.jsonl'));

        const file = await fsPromises.readFile('.resultData/VARIANT-METAFIELDS.jsonl', { encoding: 'utf8' });
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
const FetchProductVariantBySKU = async (args) => {
    try {
        const FindVariantId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
            .then(res => res.json())
        return FindVariantId.data.productVariants.edges[0].node.id;
    }
    catch (e) {
        console.log(`Check the correctness of the data and input format. Error - ${JSON.stringify(e.message)}, Product doesn't exist`)
    }
}

async function convertVariantMetafields() {
    const variantString = await fsPromises.readFile('/Users/Bogdan/Desktop/writeFile/resultData/METAFIELDS.jsonl', 'utf-8');
    let jsonString = `[ ${variantString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`;
    let parsedString = JSON.parse(jsonString);
    let currentVariantId;
    let variantMetafieldsArray = [];
    for (let i = 0; i < parsedString.length; i++) {
        if (Object.keys(parsedString[i]).length === 2 || Object.keys(parsedString[i]).length === 5) { //here
            continue;
        }
        else {
            if (Object.keys(parsedString[i]).length === 3) {
                currentVariantId = await FetchProductVariantBySKU(getProductVariantBySKU(parsedString[i]['sku']));
            }
            else {
                for (let variantObjValue in parsedString[i]) {
                    switch (variantObjValue) {
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
                console.log(1);
                const followObjVariant = parsedString[i + 1];
                if (!followObjVariant || Object.keys(followObjVariant).length === 2 || Object.keys(followObjVariant).length === 3 || variantMetafieldsArray.length > 0) {
                    const getVariantMetafieldData = () => ({
                        id: currentVariantId,
                        metafields: variantMetafieldsArray
                    });

                    let data = updateMetafields(getVariantMetafieldData());
                    console.log(2);
                    await fsPromises.appendFile('resultData/VARIANT-METAFIELDS.jsonl', data.toString() + '\n')
                    console.log(3);
                    console.log('Variant Metafield was added');
                    variantMetafieldsArray = [];
                }
            }
        }
    }
    //await fetchMutationVariantMetafieldsUpdate(stagedUploads(), updateProducts);
    //await fsPromises.writeFile('resultData/VARIANT-METAFIELDS.jsonl', '');

}

module.exports = { convertVariantMetafields }
