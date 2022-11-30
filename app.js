const express = require("express");
const app = express();
const port = 3000;

const connect = require("./schemas");
const indexRouter = require("./route/index");
connect();

// body-parser-middleware
app.use(express.json());

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(port, "has been opened");
});
