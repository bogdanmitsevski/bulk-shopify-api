const fs      = require('fs');
const csvjson = require('csvjson');
const today   = new Date();

async function toCSVconverter() {

    fs.readFile('resultData/PRODUCTS.json', 'utf-8', (err, fileContent) => { //read json file before converting
        if (err) {
            console.log(err);
            throw new Error(err);
        }

        const csvData = csvjson.toCSV(fileContent, { //add settings to CSV conversion
            headers: 'key',
            delimiter: ";;",
            wrap: false
        });

        fs.writeFile(`resultData/products_backup_${today.toLocaleDateString()}.csv`, //result file creation
        csvData                                                         //replace columns name according to shopify standards
        .replaceAll(';;',',')
        .replaceAll('Option1Name','Option1 Name')
        .replaceAll('Option1Value','Option1 Value')
        .replaceAll('Option2Name','Option2 Name')
        .replaceAll('Option2Value','Option2 Value')
        .replaceAll('Option3Name','Option3 Name')
        .replaceAll('Option3Value','Option3 Value')
        .replaceAll('VariantPrice','Variant Price')
        .replaceAll('VariantSKU','Variant SKU')
        .replaceAll('VariantBarcode','Variant Barcode')
        .replaceAll('VariantCompareAtPrice','Variant Compare At Price')
        .replaceAll('VariantInventoryQty', 'Variant Inventory Qty')
        .replace('amount','Cost per item')
        .replace('url','Image src')
        .replace('altText','Image Alt Text')
        .replace('VariantInventoryTracker','Variant Inventory Tracker')
        .replace('VariantInventoryPolicy','Variant Inventory Policy')
        .replace('VariantFulfillmentService','Variant Fulfillment Service'), (err) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            console.log('JSON was converted in CSV successfully');
            fs.unlink('resultData/PRODUCTS.json', (err) => { //delete last json file
                if(err) {
                    console.log(err);
                }
                console.log('JSON file was successfully removed');
            })
        })
    })

}

module.exports = { toCSVconverter };