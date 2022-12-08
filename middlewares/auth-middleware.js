const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    console.log(authType);
    res.status(401).send({ errorMessage: "11로그인 후 이용 가능한 기능입니다." });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "secret-key");
    Users.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({ errorMessage: "22로그인 후 이용 가능한 기능입니다." });
  }
};
