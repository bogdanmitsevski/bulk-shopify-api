const fs = require('fs');
const fsPromises = require('fs/promises');
const { stagedUploads, updateProducts, updateVariants } = require('../utils/graphqlRequests/mutations');
const { convertProductMetafields } = require('../utils/converter/productMetaFieldConverter');
const { convertVariantMetafields } = require('../utils/converter/variantMetaFieldConverter');
const requestStructure = require('../utils/requestOptions/requestOptions');

class MetafieldController {
    async sendMetafields(req, res) {
        const fetchMutationMetafieldsUpdate = async (args, args1, filepath) => {    //create query for updating metafields
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
                formData.append('file', await fsPromises.readFile(filepath)); // send file with metafields

                const file = await fsPromises.readFile(filepath, { encoding: 'utf8' });
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

        try {
            let isProductMetafieldsFinished = false;
            let isVariantMetafieldsFinished = false;
            setTimeout(async () => { //get product metafields
                await convertProductMetafields();
                await fetchMutationMetafieldsUpdate(stagedUploads(), updateProducts, 'resultData/PRODUCT-METAFIELDS.jsonl');
                await fsPromises.writeFile('resultData/PRODUCT-METAFIELDS.jsonl', '');
                isProductMetafieldsFinished = true;
            }, 120000);

            setTimeout(async () => { //get variant metafields
                convertVariantMetafields();
                await fetchMutationMetafieldsUpdate(stagedUploads(), updateVariants, 'resultData/VARIANT-METAFIELDS.jsonl');
                await fsPromises.writeFile('resultData/VARIANT-METAFIELDS.jsonl', '');
                isVariantMetafieldsFinished = true;
            }, 120000);
            let isMetafieldsReady = setInterval((async () => {
                if (isProductMetafieldsFinished === true && isVariantMetafieldsFinished === true) {
                    res.status(200).json('Product Metafields were sent to shopify successfully');
                    clearInterval(isMetafieldsReady);
                }
                else {
                    console.log('Waiting for metafields uploading');
                }
            }), 60000)
        }
        catch (e) {
            res.status(300).json(e || e.message);
        }

    }
}


module.exports = new MetafieldController;