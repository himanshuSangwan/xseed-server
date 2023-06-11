const router = require("express").Router();
const auth = require("../middleware/auth");
const lessonController = require("../controllers/lesson.controller");
const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: path.join(__dirname, "../uploads/temp"),
});

const fields = [{ name: "banner" }];

router
  .route("/")
  .post(upload.any(fields), auth, lessonController.add)
  .put(upload.any(fields), auth, lessonController.edit);
router.route("/:id").get(lessonController.getDetail).delete(auth, lessonController.delete);
router.route("/list").post(lessonController.listAll);

module.exports = router;
