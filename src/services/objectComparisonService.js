function compareObjects(sourceObject, destinationObject) {

    const conflictingFields = [];

    const fields = new Set([

        ...Object.keys(sourceObject),

        ...Object.keys(destinationObject)

    ]);

    for (const field of fields) {

        if (sourceObject[field] !== destinationObject[field]) {

            conflictingFields.push(field);

        }

    }

    return {

        equal:
            conflictingFields.length === 0,

        conflictingFields

    };

}

module.exports = {

    compareObjects

};