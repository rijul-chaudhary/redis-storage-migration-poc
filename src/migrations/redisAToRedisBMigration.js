const {areSchemasCompatible} = require("../services/schemaCompatibilityService");
const {compareObjects} = require("../services/objectComparisonService");
const {buildMetadata} = require("../services/metadataService");
const {analyzeConflict} = require("../services/conflictAnalysisService");

const redisAClient = require("../config/redisAClient");
const redisBClient = require("../config/redisBClient");

const conflictService = require("../services/conflictService");

async function migrateUsers() {

    await conflictService.clearMigrationConflicts();

    const keys = await redisAClient.keys("user:*");

    let migratedCount = 0;
    let synchronizedCount = 0;
    let conflictCount = 0;

    console.log(`Found ${keys.length} users to migrate`);

    for (const key of keys) {

        const sourceValue = await redisAClient.get(key);

        const destinationValue = await redisBClient.get(key);

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

        const sourceObject = JSON.parse(sourceValue);
        const destinationObject = JSON.parse(destinationValue);

        const schemaAnalysis =
            areSchemasCompatible(
                sourceObject,
                destinationObject
            );

        if (
            !schemaAnalysis.compatible
        ) {

            conflictCount++;

            await conflictService.addConflict({

                conflictType:
                    "SCHEMA_CONFLICT",

                reason:
                    schemaAnalysis.reason,

                key,

                source:
                    "MIGRATION",

                sourceData:
                    sourceObject,

                destinationData:
                    destinationObject,

                sourceMetadata:
                    buildMetadata(sourceObject),

                destinationMetadata:
                    buildMetadata(destinationObject),

                sourceSchema:
                    schemaAnalysis.sourceFields,

                destinationSchema:
                    schemaAnalysis.destinationFields

            });

            console.log(
                `[SCHEMA CONFLICT] ${key}`
            );

            continue;
        }

        const comparisonResult = compareObjects(
                sourceObject,
                destinationObject
            );

        if (comparisonResult.equal) {

            synchronizedCount++;

            console.log(
                `[SYNCED ${key}]`
            );

            continue;
        }

        conflictCount++;

        const sourceMetadata =
        buildMetadata(sourceObject);

    const destinationMetadata =
        buildMetadata(destinationObject);

    const analysis =
        analyzeConflict({

            conflictType:
                "DATA_CONFLICT",

            comparisonResult,

            sourceMetadata,

            destinationMetadata

        });

        await conflictService.addConflict({

            conflictType: "DATA_CONFLICT",

            reason: "Values differ during migration",

            key,

            source: "MIGRATION",

            sourceData: sourceObject,

            destinationData: destinationObject,

            sourceMetadata,

            destinationMetadata,

            analysis,

            sourceSchema: schemaAnalysis.sourceFields,

            destinationSchema: schemaAnalysis.destinationFields
        });

        console.log(`[DATA CONFLICT] ${key}`);
    }

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

    console.log("Migration Summary:", summary);

    return summary;

    }

module.exports = {
migrateUsers
};
