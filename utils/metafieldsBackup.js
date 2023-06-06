const https = require('https');
const fetch = require('node-fetch');
const fs = require('fs');
const requestStructure = require('./requestOptions/requestOptions');
const { convertProductMetafields } = require('./converter/productMetaFieldConverter');
const { convertVariantMetafields } = require('./converter/variantMetaFieldConverter');
const GetMetafields = async (bulkMutation, bulkId) => {
    try {
        let url = process.env.shopUrl + `/admin/api/2023-01/graphql.json`;
        const BulkOperationId = await fetch(`https://my-ship-test.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkMutation))
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            });
        console.log(BulkOperationId.data);
        const timeOutAction = () => {
            console.log(3);
            return new Promise((resolve, reject) => {
                let getLinkInterval = setInterval(async () => {
                    const BulkOperationLink = await fetch(`https://my-ship-test.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkId(BulkOperationId.data.bulkOperationRunQuery.bulkOperation.id)))
                        .then((response) => {
                            return response.json();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    console.log(1, BulkOperationLink);
                    try {
                        if (BulkOperationLink.data.node.url) {
                            resolve(BulkOperationLink.data.node.url);
                            clearInterval(getLinkInterval);
                        }
                        else {
                            console.log('Waiting for Link');
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }, 20000);
            })
        }
        const runPromise = async () => {
            console.log('Waiting for status');
            const file = fs.createWriteStream("METAFIELDS.jsonl");
            console.log(4);
            https.get(await timeOutAction(), function (response) {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    convertProductMetafields();
                    convertVariantMetafields();
                });
            });
        };

        await runPromise();

    }
    catch (e) {
        console.log(e.message || e);
    }
}

module.exports = { GetMetafields };