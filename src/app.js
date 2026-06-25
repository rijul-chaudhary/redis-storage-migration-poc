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

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

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

const PORT = 3000;

async function startServer() {
    try {
        await redisAClient.connect();
        await redisBClient.connect();

        await startRedisACDCListener();

        console.log("Connected to Redis A");
        console.log("Connected to Redis B");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Startup Error:", error);
    }
}

startServer();