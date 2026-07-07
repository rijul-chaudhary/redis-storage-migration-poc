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

    const sourceProcessedAt =
        new Date(
            sourceMetadata.processedAt
        );

    const destinationProcessedAt =
        new Date(
            destinationMetadata.processedAt
        );

    if (sourceProcessedAt > destinationProcessedAt) {

        return {

            conflictingFields:
                comparisonResult.conflictingFields,

            suggestedAction:
                "OVERWRITE",

            reason:
                "Source record was processed later."

        };

    }

    return {

    conflictingFields:
        comparisonResult.conflictingFields,

    suggestedAction:
        "KEEP_DESTINATION",

    reason:
        "Destination record was processed later."

};

}

module.exports = {

    analyzeConflict

};