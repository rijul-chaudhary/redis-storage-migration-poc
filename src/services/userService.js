const storageManager = require("../storage/storageManager");

async function createUser(user) {
    return storageManager.createUser(user);
}

async function getUser(id) {
    return storageManager.getUser(id);
}

async function deleteUser(id) {
    return storageManager.deleteUser(id);
}

async function updateUser(id, user) {
    return storageManager.updateUser(id, user);
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
};