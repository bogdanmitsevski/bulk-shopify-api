const express = require('express');
const router = express.Router();
const CreateController = require('../controllers/createController');
const createSchema = require('../schema/createSchema');
const validateRequestSchema = require('../middleware/reqBodyMiddleware');
router.post('/create', CreateController.CreateData);
router.post('/add', createSchema,
validateRequestSchema, CreateController.WriteData);

module.exports = router;
