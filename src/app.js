const express = require("express");
const redisClient = require("./config/redis");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

const PORT = 3000;

async function startServer() {
    try {
        await redisClient.connect();

        console.log("Connected to Redis A");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Startup Error:", error);
    }
}

startServer();