// error generator function to handle errors
const generateError = (statusCode, message) => {
  // create a new error object with the status code and message
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// export the error handler function
module.exports = { generateError };
