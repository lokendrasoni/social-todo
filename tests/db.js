const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const fs = require('fs');
const { EJSON } = require('bson');

module.exports.connect = async () => {
    const replSet = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger', dbName: 'social_todo_test' },
    });
    await replSet.waitUntilRunning();
    const uri = replSet.getUri('social_todo_test');
    await new Promise((resolve, reject) => {
        mongoose.connect(
            uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
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
    return replSet;
};

module.exports.disconnect = async replset => {
    await mongoose.connection.close();
    await replset.stop();
};

module.exports.migrate = async path => {
    const files = fs.readdirSync(path);
    const promises = [];
    for await (let file of files) {
        const content = EJSON.parse(fs.readFileSync(`${path}/${file}`));
        file = file.replace('.json', '');
        promises.push(mongoose.connection.db.collection(file).insertMany(content));
    }
    await Promise.all(promises);
    console.log('Added data');
};
