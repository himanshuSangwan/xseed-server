const router = require("express").Router();
const auth = require("../middleware/auth");
const quizzeresultController = require("../controllers/quizzeResult.controller");

router.route("/").post(auth, quizzeresultController.add).put(auth, quizzeresultController.edit);
router.route("/:id").get(quizzeresultController.getDetail).delete(auth, quizzeresultController.delete);
router.route("/list").post(quizzeresultController.listAll);

module.exports = router;
