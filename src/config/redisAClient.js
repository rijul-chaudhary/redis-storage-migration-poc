const { createClient } = require("redis");

const redisAClient = createClient({
    url: process.env.REDIS_A_URL
});

redisAClient.on("error", () => {
    console.log("Redis A unavailable. Waiting for Redis...");
});

module.exports = redisAClient;