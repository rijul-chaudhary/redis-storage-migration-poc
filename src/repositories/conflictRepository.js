let conflicts = [];

function saveConflict(conflict) {

    conflicts.push(conflict);

}

function findAllConflicts() {

    return conflicts;

}

function findConflictByKey(key) {

    return conflicts.find(
        conflict =>
            conflict.key === key
    );

}

function removeConflictByKey(key) {

    conflicts =
        conflicts.filter(
            conflict =>
                conflict.key !== key
        );

}

function removeMigrationConflicts() {

    conflicts =
        conflicts.filter(
            conflict =>
                conflict.source !==
                "MIGRATION"
        );

}

function findMigrationConflicts() {

    return conflicts.filter(
        conflict =>
            conflict.source ===
            "MIGRATION"
    );

}

function findCdcConflicts() {

    return conflicts.filter(
        conflict =>
            conflict.source ===
            "CDC"
    );

}

function existsConflict(key, source) {

    return conflicts.some(
        conflict =>
            conflict.key === key &&
            conflict.source === source
    );

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