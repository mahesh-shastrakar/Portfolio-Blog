const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return JSON.stringify(error);
};
module.exports = { errorHandler };
// middleware to handle errors
