// import express and the comment controller module and verifyUser function from the utils folder
const express = require("express");
const commentController = require("../controllers/comment.controller");
const { verifyUser } = require("../middlewares/verifyUser");

// create a new router instance
const router = express.Router();

// Define routes for the comment module and call the respective controller functions and verifyUser middleware
router.post("/create", verifyUser, commentController.create);

router.get("/getPostComments/:postId", commentController.getPostComments);

router.put(
  "/likeComment/:commentId",
  verifyUser,
  commentController.likeComment
);

router.put(
  "/editComment/:commentId",
  verifyUser,
  commentController.editComment
);

router.delete(
  "/deleteComment/:commentId",
  verifyUser,
  commentController.deleteComment
);

router.get("/getcomments", verifyUser, commentController.getcomments);

// Export the router module
module.exports = router;
