const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    video_link: {
      type: String,
    },
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

let Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
