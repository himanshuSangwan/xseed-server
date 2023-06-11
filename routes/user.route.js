const express = require("express");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");
const userController = require("../controllers/user.controller");
const multer = require("multer");

const upload = multer({
  dest: path.join(__dirname, "../uploads/temp"),
});

const fields = [{ name: "profile_img" }];

router.route("/").post(upload.any(fields), userController.add).put(auth, upload.any(fields), userController.edit);
router.route("/:id").get(auth, userController.getDetail).delete(auth, userController.delete);
router.route("/list").post(auth, userController.listAll);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.route("/forgot").post(userController.forgetPassword);
module.exports = router;
