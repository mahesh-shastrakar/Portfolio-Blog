// Require necessary NPM packages

const { generateError } = require("../utils/error.js");
const Post = require("../models/post.model");

// Define the create function to create a new post in the database and return the post
const create = async (req, res, next) => {
  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return next(generateError(401, "Unauthorized"));
  }

  // Check if the title and content are not empty
  if (!req.body.title || !req.body.content) {
    return next(generateError(400, "Title and content are required"));
  }
  try {
    // Create a slug from the title and remove special characters from the slug using regex
    const slug = req.body.title
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^a-zA-Z0-9-]/g, "-");

    // Create a new post instance with the title, content, slug, and userId
    const savedPost = new Post({ ...req.body, slug, userId: req.user.id });

    // Save the post to the database
    await savedPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    return next(generateError(500, error.message));
  }
};

// Define the getPosts function to get all posts from the database
const getPosts = async (req, res, next) => {
  try {
    // Get the startIndex, limit, and sort direction from the query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Find all posts that match the query parameters and sort them by updatedAt in the specified direction with pagination support
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get the total number of posts
    const totalPosts = await Post.countDocuments();

    // Get the number of posts from the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const countLastMonth = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Return the posts, total number of posts, and number of posts from the last month
    res.status(200).json({ posts, totalPosts, countLastMonth });
  } catch (error) {
    return next(generateError(500, error.message));
  }
};

// Define the deletePost function to delete a post from the database
const deletePost = async (req, res, next) => {
  // Check if the user is an admin or the owner of the post
  if (!req.user.isAdmin || req.params.userId !== req.user.id) {
    return next(generateError(401, "Unauthorized"));
  }

  try {
    // Find the post by the postId
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    // If the post is not found, return an error message
    if (!deletedPost) {
      return next(generateError(404, "Post not found"));
    }
    // Return a success message
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    // Return an error message if the post cannot be deleted
    return next(generateError(500, error.message));
  }
};

// Define the updatePost function to update a post in the database
const updatePost = async (req, res, next) => {
  // Check if the user is an admin or the owner of the post
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(generateError(403, "You are not allowed to update this post"));
  }
  try {
    // Find the post by the postId and update the title, content, category, and image
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    // Return the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(error);
  }
};

// Export the post controller
module.exports = { create, getPosts, deletePost, updatePost };
