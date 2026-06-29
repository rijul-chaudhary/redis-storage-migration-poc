const { createClient } = require("redis");

const redisAClient = createClient({
    url: process.env.REDIS_A_URL
});

redisAClient.on("error", (err) => {
    console.error("Redis A Error:", err);
});

module.exports = redisAClient;