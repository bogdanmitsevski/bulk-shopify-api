const express               = require('express');
const router                = express.Router();
const CheckController       = require('../controllers/checkController');
router.post('/check',CheckController.CheckProduct);

module.exports = router;