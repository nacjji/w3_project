const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");

// 전체 댓글 조회
router.get("/", async (req, res) => {
  let comments = await Comments.find(
    {},
    { user: true, content: true, postAt: true }
  );
  comments.reverse((a, b) => b.postAt - a.postAt);
  return res.status(200).json(comments);
});

// 특정 게시글에 달린 댓글 조회
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  let comments = await Comments.find(
    { postId: _postId },
    { user: true, content: true, postAt: true }
  );
  return res.status(200).json({ comments });
});

// 댓글 생성
router.post("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, content, password, postAt } = req.body;
    const comments = await Posts.findOne({ _id: _postId });
    if (!content)
      return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    if (_postId != comments._id.toString())
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    const comment = await Comments.create({
      postId: _postId,
      user,
      password,
      content,
      postAt,
    });
    return res.json({ Comments: comment });
  } catch (message) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 댓글 수정
router.put("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const { content, password } = req.body;
    let comment = await Comments.findOne({ _id: _commentId });
    // 파라미터가 올바르지만
    if (comment !== null) {
      // 내용이 없을 때 에러 발생
      if (content == null)
        return res.status(400).json({ message: "댓글 내용을 입력해 주세요" });
      else {
        if (password == comment.password) {
          await Comments.updateOne(
            { _id: _commentId },
            { $set: { content: content } }
          );
        } else
          return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." });
      }
      return res.status(200).json({ message: "댓글을 수정하였습니다." });
    } else
      return res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
  } catch {
    return res.status(400).json({ message: "잘못된 데이터 형식입니다." });
  }
});

// 댓글 삭제
router.delete("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const comment = await Comments.findOne({ _id: _commentId });
    if (comment._id.toString() != _commentId)
      return res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
    const { password } = req.body;

    // 비밀번호 일치 확인
    if (password == comment.password) {
      await Comments.deleteOne({ _id: _commentId });
      return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } else
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
  } catch (message) {
    return res.status(400).json({ message: "잘못된 데이터 형식입니다." });
  }
});

module.exports = router;
