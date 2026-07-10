function analyzeConflict({

    conflictType,

    comparisonResult,

    sourceMetadata,

    destinationMetadata

}) {

    if (conflictType === "SCHEMA_CONFLICT") {

        return {

            conflictingFields: [],

            suggestedAction:
                "MANUAL_REVIEW",

            reason:
                "Schema mismatch detected."

        };

    }

    const sourceUpdatedAt =
        new Date(
            sourceMetadata.updatedAt
        );

    const destinationUpdatedAt =
        new Date(
            destinationMetadata.updatedAt
        );

    if (sourceUpdatedAt > destinationUpdatedAt) {

        return {

            conflictingFields:
                comparisonResult.conflictingFields,

            suggestedAction:
                "OVERWRITE",

            reason:
                "Source record was updated later."

        };

    }

    return {

    conflictingFields:
        comparisonResult.conflictingFields,

    suggestedAction:
        "KEEP_DESTINATION",

    reason:
        "Destination record was updated later."

};

}

module.exports = {

    analyzeConflict

};