const { createClient } = require("redis");

const redisBClient = createClient({
    url: "redis://localhost:6380"
});

redisBClient.on("error", (err) => {
    console.error("Redis B Error:", err);
});

module.exports = redisBClient;