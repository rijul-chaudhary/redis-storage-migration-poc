let pendingConflicts = [];

function setMigrationConflicts(conflicts) {

    pendingConflicts =
        pendingConflicts.filter(
            conflict =>
                conflict.source !==
                "MIGRATION"
        );

    pendingConflicts.push(
        ...conflicts
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

    pendingConflicts.push(conflict);
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
            conflict.source === "MIGRATION"
    );
}

function getCdcConflicts() {

    return pendingConflicts.filter(
        conflict =>
            conflict.source === "CDC"
    );
}

module.exports = {
    setMigrationConflicts,
    addConflict,
    getConflicts,
    getConflict,
    removeConflict,
    getMigrationConflicts,
    getCdcConflicts
};