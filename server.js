const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const cors = require("cors");
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongo database");
});

mongoose.connection.on("error", (err) => {
  console.log("Error at mongoDB: " + err);
});
var app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));
app.use(bodyParser.json({ limit: "200mb" }));

app.use(cors());
app.use("/uploads", express.static("uploads"));

const userRoute = require("./routes/user.route");
const classRoute = require("./routes/class.route");
const subjectRoute = require("./routes/subject.route");
const lessonRoute = require("./routes/lesson.route");
const sectionRoute = require("./routes/section.route");
const quizzeRoute = require("./routes/quizze.route");
const quizzeResultRoute = require("./routes/quizzeResult.route");

app.use("/user", userRoute);
app.use("/class", classRoute);
app.use("/subject", subjectRoute);
app.use("/lesson", lessonRoute);
app.use("/section", sectionRoute);
app.use("/quizze", quizzeRoute);
app.use("/quizzeresult", quizzeResultRoute);

let server = http.createServer(app);
app.use(function (err, req, res, next) {
  if (err.status) {
    res.status(err.status).send(err);
  } else {
    res.status(404).json(err);
  }
});

server.listen(port, () => {
  console.log(`Server is starting at ${port}`);
});
