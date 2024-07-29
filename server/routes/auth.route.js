// Initialize express router and import the auth controller module
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Define routes for the auth module and call the respective controller functions
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/googleOAuth", authController.googleOAuth);

// Export the router module
module.exports = router;
