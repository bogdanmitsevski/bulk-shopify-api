const express           = require('express');
const router            = express.Router();
const WebhookController = require('../controllers/webhookController');
router.post('/webhook', WebhookController.GetWebhookData);

module.exports = router;
