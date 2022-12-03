const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const { Posts, Users } = require("../models");

// 전체 게시물 조회
router.get("/", async (req, res) => {
  // console.log(Posts.findAll({ include: Users }));
  try {
    const posts = await Posts.findAll();
    console.log(posts);
    return res.status(200).json(Posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
});

// 게시물 상세 조회
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    let post = await Posts.findOne({ _id: _postId }, { password: false, __v: false });
    // 올바른 파라미터를 입력받지 않으면 falsey 한 null 이 반환되기 때문에 !post 를 사용했다.
    if (!post) {
      return res.status(400).json({ message: "게시물 조회에 실패하였습니다." });
    } else {
      return res.status(200).json({ post: post });
    }
  } catch (message) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 게시물 생성
router.post("/", async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    console.log(userId, title, content);
    const post = await Posts.create({
      userId,
      title,
      content,
    });

    res.json({ result: post });
  } catch (message) {
    console.log(message);
    res.status(500).json({ message: "알 수 없는 오류" });
  }
});

// 게시물 수정 // 게시물 중 title 과 content 만 수정하기 위해 patch를 사용한다.
router.patch("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { title, content, password } = req.body;
  // _id 가 파라미터로 받은 _postId 와 같은 데이터를 찾는다.
  console.log("여기에요", Posts);
  try {
    const post = await Posts.findOne({ _id: _postId });
    // 올바른 파라미터
    if (post) {
      if (!content || !title || !password) {
        return res.status(400).json({ message: "필수 항목을 작성해주세요" });
      } else if (password === post.password) {
        await Posts.updateOne({ _id: _postId }, { title: title, content: content });
        return res.status(200).json({ message: "게시글을 수정하였습니다." });
      } else {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      return res.status(400).json({ message: "게시물 조회에 실패하였습니다." });
    }
  } catch (message) {
    return res.status(500).json({ message: "잘못된 데이터 형식입니다." });
  }
});

router.delete("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body;
  try {
    const post = await Posts.findOne({ _id: _postId });
    if (post) {
      if (password === post.password) {
        await Posts.deleteOne({ _id: _postId });
        res.json({ result: "게시글을 삭제하였습니다." });
      } else {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      return res.status(400).json({ message: "게시물 조회에 실패하였습니다." });
    }
  } catch (error) {
    return res.status(500).json({ error: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
