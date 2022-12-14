const express = require("express");
const router = express.Router();

// 전체 댓글 조회
router.get("/", async (req, res) => {
  const comments = await Comments.find({}, { password: false, __v: false });
  comments.reverse((a, b) => b.postAt - a.postAt);
  return res.status(200).json(comments);
});

// 특정 게시글에 달린 댓글 조회
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const comments = await Comments.find({ postId: _postId }, { password: false, __v: false });
  comments.reverse((a, b) => b.postAt - a.postAt);
  return res.status(200).json({ comments });
});

// 댓글 생성
router.post("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, content, password, postAt } = req.body;
    const comment = await Posts.findOne({ _id: _postId });
    if (!content) return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    // _id 값을 가져올 때 mongoose의 ObjectId 객체 타입으로 가져오는데, toString 을 사용해 문자열 형식으로 변환한뒤 비교한다.
    if (_postId !== comment._id.toString()) {
      throw message;
    }
    const commentCreate = await Comments.create({
      postId: _postId,
      user,
      password,
      content,
      postAt,
    });
    return res.json({ Comments: commentCreate });
  } catch (message) {
    return res.status(500).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 댓글 수정
router.patch("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const { content, password } = req.body;
    let comment = await Comments.findOne({ _id: _commentId });
    // 파라미터가 올바르고
    if (comment) {
      // 비밀번호가 일치하면 데이터 수정
      if (!content || !password) {
        return res.status(400).json({ message: "필수 항목을 입력해 주세요" });
      } else if (password === comment.password) {
        await Comments.updateOne({ _id: _commentId }, { content: content });
        return res.status(200).json({ message: "댓글을 수정하였습니다." });
      } else {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      return res.status(400).json({ message: "게시물 조회에 실패하였습니다." });
    }
  } catch {
    return res.status(500).json({ message: "잘못된 데이터 형식입니다." });
  }
});

// 댓글 삭제
router.delete("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const comment = await Comments.findOne({ _id: _commentId });
    if (comment._id.toString() !== _commentId) return res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
    const { password } = req.body;

    // 비밀번호 일치 확인
    if (password === comment.password) {
      await Comments.deleteOne({ _id: _commentId });
      return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } else {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }
  } catch (message) {
    return res.status(400).json({ message: "잘못된 데이터 형식입니다." });
  }
});

module.exports = router;
