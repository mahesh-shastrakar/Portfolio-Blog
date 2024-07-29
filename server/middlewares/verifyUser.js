// import jwt and errorHandler from the utils folder
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");

// create a middleware function to verify the user token
const verifyUser = (req, res, next) => {
  // get the token from the cookie
  const token = req.cookies.access_token;

  // if the token is not present, return an error
  if (!token) {
    next(errorHandler(401, "Unauthorized"));
  }

  // verify the token and get the user object from the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // if the token is invalid, return an error
    if (err) {
      next(errorHandler(401, "Unauthorized"));
    }

    // set the user object in the request object
    req.user = user;

    // call the next middleware function
    next();
  });
};

//  export the verifyUser function
module.exports = { verifyUser };
