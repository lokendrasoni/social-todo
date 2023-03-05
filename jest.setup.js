const fs = require("fs");
const path = require('path');
const { connect, migrate, disconnect } = require('./tests/db');

module.exports = async function (globalConfig, projectConfig) {
    //dotenv
    require('dotenv').config();
    const mongod = await connect();
    const loc = path.resolve('./tests/db');
    
    //register model schema
    for (let file of fs.readdirSync(path.resolve(__dirname, "./models"))) {
        if (file.indexOf('_') !== 0 && file.indexOf('README.md') !== 0) require('./models/' + file);
    }

    await migrate(loc);
    globalThis.__MONGOD__ = mongod;
    globalThis.__MONGO_DISCONNECT_CB__ = disconnect;
};
