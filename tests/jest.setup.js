const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

module.exports = async function (globalConfig, projectConfig) {
    await new Promise((resolve, reject) => {
        mongoose.connect(
            globalThis.__MONGOD__.getUri('social_todo_test'),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
            }
        );
        const mongoCon = mongoose.connection;
        mongoCon.on("open", () => {
            console.log("Connected to MongoDB");
            resolve("Connected to mongo")
        });
        mongoCon.on("error", (err) => {
            reject(err)
        });
    });
    
    //register model schema
    for (let file of fs.readdirSync(path.resolve(__dirname, "../models"))) {
        if (file.indexOf('_') !== 0 && file.indexOf('README.md') !== 0) require('../models/' + file);
    }
};