const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/post.controller");

const { verifyUser } = require("../utils/verifyUser.js");

router.post("/create", verifyUser, post_controller.create);

module.exports = router;
