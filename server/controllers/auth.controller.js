// Require necessary NPM packages and models  for the auth controller module
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateError } = require("../utils/error.js");

// Define the register function to create a new user in the database and return a success message
const register = async (req, res, next) => {
  try {
    // Get the username, email, and password from the request body
    const { username, email, password } = req.body;

    // Check if the username, email, and password are not empty
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      // If any of the fields are empty, return an error message
      return next(generateError(400, "All fields are required"));
    }

    // Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If the user already exists, return an error message
      return next(generateError(400, "User already exists"));
    }

    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user instance with the username, email, and hashed password
    const user = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Return a success message
    res.json({ message: "User created successfully" });
  } catch (error) {
    // If an error occurs, log the error and pass it to the error handling middleware
    return next(error);
  }
};

// Define the login function to authenticate a user and return a JWT token
const login = async (req, res, next) => {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Check if the email and password are not empty
    if (!email || !password || email === "" || password === "") {
      return next(generateError(400, "All fields are required"));
    }

    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    // If the user is not found, return an error message
    if (!user) {
      return next(generateError(404, "User not found"));
    }

    // Compare the password with the hashed password in the database
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return next(generateError(400, "Invalid credentials"));
    }
    // Destructure the password field from the user object and return the rest of the user object fields
    const { password: pass, ...rest } = user._doc;

    // Sign the token with the user ID and isAdmin status as the payload and set the expiration time to 1 hour
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );

    // Set the token in a cookie and return the user object fields without the password field in the response
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    // If an error occurs, log the error and pass it to the error handling middleware
    return next(error);
  }
};

// Define the googleOAuth function to authenticate a user with Google OAuth and return a JWT token
const googleOAuth = async (req, res, next) => {
  // Get the name, email, and googlePhotoURL from the request body
  const { name, email, googlePhotoURL } = req.body;
  try {
    // Find the user with the provided email in the database
    const user = await User.findOne({
      email,
    });

    // If the user is found, return a JWT token with the user ID and isAdmin status as the payload
    if (user) {
      const { password, ...rest } = user._doc;
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1hr",
        }
      );

      // Set the token in a cookie and return the user object fields without the password field in the response
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      // If the user is not found, generate a random password, hash the password using bcrypt.
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      // Create a new user instance with the username, email, hashed password, and googlePhotoURL
      const newUser = new User({
        // Generate a username by removing spaces from the name, converting it to lowercase, and adding a random number
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(9).slice(-3),
        email: email,
        password: hashedPassword,
        profilePicture: googlePhotoURL,
      });

      // Save the user to the database
      await newUser.save();

      // Destructure the password field from the user object and return the rest of the user object fields
      const { password, ...rest } = newUser._doc;
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1hr",
        }
      );
      // Set the token in a cookie and return the user object fields without the password field in the response
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    return next(error);
  }
};

// Define the logout function to clear the access_token cookie and return a success message
const logout = (req, res) => {
  // Clear the access_token cookie
  res.clearCookie("access_token");

  // Return a success message
  res.json({ message: "Logout successful" });
};

// Export the auth controller module
module.exports = { register, login, logout, googleOAuth };
