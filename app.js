const express = require("express");
const app = express();
const port = 3000;
const Posts = require("./route/posts.js");

app.use(express.json());

app.use("/api", [Posts]);

app.listen(port, () => {
  console.log(port, "has been opened");
});
