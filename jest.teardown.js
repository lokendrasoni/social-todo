module.exports = async function (globalConfig, projectConfig) {
    await globalThis.__MONGO_DISCONNECT_CB__(globalThis.__MONGOD__);
    console.log('disconnected mongodb');
};
