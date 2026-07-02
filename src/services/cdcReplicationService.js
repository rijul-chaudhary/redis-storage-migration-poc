const {areObjectsEqual} = require("./objectComparisonService");

const redisAClient = require("../config/redisAClient");
const redisBClient = require("../config/redisBClient");

const conflictService = require("./conflictService");

async function replicateSet(key) {

    const redisAValue = await redisAClient.get(key);

    if (!redisAValue) {
        return;
    }

    const redisBValue = await redisBClient.get(key);

    if (!redisBValue) {

        await redisBClient.set(
            key,
            redisAValue
        );

        console.log(
            `[CDC REPLICATION] ${key} synced to Redis B`
        );

        return;
    }

    const redisAObject = JSON.parse(redisAValue);

    const redisBObject = JSON.parse(redisBValue);

    if (
    areObjectsEqual(
        redisAObject,
        redisBObject
        )
    ) {

    console.log(`[CDC SYNCED] ${key} already identical`);

        return;
    }

    conflictService.addConflict({
        source: "CDC",
        key,
        redisA: redisAObject,
        redisB: redisBObject
    });

    console.log(`[CDC CONFLICT] ${key}`);
}

async function replicateDelete(key) {

    await redisBClient.del(key);

    console.log(`[CDC REPLICATION] ${key} deleted from Redis B`);
}

module.exports = {
    replicateSet,
    replicateDelete
};