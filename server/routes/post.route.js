// Initialize express router
const express = require("express");
const post_controller = require("../controllers/post.controller");
const { verifyUser } = require("../middlewares/verifyUser.js");

// create a new router instance
const router = express.Router();

// Define routes for the post module and call the respective controller functions and verifyUser middleware
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

// Export the router module
module.exports = router;
