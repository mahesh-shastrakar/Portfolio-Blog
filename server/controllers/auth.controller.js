const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error.js");
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(errorHandler(400, "All fields are required"));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      next(errorHandler(400, "All fields are required"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      next(errorHandler(400, "Invalid credentials"));
    }
    const { password: pass, ...rest } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};
module.exports = { register, login, logout };
