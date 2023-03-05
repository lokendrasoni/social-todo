const mongoose = require("mongoose");
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
};