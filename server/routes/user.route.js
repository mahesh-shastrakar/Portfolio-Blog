const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyUser } = require("../utils/verifyUser");
router.get("/test", userController.test);
router.put("/update/:userId", verifyUser, userController.update);
router.delete("/delete/:userId", verifyUser, userController.deleteUser);
module.exports = router;
