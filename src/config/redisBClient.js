const { createClient } = require("redis");

const redisBClient = createClient({
    url: process.env.REDIS_B_URL
});

redisBClient.on("error", (err) => {
    console.error("Redis B Error:", err);
});

module.exports = redisBClient;