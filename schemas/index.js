const mongoose = require("mongoose");

// mongoose community 의 로컬 서버인 27017로 연결해서 w3_project 데이터베이스를 만든다.
const connect = () => {
  mongoose.connect("mongodb://localhost:27017/w3_project").catch((err) => console.log(err));
};
mongoose.connection.on("error", (err) => {
  console.log("mongoDB connection error", err);
});

module.exports = connect;
