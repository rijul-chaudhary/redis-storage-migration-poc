const redisAClient = require("../config/redisAClient");
const redisBClient = require("../config/redisBClient");

async function replicateSet(key) {

    const value =
        await redisAClient.get(key);

    if (!value) {
        return;
    }

    await redisBClient.set(
        key,
        value
    );

    console.log(
        `[CDC REPLICATION] ${key} synced to Redis B`
    );
}

async function replicateDelete(key) {

    await redisBClient.del(key);

    console.log(
        `[CDC REPLICATION] ${key} deleted from Redis B`
    );
}

module.exports = {
    replicateSet,
    replicateDelete
};