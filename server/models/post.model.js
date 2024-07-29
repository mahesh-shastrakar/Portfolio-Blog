// Require mongoose
const mongoose = require("mongoose");

// Define the post schema with the required fields and default values for the post module
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://www.salesforce.com/ca/blog/wp-content/uploads/sites/12/2023/10/anatomy-of-a-blog-post-deconstructed-open-graph.jpg?w=768&h=401",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// export the post model module with the schema definition
module.exports = mongoose.model("Post", postSchema);
