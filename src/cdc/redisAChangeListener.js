const { 
    initializeMetadata,
    touchMetadata
 } = require("../services/recordMetadataService");

const redisAClient = require("../config/redisAClient");

const {
    processSetEvent,
    processDeleteEvent
} = require("../services/redisSyncService");

const ignoredKeys = new Set();

async function startRedisACDCListener() {

    const subscriber =
        redisAClient.duplicate();

    await subscriber.connect();

    await subscriber.pSubscribe("__keyevent@0__:set", async (key) => {

        console.log(`[CDC EVENT] SET ${key}`);

        if (ignoredKeys.has(key)) {

            ignoredKeys.delete(key);

            await processSetEvent(key);

            return;
        }

        if (!key.startsWith("user:")) {
            return;
        }

        const rawRecord = await redisAClient.get(key);

        if (!rawRecord) {
            return;
        }

        const parsedRecord = JSON.parse(rawRecord);

        const { record, changed } =
            initializeMetadata(parsedRecord);

        if (changed) {
            ignoredKeys.add(key);

            await redisAClient.set(
                key,
                JSON.stringify(record)
            );

            return;
        }

        await processSetEvent(key);

    });

    await subscriber.pSubscribe(
        "__keyevent@0__:del",
        async (key) => {

            console.log(
                `[CDC EVENT] DEL ${key}`
            );

            await processDeleteEvent(key);
        }
    );

    console.log(
        "Redis A CDC Listener Started"
    );
}

module.exports = {
    startRedisACDCListener
};