const {initializeMetadata} = require("../services/recordMetadataService");

const redisBClient = require("../config/redisBClient");

const ignoredKeys = new Set();

function ignoreNextEvent(key) {
    ignoredKeys.add(key);
}

async function startRedisBCDCListener() {

    const subscriber = redisBClient.duplicate();

    await subscriber.connect();

    await subscriber.pSubscribe("__keyevent@0__:set", async (key) => {

        console.log(`[REDIS B CDC EVENT] SET ${key}`);

        if (ignoredKeys.has(key)) {

            ignoredKeys.delete(key);

            return;
        }

        if (!key.startsWith("user:")) {
            return;
        }

        const rawRecord = await redisBClient.get(key);

        if (!rawRecord) {
            return;
        }

        const parsedRecord = JSON.parse(rawRecord);

        const result = initializeMetadata(parsedRecord);

        if (result.changed) {

            ignoreNextEvent(key);

            await redisBClient.set(
                key,
                JSON.stringify(result.record)
            );
        }
    });

    console.log("Redis B CDC Listener Started");
}

module.exports = {
    startRedisBCDCListener
};