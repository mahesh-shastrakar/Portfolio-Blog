const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
module.exports = errorHandler;
// middleware to handle errors
