require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const port = 3000;
app.use(express.json());
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
app.use("/user", userRouter);
app.use("/auth", authRouter);
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
