const express = require("express");

const redisAStorage = require("../storage/redisAStorage");

const router = express.Router();

router.post("/users", async (req, res) => {

    try {

        const result =
            await redisAStorage.createUser(
                req.body
            );

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Legacy write failed"
        });
    }
});

module.exports = router;