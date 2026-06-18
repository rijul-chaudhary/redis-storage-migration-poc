const redisClient = require("../config/redis");

async function createUser(user) {
    const key = `user:${user.id}`;

    await redisClient.set(
        key,
        JSON.stringify(user)
    );

    return user;
}

module.exports = {
    createUser
};