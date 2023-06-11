const mongoose = require("mongoose");

const lessonSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    banner: {
      type: String,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

let Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
