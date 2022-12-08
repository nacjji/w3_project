const authMiddleware = require("../middlewares/auth-middleware.js");
const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");
const { Users } = require("../models");
// 회원가입
router.post("/", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.status(400).send({ errorMessage: "패스워드가 패스워드 확인란과 다릅니다." });
    return;
  }
  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await Users.findAll({
    where: { [Op.or]: [{ email }, { nickname }] },
  });

  if (existsUsers.length) {
    res.status(400).send({ errorMessage: "이메일 또는 닉네임이 이미 사용중입니다." });
    return;
  }

  await Users.create({ email, nickname, password });
  res.status(201).send({});
});

// 회원 정보 조회
router.get("/me", authMiddleware, (req, res) => {
  res.json({ users: res.locals.users });
});

module.exports = router;
