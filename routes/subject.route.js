const router = require("express").Router();
const auth = require("../middleware/auth");
const subjectController = require("../controllers/subject.controller");

router.route("/").post(auth, subjectController.add).put(auth, subjectController.edit);
router.route("/:id").get(subjectController.getDetail).delete(auth, subjectController.delete);
router.route("/list").post(subjectController.listAll);

module.exports = router;
