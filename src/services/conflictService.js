const conflictRepository = require("../repositories/conflictRepository");

function clearMigrationConflicts() {

    conflictRepository.removeMigrationConflicts();
}

function addConflict(conflict) {

    if (
        conflictRepository.existsConflict(
            conflict.key,
            conflict.source
        )
    ) {
        return;
    }

    const conflictId = `${Date.now()}-${conflict.key}`;

    conflictRepository.saveConflict({
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

        detectedAt:
            new Date().toISOString(),

        resolutionStatus:
            "PENDING"

    });
}

function getConflicts() {

    return conflictRepository.findAllConflicts();
}

function getConflict(key) {

    return conflictRepository.findConflictByKey(key);
}

function removeConflict(key) {

    conflictRepository.removeConflictByKey(key);
}

function getMigrationConflicts() {

    return conflictRepository.findMigrationConflicts();
}

function getCdcConflicts() {

    return conflictRepository.findCdcConflicts();
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