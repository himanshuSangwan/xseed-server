const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let quizzeResult = new Schema({
  quizzeScore: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quizzeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quizze",
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  },
  totalMarks: {
    type: Number,
  },
  min_marks: {
    type: Number,
  },
});

module.exports = mongoose.model("QuizzeResult", quizzeResult);
