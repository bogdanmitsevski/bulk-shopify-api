const https                                  = require('https');
const fs                                     = require('fs');
const fetch                                  = require('node-fetch');
const requestStructure                       = require('../utils/requestOptions/requestOptions');
const { getProductInfo, getBulkOperationId } = require('../utils/graphqlRequests/queries');
const { changeExtension }                    = require('../utils/converter/jsonl2json');

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
                const timeOutAction = () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(async () => {
                            const BulkOperationLink = await fetch(process.env.shopUrl + `/admin/api/2023-01/graphql.json`, requestStructure(bulkId(BulkOperationId.data.bulkOperationRunQuery.bulkOperation.id)))
                                .then((response) => {
                                    return response.json();
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            resolve(BulkOperationLink.data.node.url);
                        }, 20000);
                    })
                }
                const runPromise = async () => {
                    console.log('Waiting for status');
                    const file = fs.createWriteStream("file.jsonl");
                    https.get(await timeOutAction(), function(response) {
                    response.pipe(file);
                    file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    changeExtension();
                    });
                    });
                };

                await runPromise();
                //await changeExtension();

            }
            catch (e) {
                console.log(JSON.stringify(e));
            }
        }
        await GetProducts(getProductInfo(), getBulkOperationId);

    }
}

module.exports = new BackupController;