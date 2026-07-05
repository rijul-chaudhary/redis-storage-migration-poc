let pendingConflicts = [];

function clearMigrationConflicts() {

    pendingConflicts =
        pendingConflicts.filter(
            conflict =>
                conflict.source !==
                "MIGRATION"
        );
}

function addConflict(conflict) {

    const existingConflict =
        pendingConflicts.find(
            item =>
                item.key === conflict.key &&
                item.source === conflict.source
        );

    if (existingConflict) {
        return;
    }

    const conflictId = `${Date.now()}-${conflict.key}`;

    pendingConflicts.push({
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

    return pendingConflicts;
}

function getConflict(key) {

    return pendingConflicts.find(
        conflict =>
            conflict.key === key
    );
}

function removeConflict(key) {

    pendingConflicts =
        pendingConflicts.filter(
            conflict =>
                conflict.key !== key
        );
}

function getMigrationConflicts() {

    return pendingConflicts.filter(
        conflict =>
            conflict.source ===
            "MIGRATION"
    );
}

function getCdcConflicts() {

    return pendingConflicts.filter(
        conflict =>
            conflict.source ===
            "CDC"
    );
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