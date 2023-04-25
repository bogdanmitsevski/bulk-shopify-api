const express = require('express');
const router = express.Router();
const DeleteController = require('../controllers/deleteController');
router.post('/delete', DeleteController.DeleteData);

module.exports = router;
