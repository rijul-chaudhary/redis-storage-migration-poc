const crypto = require("crypto");

function generateSchemaFingerprint(object) {

    return Object.keys(object)
        .sort()
        .join("|");

}

function generateContentFingerprint(object) {

    return crypto
        .createHash("sha256")
        .update(JSON.stringify(object))
        .digest("hex");

}

function buildMetadata(record) {

    return {

        createdAt:
            record.__metadata.createdAt,

        updatedAt:
            record.__metadata.updatedAt,

        schemaFingerprint:
            generateSchemaFingerprint(
                record.data
            ),

        contentFingerprint:
            generateContentFingerprint(
                record.data
            )

    };

}

module.exports = {

    generateSchemaFingerprint,

    generateContentFingerprint,

    buildMetadata

};