require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.route");
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || "Internal Server Error";
  res
    .status(statusCode)
    .json({ success: false, statusCode: statusCode, message: message });
});
app.get("/test", (req, res) => {
  res.json({ message: "API is working!  " });
});
