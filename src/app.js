const express = require("express");

const redisAClient = require("./config/redisAClient");
const redisBClient = require("./config/redisBClient");

const userRoutes = require("./routes/userRoutes");

const app = express();

const migrationRoutes = require("./routes/migrationRoutes");

const legacyRoutes = require("./routes/legacyRoutes");

const adminRoutes = require("./routes/adminRoutes");

const path = require("path");

app.use(express.json());

app.use("/users", userRoutes);

app.use("/admin", adminRoutes);

app.use("/legacy", legacyRoutes);

app.use("/migrate", migrationRoutes);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

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