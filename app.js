const express = require("express");
const app = express();
const port = 3000;
const Posts = require("./route/posts.js");
const Comments = require("./route/comments.js");
const connect = require("./schemas");
connect();

app.use(express.json());

app.use("/", [Posts, Comments]);

app.listen(port, () => {
  console.log(port, "has been opened");
});
