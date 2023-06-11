const router = require("express").Router();
const auth = require("../middleware/auth");
const quizzeController = require("../controllers/quizze.controller");

router.route("/").post(auth, quizzeController.add).put(auth, quizzeController.edit);
router.route("/:id").get(quizzeController.getDetail).delete(auth, quizzeController.delete);
router.route("/list").post(quizzeController.listAll);

module.exports = router;
