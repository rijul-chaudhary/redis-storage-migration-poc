const config = require("../config/config");

const redisAStorage = require("./redisAStorage");
const redisBStorage = require("./redisBStorage");

function getActiveStorage() {

    console.log(
        "ACTIVE STORAGE VALUE:",
        config.activeStorage
    );

    if (config.activeStorage === "redisB") {
        return redisBStorage;
    }

    return redisAStorage;
}

async function createUser(user) {
    return getActiveStorage().createUser(user);
}

async function getUser(id) {
    return getActiveStorage().getUser(id);
}

async function updateUser(id, user) {
    return getActiveStorage().updateUser(id, user);
}

async function deleteUser(id) {
    return getActiveStorage().deleteUser(id);
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
};