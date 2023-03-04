const mongoose = require("mongoose");
module.exports = async function (globalConfig, projectConfig) {
    await new Promise((resolve, reject) => {
        mongoose.connect(
            globalThis.__MONGOD__.getUri('dashclicks_test'),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
            },
            err => {
                if (err) {
                    reject(err);
                }
                console.log('Connected to mongo');
                resolve('Connected to mongo');
            },
        );
    });
};