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
const path = require("path");

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
// const corsOptions = {
//   origin: ["https://maheshshastrakar.online"],
//   optionsSuccessStatus: 200,
// };
// middleware functions for parsing incoming requests
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

// for render deployment
const dirname1 = path.resolve();
app.use(express.static(path.join(dirname1, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(dirname1, "client", "dist", "index.html"));
});

// error handling middleware  function
app.use(errorHandler);

// start the server and listen on port
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
