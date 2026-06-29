const { createClient } = require("redis");

const redisBClient = createClient({
    url: process.env.REDIS_B_URL
});

redisBClient.on("error", () => {
    console.log("Redis B unavailable. Waiting for Redis...");
});

module.exports = redisBClient;