const express = require("express");
const {
    createZar,
    getZaruud,
    getZar,
    updateZar,
    deleteZar,
    getCatZaruud,
    getZarComments
} = require("../controller/zarController");
const router = express.Router();
//protect export hiihde namedeer n export hiisen {}
const {protect, authorize} = require("../middleware/protect");

//  /api/v1/zar
router.route("/")
    .get(getZaruud)
    .post(protect,authorize("admin", "user"), createZar);
router.route("/:id")
    .get(getZar)
    .put(protect,authorize("admin", "user"), updateZar)
    .delete(protect,authorize("admin", "user"), deleteZar);
// router.route("/:categoryId/zaruud").get(getCatZaruud);
router.route("/:id/comments").get(getZarComments);


module.exports = router;
