require('dotenv').config();
const cron = require('cron');
const { GetProducts } = require('./utils/productsBackup');
const { GetMetafields } = require('./utils/metafieldsBackup');
const { getProductInfo, getBulkOperationId, getMetafields } = require('./utils/graphqlRequests/queries')
const port    = process.env.PORT || 3000;
const express = require('express');
const app     = express();
const root    = require('./routes/indexRouter');
app.use(express.json());

const start = async () => {
    try {
        app.listen(port, () => {
            app.use('/api', root);
            console.log(`Server is working on port ${port}`);
            new cron.CronJob('02 00 * * *', () => {
                GetProducts(getProductInfo(), getBulkOperationId)
            }).start();
            // new cron.CronJob('20 * * * *', () => {
            //     GetMetafields(getMetafields(), getBulkOperationId)
            // }).start();
        });
    }
    catch (e) {
        console.log(e);
    }
};

start();