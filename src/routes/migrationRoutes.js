const express = require("express");

const router = express.Router();

const conflictService = require("../services/conflictService");

const {migrateUsers} = require("../migrations/redisAToRedisBMigration");

const redisBClient = require("../config/redisBClient");

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

router.get(
    "/conflicts",
    (req, res) => {

        res.status(200).json({
            conflicts:
                conflictService.getConflicts()
        });
    }
);

router.post(
    "/resolve",
    async (req, res) => {

        try {

            const {
                key,
                action
            } = req.body;

            const conflict =
                conflictService.getConflict(
                    key
                );

            if (!conflict) {

                return res.status(404).json({
                    error:
                        "Conflict not found"
                });
            }

            if (action === "overwrite") {

                await redisBClient.set(
                    key,
                    JSON.stringify(
                        conflict.redisA
                    )
                );

                console.log(
                    `[RESOLVED] ${key} overwritten in Redis B`
                );
            }

            if (action === "skip") {

                console.log(
                    `[SKIPPED] ${key}`
                );
            }

            conflictService.removeConflict(
                key
            );

            res.status(200).json({
                message:
                    `Conflict resolved using ${action}`
            });

        } catch (error) {

            console.error(
                "Conflict Resolution Error:",
                error
            );

            res.status(500).json({
                error:
                    "Conflict resolution failed"
            });
        }
    }
);

module.exports = router;