require('dotenv').config();
const port    = process.env.PORT || 3000;
const express = require('express');
const app     = express();
const root    = require('./routes/indexRouter');
const db      = require('./models/index');
app.use(express.json());

const start = async () => {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync();
        app.listen(port, () => {
            app.use('/api', root);
            console.log(`Server is working on port ${port}`);
        });
    }
    catch (e) {
        console.log(e);
    }
};

start();