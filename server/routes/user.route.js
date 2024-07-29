// import express and the user controller module and verifyUser function from the utils folder
const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyUser } = require("../middlewares/verifyUser");

// create a new router instance
const router = express.Router();

// Define routes for the user module and call the respective controller functions and verifyUser middleware
router.put("/update/:userId", verifyUser, userController.update);
router.delete("/delete/:userId", verifyUser, userController.deleteUser);
router.post("/signout", userController.signout);
router.get("/getusers", verifyUser, userController.getUsers);
router.get("/:userId", verifyUser, userController.getUser);

// Export the router module
module.exports = router;
