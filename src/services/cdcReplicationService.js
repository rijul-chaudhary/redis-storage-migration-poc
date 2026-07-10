const {areSchemasCompatible} = require("./schemaCompatibilityService");
const {compareObjects} = require("./objectComparisonService");
const {buildMetadata} = require("./metadataService");
const {analyzeConflict} = require("./conflictAnalysisService");

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

    const redisAData = redisAObject.data;
    const redisBData = redisBObject.data;

    const schemaAnalysis =
        areSchemasCompatible(
            redisAData,
            redisBData
        );

    if (
        !schemaAnalysis.compatible
    ) {

        await conflictService.addConflict({

            conflictType:
                "SCHEMA_CONFLICT",

            reason:
                schemaAnalysis.reason,

            key,

            source:
                "CDC",

            sourceData:
                redisAData,

            destinationData:
                redisBData,

            sourceMetadata:
                buildMetadata(redisAObject),

            destinationMetadata:
                buildMetadata(redisBObject),

            sourceSchema:
                schemaAnalysis.sourceFields,

            destinationSchema:
                schemaAnalysis.destinationFields,

            analysis: analyzeConflict({

                conflictType: "SCHEMA_CONFLICT"

            })

        });

        console.log(
            `[CDC SCHEMA CONFLICT] ${key}`
        );

        return;
    }

    const comparisonResult =
        compareObjects(
            redisAData,
            redisBData
        );

    if (comparisonResult.equal) {

        console.log(
            `[CDC SYNCED ${key}]`
        );

        return;

    }

    const sourceMetadata =
        buildMetadata(redisAObject);

    const destinationMetadata =
        buildMetadata(redisBObject);

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

        reason: "Values differ for compatible schemas",

        key,

        source: "CDC",

        sourceData: redisAData,

        destinationData: redisBData,

        sourceMetadata,

        destinationMetadata,

        analysis,

        sourceSchema:
            schemaAnalysis.sourceFields,
            
        destinationSchema:
            schemaAnalysis.destinationFields,
    });

    console.log(`[CDC DATA CONFLICT] ${key}`);
}

async function replicateDelete(key) {

    await redisBClient.del(key);

    console.log(`[CDC REPLICATION] ${key} deleted from Redis B`);
}

module.exports = {
    replicateSet,
    replicateDelete
};