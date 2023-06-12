const https = require('https');
const fetch = require('node-fetch');
const fs = require('fs');
const requestStructure = require('../utils/requestOptions/requestOptions');
const { downloadMedia } = require('./converter/mediaConverter');
const GetMedia = async (bulkMutation, bulkId) => {
    try {
        const BulkOperationId = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkMutation))
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            });
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
            const file = fs.createWriteStream("resultData/MEDIA.jsonl");
            https.get(await timeOutAction(), function (response) {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    downloadMedia();
                });
            });
        };

        await runPromise();

    }
    catch (e) {
        console.log(e.message || e);
    }
}

module.exports = { GetMedia };