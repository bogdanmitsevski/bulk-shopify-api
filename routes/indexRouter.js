const express       = require('express');
const router        = express.Router();
const createRouter  = require('./createRouter');
const updateRouter  = require('./updateRouter');
const deleteRouter  = require('./deleteRouter');
const webhookRouter = require('./webhookRouter');
const resultRouter  = require('./resultRouter');
const checkRouter   = require('./checkRouter');
const backupRouter  = require('./backupRouter');
router.use('/', createRouter);
router.use('/', updateRouter);
router.use('/', deleteRouter);
router.use('/', webhookRouter);
router.use('/', resultRouter);
router.use('/', checkRouter);
router.use('/', backupRouter);

module.exports = router;
