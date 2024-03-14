const { errorHandler } = require("../utils/error");
const Post = require("../models/post.model");
const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Title and content are required"));
  }
  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const savedPost = new Post({ ...req.body, slug, userId: req.user.id });

  try {
    await savedPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
module.exports = { create };
