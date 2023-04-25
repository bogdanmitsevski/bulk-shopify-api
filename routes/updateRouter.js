const express = require('express');
const router = express.Router();
const updateSchema = require('../schema/updateSchema');
const validateRequestSchema = require('../middleware/reqBodyMiddleware');
const UpdateController = require('../controllers/updateController');
router.post('/put', updateSchema, validateRequestSchema, UpdateController.AddToFileData);
router.post('/update', UpdateController.UpdateData);
module.exports = router;