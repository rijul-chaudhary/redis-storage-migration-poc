const { createClient } = require("redis");

const redisConflictClient = createClient({
    url: process.env.REDIS_CONFLICT_URL
});

redisConflictClient.on("error", () => {
    console.log("Redis Conflict unavailable. Waiting for Redis...");
});

module.exports = redisConflictClient;