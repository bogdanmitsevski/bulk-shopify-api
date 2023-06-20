const fs = require('fs');


async function convertJSONLtoJSON() {
    fs.readFile('resultData/PRODUCTS.jsonl', 'utf-8', (err, jsonString) => { //read file with products
        if (err) {
            console.log(err);
            return;
        }
        let jsonObject = `[ ${jsonString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`; 
        let object = JSON.parse(jsonObject); //convert to JSON
        let productHandle;
        for (let i = 0; i < object.length; i++) { //main cycle for all objects in array
            let subObject = object[i];
            if (subObject["selectedOptions"] === undefined && Object.keys(subObject).length > 2) { //check if it's main product
                subObject['__type__'] = 'main_product';
            }
            else if (subObject["selectedOptions"] !== undefined) { //check if it's variant
                subObject['__type__'] = 'variant';
            }
            else if (subObject["selectedOptions"] === undefined && Object.keys(subObject).length === 2) { //check if it's product photo or product variant handle
                subObject['__type__'] = 'variant_handle';
            }
            for (let subProperty in subObject) { //second cycle for each key in each object for replace or delete some data
                if (subObject['__type__'] === 'main_product') {
                    switch (subProperty) {
                        case 'handle':
                            productHandle = subObject['handle'];
                            break;
                        case 'title':
                            subObject['title'] = `"${subObject['title']}"`;
                            break;
                        case 'descriptionHtml':
                            subProperty = 'description';
                            let singleQuoteString = (subObject['descriptionHtml']).replaceAll('"', "'");
                            subObject['description'] = `"${singleQuoteString}"`;
                            delete subObject['descriptionHtml'];
                            break;
                        case 'status':
                            subProperty = 'status';
                            subObject['Status'] = subObject['status'];
                            delete subObject['status'];
                            break;
                        case 'productType':
                            subProperty = 'Type';
                            subObject['Type'] = `"${subObject['productType']}"`;
                            delete subObject['productType'];
                            break;
                        case 'tags':
                            subProperty = 'Tags';
                            let arrToString = subObject['tags'];
                            subObject['Tags'] = `"${arrToString.toString()}"`;
                            delete subObject['tags'];
                            break;
                        case 'id':
                            delete subObject['id'];
                            break;
                        case '__parentId':
                            delete subObject['__parentId'];
                            break;
                        case 'options':                         //add option variant name according to option value in main product
                            // Option1(Name+Value)
                            if (subObject['options'][0] === undefined) {
                                subObject['Option1Name'] = '';
                                subObject['Option1Value'] = '';
                            }
                            else {
                                let option1Arr = (subObject['options'][0].values).toString().split(',');
                                if (option1Arr.length > 0) {
                                    subObject['Option1Name'] = (subObject['options'][0].name);
                                    subObject['Option1Value'] = `"${option1Arr[0]}"`;
                                }
                            }
                            //Option2(Name+Value)
                            if (subObject['options'][1] === undefined) {
                                subObject['Option2Name'] = '';
                                subObject['Option2Value'] = '';
                            }
                            else {
                                let option2Arr = (subObject['options'][1].values).toString().split(',');
                                if (option2Arr.length > 0) {
                                    subObject['Option2Name'] = (subObject['options'][1].name);
                                    subObject['Option2Value'] = `"${option2Arr[0]}"`;
                                }
                            }
                            // // Option3(Name+Value)
                            if (subObject['options'][2] === undefined) {
                                subObject['Option3Name'] = '';
                                subObject['Option3Value'] = '';
                            }
                            else {
                                let option3Arr = (subObject['options'][2].values).toString().split(',');
                                if (option3Arr.length > 0) {
                                    subObject['Option3Name'] = (subObject['options'][2].name);
                                    subObject['Option3Value'] = `"${option3Arr[0]}"`;
                                }
                            }
                            delete subObject['options'];
                            break;
                        case 'price':
                            subObject['VariantPrice'] = subObject['price'];
                            delete subObject['price'];
                            break;
                        case 'compareAtPrice':
                            subObject['VariantCompareAtPrice'] = subObject['compareAtPrice'];
                            delete subObject['compareAtPrice'];
                            break;
                        case 'sku':
                            subObject['VariantSKU'] = subObject['sku'];
                            delete subObject['sku'];
                            break;
                        case 'barcode':
                            subObject['VariantBarcode'] = subObject['barcode'];
                            delete subObject['barcode'];
                            break;
                    }
                }
            }
            if (subObject['__type__'] === 'variant') {
                subObject["handle"] = productHandle;
                subObject["title"] = '';
                subObject["VariantInventoryTracker"] = 'shopify';
                subObject["VariantInventoryPolicy"] = 'deny';
                subObject["VariantFulfillmentService"] = 'manual';
                for (let variantProperty in subObject) {
                    switch (variantProperty) {
                        case 'price':
                            subObject['VariantPrice'] = subObject['price'];
                            delete subObject['price'];
                            break;
                        case 'compareAtPrice':
                            subObject['VariantCompareAtPrice'] = subObject['compareAtPrice'];
                            delete subObject['compareAtPrice'];
                            break;
                        case 'sku':
                            subObject['VariantSKU'] = subObject['sku'];
                            delete subObject['sku'];
                            break;
                        case 'barcode':
                            subObject['VariantBarcode'] = subObject['barcode'];
                            delete subObject['barcode'];
                            break;
                        case '__parentId':
                            delete subObject['__parentId'];
                            break;
                    }
                }
                if (subObject["selectedOptions"][0] != undefined) {                        //add each option to each value in product variant
                    subObject["Option1Value"] = `"${subObject["selectedOptions"][0].value}"`;
                }
                else {
                    subObject["Option1Value"] = '';
                }
                if (subObject["selectedOptions"][1] != undefined) {
                    subObject["Option2Value"] = `"${subObject["selectedOptions"][1].value}"`;
                }
                else {
                    subObject["Option2Value"] = '';
                }
                if (subObject["selectedOptions"][2] != undefined) {
                    subObject["Option3Value"] = `"${subObject["selectedOptions"][2].value}"`;
                    delete subObject["selectedOptions"];
                }
                else {
                    subObject["Option3Value"] = '';
                    delete subObject["selectedOptions"];
                }
            }
            else if (subObject['__type__'] === 'variant_handle') {
                subObject["handle"] = productHandle;
                delete subObject['__parentId'];
            }
            let nextObject = object[i + 1]
            if (subObject['__type__'] === 'main_product' && nextObject) { //add first variant data to main product object(as in shopify standarts)
                subObject['VariantSKU'] = nextObject['sku'];
                subObject['VariantBarcode'] = nextObject['barcode'];
                subObject['VariantPrice'] = nextObject['price'];
                subObject['VariantCompareAtPrice'] = nextObject['compareAtPrice'];
                subObject['inventoryItem'] = nextObject['inventoryItem'];
                subObject["VariantInventoryTracker"] = 'shopify';
                subObject["VariantInventoryPolicy"] = 'deny';
                subObject["VariantFulfillmentService"] = 'manual';
                object.splice(i + 1, 1);
            }
            for (subProperty in subObject) {
                if (subObject[subProperty] === null) {
                    subObject[subProperty] = '';
                }

            }
            delete subObject['__type__'];

        }
        fs.writeFile('resultData/PRODUCTS.json', JSON.stringify(object, null, 2), 'utf-8', (err) => { //write result(converted JSON)
            if (err) {
                console.log(err);
                return;
            }
            console.log('Data was converted to JSON');
            fs.unlink('resultData/PRODUCTS.jsonl', (err) => { //delete last jsonl file
                if (err) {
                    console.log(err);
                }
                console.log('JSONL file was successfully removed');
            })
        })
    });
}

module.exports = { convertJSONLtoJSON };