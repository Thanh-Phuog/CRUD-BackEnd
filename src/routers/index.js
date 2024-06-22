const express = require("express");
const router = express.Router();

router.use("/api/v1/user", require("./user/index"));
router.use("/api/v1/post", require("./post/index"));

module.exports = router;
