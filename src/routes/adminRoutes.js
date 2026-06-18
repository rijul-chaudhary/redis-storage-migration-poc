const express = require("express");

const router = express.Router();

const redisAStorage = require("../storage/redisAStorage");
const redisBStorage = require("../storage/redisBStorage");

router.get("/redis-a/users", async (req, res) => {

    const users =
        await redisAStorage.getAllUsers();

    res.json(users);
});

router.get("/redis-b/users", async (req, res) => {

    const users =
        await redisBStorage.getAllUsers();

    res.json(users);
});

module.exports = router;