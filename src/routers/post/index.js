const express = require("express");
const router = express.Router();
const postController = require("../../controllers/post.controller");
// const Post = require("../../models/post.model");
// const User = require("../../models/user.model");

// router.get("/user/:idUser", async (req, res) => {
//   const idUser = req.params.idUser;

//   try {
//     const data = await Post.find({ userId: idUser }).populate("userId", "name");
//     const posts = data.map((e) => {
//       return {
//         id: e._id,
//         userName: e.userId.name,
//         title: e.title,
//         content: e.content,
//       };
//     });
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(500).json({ status: 500, message: err.message });
//   }
// });
// router.post("/create-post", async (req, res) => {
//   const { title, content, userId } = req.body;

//   if (!title || !content || !userId) {
//     return res
//       .status(400)
//       .json({ status: 400, message: "All fields are required" });
//   }

//   try {
//     // Find the user by username
//     const user = await User.findOne({ name: userId });
//     if (!user) {
//       return res.status(404).json({ status: 404, message: "User not found" });
//     }

//     const post = new Post({
//       title,
//       content,
//       userId: user._id,
//     });

//     const savedPost = await post.save();
//     res.status(201).json({
//       status: 201,
//       message: "Post created successfully",
//       data: savedPost,
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ status: 500, message: "Failed to create post", details: err });
//   }
// });
router.get("/user/:idUser", postController.getUserPosts);
router.post("/create-post", postController.createPost);
router.put("/update-post/:id", postController.updatePost);
router.get("/get-by-id/:id", postController.getPostsById);
router.delete("/delete-post/:id", postController.deletePost);
router.get("/get-all", postController.getAllPosts);

module.exports = router;
