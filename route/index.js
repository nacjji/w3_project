const express = require("express");
const router = express.Router();
const Posts = require("./posts");
const Comments = require("./comments");

router.use("/posts", Posts);
router.use("/comments", Comments);
module.exports = router;
