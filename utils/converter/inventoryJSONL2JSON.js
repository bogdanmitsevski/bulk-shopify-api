const fs = require('fs');
const today = new Date();


async function convertINVENTORYJSONLtoJSON() {
    fs.readFile('/Users/Bogdan/Desktop/writeFile/resultData/INVENTORY.jsonl', 'utf-8', (err, jsonInventoryString) => {
        if (err) {
            console.log(err);
            return;
        }
        let jsonOInventorybject = `[ ${jsonInventoryString.split(/\n/).toString().replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')} ]`;
        let inventoryObject = JSON.parse(jsonOInventorybject);
        let inventoryHandle;
        let productTitle;
        let variantIndex = null;

        for (let i = 0; i < inventoryObject.length; i++) {
            let internalObject = inventoryObject[i];
            for (let internalObjectProperty in internalObject) {
                if (Object.keys(internalObject).length === 2 && internalObject['title'] !== undefined) {
                    productTitle = internalObject['title'];
                }
                switch (internalObjectProperty) {
                    case 'id':
                        delete internalObject['id'];
                        break;
                    case 'handle':
                        inventoryHandle = internalObject['handle'];
                        internalObject['handle'] = '';
                        break;
                    case 'title':
                        internalObject['title'] = '';
                        break;
                    case '__parentId':
                        delete internalObject['__parentId'];
                        break;
                    case 'location':
                        internalObject['Location'] = (internalObject['location'].name).replaceAll('"',"'");
                        delete internalObject['location'];
                        break;
                    case 'quantities':
                        internalObject['OnHand'] = internalObject['quantities'][0].quantity;
                        delete internalObject['quantities'];
                        break;
                }

            }
            if (internalObject['selectedOptions'] !== undefined) {
                internalObject['handle'] = inventoryHandle;
                internalObject['title'] = productTitle;
                for (let internalObjectProperty in internalObject) {
                    switch (internalObjectProperty) {
                        case 'selectedOptions':
                            // Option1(Name+Value)
                            if (internalObject['selectedOptions'][0] === undefined) {
                                internalObject['Option1Name'] = '';
                                internalObject['Option1Value'] = '';
                            }
                            else {
                                internalObject['Option1Name'] = (internalObject['selectedOptions'][0].name);
                                internalObject['Option1Value'] = (internalObject['selectedOptions'][0].value);
                                // }
                            }
                            //Option2(Name+Value)
                            if (internalObject['selectedOptions'][1] === undefined) {
                                internalObject['Option2Name'] = '';
                                internalObject['Option2Value'] = '';
                            }
                            else {
                                internalObject['Option2Name'] = (internalObject['selectedOptions'][1].name);
                                internalObject['Option2Value'] = (internalObject['selectedOptions'][1].value);
                            }
                            // // Option3(Name+Value)
                            if (internalObject['selectedOptions'][2] === undefined) {
                                internalObject['Option3Name'] = '';
                                internalObject['Option3Value'] = '';
                            }
                            else {
                                internalObject['Option3Name'] = (internalObject['selectedOptions'][2].name);
                                internalObject['Option3Value'] = (internalObject['selectedOptions'][2].value);
                            }
                            delete internalObject['selectedOptions'];
                            break;
                    }
                }
                if (variantIndex !== null) {
                    inventoryObject.splice(variantIndex, 1);
                    --i;
                }
                variantIndex = i;
            }
            else {
                const variant = inventoryObject[variantIndex];
                if (variant) {
                    inventoryObject[i] = { ...variant, ...internalObject };
                }
            }
            if (Object.keys(internalObject).length === 0 || Object.values(internalObject).filter((x) => ![null, undefined, ''].includes(x)).length === 0) {
                inventoryObject.splice(i, 1);
                i--;
            }

        }
        inventoryObject.splice(variantIndex, 1);


        fs.writeFile('/Users/Bogdan/Desktop/writeFile/resultData/INVENTORY.json', JSON.stringify(inventoryObject, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Data was converted to JSON');
            // fs.unlink('/Users/Bogdan/Desktop/writeFile/resultData/INVENTORY.jsonl', (err) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log('JSONL file was successfully removed');
            // })
        })
    });
}

module.exports = { convertINVENTORYJSONLtoJSON };