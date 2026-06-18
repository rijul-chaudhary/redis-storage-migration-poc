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

module.exports = router;