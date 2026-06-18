const express = require("express");

const redisAClient = require("./config/redisAClient");
const redisBClient = require("./config/redisBClient");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

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