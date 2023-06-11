const router = require("express").Router();
const auth = require("../middleware/auth");
const sectionController = require("../controllers/section.controller");

router.route("/").post(auth, sectionController.add).put(auth, sectionController.edit);
router.route("/:id").get(sectionController.getDetail).delete(auth, sectionController.delete);
router.route("/list").post(sectionController.listAll);

module.exports = router;
