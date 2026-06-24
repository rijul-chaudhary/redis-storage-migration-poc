let pendingConflicts = [];

function setConflicts(conflicts) {
    pendingConflicts = conflicts;
}

function getConflicts() {
    return pendingConflicts;
}

function getConflict(key) {

    console.log(
        "Searching Conflict:",
        key
    );

    return pendingConflicts.find(
        conflict => conflict.key === key
    );
}

function removeConflict(key) {

    console.log(
        "Before Remove:",
        pendingConflicts.length
    );

    pendingConflicts =
        pendingConflicts.filter(
            conflict => conflict.key !== key
        );

    console.log(
        "After Remove:",
        pendingConflicts.length
    );
}

module.exports = {
    setConflicts,
    getConflicts,
    getConflict,
    removeConflict
};