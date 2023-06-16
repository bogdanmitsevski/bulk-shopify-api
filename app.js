require('dotenv').config();
const cron                                                                              = require('cron');
const { GetProducts }                                                                   = require('./utils/productsBackup');
const { GetInventory }                                                                  = require('./utils/inventoryBackup');
const { GetMedia }                                                                      = require('./utils/mediaBackup');
const { GetMetafields }                                                                 = require('./utils/metafieldsBackup');
const { getProductInfo, getBulkOperationId, getMetafields, getInventoryInfo, getMedia } = require('./utils/graphqlRequests/queries')
const port                                                                              = process.env.PORT || 3000;
const express                                                                           = require('express');
const app                                                                               = express();
const root                                                                              = require('./routes/indexRouter');
app.use(express.json());

const start = async () => {
    try {
        app.listen(port, () => {
            app.use('/api', root);
            console.log(`Server is working on port ${port}`);
            new cron.CronJob('00 12 * * *', () => {              //get products in some time
                GetProducts(getProductInfo(), getBulkOperationId)
            }).start();
            new cron.CronJob('00 13 * * *', () => {              //get inventory in some time
                GetInventory(getInventoryInfo(), getBulkOperationId)
            }).start();
            new cron.CronJob('30 12 * * *', () => {              //get media in some time
                GetMedia(getMedia(), getBulkOperationId)
            }).start();
            new cron.CronJob('00 15 * * */3', () => {              //get metafields in some time
                GetMetafields(getMetafields(), getBulkOperationId)
            }).start();
        });
    }
    catch (e) {
        console.log(e);
    }
};

start();