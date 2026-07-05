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

function buildMetadata(object) {

    return {

        processedAt:
            new Date().toISOString(),

        schemaFingerprint:
            generateSchemaFingerprint(object),

        contentFingerprint:
            generateContentFingerprint(object)

    };

}

module.exports = {

    generateSchemaFingerprint,

    generateContentFingerprint,

    buildMetadata

};