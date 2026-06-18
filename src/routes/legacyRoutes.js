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

router.put("/users/:id", async (req, res) => {

    try {

        const result =
            await redisAStorage.updateUser(
                req.params.id,
                req.body
            );

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Legacy update failed"
        });
    }
});

router.delete("/users/:id", async (req, res) => {

    try {

        const result =
            await redisAStorage.deleteUser(
                req.params.id
            );

        res.json({
            deleted: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Legacy delete failed"
        });
    }
});

module.exports = router;