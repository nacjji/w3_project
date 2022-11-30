const express = require("express");
const app = express();
const port = 3000;
const Posts = require("./route/posts.js");
const Comments = require("./route/comments.js");
const connect = require("./schemas");
const indexRouter = require("./route/index");
connect();

app.use(express.json());

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(port, "has been opened");
});
