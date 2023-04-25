const fetch = require('node-fetch');
const fs = require('fs');
const fsPromises = require('fs/promises');
const FormData = require('form-data');
const requestStructure = require('../utils/requestOptions/requestOptions');
const { parseStringToStringArray } = require('../utils/requestParsers');
const { getProduct, getProductByGUID } = require('../utils/graphqlRequests/queries');
const { stagedUploads, updateProduct, updateProducts } = require('../utils/graphqlRequests/mutations');
class UpdateController {
    async AddToFileData(req, res) {
        try {
            for (let i = 0; i < req.body.variants.length; i++) {
                for (const value of req.body.variants[i].options) {
                    const index = req.body.variants[i].options.indexOf(value);
                    req.body.variants[i].options[index] = value + '⁢'.repeat(i);
                }
            }
            const FetchProductId = async (args) => {
                try {
                    const FindProductId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args))
                        .then(res => res.json())
                    return FindProductId.data.products.edges[0].node.id;
                }
                catch (e) {
                    console.log(`Check the correctness of the data and input format. Error - ${JSON.stringify(e)}`)
                }
            }
            if (req.body.sku) {
                const FetchProductIdResult = await FetchProductId(getProduct(req.body.sku));
                const data = updateProduct({
                    id: FetchProductIdResult,
                    title: req.body.title,
                    handle: req.body.handle,
                    description: req.body.description,
                    tags: req.body.tags,
                    options: parseStringToStringArray(req.body.options),
                    variants: req.body.variants
                });

                if(FetchProductIdResult === undefined) {
                    res.status(300).json(`product with SKU: "${req.body.sku}" doesn't exist` );
                }

                else {

                fs.appendFile('UPDATE.jsonl', data.toString() + '\n', (err) => {
                    if (err)
                        throw err;
                    else
                        console.log('200');
                        res.status(200).send('Product was added');
                })
                }
            }

            else {
                const FetchProductIdResult = await FetchProductId(getProductByGUID(req.body.guid));
                const data = updateProduct({
                    id: FetchProductIdResult,
                    title: req.body.title,
                    handle: req.body.handle,
                    description: req.body.description,
                    tags: req.body.tags,
                    options: parseStringToStringArray(req.body.options),
                    variants: req.body.variants
                });

                if(FetchProductIdResult === undefined) {
                    res.status(300).json(`product with GUID: "${req.body.guid}" doesn't exist` );
                }

                else {

                fs.appendFile('UPDATE.jsonl', data.toString() + '\n', (err) => {
                    if (err)
                        throw err;
                    else
                        res.status(200).send('Product was added');
                })
            }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    async UpdateData(req, res) {
        const fetchMutationUploadsUpdate = async (args, args1) => {
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
                formData.append('file', fs.createReadStream('./UPDATE.jsonl'));

                const file = await fsPromises.readFile('./UPDATE.jsonl', { encoding: 'utf8' });
                if (file.length === 0) {
                    res.status(300).json('File with products is empty');
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
                        .then((responseJson) => {
                            console.log(responseJson);
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    res.status(200).send('Products were sent to Shopify');
                }
            } catch (e) {
                res.status(300).json(`Check the correctness of the data and input format. Error - ${JSON.stringify(e)}`)
            }
        }
        await fetchMutationUploadsUpdate(stagedUploads(), updateProducts);
        fs.writeFile('UPDATE.jsonl', '', function () { console.log('File is clear') })
    }
    catch(e) {
        console.log(e);
    }
}

module.exports = new UpdateController;