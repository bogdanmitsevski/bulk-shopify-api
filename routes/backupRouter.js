const express               = require('express');
const router                = express.Router();
const BackupController       = require('../controllers/backupController');
router.post('/backup',BackupController.ProductsBackup);

module.exports = router;