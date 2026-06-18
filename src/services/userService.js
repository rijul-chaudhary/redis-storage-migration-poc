const redisAStorage = require("../storage/redisAStorage");

async function createUser(user) {
    return redisAStorage.createUser(user);
}

module.exports = {
    createUser
};