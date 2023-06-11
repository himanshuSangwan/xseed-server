const router = require("express").Router();
const auth = require("../middleware/auth");
const classController = require("../controllers/class.controller");

router.route("/").post(auth, classController.add).put(auth, classController.edit);
router.route("/:id").get(classController.getDetail).delete(auth, classController.delete);
router.route("/list").post(classController.listAll);

module.exports = router;
