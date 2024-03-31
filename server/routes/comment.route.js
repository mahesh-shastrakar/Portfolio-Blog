const express = require("express");

const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { verifyUser } = require("../utils/verifyUser");

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
module.exports = router;
