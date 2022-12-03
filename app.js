const express = require("express");
const app = express();
const port = 3000;
const { sequelize } = require("./models");
// indexRouter에 route/index 파일을 불러와서 변수에 할당
const indexRouter = require("./route/index");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("sequelize 연결 성공");
  })
  .catch((err) => {
    console.log("sequelize 연결 실패", err);
  });

// body-parser-middleware
// http 응답의 body 부분을 json 형식으로 불러오는 미들웨어
app.use(express.json());

const router = express.Router();

app.use("/api", express.urlencoded({ extended: false }), router);

app.use(express.static("assets"));

// request 로그를 보내주는 미들웨어
// app.use((req, res, next) => {
//   console.log(`Request URL: ${req.originalUrl} - ${new Date()}`);
//   next();
// });

// "/" 로 들어오는 요청을 indexRouter 로 보냄
app.use("/", indexRouter);

// port 를 열어주는 이벤트 리스너
app.listen(port, () => {
  console.log(port, "has been opened");
});
