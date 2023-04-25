const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/resultController');
router.post('/result', ResultController.GetResultData);

module.exports = router;