const redisConflictClient = require("../config/redisConflictClient");

function getIndexName(source) {

    if (source === "MIGRATION") {
        return "migration-conflicts:index";
    }

    return "cdc-conflicts:index";
}

async function saveConflict(conflict) {

    const conflictKey =
        `conflict:${conflict.conflictId}`;

    await redisConflictClient.set(

        conflictKey,

        JSON.stringify(conflict)

    );

    await redisConflictClient.sAdd(

        getIndexName(conflict.source),

        conflictKey

    );
}

async function findAllConflicts() {

    const migrationConflicts =
        await findMigrationConflicts();

    const cdcConflicts =
        await findCdcConflicts();

    return [

        ...migrationConflicts,

        ...cdcConflicts

    ];

}

async function findConflictByKey(key) {

    const conflicts =
        await findAllConflicts();

    return conflicts.find(

        conflict =>

            conflict.key === key

    );

}

async function removeConflictByKey(key) {

    const conflict =
        await findConflictByKey(key);

    if (!conflict) {
        return;
    }

    const conflictKey =
        `conflict:${conflict.conflictId}`;

    await redisConflictClient.del(
        conflictKey
    );

    await redisConflictClient.sRem(

        getIndexName(conflict.source),

        conflictKey

    );

}

async function removeMigrationConflicts() {

    const conflictKeys =
        await redisConflictClient.sMembers(
            "migration-conflicts:index"
        );

    if (conflictKeys.length > 0) {

        await redisConflictClient.del(
            conflictKeys
        );

    }

    await redisConflictClient.del(
        "migration-conflicts:index"
    );

}

async function findMigrationConflicts() {

    const conflictKeys =
        await redisConflictClient.sMembers(
            "migration-conflicts:index"
        );

    const conflicts = [];

    for (const key of conflictKeys) {

        const conflict =
            await redisConflictClient.get(key);

        if (conflict) {

            conflicts.push(
                JSON.parse(conflict)
            );

        }

    }

    return conflicts;
}

async function findCdcConflicts() {

    const conflictKeys =
        await redisConflictClient.sMembers(
            "cdc-conflicts:index"
        );

    const conflicts = [];

    for (const key of conflictKeys) {

        const conflict =
            await redisConflictClient.get(key);

        if (conflict) {

            conflicts.push(
                JSON.parse(conflict)
            );

        }

    }

    return conflicts;
}

async function existsConflict(key, source) {

    const indexName =
        getIndexName(source);

    const conflictKeys =
        await redisConflictClient.sMembers(
            indexName
        );

    for (const conflictKey of conflictKeys) {

        const conflict =
            await redisConflictClient.get(conflictKey);

        if (!conflict) {
            continue;
        }

        const parsedConflict =
            JSON.parse(conflict);

        if (parsedConflict.key === key) {
            return true;
        }

    }

    return false;
}

module.exports = {

    saveConflict,

    findAllConflicts,

    findConflictByKey,

    removeConflictByKey,

    removeMigrationConflicts,

    findMigrationConflicts,

    findCdcConflicts,

    existsConflict

};