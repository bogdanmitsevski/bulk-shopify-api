const https             = require('https');
const fetch             = require('node-fetch');
const fs                = require('fs');
const requestStructure  = require('../utils/requestOptions/requestOptions');
const { downloadMedia } = require('./converter/mediaConverter');
const GetMedia = async (bulkMutation, bulkId) => {
    try {
        const BulkOperationId = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkMutation))  //get bulk operation id
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            });
        const timeOutAction = () => {
            return new Promise((resolve, reject) => {
                let getLinkInterval = setInterval(async () => {
                    const BulkOperationLink = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkId(BulkOperationId.data.bulkOperationRunQuery.bulkOperation.id))) //get link with media
                        .then((response) => {
                            return response.json();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    try {
                        if (BulkOperationLink.data.node.url) {  //check if link is avaliable
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
            const file = fs.createWriteStream("resultData/MEDIA.jsonl"); //write data to file
            https.get(await timeOutAction(), function (response) {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    downloadMedia(); //run download media function
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