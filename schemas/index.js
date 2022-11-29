const mongoose = require("mongoose");
const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/w3_project")
    .catch((err) => console.log(err));
};
mongoose.connection.on("error", (err) => {
  console.log("mongoDB connection error", err);
});

module.exports = connect;
