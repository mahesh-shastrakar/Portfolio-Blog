// Description: Comment controller to handle comment related operations.

// Require necessary NPM packages and models for the comment controller module
const Comment = require("../models/comment.model");
const { generateError } = require("../utils/error.js");

// Define the create function to create a new comment in the database and return the comment
const create = async (req, res, next) => {
  // Get the userId, postId, and content from the request body
  const { userId, postId, content } = req.body;

  // Check if the userId is the same as the authenticated user's id
  if (userId !== req.user.id) {
    return next(generateError(403, "You can only comment as yourself"));
  }

  // Check if the userId, postId, and content are not empty
  if (!userId || !postId || !content) {
    return next(generateError(400, "All fields are required"));
  }
  try {
    // Create a new comment instance with the userId, postId, and content
    const comment = new Comment({ userId, postId, content });

    // Save the comment to the database
    await comment.save();
    res.json(comment);
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    return next(error);
  }
};

// Define the getPostComments function to get all comments for a specific post
const getPostComments = async (req, res, next) => {
  // Get the postId from the request parameters
  const { postId } = req.params;

  try {
    // Find all comments for the specified postId and sort them by createdAt in descending order
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    // Return the comments
    res.json(comments);
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    return next(error);
  }
};

// Define the likeComment function to like or unlike a comment
const likeComment = async (req, res, next) => {
  try {
    // Find the comment by the commentId from the request parameters
    const comment = await Comment.findById(req.params.commentId);

    // If the comment is not found, return an error message
    if (!comment) {
      return next(generateError(404, "Comment not found"));
    }

    // Check if the user has already liked the comment
    const userIndex = comment.likes.indexOf(req.user.id);

    // If the user has not liked the comment, increment the numberOfLikes and add the user's id to the likes array of the comment
    if (userIndex === -1) {
      // Increment the numberOfLikes
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      // If the user has already liked the comment, decrement the numberOfLikes and remove the user's id from the likes array of the comment
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    // Save the updated comment to the database
    await comment.save();

    // Return the updated comment
    res.status(200).json(comment);
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    return next(error);
  }
};

// Define the editComment function to edit a comment
const editComment = async (req, res, next) => {
  try {
    // Find the comment by the commentId from the request parameters
    const comment = await Comment.findById(req.params.commentId);

    // If the comment is not found, return an error message
    if (!comment) {
      return next(generateError(404, "Comment not found"));
    }

    // Check if the user is the owner of the comment or an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        generateError(403, "You are not allowed to edit this comment")
      );
    }

    // Update the content of the comment with the content from the request body
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    // Return the edited comment
    res.status(200).json(editedComment);
  } catch (error) {
    return next(error);
  }
};

// Define the deleteComment function to delete a comment
const deleteComment = async (req, res, next) => {
  try {
    // Find the comment by the commentId from the request parameters
    const comment = await Comment.findById(req.params.commentId);

    // If the comment is not found, return an error message
    if (!comment) {
      return next(generateError(404, "Comment not found"));
    }

    // Check if the user is the owner of the comment or an admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        generateError(403, "You are not allowed to delete this comment")
      );
    }

    // Delete the comment from the database
    await Comment.findByIdAndDelete(req.params.commentId);

    // Return a success message
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    return next(error);
  }
};

// Define the getcomments function to get all comments
const getcomments = async (req, res, next) => {
  // Check if the user is an admin
  if (!req.user.isAdmin)
    return next(generateError(403, "You are not allowed to get all comments"));
  try {
    // Get the startIndex, limit, and sort direction from the query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    // Find all comments, sort them by createdAt, skip the startIndex, and limit the number of comments returned
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get the total number of comments and the number of comments from the last month
    const totalComments = await Comment.countDocuments();

    // Get the date one month ago
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Get the number of comments from the last month
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Return the comments, total number of comments, and number of comments from the last month
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    return next(error);
  }
};

// Export the comment controller module
module.exports = {
  create,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getcomments,
};
