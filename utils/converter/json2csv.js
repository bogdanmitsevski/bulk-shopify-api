const fs = require('fs');
const csvjson = require('csvjson');
const today = new Date();

async function toCSVconverter() {

    fs.readFile('/Users/Bogdan/Desktop/writeFile/file1.json', 'utf-8', (err, fileContent) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }

        const csvData = csvjson.toCSV(fileContent, {
            headers: 'key',
            delimiter: ";;",
            wrap: false
        });

        fs.writeFile(`/Users/Bogdan/Desktop/writeFile/backup_${today.toLocaleDateString()}.csv`, 
        csvData
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
        .replace('amount','Cost per item'), (err) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            console.log('JSON was converted in CSV successfully');
            // fs.unlink('/Users/Bogdan/Desktop/writeFile/file1.json', (err) => {
            //     if(err) {
            //         console.log(err);
            //     }
            //     console.log('JSON file was successfully removed');
            // })
        })
    })

}

module.exports = { toCSVconverter };