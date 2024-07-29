// Desc: Error handler middleware

const errorHandler = (err, req, res, next) => {
  // get the status code and message of the error
  const statusCode = res.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

// export the error handler middleware function

module.exports = { errorHandler };
