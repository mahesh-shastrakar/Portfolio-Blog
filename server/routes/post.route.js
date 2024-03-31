const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/post.controller");

const { verifyUser } = require("../utils/verifyUser.js");

router.post("/create", verifyUser, post_controller.create);
router.get("/getposts", post_controller.getPosts);
router.delete(
  "/deletepost/:postId/:userId",
  verifyUser,
  post_controller.deletePost
);
router.put(
  "/updatepost/:postId/:userId",
  verifyUser,
  post_controller.updatePost
);
module.exports = router;
