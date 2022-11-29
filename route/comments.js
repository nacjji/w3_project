const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");
// 전체 댓글 조회
router.get("/comments", async (req, res) => {
  let comments = await Comments.find({});
  comments.reverse((a, b) => b.postAt - a.postAt);
  res.status(200).json(comments);
});

// 특정 게시글에 달린 댓글 조회
router.get("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  let comments = await Comments.find({ postId: _postId });
  res.status(200).json({ comments });
});

// 댓글 생성
router.post("/comments/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, content, password, postAt } = req.body;
    const comments = await Posts.findOne({ _id: _postId });
    if (!content) res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    if (_postId != comments._id.toString())
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    const comment = await Comments.create({
      postId: _postId,
      user,
      password,
      content,
      postAt,
    });
    res.json({ Comments: comment });
  } catch (message) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 댓글 수정
router.put("/comments/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const { content, password } = req.body;
    let comment = await Comments.findOne({ _id: _commentId });
    // 파라미터가 올바르지만
    if (comment !== null) {
      // 내용이 없을 때 에러 발생
      if (content == null)
        res.status(400).json({ message: "댓글 내용을 입력해 주세요" });
      else {
        if (password == comment.password) {
          await Comments.updateOne(
            { _id: _commentId },
            { $set: { content: content } }
          );
        } else
          res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
      res.status(200).json({ message: "댓글을 수정하였습니다." });
    } else res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
  } catch {
    res.status(400).json({ message: "잘못된 데이터 형식입니다." });
  }
});

// 댓글 삭제
router.delete("/comments/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const comment = await Comments.findOne({ _id: _commentId });
    if (comment._id.toString() != _commentId)
      res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
    const { password } = req.body;

    // 비밀번호 일치 확인
    if (password == comment.password) {
      await Comments.deleteOne({ _id: _commentId });
      res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } else res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
  } catch (message) {
    res.status(400).json({ message: "잘못된 데이터 형식입니다." });
  }
});

module.exports = router;
