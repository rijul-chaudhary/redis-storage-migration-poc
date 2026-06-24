const {
    replicateSet,
    replicateDelete
} = require("./cdcReplicationService");

async function processSetEvent(key) {

    if (!key.startsWith("user:")) {
        return;
    }

    console.log(
        `[CDC SYNC] Processing SET for ${key}`
    );

    await replicateSet(key);
}

async function processDeleteEvent(key) {

    if (!key.startsWith("user:")) {
        return;
    }

    console.log(
        `[CDC SYNC] Processing DELETE for ${key}`
    );

    await replicateDelete(key);
}

module.exports = {
    processSetEvent,
    processDeleteEvent
};