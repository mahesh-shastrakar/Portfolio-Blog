const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return JSON.parse(error);
};
module.exports = { errorHandler };
// middleware to handle errors
