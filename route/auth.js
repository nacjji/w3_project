const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  // console.log(User.prototype);
  const user = await User.findOne({ where: { email } });

  if (!user || password !== user.password) {
    return res.status(400).send({ errorMessage: "이메일 또는 패스워드가 틀렸습니다." });
  }
  return res.send({ token: jwt.sign({ userId: user.userId }, "secret-key") });
});

module.exports = router;
