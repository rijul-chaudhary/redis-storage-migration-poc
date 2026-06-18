const redisAStorage = require("../storage/redisAStorage");

async function createUser(user) {
    return redisAStorage.createUser(user);
}

async function getUser(id) {
    return redisAStorage.getUser(id);
}

module.exports = {
    createUser,
    getUser
};