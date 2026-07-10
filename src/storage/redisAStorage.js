const {
    touchMetadata
} = require("../services/recordMetadataService");

const redisClient = require("../config/redisAClient");

async function createUser(user) {

    const key = `user:${user.id}`;

    const existingUser = await redisClient.get(key);

    if (existingUser) {

        throw new Error(
            `User ID ${user.id} already exists`
        );
    }

    const record = {

        data: user,

        __metadata: {}

    };

    await redisClient.set(

        key,

        JSON.stringify(record)

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

    const record = JSON.parse(data);

    return record.data;
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

    const existingRecord =
        JSON.parse(existingUser);

    const user = {

        id,

        ...updatedUser

    };

    const updatedRecord = {

        data: user,

        __metadata:
            existingRecord.__metadata || {}

    };

    const result = touchMetadata(updatedRecord);

    await redisClient.set(

        key,

        JSON.stringify(result.record)

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

            const record =
                JSON.parse(data);

            if (record.data) {

                users.push(record.data);

            } else {

                console.warn(
                    `[WARNING] Skipping malformed Redis record: ${key}`
                );

            }
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