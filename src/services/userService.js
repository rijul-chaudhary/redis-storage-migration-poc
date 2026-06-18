const redisAStorage = require("../storage/redisAStorage");

async function createUser(user) {
    return redisAStorage.createUser(user);
}

async function getUser(id) {
    return redisAStorage.getUser(id);
}

async function deleteUser(id) {
    return redisAStorage.deleteUser(id);
}

async function updateUser(id, user) {
    return redisAStorage.updateUser(id, user);
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
};