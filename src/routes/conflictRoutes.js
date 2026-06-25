const express = require("express");

const router = express.Router();

const conflictService = require("../services/conflictService");

const redisBClient = require("../config/redisBClient");

router.get(
    "/migration",
    (req, res) => {

        res.status(200).json({
            conflicts:
                conflictService.getMigrationConflicts()
        });
    }
);

router.get(
    "/cdc",
    (req, res) => {

        res.status(200).json({
            conflicts:
                conflictService.getCdcConflicts()
        });
    }
);

router.post(
    "/migration/resolve",
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
            }

            conflictService.removeConflict(
                key
            );

            res.status(200).json({
                message:
                    `Migration conflict resolved using ${action}`
            });

        } catch (error) {

            res.status(500).json({
                error:
                    "Migration conflict resolution failed"
            });
        }
    }
);

router.post(
    "/cdc/resolve",
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
            }

            conflictService.removeConflict(
                key
            );

            res.status(200).json({
                message:
                    `CDC conflict resolved using ${action}`
            });

        } catch (error) {

            res.status(500).json({
                error:
                    "CDC conflict resolution failed"
            });
        }
    }
);

module.exports = router;