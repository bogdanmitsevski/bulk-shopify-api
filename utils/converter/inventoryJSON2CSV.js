const fs      = require('fs');
const csvjson = require('csvjson');
const today   = new Date();

async function InventorytoCSVconverter() {

    fs.readFile('/Users/Bogdan/Desktop/writeFile/resultData/INVENTORY.json', 'utf-8', (err, fileContent) => { //read json file before converting
        if (err) {
            console.log(err);
            throw new Error(err);
        }

        const csvData = csvjson.toCSV(fileContent, { //add settings to CSV conversion
            headers: 'key',
            delimiter: ";;",
            wrap: false
        });

        fs.writeFile(`/Users/Bogdan/Desktop/writeFile/resultData/inventory_backup_${today.toLocaleDateString()}.csv`, //result file creation
        csvData
        .replaceAll(';;',',')                            //replace columns name according to shopify standards
        .replaceAll('Option1Name','Option1 Name')
        .replaceAll('Option1Value','Option1 Value')
        .replaceAll('Option2Name','Option2 Name')
        .replaceAll('Option2Value','Option2 Value')
        .replaceAll('Option3Name','Option3 Name')
        .replaceAll('Option3Value','Option3 Value')
        .replaceAll('VariantSKU','Variant SKU')
        .replaceAll('VariantInventoryQty', 'Variant Inventory Qty')
        .replaceAll('null', '')
        .replace('harmonizedSystemCode', 'HS Code')
        .replace('countryCodeOfOrigin', 'COO')
        .replace('OnHand', 'On Hand'), (err) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            console.log('JSON was converted in CSV successfully');
            fs.unlink('/Users/Bogdan/Desktop/writeFile/resultData/INVENTORY.json', (err) => { //delete last JSON file
                if(err) {
                    console.log(err);
                }
                console.log('JSON file was successfully removed');
            })
        })
    })

}

module.exports = { InventorytoCSVconverter };