const { randomUUID } = require("crypto");
const conflictRepository = require("../repositories/conflictRepository");

async function clearMigrationConflicts() {

    await conflictRepository.removeMigrationConflicts();

}

async function addConflict(conflict) {

    if (
        await conflictRepository.existsConflict(
            conflict.key,
            conflict.source
        )
    ) {
        return;
    }

    const conflictId = randomUUID();

    await conflictRepository.saveConflict({

        conflictId,

        conflictType:
            conflict.conflictType,

        reason:
            conflict.reason,

        key:
            conflict.key,

        source:
            conflict.source,

        sourceData:
            conflict.sourceData,

        destinationData:
            conflict.destinationData,

        sourceMetadata:
            conflict.sourceMetadata,

        destinationMetadata:
            conflict.destinationMetadata,

        sourceSchema:
            conflict.sourceSchema,

        destinationSchema:
            conflict.destinationSchema,

        analysis:
            conflict.analysis,

        detectedAt:
            new Date().toISOString(),

        resolutionStatus:
            "PENDING"

    });

}

async function getConflicts() {

    return await conflictRepository.findAllConflicts();

}

async function getConflict(key) {

    return await conflictRepository.findConflictByKey(key);

}

async function removeConflict(key) {

    await conflictRepository.removeConflictByKey(key);

}

async function getMigrationConflicts() {

    return await conflictRepository.findMigrationConflicts();

}

async function getCdcConflicts() {

    return await conflictRepository.findCdcConflicts();

}

module.exports = {

    addConflict,

    getConflicts,

    getConflict,

    removeConflict,

    clearMigrationConflicts,

    getMigrationConflicts,

    getCdcConflicts

};