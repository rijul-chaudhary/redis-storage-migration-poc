const redisAClient = require("../config/redisAClient");
const redisBClient = require("../config/redisBClient");

async function migrateUsers() {

    const keys = await redisAClient.keys("user:*");

    let migratedCount = 0;
    let conflictCount = 0;

    console.log(
        `Found ${keys.length} users to migrate`
    );

    for (const key of keys) {

        const sourceValue =
            await redisAClient.get(key);

        const destinationValue =
            await redisBClient.get(key);

        if (destinationValue) {

            conflictCount++;

            console.log(
                `[CONFLICT] ${key} already exists in Redis B`
            );
        }

        await redisBClient.set(
            key,
            sourceValue
        );

        migratedCount++;

        console.log(
            `[MIGRATED] ${key}`
        );
    }

    const summary = {
        totalUsersFound: keys.length,
        migratedUsers: migratedCount,
        conflictsDetected: conflictCount
    };

    console.log(
        "Migration Summary:",
        summary
    );

    return summary;
}

module.exports = {
    migrateUsers
};