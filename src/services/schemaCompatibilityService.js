function areSchemasCompatible(
    sourceObject,
    destinationObject
) {

    const sourceKeys =
        Object.keys(sourceObject);

    const destinationKeys =
        Object.keys(destinationObject);

    if (
        sourceKeys.length !==
        destinationKeys.length
    ) {

        return {

            compatible: false,

            reason:
                "FIELD_COUNT_MISMATCH",

            sourceFields:
                sourceKeys,

            destinationFields:
                destinationKeys
        };
    }

    const missingFields =
        sourceKeys.filter(
            key =>
                !destinationKeys.includes(key)
        );

    if (
        missingFields.length > 0
    ) {

        return {

            compatible: false,

            reason:
                "FIELD_NAME_MISMATCH",

            missingFields,

            sourceFields:
                sourceKeys,

            destinationFields:
                destinationKeys
        };
    }

    return {

        compatible: true,

        reason: null,

        sourceFields:
            sourceKeys,

        destinationFields:
            destinationKeys
    };
}

module.exports = {
    areSchemasCompatible
};