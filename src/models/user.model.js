const mongoose = require("mongoose");
const { user } = require("../app");

//Tạo schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
