const redisAClient = require("../config/redisAClient");

const {
    processSetEvent,
    processDeleteEvent
} = require("../services/redisSyncService");

async function startRedisACDCListener() {

    const subscriber =
        redisAClient.duplicate();

    await subscriber.connect();

    await subscriber.pSubscribe(
        "__keyevent@0__:set",
        async (key) => {

            console.log(
                `[CDC EVENT] SET ${key}`
            );

            await processSetEvent(key);
        }
    );

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