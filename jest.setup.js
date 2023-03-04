const { connect, migrate, disconnect } = require('./tests/db');
const path = require('path');

module.exports = async function (globalConfig, projectConfig) {
    //dotenv
    require('dotenv').config();
    const mongod = await connect();
    const loc = path.resolve('./tests/fixtures/db');
    await migrate(loc);
    globalThis.__MONGOD__ = mongod;
    globalThis.__MONGO_DISCONNECT_CB__ = disconnect;
};
