const express = require("express");

const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { verifyUser } = require("../utils/verifyUser");

router.post("/create", verifyUser, commentController.create);

module.exports = router;
