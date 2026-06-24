const redisClient = require("../config/redisAClient");

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

    const data =
        await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

async function deleteUser(id) {

    const key = `user:${id}`;

    const result =
        await redisClient.del(key);

    return result > 0;
}

async function updateUser(id, updatedUser) {

    const key = `user:${id}`;

    const existingUser =
        await redisClient.get(key);

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

async function getAllUsers() {

    const keys =
        await redisClient.keys("user:*");

    const users = [];

    for (const key of keys) {

        const data =
            await redisClient.get(key);

        if (data) {
            users.push(
                JSON.parse(data)
            );
        }
    }

    return users;
}

module.exports = {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
};