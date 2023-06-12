const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');
const requestStructure = require('../utils/requestOptions/requestOptions');
const { getProductInfo, getBulkOperationId, getMedia, getInventoryInfo } = require('../utils/graphqlRequests/queries');
const { convertINVENTORYJSONLtoJSON } = require('../utils/converter/inventoryJSONL2JSON');
const { InventorytoCSVconverter } = require('../utils/converter/inventoryJSON2CSV');
//const { downloadMedia } = require('../utils/converter/mediaConverter');
const { convertProductMetafields } = require('../utils/converter/productMetaFieldConverter');
const { convertVariantMetafields } = require('../utils/converter/variantMetaFieldConverter');

class BackupController {
    async ProductsBackup(req, res) {
        const GetProducts = async (bulkMutation, bulkId) => {
            try {
                const BulkOperationId = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkMutation))
                    .then((response) => {
                        return response.json();
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
                console.log(BulkOperationId.data);
                const timeOutAction = () => {
                    return new Promise((resolve, reject) => {
                        let getLinkInterval = setInterval(async () => {
                            const BulkOperationLink = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkId(BulkOperationId.data.bulkOperationRunQuery.bulkOperation.id)))
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
                        }, 10000);
                    })
                }
                const runPromise = async () => {
                    console.log('Waiting for status');
                    const file = fs.createWriteStream("resultData/INVENTORY.jsonl");
                    https.get(await timeOutAction(), function (response) {
                        response.pipe(file);
                        file.on("finish", () => {
                            file.close();
                            console.log("Download Completed");
                            convertINVENTORYJSONLtoJSON();
                            setTimeout(()=>{
                                InventorytoCSVconverter();
                            },100)
                        });
                    });
                };

                await runPromise();

            }
            catch (e) {
                console.log((e.message || e));
            }
        }
        await GetProducts(getInventoryInfo(), getBulkOperationId);

    }
}

module.exports = new BackupController;