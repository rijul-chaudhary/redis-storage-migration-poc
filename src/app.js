const express = require("express");

const redisAClient = require("./config/redisAClient");
const redisBClient = require("./config/redisBClient");

const userRoutes = require("./routes/userRoutes");

const app = express();

const migrationRoutes = require("./routes/migrationRoutes");

app.use(express.json());

app.use("/users", userRoutes);

app.use("/migrate", migrationRoutes);

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