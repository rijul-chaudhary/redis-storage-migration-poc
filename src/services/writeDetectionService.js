const config = require("../config/config");

function shouldRedirectRedisAWrite() {

    return config.activeStorage === "redisB";
}

function logRedisAWrite(operation, key) {

    console.log("\n=================================");
    console.log("[ALERT] Redis A write detected");
    console.log(`[OPERATION] ${operation}`);
    console.log(`[KEY] ${key}`);
    console.log("[ACTION] Redirecting write to Redis B");
    console.log("=================================\n");
}

module.exports = {
    shouldRedirectRedisAWrite,
    logRedisAWrite
};