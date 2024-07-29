// Initialize mongoose
const mongoose = require("mongoose");

// Define the comment schema with the required fields and default values for the comment module
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Export the comment model module with the schema definition
module.exports = mongoose.model("Comment", commentSchema);
