// Desc: User controller
// import necessary NPM packages and models
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateError } = require("../utils/error.js");

// Define the test function to test the user controller
const deleteUser = async (req, res, next) => {
  // Check if the user is an admin
  const userId = req.params.userId;
  const user = req.user;
  if (!user.isAdmin && userId !== user.id) {
    return next(generateError(401, "Unauthorized"));
  }

  try {
    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    // Return a success message
    res.json({ message: "User has been deleted" });
  } catch (err) {
    // Return an error message if the user cannot be deleted
    return next(generateError(500, err.message));
  }
};

// update user information in the database
const update = async (req, res, next) => {
  // Check if the user is the owner of the user profile
  const userId = req.params.userId;
  const user = req.user;

  if (userId !== user.id) {
    return next(generateError(401, "Unauthorized"));
  }
  // Validate the user input for updating the user information
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(generateError(400, "Password must be at least 6 characters"));
    }
    // Hash the password before saving it to the database
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  // Check if the username is provided in the request body
  if (req.body.username) {
    // Validate the username input for updating the user information
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        generateError(400, "Username must be between 6 and 20 characters")
      );
    }

    // Check if the username contains spaces or special characters other than letters and numbers
    if (req.body.username.includes(" ")) {
      return next(generateError(400, "Username cannot contain spaces"));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(generateError(400, "Username must be lowercase"));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        generateError(400, "Username must contain only letters and numbers")
      );
    }
  }
  try {
    // Find the user by the userId and update the username, password, email, and profile picture
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

    // Return the updated user information
    // Omit the password from the response for security reasons
    const { password, ...rest } = updatedUser._doc;

    // Return the updated user information
    res.json(rest);
  } catch (err) {
    return next(generateError(500, err.message));
  }
};

// Signout user by clearing the token cookie
const signout = (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie("token").json({ message: "Signout successful" });
  } catch (err) {
    return next(generateError(500, err.message));
  }
};

// get user information by userId from the database
const getUser = async (req, res, next) => {
  try {
    // Find the user by the userId from the request parameters

    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(generateError(404, "User not found"));
    }

    // Omit the password from the response for security reasons and return the user information
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

// get all users from the database
const getUsers = async (req, res, next) => {
  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return next(generateError(403, "You are not allowed to see all users"));
  }
  try {
    // Get the startIndex, limit, and sort direction from the query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // Find all users and sort them by createdAt in the specified direction with pagination support
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Omit the password from the response for security reasons
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // Get the total number of users
    const totalUsers = await User.countDocuments();

    // Get the number of users from the last month
    const now = new Date();

    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Return the users, total number of users, and number of users from the last month
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    return next(error);
  }
};

// Export the user controller functions
module.exports = { update, deleteUser, signout, getUser, getUsers };
