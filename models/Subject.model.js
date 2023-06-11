const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

let Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
