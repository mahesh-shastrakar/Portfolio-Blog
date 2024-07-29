// Require Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the user schema with the required fields and default values for the user module
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://as2.ftcdn.net/v2/jpg/02/29/75/83/1000_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Export the user model module with the schema definition
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
