const express = require("express");

const router = express.Router();

const redisAStorage =
    require("../storage/redisAStorage");

router.post("/users", async (req, res) => {

    try {

        const user =
            await redisAStorage.createUser(
                req.body
            );

        res.status(201).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/users", async (req, res) => {

    try {

        const users =
            await redisAStorage.getAllUsers();

        res.json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

router.get("/users/:id", async (req, res) => {

    try {

        const user =
            await redisAStorage.getUser(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch user"
        });
    }
});

router.put("/users/:id", async (req, res) => {

    try {

        const user =
            await redisAStorage.updateUser(
                req.params.id,
                req.body
            );

        if (!user) {

            return res.status(404).json({
                error: `User ID ${req.params.id} does not exist`
            });
        }

        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to update user"
        });
    }
});

router.delete("/users/:id", async (req, res) => {

    try {

        const deleted =
            await redisAStorage.deleteUser(
                req.params.id
            );

        if (!deleted) {

            return res.status(404).json({
                error: `User ID ${req.params.id} does not exist`
            });
        }

        res.json({
            message:
                "User deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to delete user"
        });
    }
});

module.exports = router;