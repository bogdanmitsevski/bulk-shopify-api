const { body } = require('express-validator');

const createSchema = [

    body('title').notEmpty().withMessage('Добавьте название поля - title и обязательное значение'),
    body('handle').notEmpty().withMessage('Добавьте название поля - handle и обязательное значение'),
    body('vendor').notEmpty().withMessage('Добавьте название поля - vendor и обязательное значение'),
    body('tags').notEmpty().withMessage('Добавьте название поля - tags и обязательное guid с 1С'),
    body('options').notEmpty().withMessage('Добавьте название поля - options и обязательное значение'),
    body('variants').notEmpty().withMessage('Добавьте название поля - variants и обязательное значение'),
    body(`variants.*.price`).notEmpty().withMessage('Добавьте название поля - price и обязательное значение'),
    body(`variants.*.inventoryQuantities.*.locationId`).notEmpty().withMessage('Добавьте название поля - locationId и обязательное значение'),
    body(`variants.*.inventoryQuantities.*.availableQuantity`).exists().default('0').withMessage('Добавьте название поля - avaliableQuantity'),
    body(`variants.*.inventoryItem.cost`).exists().default('0').withMessage('Добавьте название поля - cost'),
    body(`variants.*.sku`).notEmpty().withMessage('Добавьте название поля - sku и обязательное значение'),
    body(`variants.*.barcode`).exists().withMessage('Добавьте название поля - barcode'),
    body(`variants.*.weight`).exists().withMessage('Добавьте название поля - weight')
];





module.exports = createSchema