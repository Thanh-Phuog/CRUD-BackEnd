const express = require("express");
const router = express.Router();
const userModel = require("../../models/user.model");
const postModel = require("../../models/post.model");

//Kiểm tra định dạng email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//Kiểm tra password
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  return passwordRegex.test(password);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: Password123!
 */

/**
 * @swagger
 * /create-user:
 *   post:
 *     summary: Creates a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
//Thêm User
router.post("/create-user", async (req, res) => {
  const { name, email, password } = req.body;
  //Kiểm tra thông tin nhập vào
  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Vui lòng nhập đầy đủ thông tin" });
  }
  //Kiểm tra định dạng email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: "Email không hợp lệ",
    });
  }
  //Kiểm tra password
  if (!isValidPassword(password)) {
    return res.status(400).json({
      status: 400,
      message:
        "Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    });
  }

  try {
    //Kiểm tra email đã tồn tại chưa
    const checkUser = await userModel.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        status: 400,
        message: "Email đã tồn tại",
      });
    }
    //Tạo User
    const user = new userModel({ name, email, password });
    await user.save();
    res.status(201).json({ status: 201, message: "Thêm User thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Thêm User thất bại", details: err });
  }
});

/**
 * @swagger
 * /get-all-user:
 *   get:
 *     summary: Retrieves a list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
//Lấy danh sách User
router.get("/get-all-user", async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Lỗi truy xuất User", details: err });
  }
});

/**
 * @swagger
 * /get-user-detail/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some server error
 */
//Lấy danh sách User theo id
router.get("/get-user-detail/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }
    res.send(user);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Lỗi truy xuất User", details: err });
  }
});

//Lấy danh sách User theo email
router.get("/get-user-byEmail/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }
    res.send(user);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Lỗi truy xuất User", details: err });
  }
});

//Lấy danh sách User theo Name
router.get("/get-user-byname/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const user = await userModel.findOne({ name });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }
    res.send(user);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Lỗi truy xuất User", details: err });
  }
});

/**
 * @swagger
 * /update-user/{id}:
 *   put:
 *     summary: Update the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */
//Cập nhật User
router.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const editUser = await userModel.findById(id);
    if (!editUser) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }
    if (email && !isValidEmail(email)) {
      return res
        .status(400)
        .json({ status: 400, message: "Email không hợp lệ" });
    }
    if (password && !isValidPassword(password)) {
      return res.status(400).json({
        status: 400,
        message:
          "Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      });
    }

    editUser.name = name || editUser.name;
    editUser.email = email || editUser.email;
    editUser.password = password || editUser.password;
    await editUser.save();

    res.status(200).json({ status: 200, message: "Cập nhật User thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Cập nhật User thất bại", details: err });
  }
});

/**
 * @swagger
 * /delete-user/{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was successfully deleted
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some server error
 */
//Xóa User
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }
    await userModel.findByIdAndDelete(id);
    await postModel.deleteMany({ userId: id });
    res.status(200).json({ status: 200, message: "Xóa User thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Xóa User thất bại", details: err });
  }
});

/**
 * @swagger
 * /get-posts/{id}:
 *   get:
 *     summary: Get posts by user id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some server error
 */
//Lấy danh sách bài viết của User
router.get("/get-posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel
      .findById(id)
      .populate("posts", "date title content"); // Populate các bài viết của user

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Không tìm thấy User" });
    }

    // Lặp qua các bài viết của user để tạo đối tượng bài viết
    const userPosts = user.posts.map((post) => ({
      name: user.name,
      date: post.date,
      title: post.title,
      content: post.content,
    }));

    res.status(200).json(userPosts);
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Lỗi truy xuất bài viết", details: err });
  }
});

router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  //Kiểm tra thông tin nhập vào
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Vui lòng nhập đầy đủ thông tin" });
  }
  //Kiểm tra định dạng email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: "Email không hợp lệ",
    });
  }
  //Kiểm tra password
  if (!isValidPassword(password)) {
    return res.status(400).json({
      status: 400,
      message:
        "Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    });
  }
  try {
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }
    res.status(200).json({ status: 200, message: "Đăng nhập thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Đăng nhập thất bại", details: err });
  }
});

module.exports = router;
