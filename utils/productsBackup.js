const https                  = require('https');
const fetch                  = require('node-fetch');
const fs                     = require('fs');
const requestStructure       = require('./requestOptions/requestOptions');
const { convertJSONLtoJSON } = require('./converter/productJSONL2JSON');
const { toCSVconverter }     = require('./converter/productJSON2CSV');
const GetProducts = async (bulkMutation, bulkId) => {
    try {
        let url = process.env.shopUrl + `/admin/api/2023-01/graphql.json`;
        const BulkOperationId = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkMutation)) //get bulk operation id
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            });
        console.log(BulkOperationId.data);
        const timeOutAction = () => {
            return new Promise((resolve, reject) => {
                let getLinkInterval = setInterval(async () => {
                    const BulkOperationLink = await fetch(`https://best-collection-boutique.myshopify.com/admin/api/2023-01/graphql.json`, requestStructure(bulkId(BulkOperationId.data.bulkOperationRunQuery.bulkOperation.id))) //get link with products
                        .then((response) => {
                            return response.json();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    try {
                        if (BulkOperationLink.data.node.url) {   //check if link is avaliable
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
            const file = fs.createWriteStream("resultData/PRODUCTS.jsonl"); //write products to file
            https.get(await timeOutAction(), function (response) {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    console.log("Download Completed");
                    convertJSONLtoJSON(); //convert jsonl to json
                    setTimeout(()=>{
                        toCSVconverter(); //convert json to csv
                    },120000)
                });
            });
        };

        await runPromise();

    }
    catch (e) {
        console.log(e.message || e);
    }
}

module.exports = { GetProducts };