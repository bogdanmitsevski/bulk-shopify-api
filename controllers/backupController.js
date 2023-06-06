const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');
const requestStructure = require('../utils/requestOptions/requestOptions');
const { getProductInfo, getBulkOperationId, getMetafields } = require('../utils/graphqlRequests/queries');
const { convertJSONLtoJSON } = require('../utils/converter/jsonl2json');
const { toCSVconverter } = require('../utils/converter/json2csv');
const { convertProductMetafields } = require('../utils/converter/productMetaFieldConverter');
const { convertVariantMetafields } = require('../utils/converter/variantMetaFieldConverter');

class BackupController {
    async ProductsBackup(req, res) {
        const GetProducts = async (bulkMutation, bulkId) => {
            try {
                const BulkOperationId = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(bulkMutation))
                    .then((response) => {
                        return response.json();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                console.log(await BulkOperationId.data);
                const timeOutAction = () => {
                    return new Promise((resolve, reject) => {
                        let getLinkInterval = setInterval(async () => {
                            const BulkOperationLink = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(bulkId(BulkOperationId.data.bulkOperationRunQuery.bulkOperation.id)))
                                .then((response) => {
                                    return response.json();
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            if (BulkOperationLink.data.node.url) {
                                resolve(BulkOperationLink.data.node.url);
                                clearInterval(getLinkInterval);
                            }
                            else {
                                console.log('Waiting for Link');
                            }
                        }, 20000);
                    })
                }
                const runPromise = async () => {
                    console.log('Waiting for status');
                    const file = fs.createWriteStream("file.jsonl");
                    https.get(await timeOutAction(), function (response) {
                        response.pipe(file);
                        file.on("finish", () => {
                            file.close();
                            console.log("Download Completed");
                            convertJSONLtoJSON();
                            toCSVconverter();
                        });
                    });
                };

                await runPromise();

            }
            catch (e) {
                console.log(JSON.stringify(e));
            }
        }
        await GetProducts(getProductInfo(), getBulkOperationId);

    }
}

module.exports = new BackupController;