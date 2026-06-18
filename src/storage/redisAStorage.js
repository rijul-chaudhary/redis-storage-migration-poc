const redisClient = require("../config/redis");

async function createUser(user) {
    const key = `user:${user.id}`;

    await redisClient.set(
        key,
        JSON.stringify(user)
    );

    return user;
}

async function getUser(id) {
    const key = `user:${id}`;

    const data = await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

module.exports = {
    createUser,
    getUser
};