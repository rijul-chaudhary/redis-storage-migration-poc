const express = require("express");

const router = express.Router();

const userService = require("../services/userService");

router.post("/", async (req, res) => {
    try {
        console.log("Request Body:", req.body);    

        const user = await userService.createUser(
            req.body
        );

        res.status(201).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create user"
        });

    }
});

router.get("/:id", async (req, res) => {
    try {

        const user = await userService.getUser(
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
            error: "Failed to get user"
        });

    }
});

module.exports = router;