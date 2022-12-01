const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post.js");

// 전체 게시물 조회
router.get("/", async (req, res) => {
  // 게시글 조회를 할 때 불필요한 password 와  버전 키 __v 는 false 처리를 해서 보이지 않게 했다.
  const posts = await Posts.find({}, { password: false, __v: false });

  // 글이 작성된 시간을 기준으로 최신 순으로 정렬해야하기 때문에 sort가 아닌 reverse 를 사용했다.
  posts.reverse((a, b) => b.postAt - a.postAt);
  return res.status(200).json(posts);
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
    const { title, user, password, content, postAt } = req.body;
    const post = await Posts.create({
      title,
      user,
      content,
      password,
      postAt,
    });
    return res.json({ Posts: post });
  } catch (message) {
    return res.status(500).json({ message: "알 수 없는 오류" });
  }
});

// 게시물 수정 // 게시물 중 title 과 content 만 수정하기 위해 patch를 사용한다.
router.patch("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { title, content, password } = req.body;
  // _id 가 파라미터로 받은 _postId 와 같은 데이터를 찾는다.
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
