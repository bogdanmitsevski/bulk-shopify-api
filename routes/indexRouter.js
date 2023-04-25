const express = require('express');
const router = express.Router();
const createRouter = require('./createRouter');
const updateRouter = require('./updateRouter');
const deleteRouter = require('./deleteRouter');
router.use('/', createRouter);
router.use('/', updateRouter);
router.use('/', deleteRouter);

module.exports = router;
