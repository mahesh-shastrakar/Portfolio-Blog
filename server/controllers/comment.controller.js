const Comment = require("../models/comment.model");
const { errorHandler } = require("../utils/error");

const create = async (req, res, next) => {
  const { userId, postId, content } = req.body;
  if (userId !== req.user.id) {
    next(errorHandler(403, "You can only comment as yourself"));
  }
  if (!userId || !postId || !content) {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const comment = new Comment({ userId, postId, content });
    await comment.save();
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

module.exports = { create };
