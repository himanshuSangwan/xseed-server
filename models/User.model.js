const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    user_name: {
      type: String,
      default: "",
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      select: false,
    },
    profile_img: {
      type: String,
      default: "",
    },
    role: {
      type: [
        {
          type: String,
          enum: ["admin", "student"],
        },
      ],
      default: ["student"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    date_of_birth: {
      type: Date,
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

let User = mongoose.model("User", userSchema);
module.exports = User;
