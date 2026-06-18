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

async function deleteUser(id) {
    const key = `user:${id}`;

    const result = await redisClient.del(key);

    return result > 0;
}

async function updateUser(id, updatedUser) {
    const key = `user:${id}`;

    const existingUser = await redisClient.get(key);

    if (!existingUser) {
        return null;
    }

    const user = {
        id,
        ...updatedUser
    };

    await redisClient.set(
        key,
        JSON.stringify(user)
    );

    return user;
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser
};