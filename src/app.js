require("dotenv").config();

const validateEnvironment = require("./startup/validateEnvironment");

validateEnvironment();

const express = require("express");

const appARoutes = require("./routes/appARoutes");
const appBRoutes = require("./routes/appBRoutes");

const redisAClient = require("./config/redisAClient");
const redisBClient = require("./config/redisBClient");

const app = express();

const migrationRoutes = require("./routes/migrationRoutes");

const adminRoutes = require("./routes/adminRoutes");

const conflictRoutes = require("./routes/conflictRoutes");

const {startRedisACDCListener} = require("./cdc/redisAChangeListener");

const path = require("path");

app.use(express.json());

app.use("/appA", appARoutes);

app.use("/appB", appBRoutes);

app.use("/admin", adminRoutes);

app.use("/migrate", migrationRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use("/conflicts", conflictRoutes);

app.get("/", (req, res) => {
    res.json({
        service: "Redis Storage Migration POC",
        status: "UP"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "UP"
    });
});

const PORT = Number(process.env.PORT);

async function startServer() {
    try {
        await redisAClient.connect();
        console.log("Connected to Redis A");

        await redisBClient.connect();
        console.log("Connected to Redis B");

        await redisAClient.configSet("notify-keyspace-events", "KEA");

        const result = await redisAClient.configGet("notify-keyspace-events");

        console.log("Keyspace Notifications:", result);

        await startRedisACDCListener();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Startup Error:", error);
    }
}

startServer();