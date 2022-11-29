// schema : 어떤 데이터를 사용할지에 대해 명시하는 폴더
const mongoose = require("mongoose");

//한국 현지 시간
const curr = new Date();
const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
let postAt = new Date(utc + KR_TIME_DIFF);

postAt =
  postAt.getFullYear() +
  "." +
  parseInt(postAt.getMonth() + 1) +
  "." +
  postAt.getDate() +
  " " +
  postAt.getHours() +
  ":" +
  postAt.getMinutes() +
  "." +
  postAt.getSeconds();
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  password: {
    type: "Number",
    required: true,
  },
  postAt: {
    type: String,
    default: postAt,
  },
});

module.exports = mongoose.model("Posts", contentSchema);
