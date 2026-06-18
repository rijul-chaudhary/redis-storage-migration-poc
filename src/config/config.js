require("dotenv").config();

module.exports = {
    activeStorage: process.env.ACTIVE_STORAGE,

    redisA: {
        host: process.env.REDIS_A_HOST,
        port: process.env.REDIS_A_PORT
    },

    redisB: {
        host: process.env.REDIS_B_HOST,
        port: process.env.REDIS_B_PORT
    }
};