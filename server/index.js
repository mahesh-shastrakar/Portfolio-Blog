// import required modules

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/comment.route");
const { errorHandler } = require("./middlewares/errorHandler");

// connect to database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

// create express app
const app = express();

// middleware functions for parsing incoming requests
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

// error handling middleware  function
app.use(errorHandler);

// start the server and listen on port
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
