const { createClient } = require("redis");

const redisAClient = createClient({
    url: "redis://localhost:6379"
});

redisAClient.on("error", (err) => {
    console.error("Redis A Error:", err);
});

module.exports = redisAClient;