const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
//Lấy tất cả bài viết của 1 user
exports.getUserPosts = async (req, res) => {
  const idUser = req.params.idUser;
  try {
    const data = await postModel
      .find({ userId: idUser })
      .populate("userId", "name");
    if (!data) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy user" });
    }
    const posts = data.map((e) => {
      return {
        id: e._id,
        userName: e.userId.name,
        date: e.date,
        title: e.title,
        content: e.content,
      };
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ status: 400, message: "Vui lòng nhập đầy đủ thông tin" });
  }
  if (title.length < 5 || title.length > 100) {
    return res
      .status(400)
      .json({ status: 400, message: "Tiêu đề phải từ 5 đến 100 ký tự" });
  }
  if (content.length < 10) {
    return res
      .status(400)
      .json({ status: 400, message: "Nội dung phải từ 10 ký tự trở lên" });
  }

  try {
    // Find the user by username
    const user = await userModel.findOne({ name: userId });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }
    // Kiểm tra xem có bài đăng nào trùng ngày và trùng nội dung không
    const existingPost = await postModel.findOne({
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
      content: content,
    });

    if (existingPost) {
      return res
        .status(400)
        .json({ message: "Bài đăng trùng ngày và trùng nội dung đã tồn tại." });
    }
    const post = new postModel({
      title,
      content,
      userId: user._id,
    });

    const savedPost = await post.save();
    //
    await userModel.findByIdAndUpdate(user._id, {
      $push: { posts: savedPost._id },
    });
    res.status(201).json({
      status: 201,
      message: "Đăng bài thành công",
      data: savedPost,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Đăng bài thất bại", details: err });
  }
};
exports.getPostsById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy Post" });
    }
    res.send(post);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Lỗi truy xuất Post", details: err });
  }
};
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Tìm kiếm bài đăng với ID cung cấp
    const editPost = await postModel.findById(id);
    console.log("editPost:", editPost); // Log để kiểm tra giá trị của editPost

    // Kiểm tra nếu không tìm thấy bài đăng
    if (!editPost) {
      console.log("Post not found"); // Log để xác nhận rằng không tìm thấy bài đăng
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy bài Post" });
    }

    // Cập nhật các trường nếu có
    editPost.title = title || editPost.title;
    editPost.content = content || editPost.content;

    // Lưu các thay đổi vào cơ sở dữ liệu
    await editPost.save();

    // Trả về phản hồi thành công
    res.status(201).json({
      status: 201,
      message: "Cập nhật Post thành công",
      data: editPost,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Cập nhật Post thất bại",
      details: err,
    });
  }
};
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy Post" });
    }
    await postModel.findByIdAndDelete(id);
    await userModel.findByIdAndUpdate(post.userId, {
      $pull: { posts: id },
    });
    res.status(200).json({ status: 200, message: "Xóa Post thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Xóa Post thất bại", details: err });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate("userId", "name");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
