const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");

const test = (req, res) => {
  res.json({ message: "API is working!" });
};
const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  const user = req.user;
  if (userId !== user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "User has been deleted" });
  } catch (err) {
    return next(errorHandler(500, err.message));
  }
};

const update = async (req, res, next) => {
  const userId = req.params.userId;
  const user = req.user;
  if (userId !== user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 6 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username must contain only letters and numbers")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.json(rest);
  } catch (err) {
    return next(errorHandler(500, err.message));
  }
};
const signout = (req, res, next) => {
  try {
    res.clearCookie("token").json({ message: "Signout successful" });
  } catch (err) {
    return next(errorHandler(500, err.message));
  }
};
module.exports = { test, update, deleteUser, signout };
