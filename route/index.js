const express = require("express");
const router = express.Router();

//게시물,댓글
const Posts = require("./posts");
const Comments = require("./comments");

// 인증
const User = require("./users");
const Auth = require("./auth");

// 회원가입,로그인
router.use("/api/users", User);
router.use("/api/auth", Auth);

router.use("/posts", Posts);
router.use("/comments", Comments);

module.exports = router;
