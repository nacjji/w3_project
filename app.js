const express = require("express");
const app = express();
const port = 3000;

// connect 에 schemas/index.js 파일을 불러와서 상수에 할당, index.js 는 엔트리포인트이기 때문에 생략 가능
const connect = require("./schemas");
// indexRouter에 route/index 파일을 불러와서 상수에 할당
const indexRouter = require("./route/index");
// 몽구스 db와 연결
connect();

// body-parser-middleware
// http 응답의 body 부분을 json 형식으로 불러오는 미들웨어
app.use(express.json());

// "/" 로 들어오는 요청을 indexRouter 로 보냄
app.use("/", indexRouter);

// port 를 열어주는 이벤트 리스너
app.listen(port, () => {
  console.log(port, "has been opened");
});
