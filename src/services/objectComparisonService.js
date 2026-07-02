function areObjectsEqual(objectA, objectB) {

    const objectAKeys = Object.keys(objectA);
    const objectBKeys = Object.keys(objectB);

    for (const key of objectAKeys) {

        if (!(key in objectB)) {
            return false;
        }

        if (objectA[key] !== objectB[key]) {
            return false;
        }
    }

    for (const key of objectBKeys) {

        if (!(key in objectA)) {
            return false;
        }
    }

    return true;
}

module.exports = {
    areObjectsEqual
};