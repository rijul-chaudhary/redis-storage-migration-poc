const redisAClient = require("../config/redisAClient");
const redisBClient = require("../config/redisBClient");

const conflictService =
require("../services/conflictService");

async function migrateUsers() {

const keys = await redisAClient.keys("user:*");

let migratedCount = 0;
let synchronizedCount = 0;
let conflictCount = 0;

const conflicts = [];

console.log(
    `Found ${keys.length} users to migrate`
);

for (const key of keys) {

    const sourceValue =
        await redisAClient.get(key);

    const destinationValue =
        await redisBClient.get(key);

    if (!destinationValue) {

        await redisBClient.set(
            key,
            sourceValue
        );

        migratedCount++;

        console.log(
            `[MIGRATED] ${key}`
        );

        continue;
    }

    if (
        sourceValue ===
        destinationValue
    ) {

        synchronizedCount++;

        console.log(
            `[SYNCED] ${key}`
        );

        continue;
    }

    conflictCount++;

    conflicts.push({
        key,
        redisA:
            JSON.parse(
                sourceValue
            ),
        redisB:
            JSON.parse(
                destinationValue
            )
    });

    console.log(
        `[CONFLICT] ${key}`
    );
}

conflictService.setConflicts(
    conflicts
);

const summary = {

    totalUsersFound:
        keys.length,

    migratedUsers:
        migratedCount,

    synchronizedUsers:
        synchronizedCount,

    conflictsDetected:
        conflictCount
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
