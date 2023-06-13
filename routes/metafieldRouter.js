const express          = require('express');
const router           = express.Router();
const MetafieldController = require('../controllers/metafieldController');
router.post('/metafield', MetafieldController.sendMetafields);

module.exports = router;
