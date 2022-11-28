const express = require("express");
const router = express.Router();

router.get("/posts", (req, res) => {
  res.send("this is post.js get");
});

module.exports = router;
