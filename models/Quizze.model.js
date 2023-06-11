const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let QuizzeSchema = new Schema({
  title: {
    type: String,
  },
  quizze_type: {
    type: String,
  },
  description: {
    type: String,
  },
  total_marks: {
    type: Number,
  },
  min_marks: {
    type: Number,
  },
  total_question: {
    type: Number,
  },
  total_duration: {
    type: String,
  },
  is_preview: {
    type: Boolean,
    default: false,
  },
  is_publish: {
    type: Boolean,
    default: false,
  },
  allowed_multiple_time: {
    type: Boolean,
    default: false,
  },
  lesson_id: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  section_id: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },

  //question start
  questions: [
    {
      question: {
        type: String,
      },
      question_type: {
        type: String,
      },
      answer_type: {
        type: String,
      },
      file_path: {
        type: String,
      },
      Sequence: {
        type: Number,
      },
      option: {
        type: [],
      },
      correct_answers: {
        type: Array,
      },
      given_options: {
        type: Array,
      },
      hint: {
        type: String,
      },
      total_duration: {
        type: Number,
        default: 0,
      },
      marks: {
        type: Number,
      },
    },
  ],
});

let Quizze = mongoose.model("Quizze", QuizzeSchema);
module.exports = Quizze;
