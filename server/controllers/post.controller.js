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

const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

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

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const countLastMonth = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, countLastMonth });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.params.userId !== req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
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
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
module.exports = { create, getPosts, deletePost, updatePost };
