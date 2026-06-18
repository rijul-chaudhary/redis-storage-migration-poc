const express = require("express");

const router = express.Router();

const {
    migrateUsers
} = require("../migrations/redisAToRedisBMigration");

router.post("/", async (req, res) => {

    try {

        const result =
            await migrateUsers();

        res.status(200).json({
            message: "Migration completed successfully",
            summary: result
        });

    } catch (error) {

        console.error(
            "Migration Error:",
            error
        );

        res.status(500).json({
            error: "Migration failed"
        });
    }
});

module.exports = router;