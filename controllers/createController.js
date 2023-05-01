const fetch                                            = require('node-fetch');
const fsPromises                                       = require('fs/promises');
const fs                                               = require('fs');
const FormData                                         = require('form-data');
const requestStructure                                 = require('../utils/requestOptions/requestOptions');
const { parseStringToStringArray }                     = require('../utils/requestParsers');
const { stagedUploads, createProducts, createProduct } = require('../utils/graphqlRequests/mutations');
const { eventDataStorage }                             = require('../utils/eventDataStorage');
const { changeTags }                                   = require('../utils/changeTags');
class CreateController {
    async WriteData(req, res) {
        try {
            for (let i = 0; i < req.body.variants.length; i++) {
                for (const value of req.body.variants[i].options) {
                    const index = req.body.variants[i].options.indexOf(value);
                    req.body.variants[i].options[index] = value + '⁢'.repeat(i);
                }
            }
            const getReqBodyData = () => ({
                title: req.body.title,
                handle: req.body.handle,
                description: req.body.description || '',
                vendor: req.body.vendor,
                tags: changeTags(req.body.tags),
                options: parseStringToStringArray(req.body.options),
                variants: req.body.variants
            });
            let data = createProduct(getReqBodyData());

            fs.appendFile('CREATION.jsonl', data.toString() + '\n', (err) => {
                if (err) throw err;
            })

            res.json('Product was added');
        }
        catch (e) {
            console.log(e);
        }
    };
    async CreateData(req, res) {
        try {
            const fetchMutationUploadsCreate = async (args, args1) => {
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
                    formData.append('file', fs.createReadStream('./CREATION.jsonl'));

                    const file = await fsPromises.readFile('./CREATION.jsonl', {encoding: 'utf8'});
                    if(file.length === 0) {
                        res.status(300).json('File with products is empty');
                      }
                      else {

                    const sendFileResponse = await fetch('https://shopify-staged-uploads.storage.googleapis.com/', {
                        method: 'POST',
                        body: formData
                    });

                    console.log(sendFileResponse);

                    const BulkOperationResult = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(args1(uploadsResponse.data.stagedUploadsCreate.stagedTargets[0].parameters[3].value)))
                    .then((response)=>{
                        return response.json();
                    })
                    .catch((error) => {
                        console.log(error);
                      });
                      const graphqlId = BulkOperationResult.data.bulkOperationRunMutation.bulkOperation.id;
                      eventDataStorage.once(graphqlId,(reqBody)=>{res.status(200).json(reqBody);})
                    }
                } catch (e) {
                    res.status(300).json(`Check the correctness of the data and input format. Error - ${JSON.stringify(e)}`)
                }
            }
            await fetchMutationUploadsCreate(stagedUploads(), createProducts);
            fs.writeFile('CREATION.jsonl', '', function () { console.log('File is clear') })
        }
        catch (e) {
            console.log(e);
        }

    }
}

module.exports = new CreateController;