function initializeMetadata(record) {

    if (!record.__metadata) {

        record.__metadata = {};

    }

    let changed = false;

    const now = new Date().toISOString();

    if (!record.__metadata.createdAt) {

        record.__metadata.createdAt = now;

        changed = true;

    }

    if (!record.__metadata.updatedAt) {

        record.__metadata.updatedAt = now;

        changed = true;

    }

    return {

        record,

        changed

    };

}

function touchMetadata(record) {

    if (!record.__metadata) {

        record.__metadata = {};

    }

    record.__metadata.updatedAt = new Date().toISOString();

    return {

        record,

        changed: true

    };

}

module.exports = {

    initializeMetadata,

    touchMetadata

};