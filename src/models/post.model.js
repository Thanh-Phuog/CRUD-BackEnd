const mongoose = require("mongoose");
const { post } = require("../app");
const moment = require("moment-timezone");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Bắt buộc có giá trị
    minlength: 5, // Độ dài tối thiểu là 5 ký tự
    maxlength: 100, // Độ dài tối đa là 100 ký tự
  },
  content: {
    type: String,
    required: true, // Bắt buộc có giá trị
    minlength: 10, // Độ dài tối thiểu là 10 ký tự
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Bắt buộc có giá trị
  },
  date: {
    type: Date,
    default: () => moment().tz("Asia/Ho_Chi_Minh").toDate(), // Giá trị mặc định là thời gian hiện tại
  },
});

module.exports = mongoose.model("Post", postSchema);
