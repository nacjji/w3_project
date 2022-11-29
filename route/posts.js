const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post.js");

// 전체 게시물 조회
router.get("/posts", async (req, res) => {
  let posts = await Posts.find({});

  posts.reverse((a, b) => b.postAt - a.postAt);
  res.status(200).json(posts);
});

// 게시물 상세 조회
router.get("/posts/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    let post = await Posts.findOne({ _id: _postId });
    if (post == null) {
      res.status(400).json({ message: "게시물 조회에 실패하였습니다." });
    } else {
      res.status(200).json({ post: post });
    }
  } catch (message) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 게시물 생성
router.post("/posts", async (req, res) => {
  const { title, user, password, content, postAt } = req.body;
  const postC = await Posts.create({
    title,
    user,
    content,
    password,
    postAt,
  });
  res.json({ Posts: postC });
});

// 게시물 수정
router.put("/posts/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { title, content, password } = req.body;
    let post = await Posts.findOne({ _id: _postId });
    //올바른 파라미터
    if (post !== null) {
      if (!content) {
        res.status(400).json({ errMessage: "글 내용을 입력해주세요" });
      }
      if (password == post.password) {
        await Posts.updateOne(
          { _id: _postId },
          { $set: { title: title, content: content } }
        );
        res.status(200).json({ message: "게시글을 수정하였습니다." });
      } else {
        res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
      // 올바르지 않은 파라미터
    } else {
      res.status(400).json({
        errMessage: "게시글 조회에 실패하였습니다.",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "데이터 형식이 올바르지 않습니다." });
  }
});

router.delete("/posts/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password } = req.body;
    const post = await Posts.findOne({ _id: _postId });
    if (post === null) {
      res.status(400).json({ errMessage: "게시글 조회에 실패하였습니다." });
    } else {
      if (password == post.password) {
        await Posts.deleteOne({ _id: _postId });
        res.json({ result: "게시글을 삭제하였습니다." });
      } else {
        res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
